"use client";

import { usePathname } from "next/navigation";

const routeModals = ["/organizers"];

export default function ModalComponent({ children }) {
    const path = usePathname();
    if (!routeModals.includes(path)) return;

    return (
        <>
            {children}
        </>
    )
}
