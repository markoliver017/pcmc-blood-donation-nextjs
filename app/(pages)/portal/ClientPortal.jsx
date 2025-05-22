"use client"
import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation'

export default function ClientPortal() {
    const { status, data } = useSession();
    const currentRoute = usePathname();

    const isPortalBaseUrl = currentRoute == "/portal";
    const isPortalChangeRoleUrl = currentRoute == "/portal/change-role";

    if (status == "authenticated") {
        const currentUser = data.user;
        const { roles } = currentUser;

        const isUserAllowed = roles.find((role) => {
            if (!role?.url) return false;
            let roleUrl = role.url.startsWith('.') ? role.url.slice(1) : role.url;
            return currentRoute.startsWith(roleUrl);
        });

        if (!isUserAllowed && !isPortalBaseUrl && !isPortalChangeRoleUrl) redirect("/");

        // return <pre>
        //     CurrentRoute: {currentRoute} <br />
        //     IsUserAllowed: {JSON.stringify(isUserAllowed, null, 3)}
        // </pre>
    }
}
