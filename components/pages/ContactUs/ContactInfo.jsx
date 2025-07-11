"use client";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Users } from "lucide-react";

export default function ContactInfo() {
    const contactMethods = [
        {
            icon: Phone,
            title: "Phone Numbers",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            items: [
                {
                    label: "Mobile",
                    value: "(0928) 479 5154",
                    description: "For urgent inquiries and appointments",
                },
                {
                    label: "Direct Line",
                    value: "(02) 8921 9781",
                    description: "Main office line",
                },
            ],
        },
        {
            icon: Mail,
            title: "Email Address",
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            items: [
                {
                    label: "General Inquiries",
                    value: "info@pcmc-bloodcenter.gov.ph",
                    description: "General questions and information",
                },
                {
                    label: "Appointments",
                    value: "appointments@pcmc-bloodcenter.gov.ph",
                    description: "Blood donation scheduling",
                },
            ],
        },
        {
            icon: MapPin,
            title: "Location",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
            items: [
                {
                    label: "Main Office",
                    value: "PCMC Pediatric Blood Center",
                    description: "Quezon Avenue, Quezon City, Philippines",
                },
                {
                    label: "Mobile Units",
                    value: "Various Locations",
                    description: "Check our events calendar for mobile drives",
                },
            ],
        },
        {
            icon: Clock,
            title: "Office Hours",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200",
            items: [
                {
                    label: "Monday - Friday",
                    value: "8:00 AM - 6:00 PM",
                    description: "Regular office hours",
                },
                {
                    label: "Saturday",
                    value: "8:00 AM - 4:00 PM",
                    description: "Limited services",
                },
            ],
        },
    ];

    const emergencyContacts = [
        {
            title: "Emergency Blood Requests",
            phone: "(0928) 479 5154",
            description: "24/7 emergency blood requests for pediatric patients",
        },
        {
            title: "Medical Staff",
            phone: "(02) 8921 9781",
            description: "Direct line to medical professionals",
        },
    ];

    return (
        <section
            id="contact-info"
            className="py-16 bg-gray-50 dark:bg-gray-800"
        >
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Get in Touch
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Multiple ways to reach our team. We're here to help with
                        any questions about blood donation, scheduling, or our
                        services.
                    </p>
                </motion.div>

                {/* Contact Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {contactMethods.map((method, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`${method.bgColor} dark:bg-gray-900 rounded-xl border ${method.borderColor} dark:border-gray-700 p-6`}
                        >
                            <div className="flex items-center mb-6">
                                <div
                                    className={`w-12 h-12 rounded-lg ${method.bgColor} dark:bg-gray-800 flex items-center justify-center mr-4`}
                                >
                                    <method.icon
                                        className={`w-6 h-6 ${method.color}`}
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {method.title}
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {method.items.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="border-l-4 border-gray-300 dark:border-gray-600 pl-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                    {item.label}
                                                </h4>
                                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {item.value}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Emergency Contacts */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-8 text-white mb-12"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                            <Phone className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                            Emergency Contacts
                        </h3>
                        <p className="text-lg opacity-90">
                            For urgent blood requests and emergency situations
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {emergencyContacts.map((contact, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.6 + index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
                            >
                                <h4 className="text-lg font-semibold mb-2">
                                    {contact.title}
                                </h4>
                                <p className="text-2xl font-bold mb-2">
                                    {contact.phone}
                                </p>
                                <p className="text-sm opacity-90">
                                    {contact.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Additional Information */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8"
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        Additional Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MessageCircle className="w-6 h-6 text-blue-500 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        Response Time
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        We typically respond to inquiries within
                                        24 hours during business days.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Users className="w-6 h-6 text-green-500 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        Language Support
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        We provide support in English, Filipino,
                                        and other local languages.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Clock className="w-6 h-6 text-purple-500 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        After Hours
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Emergency contacts are available 24/7
                                        for urgent blood requests.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <MapPin className="w-6 h-6 text-orange-500 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        Accessibility
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Our facilities are wheelchair accessible
                                        with designated parking.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
