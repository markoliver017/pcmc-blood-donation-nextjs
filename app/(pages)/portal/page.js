import { auth } from "@lib/auth";

import { redirect } from "next/navigation";
import React from "react";
import AuthSelectRole from "./AuthSelectRole";

export default async function PortalPage() {
    const session = await auth();

    if (!session?.user) return null;

    const { roles, role_name: session_role } = session.user;

    const currentLoggedInRole = roles.find(
        (role) => role.role_name == session_role
    );

    if (!currentLoggedInRole) {
        return <AuthSelectRole roles={session?.user?.roles || []} />;
    }

    redirect(currentLoggedInRole?.url || "/portal?error=RoleUrlNotFound");

    return <pre>
        {JSON.stringify(session, null, 2)}
    </pre>
}
