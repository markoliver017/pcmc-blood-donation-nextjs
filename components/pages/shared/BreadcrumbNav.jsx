"use client";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export default function BreadcrumbNav({
    items = [],
    className = "",
    variant = "light", // "light" for light background, "dark" for dark background
}) {
    const isLight = variant === "light";
    const textColor = isLight
        ? "text-gray-700 dark:text-gray-300"
        : "text-white/80";
    const hoverColor = isLight
        ? "hover:text-gray-900 dark:hover:text-white"
        : "hover:text-white";
    const iconColor = isLight
        ? "text-gray-500 dark:text-gray-400"
        : "text-white/60";
    const currentColor = isLight
        ? "text-gray-900 dark:text-white font-semibold"
        : "text-white font-semibold";

    return (
        <motion.nav
            className={`w-full bg-white/20 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 ${className}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <div className=" mx-auto px-4 py-3">
                <div className="flex items-center space-x-2">
                    <Link
                        href="/"
                        className={`flex items-center gap-1 ${textColor} ${hoverColor} transition-colors duration-200`}
                    >
                        <Home className="h-4 w-4" />
                        <span className="text-sm font-medium">Home</span>
                    </Link>

                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-2"
                        >
                            <ChevronRight className={`h-4 w-4 ${iconColor}`} />
                            {item.current ? (
                                <span className={`text-sm ${currentColor}`}>
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`text-sm font-medium ${textColor} ${hoverColor} transition-colors duration-200`}
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </motion.nav>
    );
}
