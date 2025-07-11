"use client";
import { motion } from "framer-motion";
import { Users, Award, Shield, Heart } from "lucide-react";
import { AnimatedSection } from "../shared";

const teamData = [
    {
        name: "Dr. Maria Santos",
        position: "Medical Director",
        department: "Pediatric Blood Center",
        description:
            "Leading our mission to provide safe and reliable blood services for children in need.",
        image: "/avatar-1.png",
        icon: Shield,
    },
    {
        name: "Dr. Juan Dela Cruz",
        position: "Head of Blood Bank",
        department: "Laboratory Services",
        description:
            "Ensuring the highest standards of blood safety and quality control.",
        image: "/avatar-2.png",
        icon: Heart,
    },
    {
        name: "Ana Rodriguez",
        position: "Donor Relations Manager",
        department: "Community Outreach",
        description:
            "Building strong relationships with our donor community and partners.",
        image: "/avatar-3.png",
        icon: Users,
    },
];

const statsData = [
    {
        number: "45+",
        label: "Years of Service",
        description: "Dedicated to pediatric care",
    },
    {
        number: "1000+",
        label: "Lives Saved",
        description: "Through blood donations",
    },
    {
        number: "50+",
        label: "Medical Staff",
        description: "Specialized professionals",
    },
    {
        number: "100%",
        label: "Safety Record",
        description: "Zero transfusion incidents",
    },
];

export default function TeamSection() {
    return (
        <AnimatedSection className="max-w-screen-xl w-full mx-auto mb-16">
            {/* Team Members */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                    Our Leadership Team
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    Meet the dedicated professionals who lead our mission to
                    save children's lives through blood donation.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {teamData.map((member, index) => {
                    const IconComponent = member.icon;

                    return (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 text-center"
                        >
                            <div className="flex justify-center mb-4">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
                                    <IconComponent className="h-8 w-8 text-red-600 dark:text-red-300" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                {member.name}
                            </h3>
                            <p className="text-red-600 dark:text-red-400 font-semibold mb-1">
                                {member.position}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                                {member.department}
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                {member.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Statistics */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
                className="bg-gradient-to-r from-red-50 via-white to-blue-50 dark:from-red-900 dark:via-slate-900 dark:to-blue-900 rounded-2xl p-8 shadow-lg border border-red-100 dark:border-red-800"
            >
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Our Impact
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                        Numbers that reflect our commitment to saving young
                        lives
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                {stat.label}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">
                                {stat.description}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </AnimatedSection>
    );
}
