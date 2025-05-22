"use client";
import Skeleton from "@components/ui/skeleton";
import { Timer } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function SessionLogger() {
    const { data: session, status, update } = useSession();
    const router = useRouter()

    const handleChangeRole = async (role) => {
        await update({ role_name: role });
        router.refresh()
    };

    if (status === "loading") return <Skeleton />;
    if (status === "unauthenticated")
        return (
            <a className="btn btn-neutral" href="/">
                Sign in
            </a>
        );
    return (
        <div>
            <button
                className="btn btn-neutral dark:border-red-500"
                onClick={() => handleChangeRole(" ")}
            >
                Reset Role
            </button>
            <div>
                <h1 className="text-2xl font-semibold">Session Data</h1>
                <pre>{JSON.stringify(session, null, 2)}</pre>
            </div>
            <div className="badge badge-outline badge-warning">
                <Timer className="h-4" />
                Session expires on:{" "}
                {moment(session?.expires).format("MMM DD, YYYY")} at{" "}
                {moment(session?.expires).format("hh:mm:ss A")}
            </div>
        </div>
    );
}
