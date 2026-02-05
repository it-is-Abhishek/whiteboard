import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  throttle: 16,
  authEndpoint: "/api/liveblocks-auth",
  
});

type UserMeta = {
  id?: string;
  info?: {
    name?: string;
    picture?: string;
  };
};

type Presence = {
  cursor : {x :number , y: number } | null,
}

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
