"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


interface InfoProps {
    boardId: string;
};

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

export const Info = ({
    boardId,
}:InfoProps) => {
    const data = useQuery(api.board.get, {
        id: boardId as Id<"board">,
    });

    if (!data) return <InfoSkeleton/>;

    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
                <Button>
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        height={40}
                        width={40}
                    />
                </Button>
        </div>
    );
};


export const InfoSkeleton = () => {
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-m w-[300px]"/>
    );
};