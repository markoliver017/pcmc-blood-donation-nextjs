"use client";
import Skeleton from "@components/ui/skeleton";
import { Timer } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import React from "react";

export default function SessionTimer() {
    const { data: session, status } = useSession();

    if (status === "loading") return <Skeleton />;

    return (
        <div className="badge p-3 mt-2 badge-warning">
            <Timer className="h-4" />
            Session expires:{" "}
            {moment(session?.expires).format("MMM DD, YYYY")} at{" "}
            {moment(session?.expires).format("hh:mm:ss A")}
        </div>
    );
}
