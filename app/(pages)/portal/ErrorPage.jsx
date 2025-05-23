"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";

export default function ErrorPage({ children, className = "bg-red-400" }) {
    return (
        <Card className={`${className}`}>
            <CardHeader>
                <CardTitle className="text-3xl">System Message:</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xl leading-10 italic">{children}</p>

                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="btn btn-error mt-2"
                >
                    <FaSignOutAlt /> Sign Out
                </button>
            </CardContent>
        </Card>
    );
}
