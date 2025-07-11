"use client";
import { BreadcrumbNav, CallToAction } from "@components/pages/shared";
import HeroSection from "@components/pages/AboutUs/HeroSection";
import MissionSection from "@components/pages/AboutUs/MissionSection";
import FeaturesGrid from "@components/pages/AboutUs/FeaturesGrid";
import TimelineSection from "@components/pages/AboutUs/TimelineSection";
import TeamSection from "@components/pages/AboutUs/TeamSection";
import useRegistration from "@components/pages/shared/useRegistration";
import SelectRegisterDrawer from "../SelectRegisterDrawer";

export default function AboutUsPage() {
    const { openRegister, setOpenRegister } = useRegistration();
    return (
        <main className="space-y-10 min-h-screen bg-white dark:bg-gray-900">
            <SelectRegisterDrawer
                open={openRegister}
                setOpen={setOpenRegister}
            />
            {/* Breadcrumb Navigation */}
            {/* <BreadcrumbNav
                items={[
                    { label: "About Us", href: "/about-us", current: true },
                ]}
            /> */}

            {/* Hero Section */}
            <HeroSection />

            {/* Overview Section */}
            <section
                id="overview"
                className="max-w-screen-xl mt-5 w-full mx-auto flex flex-col lg:flex-row gap-10 items-center shadow p-6 rounded-xl bg-white/80 dark:bg-slate-800/80 mb-16"
            >
                <div className="flex-1 text-justify text-slate-700 dark:text-slate-200 space-y-4">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
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
                    <p className="text-lg leading-relaxed">
                        The Pediatric Blood Center Mobile Blood Donation Portal
                        is a user-friendly, secure digital platform designed to
                        connect volunteer blood donors with pediatric patients
                        in need. Focused on convenience, safety, and community
                        engagement, this mobile portal enables donors to easily
                        register, schedule, and track their donations, while
                        providing critical updates about pediatric blood needs.
                    </p>
                    <p className="text-lg leading-relaxed">
                        Our center ensures every donation is safe, secure, and
                        reaches those who need it most. We are committed to
                        saving and improving the lives of children in need by
                        empowering volunteer blood donors. Our mobile platform
                        makes blood donation simple, accessible and meaningful –
                        bridging compassion with action.
                    </p>
                </div>

                <div className="h-96 w-full max-w-[700px] relative overflow-hidden rounded-xl shadow-lg group transition-all duration-700 hover:cursor-pointer flex items-center justify-center bg-gradient-to-br from-red-100 to-blue-100 dark:from-red-900 dark:to-blue-900">
                    <img
                        src="/pcmc-building.png"
                        alt="PCMC Building"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 w-full h-full"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-slate-800/80 rounded-lg px-4 py-2 shadow text-slate-800 dark:text-white text-sm font-semibold">
                        PCMC Pediatric Blood Center
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <MissionSection />

            {/* Key Features Grid */}
            <FeaturesGrid />

            {/* Timeline Section */}
            <TimelineSection />

            {/* Team Section */}
            <TeamSection />

            {/* Call to Action */}
            <CallToAction
                title="Join Our Mission"
                subtitle="Be part of our life-saving community and help us provide safe blood for children in need."
                // primaryButtonText="Register as Donor"
                primaryButton={{
                    text: "Start Donating",
                    onClick: () => setOpenRegister(true),
                }}
                secondaryButtonText="Learn More"
                secondaryButton={{
                    text: "Learn More",
                    href: "/donation-process",
                }}
                variant="hero"
            />
        </main>
    );
}
