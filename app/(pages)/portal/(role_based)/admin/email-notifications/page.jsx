"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
    Plus,
    Search,
    Mail,
    Settings,
    Eye,
    Edit,
    Trash2,
    Send,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getEmailTemplates,
    deleteEmailTemplate,
} from "@action/emailTemplateAction";
import { toast } from "sonner";
import { getSampleDataForCategory } from "@lib/utils/emailTemplateUtils";

// Import our components
import EmailTemplateList from "@components/admin/email-templates/EmailTemplateList";
import EmailTemplateForm from "@components/admin/email-templates/EmailTemplateForm";
import EmailTemplatePreview from "@components/admin/email-templates/EmailTemplatePreview";
import EmailTemplateAnalytics from "@components/admin/email-templates/EmailTemplateAnalytics";

export default function EmailNotificationsDashboard() {
    const [activeTab, setActiveTab] = useState("templates");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [previewData, setPreviewData] = useState(null);
    const [sampleDataPreview, setSampleDataPreview] = useState(null);

    const queryClient = useQueryClient();

    // Fetch email templates
    const {
        data: templates,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["emailTemplates"],
        queryFn: getEmailTemplates,
    });

    // Filter templates based on search and category
    const filteredTemplates =
        templates?.data?.filter((template) => {
            const matchesSearch =
                template.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                template.subject
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategory === "all" ||
                template.category === selectedCategory;
            return matchesSearch && matchesCategory;
        }) || [];

    // Handle template actions
    const handleEditTemplate = (template) => {
        setSelectedTemplate(template);
        setIsFormOpen(true);
        setActiveTab("form");
    };

    const handlePreviewTemplate = async (template) => {
        setSelectedTemplate(template);
        setIsPreviewOpen(true);
        // setActiveTab("preview");
        // Fetch preview data from API
        try {
            const sampleData = getSampleDataForCategory(template.category);
            const res = await fetch("/api/email-templates/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ template, sampleData }),
            });
            const data = await res.json();
            setPreviewData(data);
            setSampleDataPreview(sampleData);
        } catch (err) {
            setPreviewData({
                subject: template.subject,
                html_content: template.html_content,
                text_content: template.text_content,
            });
        }
    };

    const handleDeleteTemplate = async (templateId) => {
        if (confirm("Are you sure you want to delete this template?")) {
            try {
                await deleteEmailTemplate(templateId);
                toast.success("Template deleted successfully");
                queryClient.invalidateQueries(["emailTemplates"]);
            } catch (error) {
                toast.error("Failed to delete template");
                console.error("Delete error:", error);
            }
        }
    };

    const handleCreateNew = () => {
        setSelectedTemplate(null);
        setIsFormOpen(true);
        setActiveTab("form");
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedTemplate(null);
        setActiveTab("templates");
    };

    const handlePreviewClose = () => {
        setIsPreviewOpen(false);
        setSelectedTemplate(null);
        setPreviewData(null);
        setActiveTab("templates");
    };

    // Template categories for filter
    const templateCategories = [
        { value: "all", label: "All Categories" },
        { value: "AGENCY_REGISTRATION", label: "Agency Registration" }, //done
        {
            value: "AGENCY_COORDINATOR_REGISTRATION",
            label: "Agency Coordinator Registration",
        }, //done
        {
            value: "AGENCY_COORDINATOR_APPROVAL",
            label: "Agency Coordinator Approval",
        }, //done
        {
            value: "AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
            label: "Agency Coordinator Registration Notification to Agency",
        },
        {
            value: "AGENCY_DONOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
            label: "Agency Donor Registration Notification to Agency",
        },
        { value: "AGENCY_APPROVAL", label: "Agency Approval" }, //done
        { value: "AGENCY_REJECTION", label: "Agency Rejection" },
        { value: "DONOR_REGISTRATION", label: "Donor Registration" },
        { value: "DONOR_APPROVAL", label: "Donor Approval" },
        { value: "DONOR_REJECTION", label: "Donor Rejection" },
        { value: "EVENT_CREATION", label: "Event Creation" },
        { value: "APPOINTMENT_BOOKING", label: "Appointment Booking" },
        { value: "MBDT_NOTIFICATION", label: "MBDT Notification" }, //done
        { value: "GENERAL", label: "General" },
        { value: "BLOOD_COLLECTION", label: "Blood Collection" },
        { value: "SYSTEM_NOTIFICATION", label: "System Notification" },
    ];

    // Get category badge color
    const getCategoryBadgeVariant = (category) => {
        const variants = {
            AGENCY_REGISTRATION: "default",
            AGENCY_COORDINATOR_REGISTRATION: "default",
            AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY: "secondary",
            AGENCY_DONOR_REGISTRATION_NOTIFICATION_TO_AGENCY: "secondary",
            AGENCY_APPROVAL: "secondary",
            AGENCY_REJECTION: "destructive",
            DONOR_REGISTRATION: "outline",
            DONOR_APPROVAL: "destructive",
            DONOR_REJECTION: "destructive",
            EVENT_CREATION: "default",
            APPOINTMENT_BOOKING: "secondary",
            MBDT_NOTIFICATION: "destructive",
            BLOOD_COLLECTION: "outline",
            SYSTEM_NOTIFICATION: "destructive",
            GENERAL: "default",
        };
        return variants[category] || "default";
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Mail className="h-8 w-8 text-primary" />
                        Email Notification Templates
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Create and manage email templates for system
                        notifications
                    </p>
                </div>
                <Button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Create Template
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Templates
                                </p>
                                <p className="text-2xl font-bold">
                                    {templates?.data?.length || 0}
                                </p>
                            </div>
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Active Templates
                                </p>
                                <p className="text-2xl font-bold">
                                    {templates?.data?.filter((t) => t.is_active)
                                        .length || 0}
                                </p>
                            </div>
                            <Settings className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Categories
                                </p>
                                <p className="text-2xl font-bold">
                                    {templateCategories?.length - 1 || 0}
                                </p>
                            </div>
                            <Eye className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Last Updated
                                </p>
                                <p className="text-sm font-bold">
                                    {templates?.data?.length > 0
                                        ? new Date(
                                              Math.max(
                                                  ...templates.data.map(
                                                      (t) =>
                                                          new Date(t.updatedAt)
                                                  )
                                              )
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                            <Send className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
            >
                <TabsList className="flex w-full gap-2 bg-muted/50 rounded-lg p-1 mb-2">
                    <TabsTrigger
                        value="templates"
                        className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-colors"
                    >
                        <Mail className="h-4 w-4" />
                        Templates
                    </TabsTrigger>
                    <TabsTrigger
                        value="analytics"
                        className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger
                        value="form"
                        disabled={!isFormOpen}
                        className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-colors disabled:opacity-50"
                    >
                        <Edit className="h-4 w-4" />
                        {selectedTemplate ? "Edit Template" : "New Template"}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-4">
                    {/* Filters */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="Search templates..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templateCategories.map((category) => (
                                            <SelectItem
                                                key={category.value}
                                                value={category.value}
                                            >
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Templates List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Templates</CardTitle>
                            <CardDescription>
                                Manage your email notification templates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-8 text-red-500">
                                    Error loading templates: {error.message}
                                </div>
                            ) : filteredTemplates.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    {searchTerm || selectedCategory !== "all"
                                        ? "No templates match your search criteria"
                                        : "No templates found. Create your first template!"}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredTemplates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold">
                                                        {template.name}
                                                    </h3>
                                                    <Badge
                                                        variant={getCategoryBadgeVariant(
                                                            template.category
                                                        )}
                                                    >
                                                        {template.category.replace(
                                                            /_/g,
                                                            " "
                                                        )}
                                                    </Badge>
                                                    <Badge
                                                        variant={
                                                            template.is_active
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {template.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-1">
                                                    Subject: {template.subject}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Updated:{" "}
                                                    {new Date(
                                                        template.updatedAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handlePreviewTemplate(
                                                            template
                                                        )
                                                    }
                                                >
                                                    View
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEditTemplate(
                                                            template
                                                        )
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteTemplate(
                                                            template.id
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <EmailTemplateAnalytics templates={templates?.data || []} />
                </TabsContent>

                <TabsContent value="form" className="space-y-4">
                    {isFormOpen && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {selectedTemplate
                                        ? "Edit Template"
                                        : "New Template"}
                                </CardTitle>
                                <CardDescription>
                                    {selectedTemplate
                                        ? "Update the email template settings and content"
                                        : "Create a new email notification template"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EmailTemplateForm
                                    template={selectedTemplate}
                                    onSuccess={() => {
                                        handleFormClose();
                                        queryClient.invalidateQueries([
                                            "emailTemplates",
                                        ]);
                                        toast.success(
                                            selectedTemplate
                                                ? "Template updated successfully"
                                                : "Template created successfully"
                                        );
                                    }}
                                    onCancel={handleFormClose}
                                />
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* EmailTemplatePreview modal rendered outside Tabs */}
            {isPreviewOpen && selectedTemplate && previewData && (
                <EmailTemplatePreview
                    template={selectedTemplate}
                    previewData={previewData}
                    sampleDataPreview={sampleDataPreview}
                    isOpen={isPreviewOpen}
                    onClose={handlePreviewClose}
                />
            )}
        </div>
    );
}
