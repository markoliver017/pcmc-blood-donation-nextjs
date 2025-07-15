"use client";
import { motion } from "framer-motion";
import {
    Clock,
    Calendar,
    AlertCircle,
    CheckCircle,
    XCircle,
} from "lucide-react";

export default function OfficeHours() {
    const regularHours = [
        {
            day: "Monday",
            hours: "8:00 AM - 6:00 PM",
            status: "open",
            services: ["Blood Donation", "Consultation", "Emergency Services"],
        },
        {
            day: "Tuesday",
            hours: "8:00 AM - 6:00 PM",
            status: "open",
            services: ["Blood Donation", "Consultation", "Emergency Services"],
        },
        {
            day: "Wednesday",
            hours: "8:00 AM - 6:00 PM",
            status: "open",
            services: ["Blood Donation", "Consultation", "Emergency Services"],
        },
        {
            day: "Thursday",
            hours: "8:00 AM - 6:00 PM",
            status: "open",
            services: ["Blood Donation", "Consultation", "Emergency Services"],
        },
        {
            day: "Friday",
            hours: "8:00 AM - 6:00 PM",
            status: "open",
            services: ["Blood Donation", "Consultation", "Emergency Services"],
        },
        {
            day: "Saturday",
            hours: "8:00 AM - 4:00 PM",
            status: "limited",
            services: ["Blood Donation", "Emergency Services"],
        },
        {
            day: "Sunday",
            hours: "Closed",
            status: "closed",
            services: ["Emergency Services Only"],
        },
    ];

    const specialSchedules = [
        {
            title: "Holiday Schedule",
            description: "Modified hours during national holidays",
            hours: "9:00 AM - 3:00 PM",
            note: "Emergency services available 24/7",
        },
        {
            title: "Blood Drive Events",
            description: "Extended hours during community blood drives",
            hours: "7:00 AM - 8:00 PM",
            note: "Check our events calendar for specific dates",
        },
        {
            title: "Emergency Services",
            description: "24/7 emergency blood requests",
            hours: "24 Hours",
            note: "Call (0928) 479 5154 for emergencies",
        },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case "open":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "limited":
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case "closed":
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "open":
                return "text-green-600 bg-green-50 border-green-200";
            case "limited":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "closed":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
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
                        Office Hours & Schedule
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Plan your visit with our operating hours. Emergency
                        services are available 24/7 for urgent blood requests.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Regular Hours */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center mb-6">
                                <Clock className="w-6 h-6 text-blue-500 mr-3" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Regular Operating Hours
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {regularHours.map((schedule, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.4 + index * 0.05,
                                        }}
                                        viewport={{ once: true }}
                                        className={`p-4 rounded-lg border ${getStatusColor(
                                            schedule.status
                                        )} dark:bg-gray-700 dark:border-gray-600`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                                                {getStatusIcon(schedule.status)}
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {schedule.day}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {schedule.hours}
                                            </span>
                                        </div>

                                        <div className="ml-8">
                                            <div className="flex flex-wrap gap-2">
                                                {schedule.services.map(
                                                    (service, serviceIndex) => (
                                                        <span
                                                            key={serviceIndex}
                                                            className="text-xs px-2 py-1 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
                                                        >
                                                            {service}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Special Schedules */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-200 dark:border-gray-600 p-6">
                            <div className="flex items-center mb-6">
                                <Calendar className="w-6 h-6 text-blue-500 mr-3" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Special Schedules
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {specialSchedules.map((schedule, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.6 + index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                        className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                                    >
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {schedule.title}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                                            {schedule.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                                {schedule.hours}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {schedule.note}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Important Notes */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-6 text-white"
                        >
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-6 h-6 text-white mt-1" />
                                <div>
                                    <h4 className="font-semibold mb-2">
                                        Important Notes
                                    </h4>
                                    <ul className="text-sm space-y-1 opacity-90">
                                        <li>
                                            • Emergency blood requests are
                                            handled 24/7
                                        </li>
                                        <li>
                                            • Last donation appointment: 30
                                            minutes before closing
                                        </li>
                                        <li>
                                            • Walk-ins welcome during regular
                                            hours
                                        </li>
                                        <li>
                                            • Appointments recommended for
                                            faster service
                                        </li>
                                        <li>
                                            • Check our events calendar for
                                            mobile blood drives
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Need to Schedule a Visit?
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            Book your appointment online or call us to confirm
                            availability. We're here to make your donation
                            experience smooth and convenient.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                                className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-teal-600 hover:bg-gray-100"
                            >
                                Schedule Appointment
                            </a>
                            <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}&su=Support%20Request&body=Hi%20Support%20Team%2C%0A%0AI%20need%20help%20with...`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-teal-600"
                            >
                                Email Us
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
