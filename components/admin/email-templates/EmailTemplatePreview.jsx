"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogContentNoX,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Eye, Mail, FileText, X, Copy, Check } from "lucide-react";

const EmailTemplatePreview = ({
    previewData,
    sampleDataPreview,
    isOpen,
    onClose,
    template,
}) => {
    const [copied, setCopied] = useState(false);

    if (!previewData || !template) {
        return null;
    }

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const formatHtmlForDisplay = (html) => {
        // Simple HTML formatting for display
        return html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<p>/gi, "")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<strong>/gi, "**")
            .replace(/<\/strong>/gi, "**")
            .replace(/<em>/gi, "*")
            .replace(/<\/em>/gi, "*")
            .replace(/<[^>]*>/g, "");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContentNoX className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="dark:text-white">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Email Template Preview</DialogTitle>
                        <Button
                            className="dark:text-white"
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Template Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    Template Information
                                </CardTitle>
                                <Badge variant="outline">
                                    {template.category}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Name:</span>{" "}
                                    {template.name}
                                </div>
                                <div>
                                    <span className="font-medium">Status:</span>
                                    <Badge
                                        variant={
                                            template.is_active
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="ml-2"
                                    >
                                        {template.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Email Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="html" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger
                                        value="html"
                                        className="flex items-center gap-2"
                                    >
                                        <Mail className="h-4 w-4" />
                                        HTML
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="text"
                                        className="flex items-center gap-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Text
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="raw"
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Raw
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="html" className="mt-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">
                                                Subject: {previewData.subject}
                                            </h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleCopy(
                                                        previewData.subject
                                                    )
                                                }
                                            >
                                                {copied ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <Separator />
                                        <div
                                            className="prose max-w-none border rounded-lg p-4 bg-gray-50"
                                            dangerouslySetInnerHTML={{
                                                __html: previewData.html_content,
                                            }}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="text" className="mt-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">
                                                Subject: {previewData.subject}
                                            </h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleCopy(
                                                        previewData.subject
                                                    )
                                                }
                                            >
                                                {copied ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <Separator />
                                        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900 whitespace-pre-wrap">
                                            {previewData.text_content ||
                                                formatHtmlForDisplay(
                                                    previewData.html_content
                                                )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="raw" className="mt-4">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-medium mb-2">
                                                Raw HTML:
                                            </h3>
                                            <div className="border rounded-lg p-4 bg-gray-900 text-gray-100 font-mono text-sm overflow-x-auto">
                                                <pre>
                                                    {previewData.html_content}
                                                </pre>
                                            </div>
                                        </div>
                                        {previewData.text_content && (
                                            <div>
                                                <h3 className="font-medium mb-2">
                                                    Raw Text:
                                                </h3>
                                                <div className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-900 font-mono text-sm">
                                                    <pre>
                                                        {
                                                            previewData.text_content
                                                        }
                                                    </pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Sample Data Used */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Sample Data Used
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(sampleDataPreview).map(
                                    ([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex justify-between items-center p-2 border rounded"
                                        >
                                            <span className="font-medium text-sm">
                                                {key}:
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {value}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContentNoX>
        </Dialog>
    );
};

export default EmailTemplatePreview;
