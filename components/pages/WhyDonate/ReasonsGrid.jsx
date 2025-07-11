"use client";
import { motion } from "framer-motion";
import { Heart, Shield, Users, Award, Star } from "lucide-react";

export default function ReasonsGrid() {
    const reasons = [
        {
            icon: Heart,
            title: "Save Children's Lives",
            description:
                "Your blood donation directly helps children in critical care, surgery, and emergency situations. Every drop counts in pediatric care.",
            benefits: [
                "Emergency transfusions",
                "Surgery support",
                "Cancer treatment",
            ],
            color: "red",
        },
        {
            icon: Shield,
            title: "Support Emergency Care",
            description:
                "Blood is essential for emergency rooms, trauma centers, and disaster response. Your donation could save someone in a critical moment.",
            benefits: ["Trauma care", "Accident victims", "Natural disasters"],
            color: "blue",
        },
        {
            icon: Users,
            title: "Strengthen Community",
            description:
                "Blood donation builds a stronger, healthier community. It's a simple act that connects us all and shows we care for each other.",
            benefits: ["Community health", "Social responsibility", "Unity"],
            color: "green",
        },
        {
            icon: Award,
            title: "Health Benefits for You",
            description:
                "Donating blood has health benefits for donors too, including reduced risk of heart disease and free health screening.",
            benefits: ["Heart health", "Free screening", "Iron regulation"],
            color: "purple",
        },
        {
            icon: Star,
            title: "Be a Hero",
            description:
                "You become a real-life hero to patients and their families. Your selfless act gives hope and saves lives every day.",
            benefits: ["Personal satisfaction", "Role model", "Legacy"],
            color: "orange",
        },
    ];

    const colorClasses = {
        red: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
        blue: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
        green: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
        purple: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20",
        orange: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20",
    };

    const iconColorClasses = {
        red: "text-red-500 dark:text-red-400",
        blue: "text-blue-500 dark:text-blue-400",
        green: "text-green-500 dark:text-green-400",
        purple: "text-purple-500 dark:text-purple-400",
        orange: "text-orange-500 dark:text-orange-400",
    };

    return (
        <section id="reasons" className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Five Compelling Reasons to Donate
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Discover why blood donation is one of the most
                        meaningful acts of kindness you can perform. Each reason
                        represents a different aspect of the incredible impact
                        your donation makes.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`p-8 rounded-xl border-2 ${
                                colorClasses[reason.color]
                            } hover:shadow-xl transition-all duration-300 hover:scale-105`}
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div
                                    className={`p-4 rounded-full bg-white dark:bg-gray-800 shadow-sm flex-shrink-0`}
                                >
                                    <reason.icon
                                        className={`w-8 h-8 ${
                                            iconColorClasses[reason.color]
                                        }`}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {reason.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {reason.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                                    Key Benefits:
                                </h4>
                                <ul className="space-y-1">
                                    {reason.benefits.map(
                                        (benefit, benefitIndex) => (
                                            <li
                                                key={benefitIndex}
                                                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                                            >
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        iconColorClasses[
                                                            reason.color
                                                        ]
                                                    }`}
                                                />
                                                {benefit}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
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
                    <div className="bg-gradient-to-r from-red-500 to-blue-600 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Ready to Make a Difference?
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            These reasons show just how powerful your donation
                            can be. Join us in saving lives and building a
                            healthier community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-red-600 hover:bg-gray-100">
                                Start Donating
                            </button>
                            <button className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-red-600">
                                Learn More
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
