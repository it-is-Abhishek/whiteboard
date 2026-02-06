"use client";


import { Layer, LayerType, Side, XYWH } from "@/types/canvas";
import { useSelf, useStorage } from "@liveblocks/react";
import { memo } from "react";
import { LiveObject, LiveMap } from "@liveblocks/client";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";


interface SelectionBoxProps {
    onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
};

const HANDLE_WIDTH = 8;


export const SelectionBox = memo(({
    onResizeHandlePointerDown,
}: SelectionBoxProps) => {

    const soleLayerId = useSelf((me) => {
        const selection = me.presence?.selection as string[] | null | undefined;
        const result = selection?.length === 1 ? selection[0] ?? null : null;
        console.log("SelectionBox - soleLayerId:", result, "selection:", selection);
        return result;
    });

    const isShowingHandles = useStorage((root) => {
        if (!soleLayerId) {
            console.log("SelectionBox - No soleLayerId, hiding handles");
            return false;
        }
        const layers = root.layers as LiveMap<string, LiveObject<Layer>> | undefined;
        if (!layers) {
            console.log("SelectionBox - No layers in root");
            return false;
        }
        
        const layer = layers.get(soleLayerId);
        console.log("SelectionBox - layer:", layer, "soleLayerId:", soleLayerId);
        
        if (!layer) {
            console.log("SelectionBox - Layer not found");
            return false;
        }
        
        // Get the layer type - LiveObject requires .get() method
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const layerAny = layer as unknown as { get: (key: string) => any; type?: number };
        const layerType = typeof layerAny.get === "function" ? layerAny.get("type") : layerAny.type;
        console.log("SelectionBox - layerType:", layerType, "LayerType.Path:", LayerType.Path);
        
        return layerType !== LayerType.Path;
    });

    const bounds = useSelectionBounds();
    console.log("SelectionBox - bounds:", bounds, "isShowingHandles:", isShowingHandles);
    
    if (!bounds){
        console.log("SelectionBox - No bounds, returning null");
        return null;
    }

    return (
        <>
            <rect
                className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
                x = {bounds.x}
                y = {bounds.y}
                width = {bounds.width}
                height = {bounds.height}
            />
            {isShowingHandles && (
                <>
                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x = {bounds.x - HANDLE_WIDTH / 2}
                        y = {bounds.y - HANDLE_WIDTH / 2}
                        width = {HANDLE_WIDTH}
                        height = {HANDLE_WIDTH}
                        style={{ cursor: "nwse-resize" }}
                    />
                </>
            )}
        </>
    );
});

SelectionBox.displayName = "SelectionBox";

