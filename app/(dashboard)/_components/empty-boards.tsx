import { Button } from "@/components/ui/button";
import Image from "next/image";

export const EmptyBoards = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/board.png"
                alt = "Empty"
                height = {260}
                width = {260}
            />
            <h2 className="text-2xl font-semibold mt-6">
                Create your first boards!
            </h2>
            <p className="text-muted-foreground texttg-sm mt-2">
                Start by Creating a board for your organization
            </p>
            <div className="mt-6">
                <Button size ="lg">
                    Create board
                </Button>
            </div>
        </div>
    );
};