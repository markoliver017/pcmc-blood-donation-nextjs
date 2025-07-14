"use client";
import { motion } from "framer-motion";
import { Heart, Users, Clock, Award, TrendingUp, Globe } from "lucide-react";

export default function StatisticsCards({ onOpenRegister }) {
    const stats = [
        {
            icon: Heart,
            value: "1 Donation",
            label: "Can Save Up to 3 Lives",
            description:
                "Your single blood donation can help multiple patients in need",
            color: "red",
        },
        {
            icon: Clock,
            value: "Every 2 Seconds",
            label: "Someone Needs Blood",
            description:
                "The constant demand for blood in hospitals and emergency rooms",
            color: "blue",
        },
        {
            icon: Users,
            value: "38%",
            label: "Of Population Eligible",
            description: "But only 3% actually donate blood each year",
            color: "green",
        },
        {
            icon: Award,
            value: "100%",
            label: "Safe & Painless",
            description:
                "Modern donation process is completely safe and comfortable",
            color: "purple",
        },
        {
            icon: TrendingUp,
            value: "25%",
            label: "Increase in Demand",
            description: "Blood demand is growing faster than donations",
            color: "orange",
        },
        {
            icon: Globe,
            value: "24/7",
            label: "Emergency Ready",
            description: "Blood is needed around the clock for emergencies",
            color: "teal",
        },
    ];

    const colorClasses = {
        red: "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
        blue: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
        green: "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300",
        purple: "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300",
        orange: "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300",
        teal: "bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-300",
    };

    const iconColorClasses = {
        red: "text-red-500 dark:text-red-400",
        blue: "text-blue-500 dark:text-blue-400",
        green: "text-green-500 dark:text-green-400",
        purple: "text-purple-500 dark:text-purple-400",
        orange: "text-orange-500 dark:text-orange-400",
        teal: "text-teal-500 dark:text-teal-400",
    };

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        The Impact of Your Donation
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        These statistics show why your blood donation is so
                        crucial for saving lives and supporting our healthcare
                        system.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`p-6 rounded-xl border-2 ${
                                colorClasses[stat.color]
                            } hover:shadow-lg transition-all duration-300 hover:scale-105`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div
                                    className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm`}
                                >
                                    <stat.icon
                                        className={`w-6 h-6 ${
                                            iconColorClasses[stat.color]
                                        }`}
                                    />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed">
                                {stat.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Ready to Make a Difference?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                            Join thousands of donors who are already saving
                            lives. Your donation could be the difference between
                            life and death for a child in need.
                        </p>
                        <button
                            onClick={onOpenRegister}
                            className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold">
                            Donate Now
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
