"use client";

import {
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
    DrawerState,
    DrawerDescription,
} from "@components/ui/drawer";
import LoginForm from "@components/login/LoginForm";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import Link from "next/link";

export default function SelectRegisterDrawer({ open, setOpen }) {
    return (
        <>
            <DrawerState direction="bottom" open={open} onOpenChange={setOpen}>
                <DrawerContent className="flex justify-center items-center dark:bg-neutral-900 dark:text-slate-100">
                    <DrawerHeader className="text-center">
                        <DrawerTitle className="text-2xl dark:text-slate-100">
                            PCMC PedBC MBD Portal - Registration
                        </DrawerTitle>
                        <DrawerDescription>
                            Please select an account on which you want to
                            register.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex gap-3">
                        <Link href="/organizers">
                            <Card className="rounded-sm cursor-pointer hover:ring-1">
                                <CardHeader>
                                    <CardTitle>Blood Donor</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Image
                                        src="/blood-bg.jpg"
                                        className="w-40 h-20 object-fill rounded-lg"
                                        width={150}
                                        height={150}
                                        alt="Donor"
                                        title="Donor"
                                    />
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href="/organizers/register">
                            <Card className="rounded-sm cursor-pointer hover:ring-1">
                                <CardHeader>
                                    <CardTitle>Agency</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Image
                                        src="/agency-reg.jpg"
                                        className="w-40 h-20 object-fill rounded-lg"
                                        width={150}
                                        height={150}
                                        alt="Agency"
                                        title="Agency"
                                    />
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href="/organizers/coordinators">
                            <Card className="rounded-sm cursor-pointer hover:ring-1">
                                <CardHeader>
                                    <CardTitle>Coordinator</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Image
                                        src="/coordinator-img.jpeg"
                                        className="w-40 h-20 object-fill rounded-lg"
                                        width={150}
                                        height={150}
                                        alt="Coordinator"
                                        title="Coordinator"
                                    />
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    <DrawerFooter>
                        <DrawerClose className="btn btn-default">
                            Close
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </DrawerState>
        </>
    );
}
