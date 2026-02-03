import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
  
});

type UserMeta = {
  id?: string;
  info?: {
    name?: string;
    picture?: string;
  };
};


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
