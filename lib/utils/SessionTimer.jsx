"use client";
import Skeleton from "@components/ui/skeleton";
import { Timer } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import React from "react";

export default function SessionTimer() {
    const { data: session, status } = useSession();

    if (status === "loading") return <div className="skeleton h-12 w-64"></div>;

    return (
        <div className="btn p-3 mt-2 rounded-2xl border-0 btn-warning">
            <Timer className="h-4" />
            Session expires: {moment(session?.expires).format(
                "MMM DD, YYYY"
            )}{" "}
            at {moment(session?.expires).format("hh:mm:ss A")}
        </div>
    );
}
