"use client";

import {
    Dialog,
    DialogOverlay,
    DialogHeader,
    DialogTitle,
    DialogContentNoX,
} from "@components/ui/dialog";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";

export default function ErrorModal({ children }) {
    const router = useRouter();

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
            <DialogOverlay>
                <DialogContentNoX
                    onInteractOutside={(event) => event.preventDefault()}
                    className="min-w-full md:min-w-8/10 2xl:min-w-7/10 max-h-97/100 overflow-y-scroll"
                    tabIndex={-1}
                >
                    <ToastContainer />
                    <DialogHeader className="hidden">
                        <DialogTitle>Title</DialogTitle>
                    </DialogHeader>
                    {children}
                </DialogContentNoX>
            </DialogOverlay>
        </Dialog>
        //   <DialogContent>
        //   <DialogHeader>
        //     <DialogTitle>Are you absolutely sure?</DialogTitle>
        //     <DialogDescription>
        //       This action cannot be undone. This will permanently delete your account
        //       and remove your data from our servers.
        //     </DialogDescription>
        //   </DialogHeader>
        // </DialogContent>
    );
}
