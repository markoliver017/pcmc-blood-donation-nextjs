"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Switch } from "@components/ui/switch";
import { Badge } from "@components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";
import { ScrollArea } from "@components/ui/scroll-area";
import { Separator } from "@components/ui/separator";
import { CheckCircle, XCircle, Save, Eye, EyeOff, Plus, X } from "lucide-react";
import Tiptap from "@components/reusable_components/Tiptap";
import {
    TEMPLATE_CATEGORIES,
    DYNAMIC_FIELDS,
    formatCategoryName,
    getSampleDataForCategory,
} from "@lib/utils/emailTemplateUtils";
import FormLogger from "@lib/utils/FormLogger";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@components/ui/form";
import InlineLabel from "@components/form/InlineLabel";
import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import {
    createEmailTemplateAction,
    updateEmailTemplate,
} from "@action/emailTemplateAction";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";

// Form validation schema
const templateSchema = z.object({
    name: z.string().min(1, "Template name is required"),
    category: z.string().min(1, "Category is required"),
    subject: z.string().min(1, "Subject is required"),
    html_content: z.string().min(1, "Content is required"),
    text_content: z.string().optional(),
    is_active: z.boolean().default(true),
    dynamic_fields: z.array(z.string()).default([]),
});

const EmailTemplateForm = ({
    template = null,
    onSubmit,
    onPreview,
    showPreview = false,
}) => {
    const queryClient = useQueryClient();
    const [selectedFields, setSelectedFields] = useState(
        template?.dynamic_fields || []
    );
    const [showFieldSelector, setShowFieldSelector] = useState(false);
    const [previewData, setPreviewData] = useState({});

    const form = useForm({
        resolver: zodResolver(templateSchema),
        defaultValues: {
            name: template?.name || "",
            category: template?.category || "",
            subject: template?.subject || "",
            html_content: template?.html_content || "",
            text_content: template?.text_content || "",
            is_active: template?.is_active ?? true,
            dynamic_fields: template?.dynamic_fields || [],
        },
    });

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = form;

    const watchedCategory = watch("category");

    // Function to create default template for AGENCY_REGISTRATION
    const createDefaultAgencyRegistrationTemplate = () => {
        const defaultSubject =
            "🩸 Welcome to PCMC Pediatric Blood Center - Your Agency Registration is Received";

        const defaultHtmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🩸 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Blood Donation Management System</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear {{user_name}},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                Thank you for registering <strong>{{agency_name}}</strong> as a partner agency in our blood donation initiative. We are excited to welcome you to our network of organizations dedicated to saving lives through blood donation.
            </p>
        </div>

        <!-- Status Information -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">📋 Application Status: Under Review</h3>
            <p style="color: #92400e; margin: 0; line-height: 1.5;">
                Your application is currently being reviewed by our <strong>Mobile Blood Donation Team (MBDT)</strong>. 
                This process typically takes 2-3 business days. You will receive a confirmation email once your account is approved.
            </p>
        </div>

        <!-- Agency Details -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🏢 Your Agency Information</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Agency Name:</td>
                        <td style="padding: 8px 0; color: #374151;">{{agency_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Contact Person:</td>
                        <td style="padding: 8px 0; color: #374151;">{{user_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email Address:</td>
                        <td style="padding: 8px 0; color: #374151;">{{user_email}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Address:</td>
                        <td style="padding: 8px 0; color: #374151;">{{agency_address}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Registration Date:</td>
                        <td style="padding: 8px 0; color: #374151;">{{registration_date}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 What Happens Next?</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ol style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Review Process:</strong> Our MBDT will review your application and verify the provided information.</li>
                    <li><strong>Account Activation:</strong> Once approved, you'll receive login credentials and access to the portal.</li>
                    <li><strong>Training & Onboarding:</strong> We'll provide training materials and guidance for using the system.</li>
                    <li><strong>Event Creation:</strong> You'll be able to create and manage blood donation events.</li>
                </ol>
            </div>
        </div>

        <!-- Important Notes -->
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px;">⚠️ Important Notes:</h4>
            <ul style="color: #991b1b; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>You will not be able to log in or use the platform until your registration is approved.</li>
                <li>Please ensure all provided information is accurate and up-to-date.</li>
                <li>Keep this email for your records and future reference.</li>
            </ul>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Help?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you have any questions about your registration or need assistance, please don't hesitate to contact us:
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 5px 0; color: #374151;">
                    <strong>Email:</strong> {{support_email}}<br>
                    <strong>Phone:</strong> +63 2 8XXX XXXX<br>
                    <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #dc2626; text-decoration: none;">{{domain_url}}</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Thank you for partnering with us in our mission to save lives through blood donation.<br>
                <strong>PCMC Pediatric Blood Center</strong><br>
                <em>Empowering communities, one donation at a time.</em>
            </p>
        </div>
    </div>
    
    <!-- Footer Note -->
    <div style="text-align: center; margin-top: 20px;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            This is an automated message. Please do not reply to this email.<br>
            For support, contact us at {{support_email}}
        </p>
    </div>
</div>`;

        const defaultTextContent = `Dear {{user_name}},

Thank you for registering {{agency_name}} as a partner agency in our blood donation initiative. We are excited to welcome you to our network of organizations dedicated to saving lives through blood donation.

APPLICATION STATUS: UNDER REVIEW
Your application is currently being reviewed by our Mobile Blood Donation Team (MBDT). This process typically takes 2-3 business days. You will receive a confirmation email once your account is approved.

YOUR AGENCY INFORMATION:
- Agency Name: {{agency_name}}
- Contact Person: {{user_name}}
- Email Address: {{user_email}}
- Address: {{agency_address}}
- Registration Date: {{registration_date}}

WHAT HAPPENS NEXT?
1. Review Process: Our MBDT will review your application and verify the provided information.
2. Account Activation: Once approved, you'll receive login credentials and access to the portal.
3. Training & Onboarding: We'll provide training materials and guidance for using the system.
4. Event Creation: You'll be able to create and manage blood donation events.

IMPORTANT NOTES:
- You will not be able to log in or use the platform until your registration is approved.
- Please ensure all provided information is accurate and up-to-date.
- Keep this email for your records and future reference.

NEED HELP?
If you have any questions about your registration or need assistance, please contact us:
- Email: {{support_email}}
- Phone: +63 2 8XXX XXXX
- Portal: {{domain_url}}

Thank you for partnering with us in our mission to save lives through blood donation.

PCMC Pediatric Blood Center
Empowering communities, one donation at a time.

---
This is an automated message. Please do not reply to this email.
For support, contact us at {{support_email}}`;

        return {
            subject: defaultSubject,
            html_content: defaultHtmlContent,
            text_content: defaultTextContent,
            dynamic_fields: [
                "user_name",
                "user_email",
                "user_first_name",
                "user_last_name",
                "agency_name",
                "agency_address",
                "registration_date",
                "system_name",
                "support_email",
                "domain_url",
            ],
        };
    };

    // Set default template when category is AGENCY_REGISTRATION and no template exists
    useEffect(() => {
        if (
            watchedCategory === "AGENCY_REGISTRATION" &&
            !template &&
            !form.getValues("name")
        ) {
            const defaultTemplate = createDefaultAgencyRegistrationTemplate();
            setValue("subject", defaultTemplate.subject);
            setValue("html_content", defaultTemplate.html_content);
            setValue("text_content", defaultTemplate.text_content);
            setSelectedFields(defaultTemplate.dynamic_fields);
        }
    }, [watchedCategory, template, setValue, form]);

    // TanStack Query mutations
    const createMutation = useMutation({
        mutationFn: async (formData) => {
            const res = await createEmailTemplateAction(formData);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["email-templates"] });
            SweetAlert({
                title: "Email Template Created",
                text: "Email template has been created successfully.",
                icon: "success",
                confirmButtonText: "Okay",
                onConfirm: () => {
                    if (onSubmit) {
                        onSubmit(data);
                    }
                },
            });
        },
        onError: (error) => {
            notify({
                error: true,
                message: error?.message || "Failed to create email template",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, formData }) => {
            const res = await updateEmailTemplate(id, formData);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["email-templates"] });
            SweetAlert({
                title: "Email Template Updated",
                text: "Email template has been updated successfully.",
                icon: "success",
                confirmButtonText: "Okay",
                onConfirm: () => {
                    if (onSubmit) {
                        onSubmit(data);
                    }
                },
            });
        },
        onError: (error) => {
            notify({
                error: true,
                message: error?.message || "Failed to update email template",
            });
        },
    });

    // Update sample data when category changes
    useEffect(() => {
        if (watchedCategory) {
            const sampleData = getSampleDataForCategory(watchedCategory);
            setPreviewData(sampleData);
        }
    }, [watchedCategory]);

    // Handle form submission
    const handleFormSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("category", data.category);
            formData.append("subject", data.subject);
            formData.append("html_content", data.html_content);
            formData.append("text_content", data.text_content || "");
            formData.append("is_active", data.is_active.toString());
            formData.append("dynamic_fields", JSON.stringify(selectedFields));

            if (template) {
                // Update existing template
                updateMutation.mutate({ id: template.id, formData });
            } else {
                // Create new template
                createMutation.mutate(formData);
            }
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };

    // Handle dynamic field insertion
    const insertField = (field) => {
        const fieldPlaceholder = `{{${field}}}`;

        // Add to selected fields if not already selected
        if (!selectedFields.includes(field)) {
            setSelectedFields((prev) => [...prev, field]);
        }

        // Show a simple alert to let user know the field was added
        // They can manually type it where they want
        alert(
            `Field ${fieldPlaceholder} added to selected fields. You can manually type it in the subject or content area.`
        );
        setShowFieldSelector(false);
    };

    // Handle preview
    const handlePreview = async () => {
        try {
            const formValues = getValues();
            const response = await fetch("/api/email-templates/preview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    template: {
                        subject: formValues.subject,
                        html_content: formValues.html_content,
                        text_content: formValues.text_content,
                    },
                    sampleData: previewData,
                }),
            });

            if (response.ok) {
                const previewResult = await response.json();
                onPreview(previewResult);
                // setShowPreview(true);
            }
        } catch (error) {
            console.error("Preview error:", error);
        }
    };

    return (
        <Form {...form}>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {template
                            ? "Edit Email Template"
                            : "Create Email Template"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="space-y-6">
                            {/* Template Name */}
                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="name">
                                            Template Name
                                        </Label>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="Enter template name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Category */}
                            <FormField
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="category">
                                            Category
                                        </Label>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {TEMPLATE_CATEGORIES.map(
                                                    (category) => (
                                                        <SelectItem
                                                            key={category}
                                                            value={category}
                                                        >
                                                            {formatCategoryName(
                                                                category
                                                            )}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Subject */}
                            <FormField
                                control={control}
                                name="subject"
                                render={({ field: { value, onChange } }) => (
                                    <FormItem>
                                        <Label htmlFor="subject">Subject</Label>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input
                                                    id="subject"
                                                    placeholder="Enter email subject (supports {{dynamic_fields}})"
                                                    value={value}
                                                    onChange={onChange}
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setShowFieldSelector(true)
                                                }
                                                title="Insert Dynamic Field"
                                            >
                                                {`{{}}`}
                                            </Button>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            You can use dynamic fields like{" "}
                                            {
                                                "{{ user_name }}, {{ agency_name }}"
                                            }
                                            , etc. in the subject line.
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Dynamic Fields */}
                            <div>
                                <Label>Dynamic Fields</Label>
                                <div className="flex items-center gap-2 mt-2">
                                    <Dialog
                                        open={showFieldSelector}
                                        onOpenChange={setShowFieldSelector}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Field
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Select Dynamic Field
                                                </DialogTitle>
                                            </DialogHeader>
                                            <ScrollArea className="h-64">
                                                <div className="grid grid-cols-1 gap-2">
                                                    {Object.entries(
                                                        DYNAMIC_FIELDS
                                                    ).map(([key, field]) => (
                                                        <div
                                                            key={key}
                                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                                            onClick={() =>
                                                                insertField(key)
                                                            }
                                                        >
                                                            <div>
                                                                <div className="font-medium">
                                                                    {
                                                                        field.label
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {
                                                                        field.description
                                                                    }
                                                                </div>
                                                            </div>
                                                            <Badge variant="secondary">
                                                                {`{{${key}}}`}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </DialogContent>
                                    </Dialog>

                                    {selectedFields.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {selectedFields.map((field) => (
                                                <Badge
                                                    key={field}
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    {`{{${field}}}`}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedFields(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (f) =>
                                                                            f !==
                                                                            field
                                                                    )
                                                            )
                                                        }
                                                        className="ml-1 hover:text-red-500"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* HTML Content */}
                            <FormField
                                control={control}
                                name="html_content"
                                render={({ field: { value, onChange } }) => (
                                    <FormItem>
                                        <Label htmlFor="html_content">
                                            HTML Content
                                        </Label>
                                        <FormControl>
                                            <Tiptap
                                                content={value}
                                                onContentChange={onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Text Content */}
                            <FormField
                                control={control}
                                name="html_content"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="html_content">
                                            HTML Content
                                        </Label>
                                        <FormControl>
                                            <Textarea
                                                id="html_content"
                                                placeholder="Enter HTML version of the email"
                                                rows={20}
                                                className="w-full mt-1 p-2"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Text Content */}
                            <FormField
                                control={control}
                                name="text_content"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="text_content">
                                            Plain Text Content (Optional)
                                        </Label>
                                        <FormControl>
                                            <Textarea
                                                id="text_content"
                                                placeholder="Enter plain text version of the email"
                                                rows={10}
                                                className="w-full mt-1 p-2"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Active Status */}
                            <FormField
                                control={control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="is_active">
                                                Active Status
                                            </Label>
                                            <div className="text-sm text-gray-500">
                                                Enable or disable this template
                                            </div>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                id="is_active"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePreview}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        createMutation.isPending ||
                                        updateMutation.isPending
                                    }
                                >
                                    {createMutation.isPending ||
                                    updateMutation.isPending ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </div>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            {template
                                                ? "Update Template"
                                                : "Create Template"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                    <FormLogger
                        watch={watch}
                        errors={errors}
                        data={createMutation.data || updateMutation.data}
                    />
                </CardContent>
            </Card>
        </Form>
    );
};

export default EmailTemplateForm;
