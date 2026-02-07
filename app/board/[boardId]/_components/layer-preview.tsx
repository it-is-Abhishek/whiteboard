
"use client";

import { memo } from "react";
import { useStorage } from "@liveblocks/react";
import { LayerType, RectangleLayer, EllipseLayer, TextLayer, Layer } from "@/types/canvas";
import { LiveMap, LiveObject } from "@liveblocks/client";
import { Rectangle } from "./rectangle";
import { Ellipse } from "./ellipse";
import { Text } from "./text";
import { Note } from "./note";


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

    const layer = useStorage((root) => (root.layers as unknown as LiveMap<string, LiveObject<Layer>>).get(id));

    if (!layer) {
        return null;
    }

    switch (layer.type) {
        case LayerType.Note:
            return (
                <Note
                    id = {id}
                    layer = {layer as unknown as TextLayer}
                    onPointerDown = {onLayerPointDown}
                    selectionColor = {selectionColor}
                />
            );

        case LayerType.Text:
            return (
                <Text
                    id = {id}
                    layer = {layer as unknown as TextLayer}
                    onPointerDown = {onLayerPointDown}
                    selectionColor = {selectionColor}
                />
            );

        case LayerType.Ellipse:
            return (
                <Ellipse
                    id = {id}
                    layer = {layer as unknown as EllipseLayer}
                    selectionColor = {selectionColor}
                    onPointerDown = {onLayerPointDown}
                />
            );

        case LayerType.Rectangle:
            return (
                <Rectangle
                    id = {id}
                    layer = {layer as unknown as RectangleLayer}
                    onPointDown = {onLayerPointDown}
                    selectionColor = {selectionColor}
                />
            );
        default:
            console.warn("Unknown layer type");
            return null;
    }
};

LayerPreview.displayName = "LayerPreview";
