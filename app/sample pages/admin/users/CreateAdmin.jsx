"use client";

import { Button } from "@components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";
import { Plus } from "lucide-react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import CreateForm from "./CreateForm";
import { useState } from "react";

export default function CreateAdmin({ onSave }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="btn btn-neutral">
                    <Plus /> Create New
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex gap-1">
                                <MdOutlineAdminPanelSettings /> Create New
                                Administrator
                            </div>
                        </DialogTitle>
                        {/* <DialogDescription> */}

                        <CreateForm
                            onSave={onSave}
                            closeModal={() => setOpen(false)}
                        />

                        {/* </DialogDescription> */}
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
