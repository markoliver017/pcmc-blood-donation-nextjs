"use client";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, Shield, Heart } from "lucide-react";

export default function MedicalRequirements() {
    const medicalConditions = [
        {
            category: "Temporary Deferrals",
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
            conditions: [
                {
                    condition: "Recent Illness",
                    duration: "Wait 24-48 hours after recovery",
                    details: "Cold, flu, fever, or any infection",
                },
                {
                    condition: "Dental Work",
                    duration: "Wait 24 hours after procedure",
                    details: "Routine cleaning, fillings, extractions",
                },
                {
                    condition: "Minor Surgery",
                    duration: "Wait 6 months after procedure",
                    details: "Appendectomy, hernia repair, etc.",
                },
                {
                    condition: "Tattoos/Piercings",
                    duration: "Wait 12 months after procedure",
                    details: "Must be done in licensed facility",
                },
            ],
        },
        {
            category: "Permanent Deferrals",
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            conditions: [
                {
                    condition: "HIV/AIDS",
                    duration: "Permanent deferral",
                    details: "For donor and recipient safety",
                },
                {
                    condition: "Hepatitis B/C",
                    duration: "Permanent deferral",
                    details: "Chronic viral infections",
                },
                {
                    condition: "Certain Cancers",
                    duration: "Permanent deferral",
                    details: "Leukemia, lymphoma, multiple myeloma",
                },
                {
                    condition: "Creutzfeldt-Jakob Disease",
                    duration: "Permanent deferral",
                    details: "Family history or exposure",
                },
            ],
        },
        {
            category: "Conditional Eligibility",
            icon: Shield,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            conditions: [
                {
                    condition: "Diabetes",
                    duration: "May donate if controlled",
                    details: "Stable blood sugar levels required",
                },
                {
                    condition: "Hypertension",
                    duration: "May donate if controlled",
                    details: "Blood pressure under 180/100",
                },
                {
                    condition: "Asthma",
                    duration: "May donate if controlled",
                    details: "No active symptoms or attacks",
                },
                {
                    condition: "Medications",
                    duration: "Case-by-case evaluation",
                    details: "Many medications are acceptable",
                },
            ],
        },
    ];

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Medical Requirements & Conditions
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Understanding how medical conditions and treatments may
                        affect your eligibility to donate blood. We prioritize
                        safety for both donors and recipients.
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {medicalConditions.map((category, categoryIndex) => (
                        <motion.div
                            key={categoryIndex}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: categoryIndex * 0.1,
                            }}
                            viewport={{ once: true }}
                            className={`${category.bgColor} dark:bg-gray-800 rounded-xl border ${category.borderColor} dark:border-gray-700 overflow-hidden`}
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <category.icon
                                        className={`w-6 h-6 ${category.color}`}
                                    />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {category.category}
                                    </h3>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {category.conditions.map(
                                        (condition, conditionIndex) => (
                                            <motion.div
                                                key={conditionIndex}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay:
                                                        categoryIndex * 0.1 +
                                                        conditionIndex * 0.05,
                                                }}
                                                viewport={{ once: true }}
                                                className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                                            >
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                    {condition.condition}
                                                </h4>
                                                <p
                                                    className={`text-sm font-medium ${category.color} mb-2`}
                                                >
                                                    {condition.duration}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {condition.details}
                                                </p>
                                            </motion.div>
                                        )
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
                        <div className="flex justify-center mb-4">
                            <Heart className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">
                            Your Health Matters
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            If you have any medical conditions or concerns,
                            please discuss them with our medical staff during
                            the screening process. We're here to help determine
                            your eligibility safely.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-blue-600 hover:bg-gray-100">
                                Contact Medical Staff
                            </button>
                            <button className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600">
                                Schedule Consultation
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
