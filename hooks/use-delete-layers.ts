

import { useSelf, useMutation} from "@liveblocks/react";
import { useStorage } from "@/liveblocks.config";

export const useDeleteLayer = () => {
    const selection = useSelf((me) => me.presence.selection);
    const isStorageLoaded = useStorage((root) => root.layerIds) !== undefined;

    return useMutation((
        {storage,  setMyPresence}
    ) => {
        if (!isStorageLoaded) return;

        const livelayers = storage.get("layers");
        const livelayersIds = storage.get("layerIds");

        selection?.forEach((id) => {
            livelayers?.delete(id);

            const index = livelayersIds?.indexOf(id);

            if (index !== -1){
                livelayersIds?.delete(index);
            }
        })

        setMyPresence({selection: []}, {addToHistory: true});
    }, [selection, isStorageLoaded]);
}
