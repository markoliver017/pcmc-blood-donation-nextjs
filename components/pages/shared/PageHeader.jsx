"use client";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export default function PageHeader({
    title,
    subtitle,
    breadcrumbs = [],
    backgroundImage = "/pcmc-building.png",
    showBreadcrumbs = true,
}) {
    return (
        <motion.header
            className="relative w-full min-h-[300px] sm:min-h-[400px] flex items-center justify-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-4 w-full max-w-4xl mx-auto">
                {/* Breadcrumbs */}
                {showBreadcrumbs && (
                    <motion.nav
                        className="flex items-center justify-center mb-6 text-white/80"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link
                            href="/"
                            className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                        >
                            <Home className="h-4 w-4" />
                            <span className="text-sm font-medium">Home</span>
                        </Link>

                        {breadcrumbs.map((crumb, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-1"
                            >
                                <ChevronRight className="h-4 w-4 text-white/60" />
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="text-sm font-medium hover:text-white transition-colors duration-200"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-sm font-medium text-white/80">
                                        {crumb.label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </motion.nav>
                )}

                {/* Title */}
                <motion.h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    {title}
                </motion.h1>

                {/* Subtitle */}
                {subtitle && (
                    <motion.p
                        className="text-lg sm:text-xl lg:text-2xl text-slate-100 font-medium mb-8 max-w-3xl mx-auto drop-shadow"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        {subtitle}
                    </motion.p>
                )}

                {/* Decorative Line */}
                <motion.div
                    className="w-24 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 rounded-full mx-auto"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                />
            </div>
        </motion.header>
    );
}
