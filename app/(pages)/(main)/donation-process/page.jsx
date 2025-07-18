"use client";
import {
    HeroSection,
    ProcessTimeline,
    FAQSection,
    SafetySection,
} from "@components/pages/DonationProcess";
import { CallToAction } from "@components/pages/shared";
import SelectRegisterDrawer from "../SelectRegisterDrawer";
import useRegistration from "@components/pages/shared/useRegistration";

export default function DonationProcessPage() {
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
                    {
                        label: "Donation Process",
                        href: "/donation-process",
                        current: true,
                    },
                ]}
                variant="light"
            /> */}

            {/* Hero Section */}
            <HeroSection onOpenRegister={() => setOpenRegister(true)} />

            {/* Process Timeline */}
            <ProcessTimeline onOpenRegister={() => setOpenRegister(true)} />

            {/* Safety Section */}
            <SafetySection onOpenRegister={() => setOpenRegister(true)} />

            {/* FAQ Section */}
            <FAQSection onOpenRegister={() => setOpenRegister(true)} />

            {/* Call to Action */}
            <CallToAction
                title="Ready to Start Your Donation Journey?"
                subtitle="Now that you understand the process, take the next step and schedule your blood donation. Your donation will save lives within days."
                primaryButton={{
                    text: "Schedule Donation",
                    onClick: () => setOpenRegister(true),
                }}
                secondaryButton={{
                    text: "Learn About Eligibility",
                    href: "/eligibility-requirements",
                }}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white"
            />
        </main>
    );
}
