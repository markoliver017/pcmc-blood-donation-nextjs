"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preloader3() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            {isLoading && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-50"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isLoading ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Linear Gradient Background */}
                    <div
                        className="bg-white/60 dark:bg-black/80"
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                        }}
                    />

                    {/* Animated Loading Text */}
                    <motion.div
                        className="p-30"
                        // initial={{ scale: 1 }}
                        // animate={{ scale: [1, 1.2, 1] }}
                        // transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                        initial={{ y: 0 }}
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                    >
                        <Image
                            src="/blood-logo.png"
                            className="flex-none rounded-4xl"
                            width={150}
                            height={150}
                            layout="intrinsic"
                            alt="Logo"
                        />
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
