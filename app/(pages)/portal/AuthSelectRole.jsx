"use client";
import LoadingModal from "@components/layout/LoadingModal";
import { reactIconsFa } from "@components/reusable_components/PreloadedIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import Skeleton from "@components/ui/skeleton";
import SessionLogger from "@lib/utils/SessionLogger";
import SessionTimer from "@lib/utils/SessionTimer";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useState } from "react";

export default function AuthSelectRole({ roles }) {
    const { status, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    if (status === "loading")
        return (
            <div className="p-5">
                <Skeleton />
            </div>
        );

    // min-h-[calc(100vh-255px)]
    return (
        <>
            <LoadingModal imgSrc="/loader_3.gif" isLoading={isLoading} />
            {/* Page Wrapper with Relative Positioning */}
            {/* <div className="relative w-full min-h-screen overflow-hidden"> */}
            <div className="flex flex-col items-center justify-center px-4 p-5  min-h-[calc(100vh-185px)] dark:text-black">
                {/* <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" /> */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Select Your Role
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Choose which role you'd like to log in as
                    </p>
                    <SessionTimer />
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
                    {roles.map((role, i) => (
                        <motion.div
                            key={i}
                            whileHover={{
                                scale: 1.03,
                                transition: { duration: 0.3 },
                            }}
                            className="w-full"
                        >
                            <Card className="hover:shadow-lg border border-gray-200 hover:border-blue-500 transition-all duration-300 bg-white/65 dark:bg-black/65 ">
                                <CardHeader className="text-center">
                                    <CardTitle className="flex flex-col items-center justify-center gap-3 text-xl font-semibold text-gray-700 dark:text-slate-200">
                                        <span className="text-blue-500 text-4xl">
                                            {React.createElement(
                                                reactIconsFa[role.icon]
                                            )}
                                        </span>
                                        <span>{role.role_name}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <button
                                        onClick={async () => {
                                            setIsLoading(true);
                                            await update({
                                                role_name: role.role_name,
                                            });
                                            window.location.replace("/portal");
                                        }}
                                        className="btn btn-primary flex items-center gap-2"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Log In
                                    </button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
            {/* <SessionLogger /> */}
        </>
    );
}
