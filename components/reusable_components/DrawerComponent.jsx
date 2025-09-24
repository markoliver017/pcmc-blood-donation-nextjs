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
            <DrawerContent className="p-5 dark:bg-black dark:text-white min-w-full md:min-w-[900px] overflow-y-scroll">
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
