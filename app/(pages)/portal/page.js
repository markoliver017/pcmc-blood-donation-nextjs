import { auth } from "@lib/auth";
import moment from "moment";
import { redirect } from "next/navigation";
import React from "react";

export default async function PortalPage() {
    const session = await auth();
    if (!session) redirect("/");
    console.log("portal session", session);
    // redirect("./portal/admin");
    if (!session.user.role) {
        return <div>You are not allowed to access this page</div>;
    }
    return (
        <div>
            Portal : <br />
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <br />
            <br />
            Expires in:{" "}
            {moment(session?.expires).format("MMM DD, YYYY | HH:mm:ss")}
        </div>
    );
}
