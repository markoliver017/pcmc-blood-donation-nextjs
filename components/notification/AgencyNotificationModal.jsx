"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { GiRingingBell } from "react-icons/gi";

export default function AgencyNotificationModal({
    isOpen,
    setIsOpen,
    children,
}) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
            <DialogContent
                className={`min-w-full md:min-w-96  max-h-97/100 overflow-y-scroll `}
                tabIndex={-1}
            >
                <DialogHeader>
                    <DialogTitle>
                        <span className="flex-items-center">
                            <GiRingingBell /> Notification Details
                        </span>
                    </DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
