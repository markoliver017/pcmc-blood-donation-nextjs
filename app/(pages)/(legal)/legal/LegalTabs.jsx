"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { ScrollArea } from "@components/ui/scroll-area";
import { Card, CardContent } from "@components/ui/card";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function LegalTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "terms";

    const handleTabChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("policy", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <Tabs
            defaultValue={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
        >
            <TabsList className="mb-6">
                <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                <TabsTrigger value="consent">Consent Form</TabsTrigger>
            </TabsList>

            {/* Terms & Conditions */}
            <TabsContent value={"terms"}>
                <ScrollArea className="h-[70vh] pr-4">
                    <h1 className="text-xl font-bold mb-4">
                        Terms and Conditions
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Effective Date: August 2025
                    </p>

                    <Card>
                        <CardContent className="space-y-6 text-sm md:text-base leading-relaxed p-6">
                            <p>
                                Welcome to the{" "}
                                <strong>
                                    PCMC Pediatric Blood Center - Medical Blood
                                    Donation Portal.
                                </strong>{" "}
                                By accessing, registering, or using any part of
                                this platform, you agree to be bound by the
                                following Terms and Conditions. Please read them
                                carefully.
                            </p>

                            <div>
                                <h2 className="text-xl font-semibold mb-2">
                                    1. Acceptance of Terms
                                </h2>
                                <p>
                                    By accessing this Portal, you agree to
                                    comply with and be legally bound by these
                                    Terms and Conditions, along with our Privacy
                                    Policy and any additional guidelines posted
                                    throughout the Portal.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-2">
                                    2. Eligibility
                                </h2>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li>
                                        Must be a registered user (Donor,
                                        Agency/Coordinator, or Admin).
                                    </li>
                                    <li>
                                        At least 18 years old (or with
                                        parental/legal consent).
                                    </li>
                                    <li>
                                        Medically qualified for donation based
                                        on screening.
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </TabsContent>

            {/* Privacy Policy */}
            <TabsContent value={"privacy"}>
                <ScrollArea className="h-[70vh] pr-4">
                    <h1 className="text-xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Last Updated: August 2025
                    </p>

                    <Card>
                        <CardContent className="space-y-6 text-sm md:text-base leading-relaxed p-6">
                            <p>
                                This Privacy Policy outlines how the PCMC
                                Pediatric Blood Center (“we,” “us,” “our”)
                                collects, uses, protects, and discloses your
                                personal and medical information when you use
                                our Blood Donation Portal.
                            </p>

                            <h2 className="text-lg font-semibold">
                                1. Information We Collect
                            </h2>
                            <p>
                                We may collect the following types of
                                information:
                            </p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>
                                    <strong>Personal Information:</strong> Name,
                                    contact details, date of birth, gender, and
                                    other identifiers.
                                </li>
                                <li>
                                    <strong>Medical Information:</strong> Blood
                                    type, donation history, health questionnaire
                                    responses, and physical examination results.
                                </li>
                                <li>
                                    <strong>Technical Data:</strong> IP address,
                                    browser type, and usage patterns collected
                                    via cookies.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </TabsContent>

            {/* Consent Form */}
            <TabsContent value={"consent"}>
                <ScrollArea className="h-[70vh] pr-4">
                    <h1 className="text-xl font-bold mb-4">
                        Donor Consent Form
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Please read this consent form carefully before
                        proceeding.
                    </p>

                    <Card>
                        <CardContent className="space-y-6 text-sm md:text-base leading-relaxed p-6">
                            <p>
                                This form confirms your voluntary agreement to
                                donate blood and your understanding of the
                                process. Your consent is essential for ensuring
                                a safe and transparent experience for both you
                                and the recipients of your generous donation.
                            </p>

                            <p>
                                By giving your consent, you acknowledge that you
                                have provided truthful information about your
                                health and medical history. This is crucial for
                                protecting your own health and ensuring the
                                safety of the blood supply. We are committed to
                                maintaining the confidentiality of your
                                information in accordance with our Privacy
                                Policy.
                            </p>

                            <p>
                                Your decision to donate can save lives, and we
                                are grateful for your willingness to be part of
                                this life-saving mission. Thank you for your
                                trust and for taking the time to review this
                                consent, which is a vital step in the process of
                                participating in blood donation events.
                            </p>

                            <h2 className="text-lg font-semibold">
                                1. Acknowledgment
                            </h2>
                            <p>
                                I understand that my information will be
                                reviewed by authorized PCMC staff and used to
                                determine my eligibility to donate blood.
                            </p>

                            <h2 className="text-lg font-semibold">
                                2. Medical Screening
                            </h2>
                            <p>
                                I consent to undergo pre-donation physical
                                examination and agree to answer all medical
                                history questions truthfully.
                            </p>

                            <h2 className="text-lg font-semibold">
                                3. Data Usage
                            </h2>
                            <p>
                                I understand that my data will be used to manage
                                my appointments, track donations, and for
                                medical compliance and reporting, as stated in
                                the Privacy Policy.
                            </p>

                            <h2 className="text-lg font-semibold">
                                4. Voluntary Participation
                            </h2>
                            <p>
                                I acknowledge that participation is voluntary,
                                and I may withdraw from the process at any time
                                before the actual blood donation.
                            </p>

                            <h2 className="text-lg font-semibold">5. Risks</h2>
                            <p>
                                I understand that there are minimal risks
                                involved with donating blood, including
                                lightheadedness, bruising, or fainting, and I
                                consent to proceed with awareness of these.
                            </p>

                            <h2 className="text-lg font-semibold">
                                6. Contact
                            </h2>
                            <p>
                                For questions regarding this consent, I may
                                contact the development or medical team at{" "}
                                <strong>pcmcpedbcmbd@gmail.com</strong>.
                            </p>

                            <p className="italic text-neutral-600 dark:text-neutral-400">
                                By proceeding with the registration and booking
                                an appointment, I confirm that I have read,
                                understood, and agreed to this consent.
                            </p>

                            <p className="text-neutral-500 dark:text-neutral-400">
                                Last Updated: August 2025
                            </p>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    );
}
