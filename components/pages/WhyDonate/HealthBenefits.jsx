"use client";
import { motion } from "framer-motion";
import {
    Heart,
    Shield,
    Activity,
    RefreshCw,
    CheckCircle,
    Award,
} from "lucide-react";

export default function HealthBenefits() {
    const benefits = [
        {
            icon: Heart,
            title: "Heart Health",
            description:
                "Regular blood donation helps reduce iron levels, which can lower the risk of heart disease and stroke.",
            details: [
                "Reduces iron overload",
                "Lowers heart disease risk",
                "Improves circulation",
            ],
            color: "red",
        },
        {
            icon: Shield,
            title: "Free Health Screening",
            description:
                "Every donation includes a comprehensive health check, including blood pressure, hemoglobin, and infectious disease testing.",
            details: [
                "Blood pressure check",
                "Hemoglobin levels",
                "Disease screening",
            ],
            color: "blue",
        },
        {
            icon: Activity,
            title: "Stimulates Blood Cell Production",
            description:
                "Donating blood stimulates your body to produce new blood cells, keeping your system fresh and healthy.",
            details: [
                "New red blood cells",
                "Improved oxygen delivery",
                "Enhanced energy levels",
            ],
            color: "green",
        },
        {
            icon: RefreshCw,
            title: "Burns Calories",
            description:
                "Donating blood burns approximately 650 calories as your body works to replace the donated blood.",
            details: [
                "Calorie burning",
                "Metabolic boost",
                "Weight management",
            ],
            color: "purple",
        },
        {
            icon: CheckCircle,
            title: "Reduces Cancer Risk",
            description:
                "Lower iron levels from regular donation may reduce the risk of certain types of cancer.",
            details: [
                "Lower iron levels",
                "Cancer prevention",
                "Long-term health",
            ],
            color: "orange",
        },
        {
            icon: Award,
            title: "Psychological Benefits",
            description:
                "The act of helping others releases endorphins and provides a sense of purpose and satisfaction.",
            details: [
                "Endorphin release",
                "Sense of purpose",
                "Community connection",
            ],
            color: "teal",
        },
    ];

    const colorClasses = {
        red: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
        blue: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
        green: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
        purple: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20",
        orange: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20",
        teal: "border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-900/20",
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
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Health Benefits for Donors
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        While you're saving lives, you're also taking care of
                        your own health. Blood donation offers numerous health
                        benefits that make it a win-win for everyone.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`p-6 rounded-xl border-2 ${
                                colorClasses[benefit.color]
                            } hover:shadow-lg transition-all duration-300 hover:scale-105`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm`}
                                >
                                    <benefit.icon
                                        className={`w-6 h-6 ${
                                            iconColorClasses[benefit.color]
                                        }`}
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {benefit.title}
                                </h3>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                {benefit.description}
                            </p>

                            <ul className="space-y-2">
                                {benefit.details.map((detail, detailIndex) => (
                                    <li
                                        key={detailIndex}
                                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                iconColorClasses[benefit.color]
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
                    className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white"
                >
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">
                            It's Good for You Too!
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            Blood donation is one of the few acts of kindness
                            that actually benefits both the giver and receiver.
                            You save lives while improving your own health -
                            what could be better?
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">
                                    650
                                </div>
                                <div className="text-sm opacity-90">
                                    Calories Burned
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">
                                    Free
                                </div>
                                <div className="text-sm opacity-90">
                                    Health Screening
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">
                                    24-48
                                </div>
                                <div className="text-sm opacity-90">
                                    Hours Recovery
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-green-600 hover:bg-gray-100">
                            Start Your Health Journey
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
