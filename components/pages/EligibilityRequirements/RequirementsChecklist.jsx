"use client";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function RequirementsChecklist() {
    const requirements = [
        {
            category: "Age & Weight",
            items: [
                {
                    text: "At least 18 years old (16 with parental consent)",
                    required: true,
                },
                { text: "Weigh 110 lbs (50 kg) or more", required: true },
                {
                    text: "No upper age limit for healthy donors",
                    required: false,
                },
            ],
        },
        {
            category: "Health Status",
            items: [
                { text: "In good general health", required: true },
                { text: "No active infections or illnesses", required: true },
                { text: "Normal blood pressure", required: true },
                {
                    text: "Hemoglobin level of at least 12.5(female)/13.5(male) - 18.0 g/dL ",
                    required: true,
                },
            ],
        },
        {
            category: "Medical History",
            items: [
                {
                    text: "No history of certain blood-borne diseases",
                    required: true,
                },
                {
                    text: "No recent major surgery (within 6 months)",
                    required: true,
                },
                {
                    text: "No recent tattoos or piercings (within 12 months)",
                    required: true,
                },
                {
                    text: "No recent dental work (within 24 hours)",
                    required: true,
                },
            ],
        },
        {
            category: "Lifestyle Factors",
            items: [
                {
                    text: "No recent travel to malaria-endemic areas",
                    required: true,
                },
                {
                    text: "No recent exposure to infectious diseases",
                    required: true,
                },
                { text: "No high-risk sexual behavior", required: true },
                { text: "No intravenous drug use", required: true },
            ],
        },
    ];

    return (
        <section
            id="requirements"
            className="py-16 bg-gray-50 dark:bg-gray-800"
        >
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Basic Eligibility Requirements
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        These are the fundamental requirements to become a blood
                        donor. All requirements are designed to ensure your
                        safety and the safety of recipients.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {requirements.map((category, categoryIndex) => (
                        <motion.div
                            key={categoryIndex}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: categoryIndex * 0.1,
                            }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white">
                                    {category.category}
                                </h3>
                            </div>

                            <div className="p-6">
                                <ul className="space-y-4">
                                    {category.items.map((item, itemIndex) => (
                                        <motion.li
                                            key={itemIndex}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.4,
                                                delay:
                                                    categoryIndex * 0.1 +
                                                    itemIndex * 0.05,
                                            }}
                                            viewport={{ once: true }}
                                            className="flex items-start space-x-3"
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                {item.required ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-blue-500" />
                                                )}
                                            </div>
                                            <span
                                                className={`text-sm ${
                                                    item.required
                                                        ? "text-gray-900 dark:text-white"
                                                        : "text-gray-600 dark:text-gray-300"
                                                }`}
                                            >
                                                {item.text}
                                            </span>
                                        </motion.li>
                                    ))}
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
                    className="mt-12 text-center"
                >
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Ready to Check Your Eligibility?
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            Take our quick eligibility quiz to see if you meet
                            the requirements to become a blood donor and help
                            save children's lives.
                        </p>
                        <a
                            href="#eligibility-quiz"
                            className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-green-600 hover:bg-gray-100"
                        >
                            Take Eligibility Quiz
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
