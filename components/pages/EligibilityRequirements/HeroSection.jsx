"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Shield, Heart } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative h-80 sm:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/image-2.JPG"
                    alt="Blood Donation Eligibility Requirements"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-indigo-800/75 to-purple-900/80" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-2 md:px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex justify-center mb-2 md:mb-6">
                        <div className="inline-flex items-center justify-center md:w-20 md:h-20 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-300/30">
                            <CheckCircle className="w-6 h-6 md:w-10 md:h-10 text-blue-300" />
                        </div>
                    </div>

                    <h1 className="text-lg md:text-5xl lg:text-6xl font-bold mb-2 md:mb-6 leading-tight">
                        Eligibility Requirements
                    </h1>

                    <p className="text-xs md:text-2xl mb-4 md:mb-8 max-w-3xl mx-auto leading-relaxed">
                        Learn about the requirements to become a blood donor and
                        help save children's lives. Your safety and the safety
                        of recipients are our top priorities.
                    </p>

                    {/* Key Highlights */}
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-4 md:mb-8">
                        {[
                            {
                                icon: CheckCircle,
                                value: "Safety",
                                label: "First",
                            },
                            {
                                icon: Shield,
                                value: "Quality",
                                label: "Standards",
                            },
                            {
                                icon: Heart,
                                value: "Care",
                                label: "Focused",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4 border border-white/20"
                            >
                                <div className="flex justify-center mb-1 md:mb-2">
                                    <item.icon className="md:w-6 md:h-6 text-blue-300" />
                                </div>
                                <div className="text-xs md:text-2xl font-bold text-blue-300">
                                    {item.value}
                                </div>
                                <div className="text-xs md:text-sm text-gray-200">
                                    {item.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex gap-4 justify-center"
                    >
                        <a
                            href="#eligibility-quiz"
                            onClick={(e) => {
                                e.preventDefault();
                                const el =
                                    document.getElementById("eligibility-quiz");
                                if (el) {
                                    el.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className="btn btn-primary btn-sm md:btn-lg md:px-8 md:py-3 text-sm md:text-lg font-semibold"
                        >
                            Check Your Eligibility
                        </a>
                        <a
                            href="#requirements"
                            onClick={(e) => {
                                e.preventDefault();
                                const el =
                                    document.getElementById("requirements");
                                if (el) {
                                    el.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className="btn btn-outline btn-sm md:btn-lg md:px-8 md:py-3 text-sm md:text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600"
                        >
                            View Requirements
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
            >
                <div className="animate-bounce">
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            </motion.div>
        </section>
    );
}
