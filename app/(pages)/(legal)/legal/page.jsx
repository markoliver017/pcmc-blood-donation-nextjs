"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { ScrollArea } from "@components/ui/scroll-area";
import { Card, CardContent } from "@components/ui/card";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function LegalPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "terms";

    const handleTabChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("policy", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="max-w-5xl mx-auto my-5 px-2 md:px-5 py-10 shadow-lg/90 dark:shadow-gray-500">
            <h1 className="text-3xl font-bold mb-6">Legal Information</h1>

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
                            Effective Date: January 2025
                        </p>

                        <Card>
                            <CardContent className="space-y-6 text-sm md:text-base leading-relaxed p-6">
                                <p>
                                    Welcome to the{" "}
                                    <strong>
                                        PCMC Pediatric Blood Center - Medical
                                        Blood Donation Portal
                                    </strong>{" "}
                                    (“Portal”). By accessing, registering, or
                                    using any part of this platform, you agree
                                    to be bound by the following Terms and
                                    Conditions. Please read them carefully.
                                </p>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        1. Acceptance of Terms
                                    </h2>
                                    <p>
                                        By accessing this Portal, you agree to
                                        comply with and be legally bound by
                                        these Terms and Conditions, along with
                                        our Privacy Policy and any additional
                                        guidelines posted throughout the Portal.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        2. Eligibility
                                    </h2>
                                    <ul className="list-disc ml-6 space-y-1">
                                        <li>
                                            Must be a registered user (Donor,
                                            Host/Agency, or Admin).
                                        </li>
                                        <li>
                                            At least 18 years old (or with
                                            parental/legal consent).
                                        </li>
                                        <li>
                                            Medically qualified for donation
                                            based on screening.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        3. User Roles and Responsibilities
                                    </h2>

                                    <h3 className="font-medium mt-3">
                                        a. Donors
                                    </h3>
                                    <ul className="list-disc ml-6 space-y-1">
                                        <li>
                                            Provide accurate medical and contact
                                            information.
                                        </li>
                                        <li>
                                            Undergo verification and health
                                            screening.
                                        </li>
                                        <li>
                                            Follow donation schedule and
                                            process.
                                        </li>
                                    </ul>

                                    <h3 className="font-medium mt-3">
                                        b. Hosts/Agencies
                                    </h3>
                                    <ul className="list-disc ml-6 space-y-1">
                                        <li>
                                            Organize and manage blood drive
                                            events.
                                        </li>
                                        <li>
                                            Coordinate with donors and PCMC
                                            staff.
                                        </li>
                                        <li>
                                            Protect participant data
                                            confidentiality.
                                        </li>
                                    </ul>

                                    <h3 className="font-medium mt-3">
                                        c. Administrators
                                    </h3>
                                    <ul className="list-disc ml-6 space-y-1">
                                        <li>
                                            Moderate the platform and user
                                            access.
                                        </li>
                                        <li>
                                            Monitor and verify event and
                                            collection data.
                                        </li>
                                        <li>
                                            Ensure compliance with audit logs.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        4. Data Privacy and Security
                                    </h2>
                                    <p>
                                        Your personal and medical data is
                                        governed by the{" "}
                                        <strong>
                                            Data Privacy Act of 2012
                                        </strong>
                                        . All data is secured, role-restricted,
                                        and used strictly for blood donation
                                        activities and public health
                                        coordination.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        5. Portal Usage
                                    </h2>
                                    <p>
                                        You agree not to misuse the Portal. This
                                        includes:
                                    </p>
                                    <ul className="list-disc ml-6 space-y-1">
                                        <li>
                                            Submitting false or misleading
                                            information.
                                        </li>
                                        <li>
                                            Attempting to hack or
                                            reverse-engineer features.
                                        </li>
                                        <li>
                                            Uploading malicious content or
                                            software.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        6. Medical Disclaimer
                                    </h2>
                                    <p>
                                        The Portal does not provide medical
                                        advice. All eligibility and
                                        donation-related decisions are made by
                                        licensed PCMC medical professionals
                                        during actual screening.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        7. Intellectual Property
                                    </h2>
                                    <p>
                                        All content, code, and visual elements
                                        are the property of PCMC Pediatric Blood
                                        Center. Unauthorized use, copying, or
                                        distribution is prohibited.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        8. System Availability
                                    </h2>
                                    <p>
                                        We aim for continuous availability, but
                                        the system may undergo maintenance or
                                        face technical issues. Planned outages
                                        will be communicated in advance when
                                        possible.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        9. Modification of Terms
                                    </h2>
                                    <p>
                                        We may modify these Terms at any time.
                                        Continued use of the Portal after
                                        changes means you accept the updated
                                        terms.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        10. Termination
                                    </h2>
                                    <p>
                                        PCMC may suspend or revoke your access
                                        at any time due to violations or system
                                        security concerns.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        11. Contact Information
                                    </h2>
                                    <p>
                                        For questions, contact the development
                                        team at:
                                        <br />
                                        <span className="block">
                                            Email: support@pcmc.gov.ph
                                        </span>
                                        <span className="block">
                                            Phone: (02) XXX-XXXX
                                        </span>
                                        <span className="block">
                                            Hours: Mon–Fri, 8:00 AM – 5:00 PM
                                        </span>
                                    </p>
                                </div>

                                <div className="pt-6 border-t mt-8 text-sm text-neutral-500 dark:text-neutral-400">
                                    <p>
                                        By using this Portal, you acknowledge
                                        that you have read, understood, and
                                        agreed to these Terms and Conditions.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </ScrollArea>
                </TabsContent>

                {/* Privacy Policy */}
                <TabsContent value="privacy">
                    <ScrollArea className="h-[70vh] pr-4">
                        <h1 className="text-xl font-bold mb-4">
                            Privacy Policy
                        </h1>
                        <Card>
                            <CardContent className="space-y-6 text-sm md:text-base leading-relaxed p-6">
                                <p>
                                    The{" "}
                                    <strong>PCMC Pediatric Blood Center</strong>{" "}
                                    values your privacy and is committed to
                                    protecting your personal and health-related
                                    information in compliance with the Data
                                    Privacy Act of 2012.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    1. Information We Collect
                                </h2>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li>
                                        Personal details (name, birthdate,
                                        contact number, etc.)
                                    </li>
                                    <li>
                                        Medical data for eligibility and
                                        screening
                                    </li>
                                    <li>Appointment and donation history</li>
                                    <li>Agency or event-related affiliation</li>
                                </ul>

                                <h2 className="text-lg font-semibold">
                                    2. How We Use Your Information
                                </h2>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li>
                                        To verify and qualify you as a donor
                                    </li>
                                    <li>
                                        To schedule appointments and manage
                                        events
                                    </li>
                                    <li>
                                        For internal analytics and service
                                        improvements
                                    </li>
                                    <li>
                                        To notify you about donation events and
                                        status
                                    </li>
                                </ul>

                                <h2 className="text-lg font-semibold">
                                    3. Data Sharing
                                </h2>
                                <p>
                                    Your data may be shared with authorized PCMC
                                    personnel and partner agencies strictly for
                                    medical, operational, or public health
                                    purposes. We do not sell or disclose
                                    personal data to third parties for
                                    commercial use.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    4. Data Security
                                </h2>
                                <p>
                                    We use industry-standard security practices
                                    to protect your data including role-based
                                    access control, audit logs, and encrypted
                                    storage where applicable.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    5. Your Rights
                                </h2>
                                <p>
                                    You have the right to access, correct, or
                                    request deletion of your personal data. You
                                    may contact us at{" "}
                                    <strong>support@pcmc.gov.ph</strong> to make
                                    a request.
                                </p>

                                <p className="text-neutral-500 dark:text-neutral-400">
                                    Last Updated: January 2025
                                </p>
                            </CardContent>
                        </Card>
                    </ScrollArea>
                </TabsContent>

                {/* Consent Form */}
                <TabsContent value="consent">
                    <ScrollArea className="h-[70vh] pr-4">
                        <h1 className="text-xl font-bold mb-4">
                            Informed Consent for Blood Donation
                        </h1>
                        <Card>
                            <CardContent className="space-y-6 text-sm md:text-base leading-relaxed p-6">
                                <p>
                                    By registering on the{" "}
                                    <strong>
                                        PCMC Pediatric Blood Center – Medical
                                        Blood Donation Portal
                                    </strong>
                                    , I voluntarily provide my personal and
                                    health-related information for the purpose
                                    of participating in blood donation events.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    1. Acknowledgment
                                </h2>
                                <p>
                                    I understand that my information will be
                                    reviewed by authorized PCMC staff and used
                                    to determine my eligibility to donate blood.
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
                                    I understand that my data will be used to
                                    manage my appointments, track donations, and
                                    for medical compliance and reporting, as
                                    stated in the Privacy Policy.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    4. Voluntary Participation
                                </h2>
                                <p>
                                    I acknowledge that participation is
                                    voluntary, and I may withdraw from the
                                    process at any time before the actual blood
                                    donation.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    5. Risks
                                </h2>
                                <p>
                                    I understand that there are minimal risks
                                    involved with donating blood, including
                                    lightheadedness, bruising, or fainting, and
                                    I consent to proceed with awareness of
                                    these.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    6. Contact
                                </h2>
                                <p>
                                    For questions regarding this consent, I may
                                    contact the development or medical team at{" "}
                                    <strong>support@pcmc.gov.ph</strong>.
                                </p>

                                <p className="italic text-neutral-600 dark:text-neutral-400">
                                    By proceeding with the registration and
                                    booking an appointment, I confirm that I
                                    have read, understood, and agreed to this
                                    consent.
                                </p>

                                <p className="text-neutral-500 dark:text-neutral-400">
                                    Last Updated: January 2025
                                </p>
                            </CardContent>
                        </Card>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
}
