"use client";

import { redirect, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import AuthSelectRole from "./AuthSelectRole";
import { useSession } from "next-auth/react";
import Skeleton_form from "@components/ui/Skeleton_form";

export default function PortalPage() {
    const session = useSession();
    const searchParams = useSearchParams();

    console.log("Session", session);
    console.log("SearchParams", searchParams);

    const { roles, role_name: session_role } = session?.data?.user;
    const callbackUrl = searchParams?.get("callbackUrl");

    console.log("CallbackUrl", callbackUrl);

    const currentLoggedInRole = roles.find(
        (role) => role.role_name == session_role
    );

    const redirectUrl = callbackUrl
        ? callbackUrl
        : currentLoggedInRole?.url || "/portal?error=RoleUrlNotFound";

    useEffect(() => {
        if (currentLoggedInRole) {
            setTimeout(() => {
                redirect(redirectUrl);
            }, 1000);
        }
    }, [redirectUrl, currentLoggedInRole]);

    if (!currentLoggedInRole) {
        return (
            <AuthSelectRole
                roles={roles || []}
                callbackUrl={callbackUrl || "/portal"}
            />
        );
    }

    return <Skeleton_form />;
}
