"use server";

import { auth } from "@lib/auth";
import {
    Donor,
    User,
    BloodType,
    Agency,
    BloodDonationCollection,
    BloodDonationEvent,
} from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";

export async function generateDonorIdPdf() {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        // Fetch donor data with associations
        const donor = await Donor.findOne({
            where: { user_id: session.user.id },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "first_name",
                        "middle_name",
                        "last_name",
                        "full_name",
                        "gender",
                        "image",
                        "email",
                    ],
                },
                {
                    model: BloodType,
                    as: "blood_type",
                    required: false,
                    attributes: ["blood_type"],
                },
                {
                    model: Agency,
                    as: "agency",
                    required: false,
                    attributes: ["name"],
                },
            ],
        });

        if (!donor) {
            return {
                success: false,
                message: "Donor record not found.",
            };
        }

        // Fetch 10 most recent blood donations
        const bloodDonations = await BloodDonationCollection.findAll({
            where: { donor_id: donor.id },
            include: [
                {
                    model: BloodDonationEvent,
                    as: "event",
                    attributes: ["date", "title"],
                },
            ],
            attributes: ["volume", "createdAt"],
            order: [["createdAt", "DESC"]],
            limit: 10,
        });

        const donorData = formatSeqObj(donor);
        const donationsData = formatSeqObj(bloodDonations);

        // Generate HTML for PDF
        const html = generateDonorIdHtml(donorData, donationsData);

        // Call the generate-pdf API
        const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/generate-pdf`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ html }),
            }
        );

        if (!response.ok) {
            return {
                success: false,
                message: "PDF generation failed",
            };
        }

        const pdfBuffer = await response.arrayBuffer();
        const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

        return {
            success: true,
            data: {
                pdf: base64Pdf,
                filename: `donor-id-${
                    donorData.donor_reference_id || "card"
                }.pdf`,
            },
        };
    } catch (error) {
        console.error("Error generating donor ID PDF:", error);
        return {
            success: false,
            message: "Failed to generate PDF. Please try again later.",
        };
    }
}

function generateDonorIdHtml(donor, donations = []) {
    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "activated":
                return "background-color: #dcfce7; color: #166534;";
            case "for approval":
                return "background-color: #fef3c7; color: #92400e;";
            case "deactivated":
                return "background-color: #fecaca; color: #991b1b;";
            case "rejected":
                return "background-color: #fecaca; color: #991b1b;";
            default:
                return "background-color: #f3f4f6; color: #374151;";
        }
    };

    const generateDonationHistory = () => {
        if (!donations || donations.length === 0) {
            return `
                <div class="donation-history">
                    <div class="info-label">🩸 Donation History</div>
                    <div class="no-donations">No donation records found</div>
                </div>
            `;
        }

        const donationRows = donations
            .map(
                (donation, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${formatDate(donation.event?.date)}</td>
                <td>${donation.volume || "N/A"} mL</td>
                <td class="event-title">${
                    donation.event?.title || "Blood Donation"
                }</td>
            </tr>
        `
            )
            .join("");

        return `
            <div class="donation-history">
                <div class="info-label">🩸 Recent Donation History (Last 10)</div>
                <table class="donation-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Volume</th>
                            <th>Event</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${donationRows}
                    </tbody>
                </table>
            </div>
        `;
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Donor ID Card - ${donor.donor_reference_id}</title>
        <style>
            @page {
                size: A4;
                margin: 0.25in 0.5in;
            }
            
            body {
                font-family: Arial, sans-serif;
                line-height: 1.4;
                color: #374151;
                margin: 0;
                padding: 0;
            }
            
            .id-card {
                max-width: 600px;
                margin: 0 auto 20px auto;
                border: 2px solid #9ca3af;
                border-radius: 8px;
                padding: 20px;
                background: white;
            }
            
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .header h1 {
                font-size: 20px;
                font-weight: bold;
                color: #dc2626;
                margin: 0 0 4px 0;
            }
            
            .header .subtitle {
                font-size: 14px;
                color: #6b7280;
                margin: 0;
            }
            
            .donor-id {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 24px;
            }
            
            .header h1 {
                font-size: 20px;
                font-weight: bold;
                color: #dc2626;
                margin: 0 0 4px 0;
            }
            
            .header .subtitle {
                font-size: 14px;
                color: #6b7280;
                margin: 0;
            }
            
            .donor-id {
                text-align: center;
                margin-bottom: 24px;
            }
            
            .content-grid {
                display: grid;
                grid-template-columns: 1fr 2fr;
                gap: 24px;
                margin-bottom: 24px;
            }
            
            .photo-section {
                text-align: center;
            }
            
            .avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                border: 2px solid #d1d5db;
                background: #f3f4f6;
                margin: 0 auto 12px auto;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                color: #6b7280;
                overflow: hidden;
            }
            
            .avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            }
            
            .status-badge {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                ${getStatusColor(donor.status)}
            }
            
            .info-section {
                display: grid;
                gap: 16px;
            }
            
            .info-item {
                margin-bottom: 12px;
            }
            
            .info-label {
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 2px;
                font-weight: 600;
            }
            
            .info-value {
                font-size: 14px;
                font-weight: 500;
            }
            
            .blood-type {
                font-size: 16px;
                font-weight: bold;
                color: #dc2626;
            }
            
            .info-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            
            .verification-badges {
                text-align: center;
                margin-top: 16px;
            }
            
            .verification-badge {
                display: inline-block;
                padding: 4px 8px;
                margin: 0 4px;
                border-radius: 4px;
                font-size: 12px;
                background: #f3f4f6;
                color: #374151;
            }
            
            .verification-badge.verified {
                background: #dbeafe;
                color: #1e40af;
            }
            
            .address-section {
                background: #f9fafb;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 16px;
            }
            
            .donation-history {
                margin-bottom: 20px;
            }
            
            .donation-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 8px;
                font-size: 11px;
            }
            
            .donation-table th,
            .donation-table td {
                border: 1px solid #e5e7eb;
                padding: 6px 8px;
                text-align: left;
            }
            
            .donation-table th {
                background: #f9fafb;
                font-weight: 600;
                font-size: 10px;
            }
            
            .donation-table td {
                font-size: 10px;
            }
            
            .event-title {
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .no-donations {
                text-align: center;
                color: #6b7280;
                font-style: italic;
                padding: 20px;
                background: #f9fafb;
                border-radius: 6px;
            }
            
            .footer {
                text-align: center;
                font-size: 11px;
                color: #6b7280;
                margin-top: 20px;
                padding-top: 16px;
                border-top: 1px solid #e5e7eb;
            }
            
            .page-break {
                page-break-before: always;
            }
        </style>
    </head>
    <body>
        <!-- Front of ID Card -->
        <div class="id-card">
            <div class="header">
                <h1>Philippine Children's Medical Center</h1>
                <p class="subtitle">BLOOD DONOR ID CARD</p>
            </div>
            
            <div class="donor-id">
                <div class="id-number">${
                    donor.donor_reference_id || "DN000000"
                }</div>
            </div>
            
            <div class="content-grid">
                <div class="photo-section">
                    <div class="avatar">
                        ${
                            donor.user?.image
                                ? `<img src="${encodeURI(
                                      donor.user.image
                                  )}" alt="Donor Photo" onerror="this.style.display='none'; this.parentNode.innerHTML='👤';">`
                                : "👤"
                        }
                    </div>
                    <div class="status-badge">${
                        donor.status?.toUpperCase() || "UNKNOWN"
                    }</div>
                </div>
                
                <div class="info-section">
                    <div class="info-item">
                        <div class="info-label">Full Name</div>
                        <div class="info-value">${
                            donor.user?.full_name || "Not specified"
                        }</div>
                    </div>
                    
                    <div class="info-row">
                        <div class="info-item">
                            <div class="info-label">🩸 Blood Type</div>
                            <div class="info-value blood-type">${
                                donor.blood_type?.blood_type || "Pending"
                            }</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Gender</div>
                            <div class="info-value">${
                                donor.user?.gender?.charAt(0).toUpperCase() +
                                    donor.user?.gender?.slice(1) ||
                                "Not specified"
                            }</div>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">📅 Date of Birth</div>
                        <div class="info-value">${formatDate(
                            donor.date_of_birth
                        )}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">📞 Contact Number</div>
                        <div class="info-value">+63${
                            donor.contact_number || "Not specified"
                        }</div>
                    </div>
                    
                    ${
                        donor.agency
                            ? `
                    <div class="info-item">
                        <div class="info-label">Agency</div>
                        <div class="info-value">${donor.agency.name}</div>
                    </div>
                    `
                            : ""
                    }
                </div>
            </div>
            
            <div class="verification-badges">
                <span class="verification-badge ${
                    donor.is_data_verified ? "verified" : ""
                }">
                    Data: ${donor.is_data_verified ? "Verified" : "Pending"}
                </span>
                <span class="verification-badge ${
                    donor.is_bloodtype_verified ? "verified" : ""
                }">
                    Blood Type: ${
                        donor.is_bloodtype_verified ? "Verified" : "Pending"
                    }
                </span>
            </div>
        </div>
        
        <!-- Back of ID Card -->
        <div class="id-card">
            <div class="header">
                <h1>DONOR INFORMATION</h1>
            </div>
            
            <div class="info-item">
                <div class="info-label">📍 Complete Address</div>
                <div class="address-section">
                    ${donor.full_address || "Address not specified"}
                </div>
            </div>
            
            <div class="info-row">
                <div class="info-item">
                    <div class="info-label">Civil Status</div>
                    <div class="info-value">${
                        donor.civil_status?.charAt(0).toUpperCase() +
                            donor.civil_status?.slice(1) || "Not specified"
                    }</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Nationality</div>
                    <div class="info-value">${
                        donor.nationality || "Not specified"
                    }</div>
                </div>
            </div>
            
            ${
                donor.occupation
                    ? `
            <div class="info-item">
                <div class="info-label">Occupation</div>
                <div class="info-value">${donor.occupation}</div>
            </div>
            `
                    : ""
            }
            
            ${generateDonationHistory()}
            
            <div class="footer">
                <p>This ID card is valid for blood donation purposes.</p>
                <p>Please present this card during donation appointments.</p>
                <p>For inquiries: contact your blood donation center</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
