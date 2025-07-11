"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { AnimatedSection } from "../shared";
import { aboutUsContent } from "../../../lib/utils/pageContent";

export default function MissionSection() {
    return (
        <AnimatedSection
            id="mission"
            className="max-w-screen-xl w-full mx-auto space-y-8 mb-16"
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
                className="relative px-4 py-10 bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-red-900 dark:via-slate-900 dark:to-blue-900 rounded-2xl shadow-lg border border-red-100 dark:border-red-800"
            >
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-red-700 dark:text-red-300 mb-2 flex items-center gap-3">
                        <span className="inline-block align-middle animate-pulse">
                            <Heart className="h-10 w-10 text-red-500" />
                        </span>
                        {aboutUsContent.mission.title}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 rounded-full mb-4" />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto text-slate-700 dark:text-slate-200 mb-2 text-lg sm:text-xl font-semibold drop-shadow leading-relaxed"
                    >
                        "{aboutUsContent.mission.statement}"
                    </motion.p>
                </div>
            </motion.div>
        </AnimatedSection>
    );
}
