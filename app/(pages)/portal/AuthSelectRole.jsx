"use client";
import { reactIconsFa } from "@components/reusable_components/PreloadedIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import Skeleton from "@components/ui/skeleton";
import SessionTimer from "@lib/utils/SessionTimer";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthSelectRole({ roles }) {
    const router = useRouter();
    const { status, update } = useSession();

    if (status === "loading") return <Skeleton />;

    return (
        <>
            <SessionTimer />
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {roles.map((role, i) => (
                    <motion.div
                        key={i}
                        whileHover={{
                            scale: 1.05,
                            fontWeight: "bolder",
                            transition: { duration: 0.3 },
                        }}
                        className="min-w-96 rounded-xl shadow-md"
                    >
                        <Card className="text-center text-3xl hover:ring-blue-400 hover:ring shadow-xl/30">
                            <CardHeader>
                                <CardTitle>
                                    <span className="flex-items-center justify-center gap-2">
                                        {React.createElement(
                                            reactIconsFa[role.icon]
                                        )}
                                        {role.role_name.toUpperCase()}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <button
                                    onClick={async () => {
                                        await update({ role_name: role.role_name })
                                        router.replace('/portal');
                                    }}
                                    className="btn"
                                >
                                    <LogIn />
                                    Log In
                                </button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                {/* <SessionLogger /> */}
            </div>
        </>
    );
}
