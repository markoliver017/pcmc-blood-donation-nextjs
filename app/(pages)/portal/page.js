import { auth } from "@lib/auth";

import { redirect } from "next/navigation";
import React from "react";
import AuthSelectRole from "./AuthSelectRole";
import SessionLogger from "@lib/utils/SessionLogger";

export default async function PortalPage() {
    const session = await auth();
    if (!session) redirect("/");
    console.log("portal session", session);


    if (!session?.user?.roles?.length) {
        return <div>You are not allowed to access this page</div>;
    }

    const { roles, role_name: session_role } = session.user;

    const currentLoggedInRole = roles.find((role) => role.role_name == session_role);

    if (!currentLoggedInRole) {
        return <AuthSelectRole roles={session?.user?.roles || []} />;
    }

    redirect(currentLoggedInRole?.url || "/portal?error=RoleUrlNotFound");
}
