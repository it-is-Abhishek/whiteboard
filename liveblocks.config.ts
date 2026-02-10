import {
  createClient,
  LiveList,
  LiveMap,
  LiveObject,
} from "@liveblocks/client";

import { createRoomContext } from "@liveblocks/react";
import { Layer, Color } from "@/types/canvas";

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
  cursor: { x: number; y: number } | null;
  selection: string[];
  pencilDraft: [x: number, y: number, pressure: number[]] | null;
  penColor: Color | null;
};

type Storage = {
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
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
} = createRoomContext<Presence, Storage, UserMeta>(client);

