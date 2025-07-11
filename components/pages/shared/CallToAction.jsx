"use client";
import { motion } from "framer-motion";
import { Handshake, ArrowRight } from "lucide-react";
import { useState } from "react";
import SelectRegisterDrawer from "../../../app/(pages)/(main)/SelectRegisterDrawer";

export default function CallToAction({
    title = "Ready to Make a Difference?",
    subtitle = "Join our community of blood donors and help save lives today.",
    primaryButton = { text: "Register Now", href: "#" },
    secondaryButton = { text: "Learn More", href: "#" },
    variant = "default", // "default" | "hero" | "compact"
    className = "",
}) {
    const [openRegister, setOpenRegister] = useState(false);

    const handlePrimaryClick = () => {
        if (primaryButton.onClick) {
            primaryButton.onClick();
        } else if (primaryButton.href) {
            window.location.href = primaryButton.href;
        } else {
            setOpenRegister(true);
        }
    };

    const handleSecondaryClick = () => {
        if (secondaryButton.onClick) {
            secondaryButton.onClick();
        } else if (secondaryButton.href) {
            window.location.href = secondaryButton.href;
        }
    };

    const containerClasses = {
        default: "max-w-screen-xl w-full mx-auto py-16 px-4",
        hero: "max-w-screen-xl w-full mx-auto py-20 px-4",
        compact: "max-w-screen-xl w-full mx-auto py-12 px-4",
    };

    const contentClasses = {
        default:
            "bg-gradient-to-r from-red-50 via-white to-blue-50 dark:from-red-900 dark:via-slate-900 dark:to-blue-900 rounded-2xl shadow-lg border border-red-100 dark:border-red-800 p-8 md:p-12",
        hero: "bg-gradient-to-r from-red-100 via-yellow-50 to-blue-100 dark:from-red-900 dark:via-slate-800 dark:to-blue-900 rounded-3xl shadow-xl border-2 border-red-200 dark:border-red-700 p-10 md:p-16",
        compact:
            "bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-900 dark:to-blue-900 rounded-xl shadow-md border border-red-100 dark:border-red-800 p-6 md:p-8",
    };

    return (
        <>
            <SelectRegisterDrawer
                open={openRegister}
                setOpen={setOpenRegister}
            />

            <motion.section
                className={`${containerClasses[variant]} ${className}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className={contentClasses[variant]}>
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Icon */}
                        <motion.div
                            className="flex justify-center mb-6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 shadow-lg">
                                <Handshake className="h-8 w-8 text-red-600 dark:text-red-300" />
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            {title}
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p
                            className="text-lg text-slate-600 dark:text-slate-300 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            {subtitle}
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            {/* Primary Button */}
                            <button
                                onClick={handlePrimaryClick}
                                className="btn btn-primary btn-lg flex items-center gap-2 px-8 py-3 text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
                            >
                                {primaryButton.text}
                                <ArrowRight className="h-5 w-5" />
                            </button>

                            {/* Secondary Button */}
                            {secondaryButton.text && (
                                <button
                                    onClick={handleSecondaryClick}
                                    className="btn btn-outline btn-primary btn-lg px-8 py-3 text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-200"
                                >
                                    {secondaryButton.text}
                                </button>
                            )}
                        </motion.div>

                        {/* Decorative Line */}
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 rounded-full mx-auto mt-8"
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}
                        />
                    </div>
                </div>
            </motion.section>
        </>
    );
}
