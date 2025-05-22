import { auth } from "@lib/auth";

import { redirect } from "next/navigation";
import React from "react";
import AuthSelectRole from "../AuthSelectRole";

export default async function Page() {
    const session = await auth();

    if (!session || !session?.user?.roles?.length) redirect("/");

    const { roles } = session.user;

    return <AuthSelectRole roles={roles || []} />;

}
