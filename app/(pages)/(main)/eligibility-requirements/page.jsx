"use client";
import HeroSection from "@components/pages/EligibilityRequirements/HeroSection";
import RequirementsChecklist from "@components/pages/EligibilityRequirements/RequirementsChecklist";
import MedicalRequirements from "@components/pages/EligibilityRequirements/MedicalRequirements";
import EligibilityQuiz from "@components/pages/EligibilityRequirements/EligibilityQuiz";
import FrequencyInfo from "@components/pages/EligibilityRequirements/FrequencyInfo";
import BreadcrumbNav from "@components/pages/shared/BreadcrumbNav";
import CallToAction from "@components/pages/shared/CallToAction";
import SelectRegisterDrawer from "../SelectRegisterDrawer";
import useRegistration from "@components/pages/shared/useRegistration";

export default function EligibilityRequirementsPage() {
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
                    {
                        label: "Eligibility Requirements",
                        href: "/eligibility-requirements",
                        current: true,
                    },
                ]}
                variant="light"
            /> */}

            {/* Hero Section */}
            <HeroSection />

            {/* Requirements Checklist */}
            <RequirementsChecklist />

            {/* Medical Requirements */}
            <MedicalRequirements />

            {/* Interactive Eligibility Quiz */}
            <EligibilityQuiz />

            {/* Donation Frequency Information */}
            <FrequencyInfo onOpenRegister={() => setOpenRegister(true)} />

            {/* Call to Action */}
            <CallToAction
                title="Ready to Check Your Eligibility?"
                subtitle="Take our quick eligibility quiz and start your journey as a blood donor. Your donation could save a child's life today."
                primaryButton={{
                    text: "Sign Up Now",
                    onClick: () => setOpenRegister(true),
                }}
                secondaryButton={{
                    text: "Learn More",
                    href: "/success-stories",
                }}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
            />
        </main>
    );
}
