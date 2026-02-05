"use client";

import { useCallback, useState } from "react";
import { Camera, CanvasMode, CanvasState, LayerType, Point, Color, Layer} from "@/types/canvas";
import { Info} from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useHistory, useCanRedo , useCanUndo, useMutation, useStorage} from "@liveblocks/react";
import { CursorPresence } from "./cursors-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";
import { setMinutes } from "date-fns";
import { nanoid } from "nanoid";
import { LiveObject, LiveList, LiveMap } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";

const MAX_LAYERS = 100;

interface Canvasprops {
    boardId: string;
};

export const Canvas = ({
    boardId,
}: Canvasprops) => {

    const layerIds = useStorage((root) => root.layerIds as LiveList<string>);

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });
    const [camera, setCamera] = useState({ x:0, y: 0 });
    const [lastUsedColor, setLastUsedColor] = useState({
        r: 0,
        g: 0,
        b: 0,
    });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const insertLayer = useMutation((
        {storage, setMyPresence},
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
        position: Point, 
    ) => {
        const liveLayers = storage.get("layers") as LiveMap<string, LiveObject<Layer>>;
        if (liveLayers.size >= MAX_LAYERS){
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

    }, [lastUsedColor]);

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }));
    }, []);

    const onPointerMove = useMutation(({setMyPresence}, e: React.PointerEvent) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera);

        setMyPresence({ cursor: current});

    }, [])

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null});
    }, [])

    const onPointerUp = useMutation((
        {},
        e
    ) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.layerType, point);
        } else{
            setCanvasState({
                mode: CanvasMode.None
            });
        }
        history.resume();
    }, [
        camera, canvasState,history,insertLayer
    ]);

    return (
        <main
        className="h-full w-full relaive bg-neutral-100 touch-none">
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
            <svg
                className="h-[100vh] w-[100vw]"
                onWheel = {onWheel}
                onPointerMove = {onPointerMove}
                onPointerLeave = {onPointerLeave}
                onPointerUp={onPointerUp}
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
                        onLayerPointDown = {() => {}}
                        selectionColor = "#000"
                        />
                    ))}
                    <CursorPresence/>
                </g>
            </svg>
        </main>
    );
};

