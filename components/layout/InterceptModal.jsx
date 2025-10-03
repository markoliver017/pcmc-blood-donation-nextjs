"use client";

import {
    Dialog,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { useRouter } from "next/navigation";
import { useModalToastContainer } from "@lib/hooks/useModalToastContainer";

export default function InterceptModal({ children, className = "" }) {
    const router = useRouter();

    useModalToastContainer();

    const handleOpenChange = () => {
        router.back();
    };

    return (
        <Dialog
            defaultOpen={true}
            open={true}
            onOpenChange={handleOpenChange}
            modal={true}
        >
            <DialogContent
                onInteractOutside={(event) => event.preventDefault()}
                className={`min-w-full md:min-w-8/10 2xl:min-w-7/10 p-2 max-h-97/100 overflow-y-scroll pt-10 ${className}`}
                tabIndex={undefined}
            >
                <DialogHeader className="hidden">
                    <DialogTitle>Title</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
