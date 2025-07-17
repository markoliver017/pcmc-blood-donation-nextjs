"use client";

import React from "react";

export default function TermsPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-10 text-sm md:text-base">
            <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
            <p className="text-neutral-600 mb-6">
                Effective Date: January 2025
            </p>

            <section className="space-y-6">
                <p>
                    Welcome to the{" "}
                    <strong>
                        PCMC Pediatric Blood Center - Medical Blood Donation
                        Portal
                    </strong>{" "}
                    (“Portal”). By accessing, registering, or using any part of
                    this platform, you agree to be bound by the following Terms
                    and Conditions. Please read them carefully.
                </p>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        1. Acceptance of Terms
                    </h2>
                    <p>
                        By accessing this Portal, you agree to comply with and
                        be legally bound by these Terms and Conditions, along
                        with our Privacy Policy and any additional guidelines
                        posted throughout the Portal.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        2. Eligibility
                    </h2>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>
                            Must be a registered user (Donor, Host/Agency, or
                            Admin).
                        </li>
                        <li>
                            At least 18 years old (or with parental/legal
                            consent).
                        </li>
                        <li>
                            Medically qualified for donation based on screening.
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        3. User Roles and Responsibilities
                    </h2>

                    <h3 className="font-medium mt-3">a. Donors</h3>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>
                            Provide accurate medical and contact information.
                        </li>
                        <li>Undergo verification and health screening.</li>
                        <li>Follow donation schedule and process.</li>
                    </ul>

                    <h3 className="font-medium mt-3">b. Hosts/Agencies</h3>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>Organize and manage blood drive events.</li>
                        <li>Coordinate with donors and PCMC staff.</li>
                        <li>Protect participant data confidentiality.</li>
                    </ul>

                    <h3 className="font-medium mt-3">c. Administrators</h3>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>Moderate the platform and user access.</li>
                        <li>Monitor and verify event and collection data.</li>
                        <li>Ensure compliance with audit logs.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        4. Data Privacy and Security
                    </h2>
                    <p>
                        Your personal and medical data is governed by the{" "}
                        <strong>Data Privacy Act of 2012</strong>. All data is
                        secured, role-restricted, and used strictly for blood
                        donation activities and public health coordination.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        5. Portal Usage
                    </h2>
                    <p>You agree not to misuse the Portal. This includes:</p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>Submitting false or misleading information.</li>
                        <li>
                            Attempting to hack or reverse-engineer features.
                        </li>
                        <li>Uploading malicious content or software.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        6. Medical Disclaimer
                    </h2>
                    <p>
                        The Portal does not provide medical advice. All
                        eligibility and donation-related decisions are made by
                        licensed PCMC medical professionals during actual
                        screening.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        7. Intellectual Property
                    </h2>
                    <p>
                        All content, code, and visual elements are the property
                        of PCMC Pediatric Blood Center. Unauthorized use,
                        copying, or distribution is prohibited.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        8. System Availability
                    </h2>
                    <p>
                        We aim for continuous availability, but the system may
                        undergo maintenance or face technical issues. Planned
                        outages will be communicated in advance when possible.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        9. Modification of Terms
                    </h2>
                    <p>
                        We may modify these Terms at any time. Continued use of
                        the Portal after changes means you accept the updated
                        terms.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        10. Termination
                    </h2>
                    <p>
                        PCMC may suspend or revoke your access at any time due
                        to violations or system security concerns.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        11. Contact Information
                    </h2>
                    <p>
                        For questions, contact the development team at:
                        <br />
                        <span className="block">
                            Email: support@pcmc.gov.ph
                        </span>
                        <span className="block">Phone: (02) XXX-XXXX</span>
                        <span className="block">
                            Hours: Mon–Fri, 8:00 AM – 5:00 PM
                        </span>
                    </p>
                </div>

                <div className="pt-6 border-t mt-8 text-sm text-neutral-500">
                    <p>
                        By using this Portal, you acknowledge that you have
                        read, understood, and agreed to these Terms and
                        Conditions.
                    </p>
                </div>
            </section>
        </div>
    );
}
