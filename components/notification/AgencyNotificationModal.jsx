"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";

export default function AgencyNotificationModal({
    isOpen,
    setIsOpen,
    children,
}) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
            <DialogContent
                className={`min-w-full md:min-w-8/10 2xl:min-w-7/10  max-h-97/100 overflow-y-scroll pt-10 `}
                tabIndex={-1}
            >
                <DialogHeader className="hidden">
                    <DialogTitle>Title</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
