"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Calendar, MapPin, User } from "lucide-react";
import Link from "next/link";

export default function StoriesGrid() {
    const stories = [
        {
            id: 1,
            title: "Little Maria's Second Chance",
            excerpt:
                "A 3-year-old girl with leukemia received multiple blood transfusions during her treatment. Today, she's cancer-free and starting kindergarten.",
            image: "/donation-drive-1.JPG",
            category: "Pediatric Cancer",
            date: "December 2024",
            location: "PCMC Pediatric Blood Center",
            donorCount: 15,
            impact: "Life Saved",
        },
        {
            id: 2,
            title: "Emergency Surgery Success",
            excerpt:
                "A premature baby needed emergency surgery and received blood from 8 different donors. The baby is now healthy and thriving.",
            image: "/donation-drive-2.JPG",
            category: "Neonatal Care",
            date: "November 2024",
            location: "PCMC NICU",
            donorCount: 8,
            impact: "Critical Care",
        },
        {
            id: 3,
            title: "Community Hero Donor",
            excerpt:
                "John, a regular donor for 10 years, has donated over 50 times. His blood has helped save countless children's lives.",
            image: "/donation-drive-3.JPG",
            category: "Regular Donor",
            date: "Ongoing",
            location: "Mobile Blood Drives",
            donorCount: 1,
            impact: "50+ Donations",
        },
        {
            id: 4,
            title: "Blood Drive Miracle",
            excerpt:
                "A school blood drive collected 200 units, which were immediately used to help children in emergency situations.",
            image: "/donation-drive-4.JPG",
            category: "Community Event",
            date: "October 2024",
            location: "Local High School",
            donorCount: 200,
            impact: "Community Impact",
        },
        {
            id: 5,
            title: "Rare Blood Type Match",
            excerpt:
                "A child with a rare blood type found a perfect match through our donor network. The transfusion was successful.",
            image: "/donation-drive-5.JPG",
            category: "Rare Blood Type",
            date: "September 2024",
            location: "PCMC Blood Bank",
            donorCount: 1,
            impact: "Perfect Match",
        },
        {
            id: 6,
            title: "Platelet Donation Success",
            excerpt:
                "A cancer patient received platelet donations from multiple donors, helping them through chemotherapy treatment.",
            image: "/donation-drive-6.JPG",
            category: "Cancer Treatment",
            date: "August 2024",
            location: "PCMC Oncology",
            donorCount: 12,
            impact: "Treatment Support",
        },
    ];

    return (
        <section id="stories" className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Featured Success Stories
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Real stories from our community showing the incredible
                        impact of blood donation on children's lives and their
                        families.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stories.map((story, index) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Story Image */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={story.image}
                                    alt={story.title}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                        {story.category}
                                    </span>
                                </div>
                            </div>

                            {/* Story Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                                    {story.title}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                    {story.excerpt}
                                </p>

                                {/* Story Meta */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {story.date}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {story.location}
                                    </div>
                                </div>

                                {/* Impact Stats */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <User className="w-4 h-4 mr-1" />
                                        {story.donorCount}{" "}
                                        {story.donorCount === 1
                                            ? "Donor"
                                            : "Donors"}
                                    </div>
                                    <div className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400">
                                        <Heart className="w-4 h-4 mr-1" />
                                        {story.impact}
                                    </div>
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
                    className="text-center mt-12"
                >
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Share Your Story
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            Have you been impacted by blood donation? Share your
                            story to inspire others and show the real difference
                            donors make in our community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact-us#contact-form"
                                className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-green-600 hover:bg-gray-100"
                            >
                                Share Your Story
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    const el =
                                        document.getElementById("testimonials");
                                    if (el) {
                                        el.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                                className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-green-600"
                            >
                                View More Stories
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
