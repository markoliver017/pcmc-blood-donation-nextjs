"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQSection() {
    const [openFAQ, setOpenFAQ] = useState(null);

    const faqs = [
        {
            question: "Who can donate blood?",
            answer: "Anyone who is at least 18 years old (16 with parental consent), weighs 110 lbs (50 kg) or more, and is in good general health may be eligible to donate.",
        },
        {
            question: "How long does the donation process take?",
            answer: "The entire process from arrival to recovery takes about 30–45 minutes, but the actual blood donation typically takes only 8–10 minutes.",
        },
        {
            question: "Why is donating blood important for children?",
            answer: "Children with cancer, premature babies, and those undergoing surgeries often need frequent and component-specific blood transfusions. Since they can't donate blood themselves, they rely entirely on adult donors.",
        },
        {
            question: "How do I schedule a donation?",
            answer: "You can book an appointment directly through the Mobile Blood Donation Portal, where you can choose your location, view available mobile blood drives, and reschedule or cancel with ease.",
        },
        {
            question: "What if I recently got sick or traveled?",
            answer: "Temporary deferral may apply if you've had a recent illness (fever, cold, infection) or travel to areas with malaria, Zika, or dengue risk. Always complete the pre-screening questionnaire in the app to check your eligibility.",
        },
        {
            question: "Is donating blood safe?",
            answer: "Yes. All equipment is sterile and used only once. Donation is supervised by trained medical professionals, and your health is carefully monitored.",
        },
        {
            question: "How often can I donate?",
            answer: "Whole blood: Every 90 days (12 weeks). Apheresed Platelets: Every 14 days.",
        },
        {
            question: "What should I do before and after donating?",
            answer: "Before: Eat a healthy meal, drink plenty of fluids, avoid heavy exercise, get a full sleep of 7-8 hours a day before, avoid drinking alcoholic beverages 24 hours before donating, avoid smoking on the day of your appointment. After: Rest and hydrate, eat a snack provided by the staff, avoid smoking for at least three (3) hours after donation, avoid strenuous activity for the rest of the day.",
        },
        {
            question: "Who can I contact if I have questions?",
            answer: "You can reach us at: (0928) 479 5154 (Mobile) or (02) 8921 9781 (Direct Line). Kindly do not hesitate to contact us if you have any concerns or questions.",
        },
        {
            question: "Can I track my donations and get reminders?",
            answer: "Absolutely! The mobile portal allows you to track donation history, get alerts for your next eligible date, and receive notifications when your blood type is urgently needed.",
        },
    ];

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
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
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
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </motion.div>
                            )}
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
