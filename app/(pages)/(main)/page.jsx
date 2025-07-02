"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import MainSlider from "./Slider";
import { useState } from "react";
import SelectRegisterDrawer from "./SelectRegisterDrawer";
import { Handshake } from "lucide-react";
import { GiCycle } from "react-icons/gi";

export default function Page() {
    const [openRegister, setOpenRegister] = useState(false);

    return (
        <main className="min-h-screen bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-900 flex flex-col overflow-x-hidden">
            {/* Hero Section with Headline, Subheadline, and CTA */}
            <SelectRegisterDrawer
                open={openRegister}
                setOpen={setOpenRegister}
            />
            <header className="mb-16 relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex items-stretch justify-center">
                {/* The MainSlider will fill the header height */}
                <div className="w-full h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
                    <MainSlider />
                </div>
                {/* Overlay for text readability */}
                <div
                    className="absolute inset-0 bg-black/60 dark:bg-black/60 z-10 pointer-events-none"
                    aria-hidden="true"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4 w-full">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
                        Donate Blood, Save Lives
                    </h1>
                    <p className="text-lg sm:text-2xl text-slate-100 font-medium mb-8 max-w-2xl mx-auto drop-shadow">
                        Join our mission to provide a safe, reliable blood
                        supply for children and families in need. Every drop
                        counts.
                    </p>
                    {/* TODO: Link this CTA to registration or info section */}
                    <div className="flex gap-5">
                        <button
                            type="button"
                            className="cursor-pointer btn-blue-500 flex-items-center justify-center min-w-48 text-blue-900 bg-[rgba(255,255,255,0.9)] rounded-2xl p-5 border shadow-[5px_5px_0px_0px_rgba(0,_0,_0,_0.5),inset_6px_6px_1px_1px_rgba(0,_0,_0,_0.3)] shadow-blue-800 hover:ring-1 hover:font-semibold"
                            onClick={() => setOpenRegister(true)}
                        >
                            <Handshake className="h-10 w-10" /> Join Us
                        </button>
                        <button
                            type="button"
                            className="cursor-pointer flex-items-center text-blue-900 bg-[rgba(255,255,255,0.9)] rounded-2xl p-5 border shadow-[5px_5px_0px_0px_rgba(0,_0,_0,_0.5),inset_6px_6px_1px_1px_rgba(0,_0,_0,_0.3)] shadow-blue-800 hover:ring-1 hover:font-semibold"
                        >
                            <GiCycle className="h-10 w-10" /> Donation Process
                        </button>
                    </div>
                </div>
            </header>

            {/* Overview Section */}
            <section className="max-w-screen-xl w-full mx-auto flex flex-col lg:flex-row gap-10 items-center shadow p-6 rounded-xl bg-white/80 dark:bg-slate-800/80 mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex-1 text-justify text-slate-700 dark:text-slate-200 space-y-4"
                >
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="inline-block align-middle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c2.04 0 3.81 1.23 4.5 3.09C12.69 4.23 14.46 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        </span>
                        Overview
                    </h2>
                    <ul className="space-y-3 mb-4">
                        <li className="flex items-start gap-3">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 dark:bg-red-900">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                            </span>
                            <span>Blood donation saves lives every day, providing hope and healing to those in need. <span className="font-semibold">Your generosity makes a difference.</span></span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 0h-1V8h-1m-4 8h.01" /></svg>
                            </span>
                            <span>Our center ensures every donation is safe, secure, and reaches those who need it most.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 dark:bg-green-900">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            <span>Join a community of heroes—donate blood and help us build a healthier future for all.</span>
                        </li>
                    </ul>
                    <div className="text-right">
                        {/* Step 3 - Make this button visually distinct and link to details */}
                        <a href="#details" className="inline-block">
                            <button className="btn btn-primary btn-lg shadow-lg px-8 py-3 text-lg animate-bounce">
                                Read More ...
                            </button>
                        </a>
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
                        alt="Overview Image"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-slate-800/80 rounded-lg px-4 py-2 shadow text-slate-800 dark:text-white text-sm font-semibold">
                        Inspiring hope, one drop at a time.
                    </div>
                </motion.div>
            </section>

            {/* Mission Section */}
            <section className="max-w-screen-xl w-full mx-auto space-y-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative px-4 py-10 bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-red-900 dark:via-slate-900 dark:to-blue-900 rounded-2xl shadow-lg border border-red-100 dark:border-red-800"
                >
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-red-700 dark:text-red-300 mb-2 flex items-center gap-3">
                            <span className="inline-block align-middle animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c2.04 0 3.81 1.23 4.5 3.09C12.69 4.23 14.46 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                            </span>
                            Our Mission
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 rounded-full mb-4" />
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-center max-w-3xl mx-auto text-slate-700 dark:text-slate-200 mb-2 text-lg sm:text-xl font-semibold drop-shadow"
                        >
                            We unite our community to give hope, health, and second chances—one drop at a time. Every donation is a promise of life for a child in need.
                        </motion.p>
                    </div>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {[
                        {
                            title: "Donation Drives",
                            icon: (
                                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                                </span>
                            ),
                            desc: "Join our regular blood drives and help us reach more patients in need. Every event is a chance to save lives.",
                            image: "/blood-donation-img-4.jpg",
                            button: "Donation Drives",
                        },
                        {
                            title: "Blood Donor App",
                            icon: (
                                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                </span>
                            ),
                            desc: "Track your donations, book appointments, and stay updated—all from your phone. Giving blood has never been easier.",
                            image: "/mobile-app.jpeg",
                            button: "Blood Donor App",
                        },
                        {
                            title: "Education & Awareness",
                            icon: (
                                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0H3" /></svg>
                                </span>
                            ),
                            desc: "Learn about the importance of blood donation and how you can make a lasting impact in your community.",
                            image: "/blood-donation-img1.jpg",
                            button: "Learn More",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md group transition-all duration-700 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-red-400 dark:hover:ring-red-600 cursor-pointer w-full"
                        >
                            <div className="relative h-60 w-full flex items-center justify-center">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 z-10">
                                    {item.icon}
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                                    {item.title}
                                </h3>
                                <p className="mb-4 text-slate-600 dark:text-slate-300 text-sm min-h-[48px]">{item.desc}</p>
                                <button className="btn btn-outline btn-primary w-full transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                                    {item.button}
                                </button>
                                <SelectRegisterDrawer
                                    open={openRegister}
                                    setOpen={setOpenRegister}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Announcements Section */}
            <section className="max-w-screen-xl w-full mx-auto py-10 mb-16 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="w-full"
                >
                    <div className="relative mx-auto max-w-3xl bg-gradient-to-r from-red-100 via-yellow-50 to-blue-100 dark:from-red-900 dark:via-slate-800 dark:to-blue-900 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6 px-8 py-8 border-2 border-red-300 dark:border-red-700">
                        <div className="flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full bg-red-200 dark:bg-red-800 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600 dark:text-red-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 0h-1V8h-1m-4 8h.01" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2 justify-center md:justify-start">
                                <span>📢</span> Important Announcement
                            </h2>
                            <p className="text-slate-800 dark:text-slate-200 mb-4 text-base md:text-lg font-medium">
                                New community blood drives are launching this month! Check your Blood Donor App for schedules and locations near you. <span className="font-semibold">Be a hero—donate today!</span>
                            </p>
                            <a href="#" className="inline-block">
                                <button className="btn btn-primary btn-sm px-6 py-2 shadow-md hover:scale-105 transition-transform">
                                    View Events
                                </button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>
            {/* TODO: Step 7 - Add navigation bar and footer */}
        </main>
    );
}
