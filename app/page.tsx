"use client";

import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <SignedOut>
          <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Whiteboard
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Please sign in to access your dashboard
            </p>
            <SignInButton>
              <Button size="lg">Sign In</Button>
            </SignInButton>
          </div>
        </SignedOut>
        
        <SignedIn>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.firstName || user?.username || user?.emailAddresses[0]?.emailAddress}
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Whiteboard</h2>
              <p className="text-gray-600">
                You are now signed in and can access your whiteboard features.
              </p>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
