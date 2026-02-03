

import Image from "next/image";

export const Loading = () => {
    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
            <Image
                src = "/logo.svg"
                alt = "Logo"
                width = {280}
                height = {280}
                className="animate-[pulse_0.7s_ease-in-out_infinite]"
            />
        </div>
    )
}