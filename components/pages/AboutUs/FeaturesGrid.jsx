"use client";
import { motion } from "framer-motion";
import {
    UserPlus,
    Calendar,
    Activity,
    Bell,
    BookOpen,
    Shield,
} from "lucide-react";
import { AnimatedSection } from "../shared";
import { aboutUsContent } from "../../../lib/utils/pageContent";

const iconMap = {
    UserPlus: UserPlus,
    Calendar: Calendar,
    Activity: Activity,
    Bell: Bell,
    BookOpen: BookOpen,
    Shield: Shield,
};

export default function FeaturesGrid() {
    return (
        <AnimatedSection className="max-w-screen-xl w-full mx-auto mb-16">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                    Key Features
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    Our mobile portal provides comprehensive tools to make blood
                    donation simple, accessible, and meaningful for both donors
                    and recipients.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aboutUsContent.overview.features.map((feature, index) => {
                    const IconComponent = iconMap[feature.icon];

                    return (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                                        <IconComponent className="h-6 w-6 text-red-600 dark:text-red-300" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </AnimatedSection>
    );
}
