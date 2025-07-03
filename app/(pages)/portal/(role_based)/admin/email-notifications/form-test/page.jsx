"use client";

import { useState } from "react";
import EmailTemplateForm from "@components/admin/email-templates/EmailTemplateForm";
import EmailTemplatePreview from "@components/admin/email-templates/EmailTemplatePreview";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Plus, X } from "lucide-react";

const FormTestPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleSubmit = (data) => {
        console.log("Template created successfully:", data);
        setShowForm(false);
        // You can add additional logic here like redirecting or showing a success message
    };

    const handlePreview = (data) => {
        setPreviewData(data);
        setShowPreview(true);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Email Template Form Test</h1>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Create Email Template</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowForm(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <EmailTemplateForm
                            onSubmit={handleSubmit}
                            onPreview={handlePreview}
                        />
                    </CardContent>
                </Card>
            )}

            {showPreview && previewData && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Email Preview</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPreview(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <EmailTemplatePreview
                            subject={previewData.subject}
                            htmlContent={previewData.html_content}
                            textContent={previewData.text_content}
                        />
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Test Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">How to Test:</h3>
                            <ol className="list-decimal list-inside space-y-1 text-sm">
                                <li>
                                    Click "Create Template" to open the form
                                </li>
                                <li>
                                    Fill in all required fields (name, category,
                                    subject, content)
                                </li>
                                <li>
                                    Try adding dynamic fields to both subject
                                    and content using the "Add Field" button
                                </li>
                                <li>
                                    Use the "Preview" button to see how the
                                    email will look with sample data
                                </li>
                                <li>Submit the form to create the template</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">
                                Features to Test:
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Form validation (required fields)</li>
                                <li>Dynamic field selection and insertion</li>
                                <li>Dynamic fields in email subject line</li>
                                <li>
                                    Rich text editor (Tiptap) for HTML content
                                </li>
                                <li>Email preview with sample data</li>
                                <li>TanStack Query mutation handling</li>
                                <li>Success/error notifications</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">
                                Expected Behavior:
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>
                                    Form should validate all required fields
                                </li>
                                <li>
                                    Dynamic fields should be selectable and
                                    insertable
                                </li>
                                <li>
                                    Preview should show the email with sample
                                    data
                                </li>
                                <li>
                                    On successful submission, should show
                                    success message
                                </li>
                                <li>Template should be saved to database</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">
                                Integration Testing:
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Create an AGENCY_REGISTRATION template</li>
                                <li>
                                    Register a new agency to test automatic
                                    email sending
                                </li>
                                <li>
                                    Check that the email uses your template with
                                    dynamic data
                                </li>
                                <li>
                                    Verify fallback to original email if
                                    template fails
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FormTestPage;
