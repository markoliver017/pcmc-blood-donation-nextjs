"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Quote, Heart, Star } from "lucide-react";

export default function ImpactStories() {
    const stories = [
        {
            name: "Maria Santos",
            role: "Blood Donor",
            image: "/blood-donation-img1.jpg",
            quote: "I've been donating blood for 10 years now. Knowing that my donation helped save a child's life during emergency surgery makes every donation worth it. It's such a simple thing to do, but the impact is enormous.",
            rating: 5,
            donationCount: 15,
            impact: "Saved 45+ lives",
        },
        {
            name: "Dr. James Chen",
            role: "Pediatric Surgeon",
            image: "/blood-donation-img-4.jpg",
            quote: "As a pediatric surgeon, I see firsthand how blood donations save children's lives every day. Without donors, we couldn't perform many life-saving surgeries. Every donor is a hero to our patients.",
            rating: 5,
            experience: "15+ years",
            impact: "Witnessed 1000+ saves",
        },
        {
            name: "Sarah Johnson",
            role: "Mother of Recipient",
            image: "/mobile-app.jpeg",
            quote: "When my daughter needed emergency blood during her leukemia treatment, it was the generosity of blood donors that saved her life. Now I donate regularly to pay it forward and help other families.",
            rating: 5,
            story: "Daughter's recovery",
            impact: "Grateful recipient",
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-br from-red-50 to-blue-50 dark:from-red-900 dark:to-blue-900">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Real Stories, Real Impact
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Hear from donors, medical professionals, and families
                        whose lives have been touched by blood donation. These
                        stories show the real human impact of your generosity.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {stories.map((story, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                    <Image
                                        src={story.image}
                                        alt={story.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {story.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {story.role}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[...Array(story.rating)].map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <Quote className="w-6 h-6 text-red-400 mb-2" />
                                <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                                    "{story.quote}"
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <Heart className="w-4 h-4" />
                                    <span className="font-semibold">
                                        {story.impact}
                                    </span>
                                </div>
                                <div className="text-gray-500 dark:text-gray-400">
                                    {story.donationCount &&
                                        `${story.donationCount} donations`}
                                    {story.experience &&
                                        `${story.experience} experience`}
                                    {story.story && story.story}
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
                    className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Your Story Could Be Next
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                            Every blood donor has a story. Whether you're a
                            first-time donor or a regular contributor, your
                            donation creates ripples of positive impact
                            throughout our community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=pedbc-support@pcmc.gov.ph&su=Successfully Donated&body=Your message here"
                                target="_blank"
                                className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold"
                            >
                                Share Your Story
                            </a>
                            <button
                                href="#stories"
                                className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold"
                            >
                                Read More Stories
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
