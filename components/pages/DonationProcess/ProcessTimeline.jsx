"use client";
import { motion } from "framer-motion";
import {
    UserCheck,
    ClipboardList,
    Stethoscope,
    Droplets,
    RefreshCw,
    CheckCircle,
    Heart,
} from "lucide-react";

export default function ProcessTimeline() {
    const steps = [
        {
            number: 1,
            icon: UserCheck,
            title: "Registration & Check-in",
            description:
                "Complete registration form and provide identification. Our staff will verify your eligibility and create your donor profile.",
            duration: "5-10 minutes",
            details: [
                "Fill out registration form",
                "Provide valid ID",
                "Verify eligibility criteria",
            ],
            color: "blue",
        },
        {
            number: 2,
            icon: ClipboardList,
            title: "Health Screening",
            description:
                "Complete a confidential health questionnaire and brief physical examination to ensure you're healthy to donate.",
            duration: "10-15 minutes",
            details: [
                "Health questionnaire",
                "Blood pressure check",
                "Hemoglobin test",
            ],
            color: "green",
        },
        {
            number: 3,
            icon: Stethoscope,
            title: "Medical Review",
            description:
                "A healthcare professional will review your health information and answer any questions you may have.",
            duration: "5 minutes",
            details: [
                "Medical history review",
                "Question & answer session",
                "Final clearance",
            ],
            color: "purple",
        },
        {
            number: 4,
            icon: Droplets,
            title: "Blood Donation",
            description:
                "The actual donation process takes about 8-10 minutes. You'll be comfortably seated while blood is collected.",
            duration: "8-10 minutes",
            details: [
                "Sterile needle insertion",
                "Blood collection",
                "Comfortable seating",
            ],
            color: "red",
        },
        {
            number: 5,
            icon: RefreshCw,
            title: "Recovery & Refreshments",
            description:
                "Rest for 10-15 minutes while enjoying refreshments. This helps your body recover and prevents dizziness.",
            duration: "10-15 minutes",
            details: [
                "Rest period",
                "Refreshments provided",
                "Monitor for reactions",
            ],
            color: "orange",
        },
        {
            number: 6,
            icon: CheckCircle,
            title: "Post-Donation Care",
            description:
                "Receive care instructions and information about when you can donate again. Your donation is processed and tested.",
            duration: "5 minutes",
            details: [
                "Care instructions",
                "Next donation date",
                "Contact information",
            ],
            color: "teal",
        },
        {
            number: 7,
            icon: Heart,
            title: "Impact & Follow-up",
            description:
                "Receive updates about your donation's impact and when it's used to help patients in need.",
            duration: "Ongoing",
            details: [
                "Impact notifications",
                "Donation tracking",
                "Community updates",
            ],
            color: "pink",
        },
    ];

    const colorClasses = {
        blue: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
        green: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
        purple: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20",
        red: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
        orange: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20",
        teal: "border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-900/20",
        pink: "border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-900/20",
    };

    const iconColorClasses = {
        blue: "text-blue-500 dark:text-blue-400",
        green: "text-green-500 dark:text-green-400",
        purple: "text-purple-500 dark:text-purple-400",
        red: "text-red-500 dark:text-red-400",
        orange: "text-orange-500 dark:text-orange-400",
        teal: "text-teal-500 dark:text-teal-400",
        pink: "text-pink-500 dark:text-pink-400",
    };

    return (
        <section
            id="process"
            className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900"
        >
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        The 7-Step Donation Process
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Our streamlined process ensures your donation experience
                        is safe, comfortable, and efficient. From start to
                        finish, the entire process takes about 45-60 minutes.
                    </p>
                </motion.div>

                {/* Timeline Line */}
                <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-green-500 hidden lg:block" />

                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{
                                    opacity: 0,
                                    x: index % 2 === 0 ? -50 : 50,
                                }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className={`flex flex-col lg:flex-row items-start gap-8`}
                                //     ${
                                //     index % 2 === 0
                                //         ? "lg:flex-row"
                                //         : "lg:flex-row-reverse"
                                // }
                            >
                                {/* Timeline Dot */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-500 flex items-center justify-center shadow-lg z-10 relative">
                                        <step.icon
                                            className={`w-8 h-8 ${
                                                iconColorClasses[step.color]
                                            }`}
                                        />
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-500 animate-pulse" />
                                </div>

                                {/* Content Card */}
                                <div
                                    className={`flex-1 p-6 rounded-xl border-2 ${
                                        colorClasses[step.color]
                                    } hover:shadow-lg transition-all duration-300 hover:scale-105`}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                                            {step.number}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Duration: {step.duration}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                        {step.description}
                                    </p>

                                    <ul className="space-y-2">
                                        {step.details.map(
                                            (detail, detailIndex) => (
                                                <li
                                                    key={detailIndex}
                                                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full ${
                                                            iconColorClasses[
                                                                step.color
                                                            ]
                                                        }`}
                                                    />
                                                    {detail}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
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
                            Ready to Start Your Journey?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                            The donation process is designed to be safe,
                            comfortable, and rewarding. Your donation will be
                            used to save lives within days.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold">
                                Schedule Your Donation
                            </button>
                            <button className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold">
                                Learn About Safety
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
