import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Lazy initialization of Convex client
let convex: ConvexHttpClient | undefined;

function getConvexClient() {
  if (!convex) {
    convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  }
  return convex;
}

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  try {
    const authorization = await auth();
    const user = await currentUser();

    if (!authorization || !user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { room } = await request.json();
    
    if (!room) {
      return new NextResponse("Room ID is required", { status: 400 });
    }

    const convexClient = getConvexClient();
    const board = await convexClient.query(api.board.get, { id: room });

    if (!board) {
      return new NextResponse("Board not found", { status: 404 });
    }

    if (board?.orgId !== authorization.orgId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name: user.firstName || "Teammate",
        picture: user.imageUrl,
      },
    });

    session.allow(room, session.FULL_ACCESS);

    const { status, body } = await session.authorize();
    return new NextResponse(body, { status });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

