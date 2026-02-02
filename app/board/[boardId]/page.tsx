import { Canvas } from "./_components/canvas";
import { Room } from "@/components/room";

interface boardIdPageProps {
    params: Promise<{
        boardId: string;
    }>;
};

const boardIdPage = async ({
    params,
}: boardIdPageProps) => {
    const { boardId } = await params;
    return (
        <Room roomId={boardId}>
            <Canvas boardId={boardId}/>
        </Room>
    );
};

export default boardIdPage;
