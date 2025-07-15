"use client";
import HeroSection from "@components/pages/SuccessStories/HeroSection";
import StoriesGrid from "@components/pages/SuccessStories/StoriesGrid";
import TestimonialCard from "@components/pages/SuccessStories/TestimonialCard";
import ImpactMetrics from "@components/pages/SuccessStories/ImpactMetrics";
import CommunitySpotlight from "@components/pages/SuccessStories/CommunitySpotlight";
import BreadcrumbNav from "@components/pages/shared/BreadcrumbNav";
import CallToAction from "@components/pages/shared/CallToAction";
import SelectRegisterDrawer from "../SelectRegisterDrawer";
import useRegistration from "@components/pages/shared/useRegistration";

export default function SuccessStoriesPage() {
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
                    { label: "Home", href: "/" },
                    { label: "Success Stories", href: "/success-stories", current: true },
                ]}
                variant="light"
            /> */}

            {/* Hero Section */}
            <HeroSection />

            {/* Featured Success Stories */}
            <StoriesGrid />

            {/* Testimonials */}
            <TestimonialCard onOpenRegister={() => setOpenRegister(true)} />

            {/* Impact Metrics */}
            <ImpactMetrics onOpenRegister={() => setOpenRegister(true)} />

            {/* Community Spotlight */}
            <CommunitySpotlight onOpenRegister={() => setOpenRegister(true)} />

            {/* Call to Action */}
            <CallToAction
                title="Be Part of Our Success Story"
                subtitle="Join our community of donors and become part of the next success story. Your donation could be the one that saves a child's life."
                primaryButton={{
                    text: "Join Our Community",
                    onClick: () => setOpenRegister(true),
                }}
                secondaryButton={{
                    text: "Learn More",
                    href: "/contact-us",
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            />
        </main>
    );
}
