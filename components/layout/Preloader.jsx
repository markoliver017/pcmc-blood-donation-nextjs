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
                    {/* Website Logo at top-left */}
                    {/* <motion.div className="absolute top-14 left-4 w-120 h-120 z-10"
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        <Image
                            src="/pcmc_logo.png"
                            alt="Website Logo"
                            fill
                            className="object-contain"
                        />
                    </motion.div> */}
                    {/* Animated Loading Text */}

                    <motion.div
                        className="text-2xl w-96 h-96  flex justify-center items-center font-semibold text-blue-500 relative "
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        Loading...
                        <Image
                            src="/loader-main.jpg"
                            // width={2500}
                            // height={1000}
                            className="object-cover rounded-full shadow-2xl/90 shadow-red-700"
                            alt="Logo"
                            fill
                            priority
                        />
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
