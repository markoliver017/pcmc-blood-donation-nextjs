"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/contact-us.jpg"
                    alt="Contact Us - PCMC Pediatric Blood Center"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/85 via-cyan-800/75 to-blue-900/80" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-500/20 backdrop-blur-sm border border-teal-300/30">
                            <Phone className="w-10 h-10 text-teal-300" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Contact Us
                    </h1>

                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                        Get in touch with our team. We're here to help with any
                        questions about blood donation, scheduling, or our
                        services.
                    </p>

                    {/* Contact Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                        {[
                            {
                                icon: Phone,
                                value: "24/7",
                                label: "Support",
                            },
                            {
                                icon: Mail,
                                value: "Quick",
                                label: "Response",
                            },
                            {
                                icon: MapPin,
                                value: "Local",
                                label: "Service",
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
                                    <item.icon className="w-6 h-6 text-teal-300" />
                                </div>
                                <div className="text-2xl font-bold text-teal-300">
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
                        <a
                            href="#contact-form"
                            onClick={(e) => {
                                e.preventDefault();
                                const element =
                                    document.getElementById("contact-form");
                                if (element) {
                                    element.scrollIntoView({
                                        behavior: "smooth",
                                    });
                                }
                            }}
                            className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold"
                        >
                            Send Message
                        </a>
                        <a
                            href="#contact-info"
                            onClick={(e) => {
                                e.preventDefault();
                                const element =
                                    document.getElementById("contact-info");
                                if (element) {
                                    element.scrollIntoView({
                                        behavior: "smooth",
                                    });
                                }
                            }}
                            className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-teal-600"
                        >
                            View Contact Info
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
