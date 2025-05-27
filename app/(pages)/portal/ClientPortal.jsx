"use client";
import { usePagesStore } from "@/store/pagesStore";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";

export default function ClientPortal() {
    const { status, data } = useSession();
    const currentRoute = usePathname();

    const menus = usePagesStore((state) => state.menus);

    const currentMenu = menus.find((menu) =>
        currentRoute.startsWith(menu.path)
    );

    if (status == "authenticated") {
        const currentUser = data.user;
        const { roles } = currentUser;
        console.log("Client portal currentUser", currentUser);

        const currentRole = roles.find(
            (role) => role.role_name == currentUser.role_name
        );

        const isUserAllowed = roles.find((role) => {
            if (!role?.url) return false;
            let roleUrl = role.url.startsWith(".")
                ? role.url.slice(1)
                : role.url;
            return currentRoute.startsWith(roleUrl);
        });

        if (!isUserAllowed) redirect("/portal");

        // return (
        //     <pre>
        //         CurrentRoute: {currentRoute} <br />
        //         IsUserAllowed: {JSON.stringify(currentRole, null, 3)}
        //     </pre>
        // );
    }
}
