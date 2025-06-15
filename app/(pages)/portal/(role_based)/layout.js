import React from "react";
import { auth } from "@lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RoleBasedLayout({ children }) {
    const session = await auth();
    // console.log("RoleBasedLayout session", session);

    const headerList = await headers();
    const currentRoute = headerList.get("x-current-path");

    console.log("currentRoute", currentRoute)
    if (!session || !session?.user) redirect("/");

    const { user: currentUser } = session;

    // const menus = usePagesStore((state) => state.menus);

    // const currentMenu = menus.find((menu, i) => {
    //     console.log("Client portal menu", i, menu.path);
    //     return menu.path.startsWith(currentRoute);
    // });
    // console.log("Client portal currentMenu", currentMenu);

    const { roles } = currentUser;
    // console.log("Client portal currentUser", currentUser);

    // const currentRole = roles.find(
    //     (role) => role.role_name == currentUser.role_name
    // );

    const isUserAllowed = roles.find((role) => {
        if (!role?.url) return false;
        let roleUrl = role.url.startsWith(".") ? role.url.slice(1) : role.url;
        return currentRoute.startsWith(roleUrl);
    });

    if (!isUserAllowed) {
        // alert("You are not allowed to access this page.");
        redirect("/portal");
    }

    return (
        <>
            {/* <ClientPortal /> */}
            {children}
        </>
    );
}
