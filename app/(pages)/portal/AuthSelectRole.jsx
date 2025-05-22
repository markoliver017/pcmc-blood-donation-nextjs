"use client";
import { reactIconsFa } from "@components/reusable_components/PreloadedIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import SessionLogger from "@lib/utils/SessionLogger";
import SessionTimer from "@lib/utils/SessionTimer";
import { motion } from "framer-motion";
import React from "react";

export default function AuthSelectRole({ roles }) {
    return (
        <>
            <SessionTimer />
            <div className="flex flex-col items-center justify-center gap-3">
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
                                <CardTitle>Log in as:</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="btn">
                                    {React.createElement(
                                        reactIconsFa[role.icon]
                                    )}
                                    {role.role_name.toUpperCase()}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                {/* <SessionLogger /> */}
            </div>
        </>
    );
}
