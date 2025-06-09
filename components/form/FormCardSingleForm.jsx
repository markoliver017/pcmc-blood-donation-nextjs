"use client";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import React from "react";

export default function FormCardSingleForm({ children, details }) {
    return (
        <>
            <Card className="md:p-4 bg-slate-100 p-3">
                <CardHeader className="text-2xl font-bold">
                    <CardTitle className="text-2xl">
                        {details?.title || "Form"}
                    </CardTitle>
                    <CardDescription>
                        <div className="text-orange-400">
                            Please fill up all the * required fields.
                        </div>
                    </CardDescription>
                </CardHeader>
                {children}
            </Card>
        </>
    );
}
