"use client";

import { useCallback, useState } from "react";
import { Camera, CanvasMode, CanvasState } from "@/types/canvas";
import { Info} from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useHistory, useCanRedo , useCanUndo, useMutation} from "@liveblocks/react";
import { CursorPresence } from "./cursors-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";
import { setMinutes } from "date-fns";

interface Canvasprops {
    boardId: string;
};

export const Canvas = ({
    boardId,
}: Canvasprops) => {

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });
    const [camera, setCamera] = useState({ x:0, y: 0 });


    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

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
            >
                <g>
                    <CursorPresence/>
                </g>
            </svg>
        </main>
    );
};

