"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Shield, Heart, CheckCircle } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/mobile-app.jpeg"
                    alt="Blood donation process"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-green-900/80" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-300/30">
                            <Clock className="w-10 h-10 text-blue-300" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Your Donation Journey
                    </h1>

                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                        From registration to recovery, we guide you through
                        every step of the blood donation process. It's simple,
                        safe, and takes less than an hour.
                    </p>

                    {/* Process Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                        {[
                            {
                                icon: Shield,
                                value: "Safe & Secure",
                                label: "Sterile Equipment",
                            },
                            {
                                icon: Clock,
                                value: "45-60 Minutes",
                                label: "Total Time",
                            },
                            {
                                icon: Heart,
                                value: "Painless",
                                label: "Minimal Discomfort",
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
                                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                            >
                                <div className="flex justify-center mb-2">
                                    <item.icon className="w-6 h-6 text-blue-300" />
                                </div>
                                <div className="text-2xl font-bold text-blue-300">
                                    {item.value}
                                </div>
                                <div className="text-sm text-gray-200">
                                    {item.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold">
                            Start Your Journey
                        </button>
                        <a
                            href="#process"
                            className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600"
                        >
                            View All Steps
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
