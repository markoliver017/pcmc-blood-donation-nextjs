"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";

import { Eye, View } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ImagePreviewComponent({
    imgSrc = null,
    triggerContent = (
        <>
            <Eye />
            Preview
        </>
    ),
    className = "btn-ghost",
}) {
    const [open, setOpen] = useState(false);

    if (!imgSrc) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogTrigger asChild>
                <button
                    onClick={(e) => e.stopPropagation()}
                    className={`btn ${className}`}
                >
                    {triggerContent}
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl p-6 dark:text-white">
                <DialogHeader>
                    <DialogTitle className="mb-4">Image Preview</DialogTitle>
                </DialogHeader>

                <div className="relative w-full max-w-full min-h-[500px] max-h-[80vh] overflow-clip">
                    <Image
                        src={imgSrc}
                        alt="Event Image"
                        width={1000}
                        height={1000}
                        className="object-cover rounded-md"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
