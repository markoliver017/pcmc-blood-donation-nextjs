"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import MainSlider from "./Slider";

export default function Page() {
    return (
        <div className="space-y-20 px-4 sm:px-10 py-10 bg-gradient-to-r from-gray-300 to-gray-200">
            {/* Hero Section / Slider */}
            <MainSlider />

            {/* Overview Section */}
            <motion.section className="flex flex-col lg:flex-row gap-10 items-center shadow p-2 rounded">
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex-1 text-justify text-slate-700 dark:text-slate-200 space-y-4"
                >
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                        Overview
                    </h2>
                    <p>
                        Blood donation is a vital community service, enabling
                        medical treatments for millions. Our blood center
                        ensures every donation is processed and delivered to
                        those who need it most.
                    </p>
                    <p>
                        Join thousands of generous individuals who help save
                        lives every day through simple yet impactful donations.
                    </p>
                    <p>
                        Your contribution goes beyond the moment—it can give
                        someone a second chance at life.
                    </p>
                    <div className="text-right">
                        <button className="btn btn-primary">
                            Read More ...
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="h-96 w-full lg:w-[700px] relative overflow-hidden rounded-xl shadow-lg group transition-all duration-700 hover:cursor-pointer"
                >
                    <Image
                        src="/slide1.png"
                        alt="Overview Image"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </motion.div>
            </motion.section>

            {/* Mission Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
                className="space-y-8"
            >
                <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white">
                    Our Mission
                </h2>

                <p className="text-center max-w-7xl mx-auto text-slate-600 dark:text-slate-300">
                    To provide a safe, accessible, and reliable blood supply
                    through community outreach, innovation, and donor-centered
                    services. Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Porro officiis cum quam maxime similique veritatis
                    adipisci fuga asperiores natus exercitationem atque vel
                    fugiat, in quisquam quas dignissimos rerum cumque deleniti
                    ipsam. Architecto quis cupiditate minima voluptate ratione,
                    quia nobis eligendi. Ipsa voluptatibus soluta distinctio cum
                    nam. Quidem ipsum nesciunt nisi?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    {[
                        {
                            title: "Donation Drives",
                            image: "/blood-donation-img-4.jpg",
                            button: "Donation Drives",
                        },
                        {
                            title: "Blood Donor App",
                            image: "/mobile-app.jpeg",
                            button: "Blood Donor App",
                        },
                        {
                            title: "Learn More",
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
                            className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md group transition-all duration-700 hover:cursor-pointer"
                        >
                            <div className="relative h-60 w-full">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-4 text-center">
                                <button className="btn w-full">
                                    {item.button}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Announcements Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
                className="bg-slate-100 dark:bg-slate-900 py-10 rounded-xl shadow-inner"
            >
                <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-4">
                    Announcements
                </h2>
                <p className="text-center max-w-7xl mx-auto text-slate-700 dark:text-slate-300">
                    📢 We’re launching new community blood drives this month
                    across several cities. Check your Blood Donor App for
                    schedules and locations near you! Lorem ipsum dolor sit,
                    amet consectetur adipisicing elit. Esse quis ratione laborum
                    dolor, architecto praesentium. Lorem ipsum dolor, sit amet
                    consectetur adipisicing elit. Fugit deserunt asperiores
                    impedit, rerum eveniet a? Natus ratione asperiores
                    repudiandae deleniti!
                </p>
            </motion.section>
        </div>
    );
}
