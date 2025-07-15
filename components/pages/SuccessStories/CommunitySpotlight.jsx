"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Building, Heart, Award, Calendar, MapPin } from "lucide-react";

export default function CommunitySpotlight({ onOpenRegister }) {
    const communityPartners = [
        {
            name: "Philippine Red Cross",
            logo: "/donation-drive-7.jpg",
            description:
                "Strategic partner in blood donation campaigns and emergency response",
            partnership: "Since 2020",
            contributions: "Blood drives, training, emergency support",
        },
        {
            name: "Department of Health",
            logo: "/coordinator-img2.jpeg",
            description:
                "Government support for pediatric blood donation initiatives",
            partnership: "Since 2019",
            contributions: "Policy support, funding, regulatory guidance",
        },
        {
            name: "Philippine Medical Association",
            logo: "/coordinator-img3.jpeg",
            description:
                "Professional medical community supporting our mission",
            partnership: "Since 2021",
            contributions: "Medical expertise, volunteer doctors, advocacy",
        },
        {
            name: "Local Universities",
            logo: "/coordinator-img4.jpeg",
            description:
                "Educational institutions hosting blood donation drives",
            partnership: "Ongoing",
            contributions: "Student donors, awareness campaigns, research",
        },
    ];

    const communityEvents = [
        {
            title: "Annual Blood Donation Marathon",
            date: "December 2024",
            location: "PCMC Campus",
            participants: "500+ donors",
            impact: "1,200 units collected",
            image: "/donation-drive-1.jpg",
        },
        {
            title: "Youth Donor Campaign",
            date: "November 2024",
            location: "Local High Schools",
            participants: "300+ students",
            impact: "600 units collected",
            image: "/donation-drive-2.jpg",
        },
        {
            title: "Corporate Blood Drive",
            date: "October 2024",
            location: "Business Districts",
            participants: "200+ employees",
            impact: "400 units collected",
            image: "/donation-drive-3.jpg",
        },
    ];

    const volunteerSpotlight = [
        {
            name: "Maria Santos",
            role: "Volunteer Coordinator",
            image: "/coordinator-img.jpeg",
            hours: "500+ hours",
            story: "Maria has been coordinating blood drives for 3 years, helping organize over 50 successful events.",
        },
        {
            name: "Carlos Rodriguez",
            role: "Donor Recruiter",
            image: "/coordinator-img2.jpeg",
            hours: "300+ hours",
            story: "Carlos personally recruited over 200 new donors through community outreach and social media.",
        },
        {
            name: "Dr. Emily Chen",
            role: "Medical Volunteer",
            image: "/coordinator-img3.jpeg",
            hours: "400+ hours",
            story: "Dr. Chen provides medical supervision at blood drives and trains new volunteers.",
        },
    ];

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
                        Community Spotlight
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Our success is built on the strength of our community
                        partnerships, dedicated volunteers, and collaborative
                        events that bring people together.
                    </p>
                </motion.div>

                {/* Community Partners */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        Our Community Partners
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {communityPartners.map((partner, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.4 + index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                            <Building className="w-8 h-8 text-blue-500" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            {partner.name}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                                            {partner.description}
                                        </p>
                                        <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                                            <div>
                                                Partnership:{" "}
                                                {partner.partnership}
                                            </div>
                                            <div>
                                                Contributions:{" "}
                                                {partner.contributions}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Community Events */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        Recent Community Events
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {communityEvents.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.6 + index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl overflow-hidden border border-green-200 dark:border-gray-600"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h4 className="text-lg font-bold text-white mb-1">
                                            {event.title}
                                        </h4>
                                        <div className="flex items-center text-sm text-white/90">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {event.date}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {event.location}
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Participants:
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {event.participants}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Impact:
                                            </span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                {event.impact}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Volunteer Spotlight */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        Volunteer Spotlight
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {volunteerSpotlight.map((volunteer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.8 + index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="relative w-24 h-24 mx-auto mb-4">
                                    <Image
                                        src={volunteer.image}
                                        alt={volunteer.name}
                                        fill
                                        className="object-cover rounded-full border-4 border-green-200 dark:border-gray-600"
                                    />
                                </div>

                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {volunteer.name}
                                </h4>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {volunteer.role}
                                </p>

                                <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3">
                                    {volunteer.hours} volunteered
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {volunteer.story}
                                </p>
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
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Join Our Community
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            Whether you want to donate blood, volunteer your
                            time, or partner with us, there are many ways to get
                            involved and make a difference.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={onOpenRegister}
                                className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-blue-600 hover:bg-gray-100"
                            >
                                Become a Volunteer
                            </button>
                            <button
                                onClick={onOpenRegister}
                                className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600"
                            >
                                Partner With Us
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
