"use client";

import { Card, CardContent } from "@components/ui/card";

export default function ConsentPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-4">
                Informed Consent for Blood Donation
            </h1>
            <Card>
                <CardContent className="space-y-6 text-sm md:text-base leading-relaxed p-6">
                    <p>
                        By registering on the{" "}
                        <strong>
                            PCMC Pediatric Blood Center – Medical Blood Donation
                            Portal
                        </strong>
                        , I voluntarily provide my personal and health-related
                        information for the purpose of participating in blood
                        donation events.
                    </p>

                    <h2 className="text-lg font-semibold">1. Acknowledgment</h2>
                    <p>
                        I understand that my information will be reviewed by
                        authorized PCMC staff and used to determine my
                        eligibility to donate blood.
                    </p>

                    <h2 className="text-lg font-semibold">
                        2. Medical Screening
                    </h2>
                    <p>
                        I consent to undergo pre-donation physical examination
                        and agree to answer all medical history questions
                        truthfully.
                    </p>

                    <h2 className="text-lg font-semibold">3. Data Usage</h2>
                    <p>
                        I understand that my data will be used to manage my
                        appointments, track donations, and for medical
                        compliance and reporting, as stated in the Privacy
                        Policy.
                    </p>

                    <h2 className="text-lg font-semibold">
                        4. Voluntary Participation
                    </h2>
                    <p>
                        I acknowledge that participation is voluntary, and I may
                        withdraw from the process at any time before the actual
                        blood donation.
                    </p>

                    <h2 className="text-lg font-semibold">5. Risks</h2>
                    <p>
                        I understand that there are minimal risks involved with
                        donating blood, including lightheadedness, bruising, or
                        fainting, and I consent to proceed with awareness of
                        these.
                    </p>

                    <h2 className="text-lg font-semibold">6. Contact</h2>
                    <p>
                        For questions regarding this consent, I may contact the
                        development or medical team at{" "}
                        <strong>support@pcmc.gov.ph</strong>.
                    </p>

                    <p className="italic text-neutral-600">
                        By proceeding with the registration and booking an
                        appointment, I confirm that I have read, understood, and
                        agreed to this consent.
                    </p>

                    <p className="text-neutral-500">
                        Last Updated: January 2025
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
