"use client";

import React from "react";
import { ClerkProvider, useAuth, RedirectToSignIn } from "@clerk/nextjs";
import {ConvexProviderWithClerk} from "convex/react-clerk";
import {AuthLoading, Authenticated, Unauthenticated, ConvexReactClient} from "convex/react";
import { Loading } from "@/components/auth/loading";


interface ClientProviderProps {
    children : React.ReactNode;
};

const convexURL = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexURL)

export const ConvexClientProvider = ({children}: ClientProviderProps) => {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth as any}>
                <AuthLoading>
                    <Loading />
                </AuthLoading>

                <Authenticated>
                    {children}
                </Authenticated>

                <Unauthenticated>
                    <RedirectToSignIn />
                </Unauthenticated>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
};
