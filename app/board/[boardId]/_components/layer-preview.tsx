
"use client";

import { memo } from "react";
import { useStorage } from "@liveblocks/react";
import { LayerType } from "@/types/canvas";
import { LiveMap, LiveObject } from "@liveblocks/client";
import { Rectangle } from "./rectangle";


interface LayerPreviewProps {
    id: string;
    onLayerPointDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor?: string;
}

export const LayerPreview = ({
    id,
    onLayerPointDown,
    selectionColor,

}: LayerPreviewProps) => {

    const layer = useStorage((root) => (root.layers as LiveMap<string, LiveObject<Layer>>).get(id));

    if (!layer) {
        return null;
    }

    switch (layer.type) {
        case LayerType.Rectangle:
            return (
                <Rectangle
                    id = {id}
                    layer = {layer}
                    onPointerDown = {onLayerPointDown}
                    selectionColor = {selectionColor}
                />
            );
        default:
            console.warn("Unknown layer type");
            return null;
    }
};

LayerPreview.displayName = "LayerPreview";
