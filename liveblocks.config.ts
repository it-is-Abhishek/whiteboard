import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
  
});

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useOthers,
  useOthersMapped,
  useSelf,
  useStorage,
  useMutation,
  useHistory,
  useCanRedo,
  useCanUndo,
  useUndo,
  useRedo,
  useBroadcastEvent,
  useEventListener,
  useThreads,
  useCreateThread,
  useEditThreadMetadata,
  useRoomInfo,
} = createRoomContext(client);
