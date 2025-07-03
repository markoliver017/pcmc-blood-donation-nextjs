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
                setShowPreview(true);
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
                                name="text_content"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="text_content">
                                            Plain Text Content
                                        </Label>
                                        <FormControl>
                                            <Textarea
                                                id="text_content"
                                                placeholder="Enter plain text version of the email"
                                                rows={4}
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
