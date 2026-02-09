
"use client";

import { memo } from "react";
import { useStorage } from "@liveblocks/react";
import { LayerType, RectangleLayer, EllipseLayer, TextLayer, Layer, NoteLayer } from "@/types/canvas";
import { LiveMap, LiveObject } from "@liveblocks/client";
import { Rectangle } from "./rectangle";
import { Ellipse } from "./ellipse";
import { Text } from "./text";
import { Note } from "./note";
import { Path } from "./path";
import { colorTocss } from "@/lib/utils";


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

    // useStorage returns a plain object, not LiveObject
    const layerData = layer as unknown as Layer;

    switch (layerData.type) {
        case LayerType.Path:
            return (
                <Path
                    key = {id}
                    points = {layerData.points}
                    onPointerDown = {(e) => onLayerPointDown(e, id)}
                    x = {layerData.x}
                    y = {layerData.y}
                    fill = {layerData.fill ? colorTocss(layerData.fill) : "#000"}
                    stroke = {selectionColor}
                />
            );

        case LayerType.Note:
            return (
                <Note
                    id = {id}
                    layer = {layerData as NoteLayer}
                    onPointerDown = {onLayerPointDown}
                    selectionColor = {selectionColor}
                />
            );

        case LayerType.Text:
            return (
                <Text
                    id = {id}
                    layer = {layerData as TextLayer}
                    onPointerDown = {onLayerPointDown}
                    selectionColor = {selectionColor}
                />
            );

        case LayerType.Ellipse:
            return (
                <Ellipse
                    id = {id}
                    layer = {layerData as EllipseLayer}
                    selectionColor = {selectionColor}
                    onPointerDown = {onLayerPointDown}
                />
            );

        case LayerType.Rectangle:
            return (
                <Rectangle
                    id = {id}
                    layer = {layerData as RectangleLayer}
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
