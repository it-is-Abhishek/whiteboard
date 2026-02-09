

import { useSelf, useMutation} from "@liveblocks/react";
import { useStorage } from "@/liveblocks.config";
import { LiveMap, LiveList } from "@liveblocks/client";
import { Layer } from "@/types/canvas";

export const useDeleteLayer = () => {
    const selection = useSelf((me) => me.presence.selection as string[] | undefined);
    const isStorageLoaded = useStorage((root) => root.layerIds) !== undefined;

    return useMutation((
        {storage,  setMyPresence}
    ) => {
        if (!isStorageLoaded) return;

        const livelayers = storage.get("layers") as LiveMap<string, Layer> | undefined;
        const livelayersIds = storage.get("layerIds") as LiveList<string> | undefined;

        if (!livelayers || !livelayersIds) return;

        selection?.forEach((id: string) => {
            livelayers.delete(id);

            const index = livelayersIds.indexOf(id);

            if (index !== -1){
                livelayersIds.delete(index);
            }
        })

        setMyPresence({selection: []}, {addToHistory: true});
    }, [selection, isStorageLoaded]);
}
