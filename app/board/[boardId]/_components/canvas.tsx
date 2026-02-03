"use client";

import { Info} from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";

interface Canvasprops {
    boardId: string;
};

export const Canvas = ({
    boardId,
}: Canvasprops) => {

    return (
        <main
        className="h-full w-full relaive bg-neutral-100 touch-none">
            <Info boardId={boardId}/>
            <Participants/>
            <Toolbar/>
        </main>
    );
};