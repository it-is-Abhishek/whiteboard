import { Canvas } from "./_components/canvas";
import { Room } from "@/components/room";
import { Loading } from "./_components/loading";

interface boardIdPageProps {
    params: Promise<{
        boardId: string;
    }>;
};

const boardIdPage = async ({
    params,
}: boardIdPageProps) => {
    // return <Loading/>
    const { boardId } = await params;
    return (
        <Room roomId={boardId} fallback = {<Loading/>}>
            <Canvas boardId={boardId}/>
        </Room>
    );
};

export default boardIdPage;
