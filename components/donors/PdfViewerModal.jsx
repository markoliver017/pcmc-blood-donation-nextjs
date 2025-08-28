"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { DownloadIcon, XIcon } from "lucide-react";
import { CardStackIcon } from "@radix-ui/react-icons";

export default function PdfViewerModal({ isOpen, onClose, pdfData, filename }) {
    const handleDownload = () => {
        if (!pdfData) return;

        const byteCharacters = atob(pdfData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename || "donor-id-card.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const pdfUrl = pdfData ? `data:application/pdf;base64,${pdfData}` : null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="flex items-center gap-2">
                        <CardStackIcon /> Donor ID Card PDF
                    </DialogTitle>
                    <Button
                        onClick={handleDownload}
                        variant="default"
                        size="sm"
                        className="flex bg-blue-800 mr-5 text-white items-center gap-2 cursor-pointer"
                    >
                        <DownloadIcon className="h-4 w-4" />
                        Download
                    </Button>
                </DialogHeader>

                <div className="flex-1 border rounded-md overflow-hidden">
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full"
                            title="Donor ID Card PDF"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No PDF data available
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
