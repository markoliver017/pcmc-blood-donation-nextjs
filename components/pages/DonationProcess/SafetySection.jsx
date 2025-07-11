"use client";
import { motion } from "framer-motion";
import {
    Shield,
    Users,
    CheckCircle,
    AlertTriangle,
    Heart,
    Award,
} from "lucide-react";

export default function SafetySection() {
    const safetyMeasures = [
        {
            icon: Shield,
            title: "Sterile Equipment",
            description:
                "All equipment is sterile, single-use, and disposed of after each donation. We follow strict infection control protocols.",
            details: [
                "Single-use needles",
                "Sterile collection bags",
                "Disposable equipment",
            ],
            color: "blue",
        },
        {
            icon: Users,
            title: "Trained Staff",
            description:
                "Our medical staff are certified professionals with extensive training in blood collection and donor care.",
            details: [
                "Certified phlebotomists",
                "Medical supervision",
                "Continuous training",
            ],
            color: "green",
        },
        {
            icon: CheckCircle,
            title: "Health Screening",
            description:
                "Comprehensive health screening ensures donor safety and blood quality. We test for various conditions.",
            details: [
                "Medical history review",
                "Physical examination",
                "Blood testing",
            ],
            color: "purple",
        },
        {
            icon: AlertTriangle,
            title: "Emergency Preparedness",
            description:
                "We have emergency protocols and medical support available at all times during the donation process.",
            details: [
                "Emergency equipment",
                "Medical staff on-site",
                "24/7 support",
            ],
            color: "red",
        },
        {
            icon: Heart,
            title: "Donor Comfort",
            description:
                "Your comfort and well-being are our top priorities. We provide a relaxing environment and attentive care.",
            details: ["Comfortable seating", "Privacy screens", "Refreshments"],
            color: "pink",
        },
        {
            icon: Award,
            title: "Quality Standards",
            description:
                "We maintain the highest standards of safety and quality, exceeding national and international guidelines.",
            details: ["AABB accreditation", "FDA compliance", "Regular audits"],
            color: "orange",
        },
    ];

    const colorClasses = {
        blue: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
        green: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
        purple: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20",
        red: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
        pink: "border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-900/20",
        orange: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20",
    };

    const iconColorClasses = {
        blue: "text-blue-500 dark:text-blue-400",
        green: "text-green-500 dark:text-green-400",
        purple: "text-purple-500 dark:text-purple-400",
        red: "text-red-500 dark:text-red-400",
        pink: "text-pink-500 dark:text-pink-400",
        orange: "text-orange-500 dark:text-orange-400",
    };

    return (
        <section className="py-16 bg-gradient-to-br from-red-50 to-blue-50 dark:from-red-900 dark:to-blue-900">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="flex justify-center mb-4">
                        <Shield className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Your Safety is Our Priority
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        We maintain the highest standards of safety and quality
                        throughout the entire donation process. Your well-being
                        is our top concern.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {safetyMeasures.map((measure, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`p-6 rounded-xl border-2 ${
                                colorClasses[measure.color]
                            } hover:shadow-lg transition-all duration-300 hover:scale-105`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div
                                    className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm`}
                                >
                                    <measure.icon
                                        className={`w-6 h-6 ${
                                            iconColorClasses[measure.color]
                                        }`}
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {measure.title}
                                </h3>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                {measure.description}
                            </p>

                            <ul className="space-y-2">
                                {measure.details.map((detail, detailIndex) => (
                                    <li
                                        key={detailIndex}
                                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                iconColorClasses[measure.color]
                                            }`}
                                        />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Safety Statistics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-red-500 mb-2">
                                    100%
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    Sterile Equipment
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-500 mb-2">
                                    24/7
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    Medical Support
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-500 mb-2">
                                    0
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    Safety Incidents
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-500 mb-2">
                                    AABB
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    Accredited
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                            Our commitment to safety has resulted in zero safety
                            incidents and maintained the highest accreditation
                            standards in the industry.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold">
                                Learn More About Safety
                            </button>
                            <button className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold">
                                View Safety Protocols
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
