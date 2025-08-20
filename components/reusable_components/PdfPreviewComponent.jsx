"use client";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";

import { Eye } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import { useState } from "react";
import { BiArrowToLeft, BiArrowToRight, BiDownload } from "react-icons/bi";

export default function PdfPreviewComponent({
    pdfSrc = null,
    triggerContent = (
        <>
            <Eye />
            Preview
        </>
    ),
    className = "btn-ghost btn-primary",
}) {
    const [open, setOpen] = useState(false);
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // Create proxy URL for CORS-free PDF access
    const getProxyPdfUrl = (originalUrl) => {
        if (!originalUrl) return null;

        // If it's already a same-origin URL, use it directly
        if (
            originalUrl.startsWith("/") ||
            originalUrl.includes(window.location.host)
        ) {
            return originalUrl;
        }

        // Use proxy for cross-origin URLs
        return `/api/pdf-proxy?url=${encodeURIComponent(originalUrl)}`;
    };

    const proxyPdfSrc = getProxyPdfUrl(pdfSrc);

    if (!pdfSrc) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogTrigger asChild>
                <button
                    onClick={(e) => e.stopPropagation()}
                    className={`btn ${className}`}
                >
                    {triggerContent}
                </button>
            </DialogTrigger>

            <DialogContent className=" max-w-4xl p-6 overflow-scroll dark:text-white">
                <DialogHeader>
                    <DialogTitle className="mb-4">PDF Preview</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center w-full h-[80vh]">
                    <div className="flex justify-between items-baseline w-full px-5">
                        <p className="flex items-center justify-center gap-2 w-full mb-4 ">
                            <BiArrowToLeft
                                className="cursor-pointer ring-offset-2 hover:ring-offset-primary hover:ring-2 hover:ring-primary"
                                onClick={() => {
                                    if (pageNumber > 1) {
                                        setPageNumber(pageNumber - 1);
                                    }
                                }}
                            />
                            <span>
                                Page {pageNumber} of {numPages}
                            </span>
                            <BiArrowToRight
                                className="cursor-pointer ring-offset-2 hover:ring-offset-primary hover:ring-2 hover:ring-primary"
                                onClick={() => {
                                    if (pageNumber < numPages) {
                                        setPageNumber(pageNumber + 1);
                                    }
                                }}
                            />
                        </p>
                        <a
                            href={pdfSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-primary btn"
                        >
                            <BiDownload />
                            <span className="max-w-56 truncate text-ellipsis text-right">
                                {pdfSrc.split("/").pop()}
                            </span>
                        </a>
                    </div>
                    <Document
                        file={pdfSrc}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="w-full h-[80vh] flex flex-col items-center"
                    >
                        <Page
                            pageNumber={pageNumber}
                            width={800}
                            height={800}
                            className="mb-4 shadow-md border rounded-md"
                        />
                    </Document>
                </div>
            </DialogContent>
        </Dialog>
    );
}
