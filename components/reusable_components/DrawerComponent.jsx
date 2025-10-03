"use client";

import { Button } from "@components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
    DrawerTrigger,
} from "@components/ui/drawer";
import { X } from "lucide-react";

export default function DrawerComponent({
    children,
    trigger,
    title,
    description = "",
    direction = "right",
}) {
    return (
        <Drawer direction={direction}>
            {trigger}
            <DrawerContent className="p-5 dark:bg-black min-w-screen md:min-w-[60%] overflow-x-hidden dark:text-white overflow-y-scroll">
                <DrawerHeader>
                    <DrawerTitle className="dark:text-white text-2xl">
                        {title}
                    </DrawerTitle>
                    <DrawerDescription className="dark:text-white">
                        {description}
                    </DrawerDescription>
                </DrawerHeader>
                {children}
                <DrawerFooter>
                    <DrawerClose className="btn btn-neutral">
                        <X /> Close
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
