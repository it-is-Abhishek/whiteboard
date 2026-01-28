"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogClose,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog";

import { useRenameModal} from "@/store/use-rename-modal";
import { init } from "next/dist/compiled/webpack/webpack";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export const RenameModal = () => {
    
    const {
        isOpen,
        onClose,
        initialValues,
    } = useRenameModal ();
    
    const [title, setTitle] = useState(initialValues.title);


    useEffect(() => {
        setTitle(initialValues.title);
    }, [initialValues]);

    const onSubmit = () => {};

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Edit board Title
                </DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Enter a new title for this board
            </DialogDescription>
            <form>
                <Input
                    disabled = {false}
                    maxLength = {60}
                    value={60}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Board title"
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button disabled = {false}>
                        Save
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    );
};
