"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

export default function TestimonialCard() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Blood Donor",
            image: "/coordinator-img.jpeg",
            quote: "I've been donating blood for 5 years now, and knowing that my donations help children in need makes it all worthwhile. The mobile portal makes it so easy to schedule appointments.",
            rating: 5,
            donationCount: 12,
            category: "Regular Donor",
        },
        {
            id: 2,
            name: "Dr. Maria Santos",
            role: "Pediatrician",
            image: "/coordinator-img2.jpeg",
            quote: "As a pediatrician, I see firsthand how blood donations save children's lives every day. The PCMC blood center's mobile platform has made it easier for donors to contribute to our mission.",
            rating: 5,
            yearsExperience: 15,
            category: "Medical Professional",
        },
        {
            id: 3,
            name: "Carlos Rodriguez",
            role: "Parent",
            image: "/coordinator-img3.jpeg",
            quote: "When my daughter needed emergency surgery, blood donors saved her life. I'm forever grateful and now I donate regularly to help other families in similar situations.",
            rating: 5,
            donationCount: 8,
            category: "Recipient Family",
        },
        {
            id: 4,
            name: "Emily Chen",
            role: "Student Donor",
            image: "/coordinator-img3.jpeg",
            quote: "My first blood donation was nerve-wracking, but the staff made me feel so comfortable. Now I encourage all my friends to donate - it's such a simple way to make a huge difference.",
            rating: 5,
            donationCount: 3,
            category: "First-Time Donor",
        },
        {
            id: 5,
            name: "Robert Williams",
            role: "Retired Teacher",
            image: "/coordinator-img4.jpeg",
            quote: "After 30 years of teaching, I wanted to continue helping children. Blood donation is my way of giving back. The mobile app makes it convenient for someone my age.",
            rating: 5,
            donationCount: 25,
            category: "Senior Donor",
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length
        );
    };

    const goToTestimonial = (index) => {
        setCurrentIndex(index);
    };

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
                        What Our Community Says
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Hear from donors, recipients, and medical professionals
                        about their experiences with blood donation and the
                        impact it has made.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Testimonial Cards */}
                    <div className="overflow-hidden">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-center"
                        >
                            <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl border border-green-200 dark:border-gray-600 p-8 max-w-4xl mx-auto">
                                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                                    {/* Image Section */}
                                    <div className="flex-shrink-0">
                                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-600 shadow-lg">
                                            <Image
                                                src={
                                                    testimonials[currentIndex]
                                                        .image
                                                }
                                                alt={
                                                    testimonials[currentIndex]
                                                        .name
                                                }
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="text-center mt-4">
                                            <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                                {
                                                    testimonials[currentIndex]
                                                        .category
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 text-center lg:text-left">
                                        <div className="flex justify-center lg:justify-start mb-4">
                                            <Quote className="w-8 h-8 text-green-500" />
                                        </div>

                                        <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                                            "{testimonials[currentIndex].quote}"
                                        </blockquote>

                                        <div className="space-y-2">
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {
                                                    testimonials[currentIndex]
                                                        .name
                                                }
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {
                                                    testimonials[currentIndex]
                                                        .role
                                                }
                                            </p>

                                            {/* Rating */}
                                            <div className="flex justify-center lg:justify-start items-center space-x-1">
                                                {[
                                                    ...Array(
                                                        testimonials[
                                                            currentIndex
                                                        ].rating
                                                    ),
                                                ].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-5 h-5 text-yellow-400 fill-current"
                                                    />
                                                ))}
                                            </div>

                                            {/* Stats */}
                                            <div className="flex justify-center lg:justify-start items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                {testimonials[currentIndex]
                                                    .donationCount && (
                                                    <span>
                                                        {
                                                            testimonials[
                                                                currentIndex
                                                            ].donationCount
                                                        }{" "}
                                                        donations
                                                    </span>
                                                )}
                                                {testimonials[currentIndex]
                                                    .yearsExperience && (
                                                    <span>
                                                        {
                                                            testimonials[
                                                                currentIndex
                                                            ].yearsExperience
                                                        }{" "}
                                                        years experience
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                        onClick={nextTestimonial}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToTestimonial(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    index === currentIndex
                                        ? "bg-green-500"
                                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                                }`}
                            />
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
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Join Our Community
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            Become part of our success stories. Your donation
                            can make the difference between life and death for a
                            child in need.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-blue-600 hover:bg-gray-100">
                                Become a Donor
                            </button>
                            <button className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600">
                                Share Your Experience
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
