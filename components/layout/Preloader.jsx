"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isLoading ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Linear Gradient Background */}
                    <div
                        className="bg-white"
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                        }}
                    />

                    {/* Animated Loading Text */}

                    <motion.div
                        className="text-2xl font-semibold text-blue-500 relative"
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        {/* Loading... */}
                        <Image
                            src="/loader_2.gif"
                            width={500}
                            height={500}
                            alt="Logo"
                            unoptimized
                        />
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
