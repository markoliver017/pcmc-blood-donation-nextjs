"use client";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@components/ui/drawer";

export default function DrawerComponent({
    children,
    position,
    title,
    isOpen,
    onClose,
}) {
    return (
        <>
            <Drawer direction={position} open={isOpen}>
                <DrawerContent className="dark:bg-neutral-900 dark:text-slate-100">
                    <DrawerHeader>
                        <DrawerTitle className="dark:text-slate-100">
                            {title}
                        </DrawerTitle>
                        {/* <DrawerDescription>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Nam veniam reiciendis nulla ducimus fuga ad.
                        </DrawerDescription> */}
                    </DrawerHeader>

                    <div className="p-4">{children}</div>

                    <DrawerFooter>
                        <DrawerClose className="btn btn-default">
                            Close
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
