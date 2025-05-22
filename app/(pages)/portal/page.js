import { auth } from "@lib/auth";

import { redirect } from "next/navigation";
import React from "react";
import AuthSelectRole from "./AuthSelectRole";
import SessionLogger from "@lib/utils/SessionLogger";

export default async function PortalPage() {
    const session = await auth();
    if (!session) redirect("/");
    console.log("portal session", session);
    // redirect("./portal/admin");
    if (!session.user.roles.length) {
        return <div>You are not allowed to access this page</div>;
    }

    if (!session.user?.role_name) {
        return <AuthSelectRole roles={session?.user?.roles || []} />;
    }

    return (
        <>
            Welcome {session.user.role_name}
            <SessionLogger />
        </>
    );
}
