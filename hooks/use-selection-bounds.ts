import { shallow } from "@liveblocks/client";

import { Layer, XYWH} from "@/types/canvas";
import { useStorage, useSelf} from "@liveblocks/react";

const boundingBox = (layers: Layer[]): XYWH | null => {
    const first = layers[0];

    if (!first){
        return null;
    }

    let left = first.x;
    let top = first.y;
    let right = first.x + first.width;
    let bottom = first.y + first.height;


    for (let i = 1; i < layers.length; i++){
        const { x, y, width, height} = layers[i];

        if (x < left){
            left = x;
        }

        if (x + width > right) {
            right = x + width;
        }
        if (y < top) {
            top = y;
        }
        if (y + height > bottom){
            bottom = y + height;
        }
    }

    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
    };
};

export const useSelectionBounds = () => {
    const selection = useSelf((me) => me.presence.selection);

    return useStorage((root) => {
        const selectionLayers = selection
        .map((layerId) => root.layers.get(layerId)!)
        .filter(Boolean);

        return boundingBox(selectionLayers);
    }, shallow)
}
