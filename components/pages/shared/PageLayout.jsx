"use client";
import { motion } from "framer-motion";

export default function PageLayout({
    children,
    className = "",
    maxWidth = "max-w-screen-xl",
    padding = "px-4",
    background = "bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-900",
}) {
    return (
        <motion.main
            className={`min-h-screen ${background} flex flex-col overflow-x-hidden ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`w-full mx-auto ${maxWidth} ${padding}`}>
                {children}
            </div>
        </motion.main>
    );
}
