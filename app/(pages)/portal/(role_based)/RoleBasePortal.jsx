"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleBasePortal({ children }) {
    const { status, data: session } = useSession();
    const currentRoute = usePathname();
    const router = useRouter();

    if (status == "loading" || status == "unauthenticated") {
        return null;
    }

    if (status == "authenticated") {
        const currentUser = session?.user;

        const { roles, role_name: session_role } = currentUser;

        const currentLoggedInRole = roles.find(
            (role) => role.role_name == session_role
        );

        const isUserAllowed = () => {
            if (!currentLoggedInRole?.url) return false;
            let roleUrl = currentLoggedInRole.url.startsWith(".")
                ? currentLoggedInRole.url.slice(1)
                : currentLoggedInRole.url;
            return currentRoute.startsWith(roleUrl);
        };

        useEffect(() => {
            if (!isUserAllowed()) {
                alert("You are not allowed to access this page.");
                router.back();
            }
        }, [currentRoute, session]);
    }

    return <>{children}</>;
}
