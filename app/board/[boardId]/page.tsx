import { Canvas } from "./_components/canvas";

interface boardIdPageProps {
    params: {
        boardId: string;
    };
};

const boardIdPage = ({
    params,
}: boardIdPageProps) => {
    return (
        <Canvas boardId={params.boardId}/>
    );
};

export default boardIdPage;