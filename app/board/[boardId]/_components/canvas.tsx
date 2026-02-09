"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Camera, CanvasMode, CanvasState, LayerType, Point, Color, Layer, Side, XYWH} from "@/types/canvas";
import { Info} from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useHistory, useCanRedo , useCanUndo, useMutation, useStorage, useOthersMapped, useSelf} from "@liveblocks/react";
import { CursorPresence } from "./cursors-presence";
import { pointerEventToCanvasPoint, connectionIdColor, resizeBounds, findIntersectingLayersWithRectangle, colorTocss, penPointsToPathLayer} from "@/lib/utils";
import { setMinutes } from "date-fns";
import { nanoid } from "nanoid";
import { LiveObject, LiveList, LiveMap } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { Path } from "./path";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayer } from "@/hooks/use-delete-layers";
import { hostname } from "os";

const MAX_LAYERS = 100;

interface Canvasprops {
    boardId: string;
};

export const Canvas = ({
    boardId,
}: Canvasprops) => {

    const layerIds = useStorage((root) => root.layerIds as LiveList<string> | undefined);
    
    const pencilDraft = useSelf((me) => me.presence.pencilDraft);



    const isStorageLoaded = layerIds !== undefined;

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });
    const [camera, setCamera] = useState({ x:0, y: 0 });
    const [lastUsedColor, setLastUsedColor] = useState({
        r: 255,
        g: 255,
        b: 255,
    });

    useDisableScrollBounce();
    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const insertLayer = useMutation((
        {storage, setMyPresence},
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
        position: Point, 
    ) => {
        if (!isStorageLoaded || !storage) {
            return;
        }
        const liveLayers = storage.get("layers") as LiveMap<string, LiveObject<Layer>>;
        if (!liveLayers || liveLayers.size >= MAX_LAYERS){
            return ;
        }

    const liveLayersIds = storage.get("layerIds") as LiveList<string>;
        const layerId = nanoid();

        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            fill: lastUsedColor,
        });

        liveLayersIds.push(layerId);
        liveLayers.set(layerId, layer);

        setMyPresence({ selection : [layerId]}, { addToHistory: true});
        setCanvasState({ mode: CanvasMode.None });

    }, [lastUsedColor, isStorageLoaded]);


    const translateSelectedLayers = useMutation((
        {storage, self},
        point: Point,
    ) => {
        if (canvasState.mode !== CanvasMode.Translating || !canvasState.initialPoint){
            return;
        }

        const offset = {
            x: point.x - canvasState.initialPoint.x,
            y: point.y - canvasState.initialPoint.y,
        };

        const liveLayers = storage.get("layers") as LiveMap<string, LiveObject<Layer>> | undefined;
        if (!liveLayers) return;

        const selection = self.presence.selection as string[] | undefined;
        if (!selection) return;

        for (const id of selection){
            const layer = liveLayers.get(id);

            if (layer){
                layer.update({
                    x: layer.get("x") + offset.x,
                    y: layer.get("y") + offset.y,
                });
            }
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point, initialPoint: point});

    }, [
        canvasState,
    ]);

    const unselectLayer = useMutation((
        {self, setMyPresence }
    ) => {
        const selection = self.presence.selection as string[] | undefined;
        if (selection && selection.length > 0) {
            setMyPresence({ selection: []}, { addToHistory: true});
        }
    }, [])

    const updateSelectionNet = useMutation((
        { storage, setMyPresence},
        current: Point,
        origin: Point,
    ) => {
        const layers = storage.get("layers") as LiveMap<string, LiveObject<Layer>> | undefined;
        setCanvasState({
            mode: CanvasMode.SelectionNet,
            origin,
            current,
        });

        if (!layers || !layerIds) return;

        const ids = findIntersectingLayersWithRectangle(
            [...layerIds],
            layers.toImmutable(),
            origin,
            current,
        );

        setMyPresence({ selection: ids }, { addToHistory: true });
    }, [layerIds])

    const startMultiSelection = useCallback((
        current: Point,
        origin: Point,
    ) => {
        if (
            Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5
        ){
            setCanvasState({
                mode: CanvasMode.SelectionNet,
                origin,
                current,
            });
        };
    }, [])

    const continueDrawing = useMutation((
        {self, setMyPresence},
        point: Point,
        e: React.PointerEvent,
    ) => {
        const pencilDraft = self.presence.pencilDraft as number[][] | null;
        if (pencilDraft == null) return;
        
        if (canvasState.mode !== CanvasMode.Pencil || 
            e.buttons !== 1
        ){
            return;
        }

        setMyPresence({
            cursor: point,
            pencilDraft:
                pencilDraft.length === 1 &&
                pencilDraft[0][0] === point.x &&
                pencilDraft[0][0] === point.y
                    ? pencilDraft
                    : [...pencilDraft, [point.x, point.y, e.pressure]],
        });
    }, [canvasState.mode])

    const insertPath = useMutation((
        { storage, self, setMyPresence }
    ) => {
        const liveLayers = storage.get("layers") as LiveMap<string, LiveObject<Layer>> | undefined;
        const pencilDraft = self.presence.pencilDraft as number[][] | null;

        if (
            pencilDraft == null ||
            pencilDraft.length < 2 ||
            !liveLayers ||
            liveLayers.size >= MAX_LAYERS
        ){
            setMyPresence({ pencilDraft: null });
            return;
        }

        const id = nanoid();
        liveLayers.set(
            id,
            new LiveObject(penPointsToPathLayer(
                pencilDraft,
                lastUsedColor,
            )),
        );

        const liveLayerIds = storage.get("layerIds") as LiveList<string>;
        liveLayerIds.push(id);

        setMyPresence({ pencilDraft: null });
        setCanvasState({ mode: CanvasMode.Pencil })
        
    }, [lastUsedColor]);


    const startDrawing = useMutation ((
        {setMyPresence},
        point: Point,
        pressure: number,
    ) => {
        setMyPresence({
            pencilDraft: [[point.x, point.y, pressure]],
            penColor: lastUsedColor,
        })
    },[lastUsedColor]);



    const resizeSelectedLayer = useMutation((
        { storage , self},
        point: Point,
    ) => {
        if (canvasState.mode !== CanvasMode.Resizing){
            return;
        }

        const bounds = resizeBounds(
            canvasState.initialBounds,
            canvasState.corner,
            point
        );

        const liveLayers = storage.get("layers") as LiveMap<string, LiveObject<Layer>> | undefined;
        if (!liveLayers) return;

        const selection = self.presence.selection as string[] | undefined;
        if (!selection || selection.length === 0) return;

        const layer = liveLayers.get(selection[0]);

        if (layer){
            layer.update(bounds);
        };

    }, [canvasState])

    const onResizeHandlePointerDown = useCallback((
        corner: Side,
        initialBounds: XYWH,
    ) => {
        history.pause();
        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds,
            corner,
        });
    }, [history]);


    

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }));
    }, []);

    const onPointerMove = useMutation(({setMyPresence}, e: React.PointerEvent) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Pressing){
            startMultiSelection(current, canvasState.origin);
        }else if (canvasState.mode === CanvasMode.SelectionNet){
            updateSelectionNet(current, canvasState.origin);
        }else if (canvasState.mode === CanvasMode.Translating){
            translateSelectedLayers(current);
        }else if (canvasState.mode === CanvasMode.Resizing) {
            resizeSelectedLayer(current);
        } else if (canvasState.mode === CanvasMode.Pencil) {
            continueDrawing(current, e);
        }

        setMyPresence({ cursor: current});

    }, [
        continueDrawing,
        canvasState,
        camera,
        resizeSelectedLayer,
        translateSelectedLayers,
        startMultiSelection,
        updateSelectionNet,
    ]);

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null});
    }, [])


    const onPointerDown = useCallback((
            e: React.PointerEvent,
    ) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Inserting) {
            return;
        }

        if (canvasState.mode === CanvasMode.Pencil) {
            startDrawing(point, e.pressure);
            return;
        }

        setCanvasState({origin: point, mode: CanvasMode.Pressing});
    }, [camera, canvasState.mode, setCanvasState, startDrawing]);

    const onPointerUp = useMutation((
        {},
        e
    ) => {
        if (!isStorageLoaded) {
            return;
        }
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Pressing
        ) {
            unselectLayer();
            setCanvasState({
                mode: CanvasMode.None,
            });
        }else if (canvasState.mode === CanvasMode.Pencil){
            insertPath();
        }else if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.layerType, point);
        } else{
            setCanvasState({
                mode: CanvasMode.None
            });
        }
        history.resume();
    }, [
        insertPath,setCanvasState ,camera, canvasState,history,insertLayer, isStorageLoaded, unselectLayer
    ]);

    const selections = useOthersMapped((other) => other.presence.selection);
    
    const onLayerPointDown = useMutation((
        { self, setMyPresence },
        e: React.PointerEvent,
        layerId: string,
    ) => {

    if  (canvasState.mode === CanvasMode.Pencil || 
        canvasState.mode === CanvasMode.Inserting
    ) {
        return;
    }

    history.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e, camera);

    const selection = self.presence.selection as string[] | undefined;
    if (!selection || !selection.includes(layerId)) {
        setMyPresence({ selection: selection ? [...selection, layerId] : [layerId] }, {addToHistory: true})
    }
    setCanvasState({mode: CanvasMode.Translating, current: point, initialPoint: point});
    }, [
        setCanvasState,
        camera,
        history,
        canvasState.mode,
    ])

    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};

        for (const user of selections) {
            const [connectionId, selection] = user as [connectionId: number, selection: string[] | undefined];

            if (!selection) continue;

            for (const layerId of selection) {
                layerIdsToColorSelection[layerId] = connectionIdColor(connectionId)
            }
        }
        return layerIdsToColorSelection;
    }, [selections]);
    
    const deleteLayers = useDeleteLayer();
    
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent){
            // case "Backspace":
            //     deleteLayers();
            //     break;

            switch (e.key) {
                case "z": {
                    if (e.ctrlKey || e.metaKey){
                        history.redo();
                    }else{
                        history.undo();
                    }
                    break;
                }
            }
        }

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [deleteLayers, history])

    if (!isStorageLoaded) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-neutral-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-neutral-500 font-medium">Loading canvas...</p>
                </div>
            </div>
        );
    }

    return (
        <main
        className="h-full w-full relative bg-neutral-100 touch-none">
            <Info boardId={boardId}/>
            <Participants/>
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo = {canRedo}
                canUndo = {canUndo}
                undo = {history.undo}
                redo = {history.redo}
            />

            {isStorageLoaded && (
                <SelectionTools
                    camera = {camera}
                    setLastUsedColor = {setLastUsedColor}
                    isStorageLoaded = {isStorageLoaded}
                />
            )}

            <svg
                className="h-[100vh] w-[100vw]"
                onWheel = {onWheel}
                onPointerMove = {onPointerMove}
                onPointerLeave = {onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}
            >
                <g
                    style = {{
                        transform: `translate(${camera.x}px, ${camera.y}px)`
                    }}
                >
                    {layerIds?.map((layerId) => (
                        <LayerPreview
                        key = {layerId}
                        id = {layerId}
                        onLayerPointDown = {onLayerPointDown}
                        selectionColor = {layerIdsToColorSelection[layerId]}
                        />
                    ))}
                    <SelectionBox
                        onResizeHandlePointerDown = {onResizeHandlePointerDown}
                    />
                    {canvasState.mode === CanvasMode.SelectionNet && canvasState.current && (
                        <rect
                            className="fill-blue-500/5 stroke-blue-500 stroke-1"
                            x={Math.min(canvasState.origin.x, canvasState.current.x)}
                            y={Math.min(canvasState.origin.y, canvasState.current.y)}
                            width = {Math.abs(canvasState.origin.x - canvasState.current.x)}
                            height = {Math.abs(canvasState.origin.y - canvasState.current.y)}
                        />
                    )}
                    <CursorPresence/>
                    {pencilDraft && (pencilDraft as number[][]).length > 0 && (
                        <Path
                            points = {pencilDraft as number[][]}
                            fill = {colorTocss(lastUsedColor)}
                            x = {0}
                            y = {0}
                        />
                    )}
                </g>
            </svg>
        </main>
    );
};

