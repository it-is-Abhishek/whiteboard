import Image from "next/image";

export const EmptyFavorites = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/fav.png"
                alt = "Empty"
                height = {260}
                width = {260}
            />
            <h2 className="text-2xl font-semibold mt-6">
                No Favorite boards!
            </h2>
            <p className="text-muted-foreground texttg-sm mt-2">
                Try Favoriting a Board
            </p>
        </div>
    );
};