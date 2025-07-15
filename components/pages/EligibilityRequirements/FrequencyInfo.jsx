"use client";
import { motion } from "framer-motion";
import { Calendar, Clock, Heart, Shield } from "lucide-react";
import Link from "next/link";

export default function FrequencyInfo({ onOpenRegister }) {
    const frequencyData = [
        {
            type: "Whole Blood",
            interval: "Every 90 days (12 weeks)",
            icon: Heart,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            description:
                "Standard blood donation including red cells, plasma, and platelets",
            details: [
                "Most common type of donation",
                "Takes 8-10 minutes to collect",
                "Your body replaces blood within 24-48 hours",
                "Can help up to 3 patients",
            ],
        },
        {
            type: "Apheresed Platelets",
            interval: "Every 14 days",
            icon: Shield,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            description: "Platelet-only donation using specialized equipment",
            details: [
                "Takes 1-2 hours to complete",
                "Platelets are returned to your body",
                "Critical for cancer patients",
                "Can donate more frequently",
            ],
        },
        {
            type: "Double Red Cells",
            interval: "Every 112 days (16 weeks)",
            icon: Calendar,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            description:
                "Double red cell donation for patients with specific needs",
            details: [
                "Takes 30-45 minutes",
                "Uses specialized equipment",
                "Higher iron requirements",
                "Helps patients with chronic anemia",
            ],
        },
    ];

    const tips = [
        {
            title: "Track Your Donations",
            description:
                "Use our platform to track your donation history and get reminders for your next eligible date.",
            icon: Calendar,
        },
        {
            title: "Stay Hydrated",
            description:
                "Drink plenty of fluids before and after donation to help your body recover quickly.",
            icon: Clock,
        },
        {
            title: "Eat Iron-Rich Foods",
            description:
                "Consume foods high in iron to maintain healthy hemoglobin levels between donations.",
            icon: Heart,
        },
        {
            title: "Listen to Your Body",
            description:
                "If you don't feel well on donation day, it's okay to reschedule. Your health comes first.",
            icon: Shield,
        },
    ];

    return (
        <section id="frequency" className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Donation Frequency & Intervals
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Understanding how often you can donate different types
                        of blood products and how to maintain your health
                        between donations.
                    </p>
                </motion.div>

                {/* Donation Types */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {frequencyData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`${item.bgColor} dark:bg-gray-800 rounded-xl border ${item.borderColor} dark:border-gray-700 overflow-hidden`}
                        >
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div
                                        className={`w-12 h-12 rounded-lg ${item.bgColor} dark:bg-gray-700 flex items-center justify-center mr-4`}
                                    >
                                        <item.icon
                                            className={`w-6 h-6 ${item.color}`}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {item.type}
                                        </h3>
                                        <p
                                            className={`text-sm font-semibold ${item.color}`}
                                        >
                                            {item.interval}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    {item.description}
                                </p>

                                <ul className="space-y-2">
                                    {item.details.map((detail, detailIndex) => (
                                        <li
                                            key={detailIndex}
                                            className="flex items-start"
                                        >
                                            <div
                                                className={`w-2 h-2 rounded-full ${item.color} mt-2 mr-3 flex-shrink-0`}
                                            ></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                {detail}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tips Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white"
                >
                    <h3 className="text-2xl font-bold text-center mb-8">
                        Tips for Regular Donors
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tips.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.6 + index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <tip.icon className="w-6 h-6 text-blue-200" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-2">
                                            {tip.title}
                                        </h4>
                                        <p className="text-sm text-blue-100">
                                            {tip.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Ready to Start Your Donation Journey?
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                            Every donation counts and can save up to 3 lives.
                            Start with whole blood donation and explore other
                            donation types as you become a regular donor.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={onOpenRegister}
                                className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold"
                            >
                                Schedule Your First Donation
                            </button>
                            <Link
                                href="/login"
                                className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold"
                            >
                                Already have an account?
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
