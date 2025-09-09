import { auth } from "@lib/auth";

import { redirect } from "next/navigation";
import React from "react";
import AuthSelectRole from "./AuthSelectRole";

export default async function PortalPage({ searchParams }) {
    const session = await auth();

    if (!session?.user) return null;

    const { roles, role_name: session_role } = session.user;
    const callbackUrl = (await searchParams)?.callbackUrl;

    const currentLoggedInRole = roles.find(
        (role) => role.role_name == session_role
    );

    if (!currentLoggedInRole) {
        return (
            <AuthSelectRole
                roles={session?.user?.roles || []}
                callbackUrl={callbackUrl || "/portal"}
            />
        );
    }

    // If there's a callbackUrl, redirect to it instead of the default role URL
    const redirectUrl =
        callbackUrl ||
        currentLoggedInRole?.url ||
        "/portal?error=RoleUrlNotFound";
    redirect(redirectUrl);

    return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
