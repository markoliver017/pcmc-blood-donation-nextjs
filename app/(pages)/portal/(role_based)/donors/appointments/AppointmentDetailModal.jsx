"use client";
import React, { useRef } from "react";
import { Calendar, MapPin, Clock, X, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const AppointmentDetailModal = ({ isOpen, appointment, onClose }) => {
    const qrRef = useRef(null);

    if (!isOpen) return null;

    const event = appointment?.time_schedule?.event;
    const verificationUrl = appointment
        ? `${process.env.NEXT_PUBLIC_DOMAIN}/verify-appointment/${appointment.id}`
        : "";

    const handleDownload = () => {
        if (!qrRef.current) return;

        const svg = qrRef.current.querySelector("svg");
        if (!svg) return;

        // Convert SVG to image
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            // Create a "full page" canvas
            const canvasWidth = 1080; // px width
            const canvasHeight = 1920; // px height (portrait)
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Fill background (white)
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Calculate center position for QR
            const qrSize = 400; // px size for QR
            const x = (canvasWidth - qrSize) / 2;
            const y = (canvasHeight - qrSize) / 2;

            // Draw QR in center
            ctx.drawImage(img, x, y, qrSize, qrSize);

            // Download as PNG
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "appointment_qr_code.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(svgUrl);
        };
        img.src = svgUrl;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold mb-2">Appointment Details</h2>
                {appointment ? (
                    <div className="space-y-2">
                        <div className="font-semibold text-lg text-blue-700 dark:text-blue-400 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {event?.title || "Untitled Event"}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />{" "}
                                {formatDate(event?.date)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />{" "}
                                {appointment.time_schedule?.formatted_time ||
                                    "-"}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event?.agency?.agency_address || "No location"}
                            </span>
                            <span className="flex items-center gap-1">
                                Status:
                                <span className="font-bold uppercase ml-1">
                                    {appointment.status}
                                </span>
                            </span>
                        </div>
                        <div
                            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center"
                            ref={qrRef}
                        >
                            <h3 className="text-lg font-semibold mb-2">
                                Verification QR Code
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">
                                Present this QR code to the staff for
                                verification.
                            </p>
                            {verificationUrl && (
                                <>
                                    <QRCodeSVG
                                        value={verificationUrl}
                                        size={128}
                                    />
                                    <button
                                        onClick={handleDownload}
                                        className="mt-3 flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download QR
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-600">
                        No appointment selected.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentDetailModal;
