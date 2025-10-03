"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFaqs } from "@action/faqAction";

export default function FAQSection() {
    const [openFAQ, setOpenFAQ] = useState(null);

    // Fetch active FAQs from database
    const { data: response, isLoading } = useQuery({
        queryKey: ["public-faqs"],
        queryFn: () => fetchFaqs({ is_active: true }),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    const faqs = response?.success ? response.data : [];

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <section id="faq" className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="flex justify-center mb-4">
                        <HelpCircle className="w-12 h-12 text-blue-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Get answers to common questions about the blood donation
                        process. If you don't see your question here, feel free
                        to contact us.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {isLoading ? (
                        // Loading skeleton
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
                                >
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : faqs.length === 0 ? (
                        // Empty state
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">
                                No FAQs available at the moment. Please check
                                back later.
                            </p>
                        </div>
                    ) : (
                        // FAQ list
                        faqs.map((faq, index) => (
                            <motion.div
                                key={faq.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                                        {faq.question}
                                    </h3>
                                    {openFAQ === index ? (
                                        <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>

                                {openFAQ === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 pb-4"
                                    >
                                        <div
                                            className="text-gray-600 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: faq.answer,
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Still Have Questions?
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            Our team is here to help! Contact us for
                            personalized assistance with any questions about the
                            donation process.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-blue-600 hover:bg-gray-100">
                                Contact Us
                            </button>
                            <button className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600">
                                Schedule Consultation
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
