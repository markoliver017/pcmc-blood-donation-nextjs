"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    Heart,
    Users,
    Droplet,
    Award,
    TrendingUp,
    Calendar,
} from "lucide-react";

export default function ImpactMetrics({ onOpenRegister }) {
    const [counts, setCounts] = useState({
        livesSaved: 0,
        totalDonations: 0,
        activeDonors: 0,
        bloodUnits: 0,
        eventsHosted: 0,
        communityPartners: 0,
    });

    const targetCounts = {
        livesSaved: 1500,
        totalDonations: 5000,
        activeDonors: 2500,
        bloodUnits: 8000,
        eventsHosted: 120,
        communityPartners: 45,
    };

    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepDuration = duration / steps;

        const timer = setInterval(() => {
            setCounts((prev) => {
                const newCounts = {};
                Object.keys(targetCounts).forEach((key) => {
                    const target = targetCounts[key];
                    const current = prev[key];
                    const increment = Math.ceil(target / steps);
                    newCounts[key] = Math.min(current + increment, target);
                });
                return newCounts;
            });
        }, stepDuration);

        return () => clearInterval(timer);
    }, []);

    const metrics = [
        {
            icon: Heart,
            label: "Lives Saved",
            value: counts.livesSaved.toLocaleString(),
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            description:
                "Children whose lives were saved through blood transfusions",
        },
        {
            icon: Droplet,
            label: "Total Donations",
            value: counts.totalDonations.toLocaleString(),
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            description:
                "Blood donations collected through our mobile platform",
        },
        {
            icon: Users,
            label: "Active Donors",
            value: counts.activeDonors.toLocaleString(),
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            description: "Registered donors in our community",
        },
        {
            icon: Award,
            label: "Blood Units",
            value: counts.bloodUnits.toLocaleString(),
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
            description: "Units of blood processed and distributed",
        },
        {
            icon: Calendar,
            label: "Events Hosted",
            value: counts.eventsHosted.toLocaleString(),
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200",
            description: "Mobile blood drives and community events",
        },
        {
            icon: TrendingUp,
            label: "Community Partners",
            value: counts.communityPartners.toLocaleString(),
            color: "text-teal-600",
            bgColor: "bg-teal-50",
            borderColor: "border-teal-200",
            description: "Organizations supporting our mission",
        },
    ];

    const achievements = [
        {
            title: "Excellence in Pediatric Care",
            description:
                "Recognized for outstanding service to children's healthcare",
            year: "2024",
            organization: "Department of Health",
        },
        {
            title: "Community Impact Award",
            description:
                "For exceptional contribution to public health and community service",
            year: "2023",
            organization: "Philippine Medical Association",
        },
        {
            title: "Innovation in Healthcare",
            description:
                "Mobile blood donation platform revolutionizing donor engagement",
            year: "2023",
            organization: "Healthcare Technology Awards",
        },
    ];

    return (
        <section id="impact" className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Our Impact by the Numbers
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        See the real impact of blood donation through our
                        community's collective efforts. Every number represents
                        a life touched, a family helped, and hope restored.
                    </p>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`${metric.bgColor} dark:bg-gray-900 rounded-xl border ${metric.borderColor} dark:border-gray-700 p-6 text-center`}
                        >
                            <div
                                className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${metric.bgColor} dark:bg-gray-800 mb-4`}
                            >
                                <metric.icon
                                    className={`w-8 h-8 ${metric.color}`}
                                />
                            </div>

                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {metric.value}
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {metric.label}
                            </h3>

                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {metric.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Achievements Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8"
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        Awards & Recognition
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.6 + index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-green-200 dark:border-gray-600"
                            >
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="w-6 h-6 text-white" />
                                </div>

                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {achievement.title}
                                </h4>

                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                    {achievement.description}
                                </p>

                                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{achievement.organization}</span>
                                    <span>•</span>
                                    <span>{achievement.year}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Be Part of Our Success Story
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            Join thousands of donors who are making a difference
                            in children's lives. Your donation could be the one
                            that saves a life today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={onOpenRegister}
                                className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-green-600 hover:bg-gray-100"
                            >
                                Schedule Your Donation
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
