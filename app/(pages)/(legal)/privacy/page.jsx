"use client";

import { Card, CardContent } from "@components/ui/card";

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <Card>
                <CardContent className="space-y-6 text-sm md:text-base leading-relaxed p-6">
                    <p>
                        The <strong>PCMC Pediatric Blood Center</strong> values
                        your privacy and is committed to protecting your
                        personal and health-related information in compliance
                        with the Data Privacy Act of 2012.
                    </p>

                    <h2 className="text-lg font-semibold">
                        1. Information We Collect
                    </h2>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>
                            Personal details (name, birthdate, contact number,
                            etc.)
                        </li>
                        <li>Medical data for eligibility and screening</li>
                        <li>Appointment and donation history</li>
                        <li>Agency or event-related affiliation</li>
                    </ul>

                    <h2 className="text-lg font-semibold">
                        2. How We Use Your Information
                    </h2>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>To verify and qualify you as a donor</li>
                        <li>To schedule appointments and manage events</li>
                        <li>For internal analytics and service improvements</li>
                        <li>To notify you about donation events and status</li>
                    </ul>

                    <h2 className="text-lg font-semibold">3. Data Sharing</h2>
                    <p>
                        Your data may be shared with authorized PCMC personnel
                        and partner agencies strictly for medical, operational,
                        or public health purposes. We do not sell or disclose
                        personal data to third parties for commercial use.
                    </p>

                    <h2 className="text-lg font-semibold">4. Data Security</h2>
                    <p>
                        We use industry-standard security practices to protect
                        your data including role-based access control, audit
                        logs, and encrypted storage where applicable.
                    </p>

                    <h2 className="text-lg font-semibold">5. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or request
                        deletion of your personal data. You may contact us at{" "}
                        <strong>support@pcmc.gov.ph</strong> to make a request.
                    </p>

                    <p className="text-neutral-500">
                        Last Updated: January 2025
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
