import { Badge } from "@components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@components/ui/dialog";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const PdfPreviewComponent = dynamic(
    () => import("@components/reusable_components/PdfPreviewComponent"),
    { ssr: false }
);

import { format } from "date-fns";
import {
    BadgeCheck,
    Building2,
    Calendar,
    CheckCircle,
    ClipboardList,
    Droplet,
    FileText,
    Hospital,
    Text,
    User,
    XCircle,
} from "lucide-react";
import React from "react";
import { BiExport } from "react-icons/bi";
import SweetAlert from "@components/ui/SweetAlert";

const colors = {
    pending:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    fulfilled:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    cancelled:
        "bg-gray-200 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400",
};

export default function DetailsModal({
    detailsOpen,
    setDetailsOpen,
    selectedRequest,
    isApproving,
    updateRequestStatus,
}) {
    return (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="max-w-xl" id="detailsModal">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-blue-500" />{" "}
                        Blood Request Details
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information for this blood request.
                    </DialogDescription>
                </DialogHeader>
                {selectedRequest && (
                    <div className="space-y-5 space-x-5 mt-2 dark:text-gray-200">
                        <div className="flex items-center justify-between gap-2">
                            <b className="flex-items-center">
                                <Droplet className="w-4 h-4 text-red-500" />
                                Component:
                            </b>{" "}
                            <div className="flex-none w-48">
                                {selectedRequest.blood_component}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <b className="flex-items-center">
                                <BadgeCheck className="w-4 h-4 text-purple-500" />
                                Blood Type:
                            </b>{" "}
                            <div className="flex-none w-48">
                                {selectedRequest.blood_type?.blood_type}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <b className="flex-items-center">
                                <BadgeCheck className="w-4 h-4 text-yellow-500" />
                                Units:
                            </b>{" "}
                            <div className="flex-none w-48">
                                {selectedRequest.no_of_units}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <b className="flex-items-center">
                                <User className="w-4 h-4 text-blue-400" />
                                Patient Name:
                            </b>{" "}
                            <div className="flex-none w-48">
                                {selectedRequest.patient_name ||
                                    (selectedRequest.user
                                        ? `${selectedRequest.user.first_name} ${selectedRequest.user.last_name}`
                                        : "-")}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <b className="flex-items-center">
                                <Hospital className="w-4 h-4 text-pink-500" />
                                Hospital:
                            </b>{" "}
                            <div className="flex-none w-48">
                                {selectedRequest.hospital_name}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <b className="flex-items-center">
                                <Calendar className="w-4 h-4 text-green-500" />
                                Date Needed:
                            </b>{" "}
                            <div className="flex-none w-48">
                                {format(
                                    new Date(selectedRequest.date),
                                    "MMM dd, yyyy"
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <b className="flex-items-center">
                                <Building2 className="w-4 h-4 text-gray-700" />
                                Agency:
                            </b>{" "}
                            <div className="flex-none w-48">
                                {selectedRequest.user?.donor?.agency?.name || (
                                    <span className="italic text-gray-400">
                                        N/A
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <b className="flex-items-center">
                                <ClipboardList className="w-4 h-4 text-indigo-500" />
                                Diagnosis:
                            </b>{" "}
                            <div className="flex-none w-48">
                                {selectedRequest.diagnosis}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <b className="flex-items-center">
                                <FileText className="w-4 h-4 text-blue-600" />
                                File:
                            </b>{" "}
                            <div className="flex-none w-48">
                                {selectedRequest?.file_url ? (
                                    <PdfPreviewComponent
                                        pdfSrc={selectedRequest?.file_url}
                                        triggerContent={
                                            <>
                                                <BiExport />
                                                View PDF
                                            </>
                                        }
                                    />
                                ) : (
                                    <span className="italic text-gray-400">
                                        N/A
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <b className="flex-items-center">
                                <Badge className="w-4 h-4 text-gray-500" />
                                Status:
                            </b>{" "}
                            <div className="flex-none w-48">
                                <Badge
                                    variant="outline"
                                    className={
                                        colors[selectedRequest.status] ||
                                        "bg-gray-200 text-gray-600"
                                    }
                                >
                                    {selectedRequest.status !== "fulfilled"
                                        ? selectedRequest.status
                                              .charAt(0)
                                              .toUpperCase() +
                                          selectedRequest.status.slice(1)
                                        : "Approved"}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <b className="flex-items-center">
                                <Text className="w-4 h-4 " />
                                Remarks:
                            </b>{" "}
                            <div className="flex-none w-48">
                                {selectedRequest.remarks}
                            </div>
                        </div>
                        {selectedRequest?.status === "pending" && (
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    disabled={isApproving}
                                    onClick={() => {
                                        SweetAlert({
                                            element_id: "detailsModal",
                                            title: "Approve Blood Request?",
                                            text: "Are you sure you want to mark this blood request as fulfilled? This action will also send a notification to the user who initiated the request.",
                                            icon: "info",
                                            showCancelButton: true,
                                            confirmButtonText: "Yes, approve",
                                            cancelButtonText: "No",
                                            onConfirm: () => {
                                                updateRequestStatus({
                                                    id: selectedRequest.id,
                                                    status: "fulfilled",
                                                });
                                            },
                                        });
                                    }}
                                    className="btn btn-success btn-xs md:btn-md"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Approve</span>
                                </button>
                                <button
                                    type="button"
                                    disabled={
                                        selectedRequest?.status !== "pending" ||
                                        isApproving
                                    }
                                    onClick={() => {
                                        MySwal.fire({
                                            target: document.getElementById(
                                                "detailsModal"
                                            ),
                                            title: "Reject Blood Request?",
                                            text: "Please provide a reason for rejecting this request.",
                                            icon: "warning",
                                            input: "text", // Add this to show a text input
                                            inputPlaceholder:
                                                "Enter rejection reason here...",
                                            inputValidator: (value) => {
                                                if (!value) {
                                                    return "You need to write a reason!";
                                                }
                                            },
                                            showCancelButton: true,
                                            confirmButtonText: "Yes, reject",
                                            cancelButtonText: "No",
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                const reason = result.value;
                                                // alert(reason);
                                                updateRequestStatus({
                                                    id: selectedRequest.id,
                                                    status: "rejected",
                                                    remarks: reason, // Send the reason to your update function
                                                });
                                            }
                                        });
                                    }}
                                    className="btn btn-error btn-xs md:btn-md"
                                >
                                    <XCircle className="w-4 h-4" />
                                    <span>Reject</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
