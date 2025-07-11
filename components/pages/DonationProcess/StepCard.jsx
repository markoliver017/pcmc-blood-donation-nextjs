"use client";
import { motion } from "framer-motion";
import { Clock, AlertCircle, CheckCircle, Info } from "lucide-react";

export default function StepCard({ step, isActive = false }) {
    const tips = [
        "Bring a valid photo ID",
        "Eat a healthy meal before donating",
        "Stay hydrated",
        "Get a good night's sleep",
        "Avoid strenuous exercise for 24 hours after",
    ];

    const whatToExpect = [
        "Professional medical staff",
        "Clean, sterile environment",
        "Comfortable seating",
        "Privacy and confidentiality",
        "Clear communication throughout",
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                isActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
            }`}
        >
            {/* Step Header */}
            <div className="flex items-center gap-4 mb-6">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        isActive
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                >
                    {step.number}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{step.duration}</span>
                    </div>
                </div>
            </div>

            {/* Step Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {step.description}
            </p>

            {/* Step Details */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    What happens during this step:
                </h4>
                <ul className="space-y-2">
                    {step.details.map((detail, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            {detail}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tips Section */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Tips for this step:
                </h4>
                <ul className="space-y-2">
                    {tips.slice(0, 3).map((tip, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                        >
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>

            {/* What to Expect */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    What to expect:
                </h4>
                <ul className="space-y-2">
                    {whatToExpect.slice(0, 3).map((expectation, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                        >
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            {expectation}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Status Indicator */}
            {isActive && (
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Current Step
                </div>
            )}

            {/* Action Button */}
            <div className="mt-6">
                <button
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        isActive
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                    {isActive ? "Continue to Next Step" : "Learn More"}
                </button>
            </div>
        </motion.div>
    );
}
