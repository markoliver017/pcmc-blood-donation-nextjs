"use client";
import { motion } from "framer-motion";
import {
    HeroSection,
    StatisticsCards,
    ReasonsGrid,
    ImpactStories,
    HealthBenefits,
} from "@components/pages/WhyDonate";
import { BreadcrumbNav, CallToAction } from "@components/pages/shared";
import SelectRegisterDrawer from "../SelectRegisterDrawer";
import useRegistration from "@components/pages/shared/useRegistration";

export default function WhyDonatePage() {
    const { openRegister, setOpenRegister } = useRegistration();

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <SelectRegisterDrawer
                open={openRegister}
                setOpen={setOpenRegister}
            />
            {/* Breadcrumb Navigation */}
            {/* <BreadcrumbNav
                items={[
                    { label: "Why Donate", href: "/why-donate", current: true },
                ]}
                variant="light"
            /> */}

            {/* Hero Section */}
            <HeroSection onOpenRegister={() => setOpenRegister(true)} />

            {/* Statistics Cards */}
            <StatisticsCards onOpenRegister={() => setOpenRegister(true)} />

            {/* Reasons Grid */}
            <ReasonsGrid onOpenRegister={() => setOpenRegister(true)} />

            {/* Impact Stories */}
            {/* <ImpactStories onOpenRegister={() => setOpenRegister(true)} /> */}

            {/* Health Benefits */}
            <HealthBenefits onOpenRegister={() => setOpenRegister(true)} />

            {/* Call to Action */}
            <CallToAction
                title="Ready to Make a Difference?"
                subtitle="Join thousands of donors who are already saving lives. Your donation could be the difference between life and death for a child in need."
                primaryButton={{
                    text: "Start Donating",
                    onClick: () => setOpenRegister(true),
                }}
                secondaryButton={{
                    text: "Learn More",
                    href: "/eligibility-requirements",
                }}
                className="bg-gradient-to-r from-red-600 to-blue-600 text-white"
            />
        </main>
    );
}
