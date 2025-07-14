"use client";
import { motion } from "framer-motion";
import { Calendar, Award, Users, Heart } from "lucide-react";
import { AnimatedSection } from "../shared";

const timelineData = [
    {
        year: "1980",
        title: "PCMC Foundation",
        description:
            "Philippine Children's Medical Center was established as a specialized pediatric hospital.",
        icon: Calendar,
        color: "red",
    },
    {
        year: "1995",
        title: "Blood Bank Establishment",
        description:
            "PCMC Pediatric Blood Center was established to serve the specialized needs of pediatric patients.",
        icon: Heart,
        color: "blue",
    },
    {
        year: "2010",
        title: "Mobile Blood Donation Program",
        description:
            "Launched mobile blood donation units to reach more communities and increase donor accessibility.",
        icon: Users,
        color: "green",
    },
    {
        year: "2020",
        title: "Digital Transformation",
        description:
            "Developed the mobile blood donation portal to modernize donor registration and management.",
        icon: Award,
        color: "yellow",
    },
    {
        year: "2025",
        title: "Enhanced Services",
        description:
            "Continued expansion of services and community outreach programs to save more young lives.",
        icon: Heart,
        color: "purple",
    },
];

const colorClasses = {
    red: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
};

export default function TimelineSection() {
    return (
        <AnimatedSection id="our-journey" className="max-w-screen-xl w-full mx-auto mb-16">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                    Our Journey
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    Decades of dedication to saving children's lives through
                    innovative blood donation services.
                </p>
            </motion.div>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-400 via-blue-400 to-green-400"></div>

                <div className="space-y-8">
                    {timelineData.map((item, index) => {
                        const IconComponent = item.icon;

                        return (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.2,
                                }}
                                viewport={{ once: true, amount: 0.3 }}
                                className="relative flex items-start gap-6"
                            >
                                {/* Timeline Dot */}
                                <div className="flex-shrink-0 relative z-10">
                                    <div
                                        className={`flex items-center justify-center h-16 w-16 rounded-full ${
                                            colorClasses[item.color]
                                        } shadow-lg border-4 border-white dark:border-slate-800`}
                                    >
                                        <IconComponent className="h-8 w-8" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {item.year}
                                        </span>
                                        <div className="w-8 h-0.5 bg-gradient-to-r from-red-400 to-blue-400 rounded-full"></div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </AnimatedSection>
    );
}
