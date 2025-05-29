"use client";

import {
    Dialog,
    DialogOverlay,
    DialogHeader,
    DialogTitle,
    DialogContentNoX,
} from "@components/ui/dialog";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingModal({ isLoading }) {

    return (
        <Dialog
            defaultOpen={true}
            open={isLoading}
            modal={true}
        >
            <DialogContentNoX
                onInteractOutside={(event) => event.preventDefault()}
                className="w-120 h-96 overflow-y-scroll"
                tabIndex={-1}
            >
                <DialogHeader className="hidden">
                    <DialogTitle>Processing . .</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center">

                    <Image
                        src="/loader_2.gif"
                        className="flex-none rounded-4xl"
                        width={250}
                        height={250}
                        layout="intrinsic"
                        alt="Logo"
                    />
                    <motion.span
                        initial={{ color: "#4b5563" }} // Tailwind's text-gray-700
                        animate={{ color: ["#4b5563", "#facc15", "#4b5563"] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        Processing ...
                    </motion.span>
                </div>
            </DialogContentNoX>

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
