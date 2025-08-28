"use client";

import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

import {
    PrinterIcon,
    UserIcon,
    CalendarIcon,
    PhoneIcon,
    MapPinIcon,
    DropletIcon,
    FileTextIcon,
    LoaderIcon,
} from "lucide-react";
import { useState } from "react";
import { generateDonorIdPdf } from "@action/donorIdAction";
import PdfViewerModal from "./PdfViewerModal";
import { toast, Toaster } from "sonner";
import Image from "next/image";

export default function DonorIdCard({ donor, donations }) {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const [pdfFilename, setPdfFilename] = useState("");

    const handleGeneratePdf = async () => {
        setIsGeneratingPdf(true);

        try {
            const result = await generateDonorIdPdf();

            if (result.success) {
                setPdfData(result.data.pdf);
                setPdfFilename(result.data.filename);
                setPdfModalOpen(true);
                toast.success(
                    "PDF Generated Successfully: Your donor ID card PDF is ready to view and download."
                );
            } else {
                toast.error(
                    "PDF Generation Failed: " +
                        (result.message ||
                            "Failed to generate PDF. Please try again.")
                );
            }
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error(
                "Error: An unexpected error occurred. Please try again."
            );
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "activated":
                return "bg-green-100 text-green-800";
            case "for approval":
                return "bg-yellow-100 text-yellow-800";
            case "deactivated":
                return "bg-red-100 text-red-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getVerificationBadge = (isVerified, label) => {
        return (
            <Badge
                variant={isVerified ? "default" : "secondary"}
                className="text-xs"
            >
                {label}: {isVerified ? "Verified" : "Pending"}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            <Toaster />
            {/* Print Controls */}
            <div className="flex justify-end gap-4 no-print">
                <Button
                    onClick={handleGeneratePdf}
                    disabled={isGeneratingPdf}
                    className="flex bg-blue-500 items-center gap-2"
                >
                    {isGeneratingPdf ? (
                        <LoaderIcon className="h-4 w-4 animate-spin" />
                    ) : (
                        <FileTextIcon className="h-4 w-4" />
                    )}
                    {isGeneratingPdf ? "Generating..." : "Generate PDF"}
                </Button>
            </div>

            {/* ID Card Container */}
            <div className="print:shadow-none print:border-0">
                {/* Front of ID Card */}
                <Card className="w-full max-w-2xl mx-auto mb-6 print:mb-4 print:shadow-none print:border-2 print:border-gray-400">
                    <CardContent className="p-6 print:p-4">
                        {/* Header */}
                        <div className="text-center mb-6 print:mb-4">
                            <h2 className="text-2xl print:text-xl font-bold text-red-600 mb-1">
                                Philippine Children's Medical Center
                            </h2>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                BLOOD DONOR ID CARD
                            </div>
                        </div>

                        {/* Donor Reference ID */}
                        <div className="text-center mb-6 print:mb-4">
                            <div className="text-3xl print:text-2xl font-bold text-gray-900 bg-gray-100 print:bg-gray-200 py-2 px-4 rounded-lg inline-block">
                                {donor.donor_reference_id || "DN000000"}
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:gap-4">
                            {/* Photo Section */}
                            <div className="flex flex-col items-center">
                                <Avatar className="h-24 w-24 print:h-20 print:w-20 mb-3 print:mb-2 border-2 border-gray-300">
                                    <Image
                                        src={donor.user?.image}
                                        alt={donor.user?.full_name || "Donor"}
                                        width={100}
                                        height={100}
                                    />
                                    <AvatarFallback className="bg-gray-200">
                                        <UserIcon className="h-12 w-12 print:h-10 print:w-10 text-gray-500" />
                                    </AvatarFallback>
                                </Avatar>

                                {/* Status Badge */}
                                <Badge
                                    className={`${getStatusColor(
                                        donor.status
                                    )} print:text-xs`}
                                >
                                    {donor.status?.toUpperCase() || "UNKNOWN"}
                                </Badge>
                            </div>

                            {/* Personal Information */}
                            <div className="md:col-span-2 space-y-4 print:space-y-2">
                                {/* Name */}
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 print:text-xs">
                                        Full Name
                                    </div>
                                    <div className="text-lg print:text-base font-semibold text-gray-900 dark:text-white">
                                        {donor.user?.full_name ||
                                            "Not specified"}
                                    </div>
                                </div>

                                {/* Basic Info Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 print:text-xs flex items-center gap-1">
                                            <DropletIcon className="h-3 w-3" />
                                            Blood Type
                                        </div>
                                        <div className="text-lg font-bold text-red-600">
                                            {donor.blood_type?.blood_type ||
                                                "Pending"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 print:text-xs">
                                            Gender
                                        </div>
                                        <div className="text-base print:text-sm font-medium">
                                            {donor.user?.gender
                                                ?.charAt(0)
                                                .toUpperCase() +
                                                donor.user?.gender?.slice(1) ||
                                                "Not specified"}
                                        </div>
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 print:text-xs flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        Date of Birth
                                    </div>
                                    <div className="text-base print:text-sm font-medium">
                                        {formatDate(donor.date_of_birth)}
                                    </div>
                                </div>

                                {/* Contact */}
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 print:text-xs flex items-center gap-1">
                                        <PhoneIcon className="h-3 w-3" />
                                        Contact Number
                                    </div>
                                    <div className="text-base print:text-sm font-medium">
                                        +63
                                        {donor.contact_number ||
                                            "Not specified"}
                                    </div>
                                </div>

                                {/* Agency (if applicable) */}
                                {donor.agency && (
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 print:text-xs">
                                            Agency
                                        </div>
                                        <div className="text-base print:text-sm font-medium">
                                            {donor.agency.name}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Verification Badges */}
                        <div className="mt-6 print:mt-4 flex flex-wrap gap-2 justify-center">
                            {getVerificationBadge(
                                donor.is_data_verified,
                                "Data"
                            )}
                            {getVerificationBadge(
                                donor.is_bloodtype_verified,
                                "Blood Type"
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Back of ID Card */}
                <Card className="w-full max-w-2xl mx-auto print:shadow-none print:border-2 print:border-gray-400">
                    <CardContent className="p-6 print:p-4">
                        {/* Header */}
                        <div className="text-center mb-6 print:mb-4">
                            <h3 className="text-lg print:text-base font-bold text-gray-900 dark:text-white">
                                DONOR INFORMATION
                            </h3>
                        </div>

                        <div className="space-y-4 print:space-y-2">
                            {/* Address */}
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 print:text-xs flex items-center gap-1 mb-2">
                                    <MapPinIcon className="h-3 w-3" />
                                    Complete Address
                                </div>
                                <div className="text-base print:text-sm text-gray-900 bg-gray-50 print:bg-gray-100 p-3 print:p-2 rounded">
                                    {donor.full_address ||
                                        "Address not specified"}
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 print:text-xs">
                                        Civil Status
                                    </div>
                                    <div className="text-base print:text-sm font-medium">
                                        {donor.civil_status
                                            ?.charAt(0)
                                            .toUpperCase() +
                                            donor.civil_status?.slice(1) ||
                                            "Not specified"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 print:text-xs">
                                        Nationality
                                    </div>
                                    <div className="text-base print:text-sm font-medium">
                                        {donor.nationality || "Not specified"}
                                    </div>
                                </div>
                            </div>

                            {donor.occupation && (
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 print:text-xs">
                                        Occupation
                                    </div>
                                    <div className="text-base print:text-sm font-medium">
                                        {donor.occupation}
                                    </div>
                                </div>
                            )}

                            {/* Donation History */}
                            <div className="mt-6">
                                <div className="text-sm text-gray-600 dark:text-gray-300 print:text-xs font-semibold mb-3 flex items-center gap-1">
                                    <DropletIcon className="h-3 w-3" />
                                    Recent Donation History (Last 10)
                                </div>

                                {donations && donations.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs border-collapse border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-50 dark:bg-gray-800">
                                                    <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                                                        #
                                                    </th>
                                                    <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                                                        Date
                                                    </th>
                                                    <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                                                        Volume
                                                    </th>
                                                    <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                                                        Event
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {donations.map(
                                                    (donation, index) => (
                                                        <tr
                                                            key={index}
                                                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                                        >
                                                            <td className="border border-gray-300 px-2 py-1">
                                                                {index + 1}
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-1">
                                                                {formatDate(
                                                                    donation
                                                                        .event
                                                                        ?.date
                                                                )}
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-1 font-medium text-red-600">
                                                                {donation.volume ||
                                                                    "N/A"}{" "}
                                                                mL
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-1 truncate max-w-32">
                                                                {donation.event
                                                                    ?.title ||
                                                                    "Blood Donation"}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300">
                                        <DropletIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            No donation records found
                                        </p>
                                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                            Your donation history will appear
                                            here after your first donation
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-4 print:my-2" />

                            {/* Last Donation Info */}
                            {donor.last_donation_date && (
                                <div>
                                    <div className="text-sm text-gray-600 print:text-xs">
                                        Last Donation
                                    </div>
                                    <div className="text-base print:text-sm font-medium">
                                        {formatDate(donor.last_donation_date)}
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="text-center text-xs print:text-xs text-gray-500">
                                <p>
                                    This ID card is valid for blood donation
                                    purposes.
                                </p>
                                <p>
                                    Please present this card during donation
                                    appointments.
                                </p>
                                {/* <p className="mt-2">
                                    For inquiries: contact your blood donation
                                    center
                                </p> */}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* PDF Viewer Modal */}
            <PdfViewerModal
                isOpen={pdfModalOpen}
                onClose={() => setPdfModalOpen(false)}
                pdfData={pdfData}
                filename={pdfFilename}
            />

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0.5in;
                    }

                    .no-print {
                        display: none !important;
                    }

                    body {
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }

                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }

                    .print\\:border-0 {
                        border: 0 !important;
                    }

                    .print\\:border-2 {
                        border-width: 2px !important;
                    }

                    .print\\:border-gray-400 {
                        border-color: #9ca3af !important;
                    }
                }
            `}</style>
        </div>
    );
}
