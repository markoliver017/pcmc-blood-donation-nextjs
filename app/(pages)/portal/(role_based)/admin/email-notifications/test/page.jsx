"use client";

import { useState } from "react";
import EmailTemplateList from "@components/admin/email-templates/EmailTemplateList";
import EmailTemplateForm from "@components/admin/email-templates/EmailTemplateForm";
import EmailTemplatePreview from "@components/admin/email-templates/EmailTemplatePreview";

const EmailTemplateTestPage = () => {
    const [currentView, setCurrentView] = useState("list"); // "list", "create", "edit"
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    // Mock template data for testing
    const mockTemplates = [
        {
            id: 1,
            name: "Welcome Email",
            category: "AGENCY_REGISTRATION",
            subject: "Welcome to PCMC Blood Donation Portal",
            html_content:
                "<p>Dear <strong>{{user_name}}</strong>,</p><p>Welcome to the PCMC Pediatric Blood Center portal!</p>",
            text_content:
                "Dear {{user_name}}, Welcome to the PCMC Pediatric Blood Center portal!",
            is_active: true,
            dynamic_fields: ["user_name", "agency_name"],
            createdAt: "2025-01-15T10:00:00Z",
            created_by_user: { first_name: "Admin", last_name: "User" },
        },
        {
            id: 2,
            name: "Appointment Confirmation",
            category: "APPOINTMENT_BOOKING",
            subject: "Your blood donation appointment is confirmed",
            html_content:
                "<p>Hello <strong>{{user_name}}</strong>,</p><p>Your appointment on <strong>{{appointment_date}}</strong> at <strong>{{appointment_time}}</strong> is confirmed.</p>",
            text_content:
                "Hello {{user_name}}, Your appointment on {{appointment_date}} at {{appointment_time}} is confirmed.",
            is_active: true,
            dynamic_fields: [
                "user_name",
                "appointment_date",
                "appointment_time",
            ],
            createdAt: "2025-01-14T15:30:00Z",
            created_by_user: { first_name: "Admin", last_name: "User" },
        },
    ];

    // Handle list actions
    const handleEdit = (template) => {
        setSelectedTemplate(template);
        setCurrentView("edit");
    };

    const handleView = (template) => {
        setSelectedTemplate(template);
        // Generate preview data
        const sampleData = {
            user_name: "John Doe",
            agency_name: "Sample Blood Bank",
            appointment_date: "2025-01-20",
            appointment_time: "10:00 AM",
            system_name: "PCMC Pediatric Blood Center",
            support_email: "support@pcmc.gov.ph",
        };
        setPreviewData({
            subject: template.subject,
            html_content: template.html_content,
            text_content: template.text_content,
        });
        setShowPreview(true);
    };

    const handleCreate = () => {
        setSelectedTemplate(null);
        setCurrentView("create");
    };

    const handleCancel = () => {
        setCurrentView("list");
        setSelectedTemplate(null);
    };

    // Handle form submission
    const handleSubmit = async (formData) => {
        try {
            console.log("Form data:", Object.fromEntries(formData));

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            alert("Template saved successfully!");
            setCurrentView("list");
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to save template");
        }
    };

    // Handle preview
    const handlePreview = (previewResult) => {
        setPreviewData(previewResult);
        setShowPreview(true);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Navigation */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Email Template Test Page</h1>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentView("list")}
                        className={`px-4 py-2 rounded ${
                            currentView === "list"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        List View
                    </button>
                    <button
                        onClick={() => setCurrentView("create")}
                        className={`px-4 py-2 rounded ${
                            currentView === "create"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        Create Form
                    </button>
                    <button
                        onClick={() => setCurrentView("edit")}
                        className={`px-4 py-2 rounded ${
                            currentView === "edit"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                        disabled={!selectedTemplate}
                    >
                        Edit Form
                    </button>
                </div>
            </div>

            {/* Component Display */}
            {currentView === "list" && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Template List Component
                    </h2>
                    <EmailTemplateList
                        templates={mockTemplates}
                        onEdit={handleEdit}
                        onView={handleView}
                        onCreate={handleCreate}
                        onDelete={(template) => {
                            console.log("Delete template:", template);
                            alert(
                                "Delete functionality would be implemented here"
                            );
                        }}
                    />
                </div>
            )}

            {currentView === "create" && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Create Template Form
                    </h2>
                    <EmailTemplateForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        onPreview={handlePreview}
                    />
                </div>
            )}

            {currentView === "edit" && selectedTemplate && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Edit Template Form
                    </h2>
                    <EmailTemplateForm
                        template={selectedTemplate}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        onPreview={handlePreview}
                    />
                </div>
            )}

            {/* Preview Component */}
            <EmailTemplatePreview
                previewData={previewData}
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                template={selectedTemplate}
            />

            {/* Debug Information */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Debug Information:</h3>
                <div className="text-sm space-y-1">
                    <p>
                        <strong>Current View:</strong> {currentView}
                    </p>
                    <p>
                        <strong>Selected Template:</strong>{" "}
                        {selectedTemplate ? selectedTemplate.name : "None"}
                    </p>
                    <p>
                        <strong>Preview Data:</strong>{" "}
                        {previewData ? "Available" : "None"}
                    </p>
                    <p>
                        <strong>Show Preview:</strong>{" "}
                        {showPreview ? "Yes" : "No"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailTemplateTestPage;
