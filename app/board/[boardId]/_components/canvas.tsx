"use client";

import { useState } from "react";
import { CanvasMode, CanvasState } from "@/types/canvas";
import { Info} from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { set } from "date-fns";
import { useHistory, useCanRedo , useCanUndo} from "@liveblocks/react";

interface Canvasprops {
    boardId: string;
};

export const Canvas = ({
    boardId,
}: Canvasprops) => {

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();


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
        </main>
    );
};