"use client";


import { UserAvatar } from "./user-avatar";
import { useOthers, useSelf} from "@/liveblocks.config";
import { connectionIdColor } from "@/lib/utils";


const MAX_SHOWN_USERS = 1;

export const Participants = () => {
    const users = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = users.length > MAX_SHOWN_USERS;

    return (
        <div className="absolute  h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
            <div className="flex gap-x-2">
                {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info}) => {
                    return (
                        <UserAvatar
                            borderColor={connectionIdColor(connectionId)}
                            key={connectionId}
                            src = {info?.picture as string | undefined}
                            name = {info?.name as string | undefined}
                            fallback={info?.name?.[0] || "T"}
                        />
                    );
                })}
                
                {currentUser && (
                    <UserAvatar
                        src={currentUser.info?.picture as string | undefined}
                        name={`${currentUser.info?.name} (You)`}
                        fallback = {currentUser.info?.name?.[0]}
                    />
                )}

                {hasMoreUsers && (
                    <UserAvatar
                        name={`${users.length - MAX_SHOWN_USERS} more`}
                        fallback = {`+${users.length - MAX_SHOWN_USERS}`}
                    />
                )}
            </div>
        </div>
    );
};

export const ParticipantsSkeleton = () => {
    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]"/>
    );
};