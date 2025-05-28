"use client";

import React, {
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
} from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@lib/utils";

const Drawer = forwardRef(
    ({ children, defaultOpen = false, direction = "bottom" }, ref) => {
        const [open, setOpen] = useState(defaultOpen);

        useImperativeHandle(ref, () => ({
            open: () => setOpen(true),
            close: () => setOpen(false),
        }));

        return (
            <DrawerPrimitive.Root
                open={open}
                onOpenChange={setOpen}
                direction={direction}
            >
                {children}
            </DrawerPrimitive.Root>
        );
    }
);

const DrawerState = forwardRef(
    ({ children, open, onOpenChange, direction = "bottom" }, ref) => {
        // const [open, setOpen] = useState(defaultOpen)

        useImperativeHandle(ref, () => ({
            open: () => onOpenChange(true),
            close: () => onOpenChange(false),
        }));

        return (
            <DrawerPrimitive.Root
                open={open}
                onOpenChange={onOpenChange}
                direction={direction}
            >
                {children}
            </DrawerPrimitive.Root>
        );
    }
);

const DrawerTrigger = (props) => (
    <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
);

const DrawerPortal = (props) => (
    <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
);

const DrawerClose = (props) => (
    <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
);

const DrawerOverlay = ({ className, ...props }) => (
    <DrawerPrimitive.Overlay
        data-slot="drawer-overlay"
        className={cn(
            "fixed inset-0 z-50 bg-black/50 transition-opacity",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            className
        )}
        {...props}
    />
);

const DrawerContent = ({ className, children, ...props }) => (
    <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
            data-slot="drawer-content"
            className={cn(
                "fixed z-50 flex h-auto flex-col bg-background",
                // bottom
                "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=bottom]:max-h-[80vh]",
                // top
                "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=top]:max-h-[80vh]",
                // left
                "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
                // right
                "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
                className
            )}
            {...props}
        >
            <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
            {children}
        </DrawerPrimitive.Content>
    </DrawerPortal>
);

const DrawerHeader = ({ className, ...props }) => (
    <div className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />
);

const DrawerFooter = ({ className, ...props }) => (
    <div
        className={cn("mt-auto flex flex-col gap-2 p-4", className)}
        {...props}
    />
);

const DrawerTitle = ({ className, ...props }) => (
    <DrawerPrimitive.Title
        data-slot="drawer-title"
        className={cn("text-foreground font-semibold", className)}
        {...props}
    />
);

const DrawerDescription = ({ className, ...props }) => (
    <DrawerPrimitive.Description
        data-slot="drawer-description"
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
    />
);

export {
    Drawer,
    DrawerState,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
};
