"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import MainSlider from "./Slider";
import { useState } from "react";
import SelectRegisterDrawer from "./SelectRegisterDrawer";
import {
    Handshake,
    Heart,
    Users,
    Clock,
    CheckCircle,
    MapPin,
    Phone,
    Mail,
    HeartPulse,
    Syringe,
    Globe,
    LogIn,
    Signature,
    Pen,
    Megaphone,
} from "lucide-react";
import { GiCycle } from "react-icons/gi";
import Link from "next/link";
import { FaHandHolding } from "react-icons/fa";

import { MdBloodtype } from "react-icons/md";

export default function Page() {
    const [openRegister, setOpenRegister] = useState(false);

    return (
        <main className="min-h-screen bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-900 flex flex-col overflow-x-hidden">
            {/* Hero Section with Headline, Subheadline, and CTA */}
            <SelectRegisterDrawer
                open={openRegister}
                setOpen={setOpenRegister}
            />
            <header className="mb-16 relative w-full h-80 sm:h-[500px] lg:h-[600px] flex items-stretch justify-center">
                {/* The MainSlider will fill the header height */}
                <div className="w-full ">
                    <MainSlider />
                </div>
                {/* Overlay for text readability */}
                {/* <div
                    className="absolute inset-0 bg-black/60 dark:bg-black/60 z-10 pointer-events-none"
                    aria-hidden="true"
                /> */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/65 dark:from-red-900/85 via-blue-800/65 dark:via-blue-800/75 to-yellow-900/60 dark:to-yellow-900/80 z-10 pointer-events-none" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4 w-full">
                    <h1 className="text-2xl md:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
                        Donate Blood, Save Lives
                    </h1>
                    <p className="md:text-2xl text-slate-100 font-medium mb-4 md:mb-8 max-w-2xl mx-auto drop-shadow">
                        Join our mission to provide a safe, reliable blood
                        supply for children and families in need. Every drop
                        counts.
                    </p>
                    <div className="flex flex-wrap justify-center gap-5">
                        <button
                            type="button"
                            className="cursor-pointer btn-blue-500 text-sm md:text-base flex-items-center justify-center md:min-w-48 text-blue-900 bg-[rgba(255,255,255,0.9)] rounded-2xl p-5 border shadow-[5px_5px_0px_0px_rgba(0,_0,_0,_0.5),inset_6px_6px_1px_1px_rgba(0,_0,_0,_0.3)] shadow-blue-800 hover:ring-1 hover:font-semibold"
                            onClick={() => setOpenRegister(true)}
                        >
                            <Handshake className="h-4 w-4 md:h-10 md:w-10" />{" "}
                            Join Us
                        </button>
                        <Link href="/donation-process">
                            <button
                                type="button"
                                className="cursor-pointer text-sm md:text-base flex-items-center justify-center md:min-w-48 text-blue-900 bg-[rgba(255,255,255,0.9)] rounded-2xl p-5 border shadow-[5px_5px_0px_0px_rgba(0,_0,_0,_0.5),inset_6px_6px_1px_1px_rgba(0,_0,_0,_0.3)] shadow-blue-800 hover:ring-1 hover:font-semibold"
                            >
                                <GiCycle className="h-4 w-4 md:h-10 md:w-10" />{" "}
                                Donation Process
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Streamlined Overview Section */}
            <section className="max-w-screen-xl w-full mx-auto flex flex-col lg:flex-row gap-10 items-center shadow p-6 rounded-xl bg-white/80 dark:bg-slate-800/80 mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex-1 text-justify text-slate-700 dark:text-slate-200 space-y-4"
                >
                    <h2 className="text-2xl md:text-4xl text-left font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="inline-block align-middle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c2.04 0 3.81 1.23 4.5 3.09C12.69 4.23 14.46 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                />
                            </svg>
                        </span>
                        Overview
                    </h2>
                    {/* <p className="text-lg text-slate-700 dark:text-slate-200 mb-4">
                        We are committed to saving and improving the lives of
                        children in need by empowering volunteer blood donors.
                        Our mobile platform makes blood donation simple,
                        accessible and meaningful – bridging compassion with
                        action.
                    </p> */}
                    <p className="text-base md:text-lg leading-relaxed">
                        The Pediatric Blood Center Mobile Blood Donation Portal
                        is a user-friendly, secure digital platform designed to
                        connect volunteer blood donors with pediatric patients
                        in need. Focused on convenience, safety, and community
                        engagement, this portal enables donors to easily
                        register, schedule, and track their donations, while
                        providing critical updates about pediatric blood needs.
                    </p>
                    <p className="text-base md:text-lg leading-relaxed">
                        Our center ensures every donation is safe, secure, and
                        reaches those who need it most. We are committed to
                        saving and improving the lives of children in need by
                        empowering volunteer blood donors. Our mobile platform
                        makes blood donation simple, accessible and meaningful –
                        bridging compassion with action.
                    </p>

                    <div className="text-right">
                        <Link href="/about-us">
                            <button className="btn btn-primary btn-lg shadow-lg px-8 py-3 text-base md:text-lg hover:scale-105 transition-transform">
                                Learn More About Us
                            </button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="h-96 w-full max-w-[700px] relative overflow-hidden rounded-xl shadow-lg group transition-all duration-700 hover:cursor-pointer flex items-center justify-center bg-gradient-to-br from-red-100 to-blue-100 dark:from-red-900 dark:to-blue-900"
                >
                    <Image
                        src="/slide1.png"
                        alt="PCMC Pediatric Blood Center"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-slate-800/80 rounded-lg px-4 py-2 shadow text-slate-800 dark:text-white text-sm font-semibold">
                        Inspiring hope, one drop at a time.
                    </div>
                </motion.div>
            </section>

            {/* Page Preview Sections */}
            <section className="max-w-screen-xl w-full mx-auto space-y-12 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="text-center"
                >
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Explore Our Services
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Discover everything you need to know about blood
                        donation and how you can make a difference.
                    </p>
                </motion.div>

                {/* About Us Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/3 relative h-64 lg:h-auto">
                            <Image
                                src="/donation-drive-7.JPG"
                                alt="About PCMC"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="lg:w-2/3 p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Heart className="h-8 w-8 text-red-500" />
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    About Us
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Learn about PCMC Pediatric Blood Center's
                                mission, history, and commitment to saving
                                children's lives through blood donation.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm">
                                    Our Mission
                                </span>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                    History
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                                    Team
                                </span>
                            </div>
                            <Link href="/about-us">
                                <button className="btn btn-outline btn-primary">
                                    Learn More About Us
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Why Donate Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col lg:flex-row-reverse">
                        <div className="lg:w-1/3 relative h-64 lg:h-auto">
                            <Image
                                src="/donation-drive-6.JPG"
                                alt="Why Donate"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="lg:w-2/3 p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="h-8 w-8 text-blue-500" />
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Why Donate
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Discover the impact of your donation and the
                                five compelling reasons why blood donation
                                matters for children and families.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm">
                                    Save Lives
                                </span>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                    Health Benefits
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                                    Community Impact
                                </span>
                            </div>
                            <Link href="/why-donate">
                                <button className="btn btn-outline btn-primary">
                                    Discover Why to Donate
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Donation Process Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/3 relative h-64 lg:h-auto">
                            <Image
                                src="/donation-drive-1.JPG"
                                alt="Donation Process"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="lg:w-2/3 p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="h-8 w-8 text-green-500" />
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Donation Process
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Follow our simple 7-step donation process. From
                                registration to recovery, we make blood donation
                                safe and comfortable.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm">
                                    7 Steps
                                </span>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                    Mobile App
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                                    Safety First
                                </span>
                            </div>
                            <Link href="/donation-process">
                                <button className="btn btn-outline btn-primary">
                                    View Donation Process
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Eligibility Requirements Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col lg:flex-row-reverse">
                        <div className="lg:w-1/3 relative h-64 lg:h-auto">
                            <Image
                                src="/blood-donation-img-4.jpg"
                                alt="Eligibility Requirements"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="lg:w-2/3 p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Eligibility Requirements
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Check if you're eligible to donate blood. Learn
                                about age requirements, health criteria, and
                                donation frequency guidelines.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm">
                                    Age Requirements
                                </span>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                    Health Criteria
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                                    Frequency
                                </span>
                            </div>
                            <Link href="/eligibility-requirements">
                                <button className="btn btn-outline btn-primary">
                                    Check Eligibility
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Success Stories Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/3 relative h-64 lg:h-auto">
                            <Image
                                src="/donation-drive-3.JPG"
                                alt="Success Stories"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="lg:w-2/3 p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Heart className="h-8 w-8 text-red-500" />
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Success Stories
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Read inspiring stories from donors and
                                recipients. See the real impact of blood
                                donation in our community.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm">
                                    Donor Stories
                                </span>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                    Recipient Stories
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                                    Community Impact
                                </span>
                            </div>
                            <Link href="/success-stories">
                                <button className="btn btn-outline btn-primary">
                                    Read Success Stories
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Us Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col lg:flex-row-reverse">
                        <div className="lg:w-1/3 relative h-64 lg:h-auto">
                            <Image
                                src="/pcmc-hospital-bg.jpg"
                                alt="Contact Us"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="lg:w-2/3 p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="h-8 w-8 text-blue-500" />
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Contact Us
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Get in touch with us. Find our location, contact
                                information, and office hours. We're here to
                                help.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm">
                                    Location
                                </span>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                    Contact Info
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                                    Office Hours
                                </span>
                            </div>
                            <Link href="/contact-us">
                                <button className="btn btn-outline btn-primary">
                                    Get in Touch
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Announcements Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="w-full"
                >
                    <div className="relative mx-auto bg-gradient-to-r from-red-100 via-yellow-50 to-blue-100 dark:from-red-900 dark:via-slate-800 dark:to-blue-900 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6 px-8 py-8 border-2 border-red-300 dark:border-red-700">
                        <div className="flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full bg-red-200 dark:bg-red-800 shadow-lg">
                            <MdBloodtype className="h-12 w-12" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2 justify-center md:justify-start">
                                <span>📢</span> Important Announcement
                            </h2>
                            <p className="text-slate-800 text-justify dark:text-slate-200 mb-4 text-base md:text-lg font-medium">
                                New community blood drives are launching this
                                month in collaboration with our partner
                                agencies. These events are exclusively available
                                to registered employees. Kindly coordinate with
                                your agency's blood drive coordinator for
                                schedules and registration.{" "}
                                <span className="font-semibold italic block">
                                    Be a hero—donate today and help save lives.
                                </span>
                            </p>
                            <div className="flex gap-4 justify-center flex-wrap">
                                <Link href="/login">
                                    <button
                                        type="button"
                                        className="btn btn-success btn-lg px-6 py-2 shadow-md hover:scale-105 transition-transform"
                                    >
                                        <LogIn /> Sign In
                                    </button>
                                </Link>
                                <button
                                    onClick={() => setOpenRegister(true)}
                                    type="button"
                                    className="btn btn-primary btn-lg px-6 py-2 shadow-md hover:scale-105 transition-transform"
                                >
                                    <Pen className="h-4 w-4" /> Register Now
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
