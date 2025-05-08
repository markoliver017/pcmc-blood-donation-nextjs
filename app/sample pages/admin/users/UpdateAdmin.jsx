"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Plus } from "lucide-react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import CreateForm from "./CreateForm";
import { useState } from "react";
import UpdateProfile from "../profile/UpdateProfile";
import Password from "../profile/Password";

export default function UpdateAdmin({ isOpen, setIsOpen, admin, onSave }) {
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex gap-1">
                                <MdOutlineAdminPanelSettings /> Update
                                Administrator
                            </div>
                        </DialogTitle>
                        {/* <DialogDescription> */}
                        {/* </DialogDescription> */}

                        <Tabs defaultValue="profile" className="w-full mt-5">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="profile">
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="password">
                                    Change Password
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="profile">
                                <UpdateProfile
                                    admin={admin}
                                    onClose={() => setIsOpen(false)}
                                    onSave={onSave}
                                />
                            </TabsContent>
                            <TabsContent value="password">
                                <Password
                                    admin={admin}
                                    onClose={() => setIsOpen(false)}
                                    onSave={onSave}
                                />
                            </TabsContent>
                        </Tabs>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
