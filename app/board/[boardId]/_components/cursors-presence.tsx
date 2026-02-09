
"use client";

import { memo } from "react";
import { shallow, useOthersConnectionIds, useOthersMapped } from "@liveblocks/react";
import { Cursor } from "./cursor";
import { Path } from "./path";
import { colorTocss } from "@/lib/utils";
import { Color } from "@/types/canvas";

const Cursors = () => {
    const ids = useOthersConnectionIds();
    return (
        <>
            {ids.map((connectionId) => (
                <Cursor
                    key = {connectionId}
                    connectionId = {connectionId}
                />
            ))}
        </>
    );
};

const Drafts = () => {
    const others = useOthersMapped((other) => ({
        pencilDraft: other.presence.pencilDraft,
        penColor: other.presence.penColor,
    }), shallow);

    return (
        others.map(([key, other]) => {
            const pencilDraft = other.pencilDraft as number[][] | null;
            const penColor = other.penColor as Color | null;
            if (pencilDraft){
                return(
                    <Path
                        key = {key}
                        x = {0}
                        y = {0}
                        points = {pencilDraft}
                        fill={penColor ? colorTocss(penColor) : "#000"}
                    />
                );
            }

            return null;
        })
    )
}

export const CursorPresence = memo(() => {
    return (
        <>
            <Drafts />
            <Cursors/>
        </>
    );
});

CursorPresence.displayName = "CursorsPresence";
