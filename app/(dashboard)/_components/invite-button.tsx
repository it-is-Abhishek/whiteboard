"use client";

import { Plus } from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Invite members
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
        <VisuallyHidden>
          <DialogTitle>Invite members</DialogTitle>
        </VisuallyHidden>

        <OrganizationProfile routing="hash" />
      </DialogContent>
    </Dialog>
  );
};
