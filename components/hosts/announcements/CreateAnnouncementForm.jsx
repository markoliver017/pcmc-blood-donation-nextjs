"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, FormField, FormItem, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import {
    agencyAnnouncementSchema,
    announcementSchema,
    createAnnouncementSchema,
} from "@lib/zod/announcementSchema";
import DisplayValidationErrors from "@components/form/DisplayValidationErrors";
import notify from "@components/ui/notify";
import LoadingModal from "@components/layout/LoadingModal";
import { storeAnnouncement } from "@action/announcementAction";
import Skeleton_form from "@components/ui/Skeleton_form";
import clsx from "clsx";
import { toastCatchError, toastError } from "@lib/utils/toastError.utils";
import SweetAlert from "@components/ui/SweetAlert";
import InlineLabel from "@components/form/InlineLabel";
import { uploadPicture } from "@/action/uploads";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from "@components/ui/card";
import React from "react";
import { BiTrash, BiUpload } from "react-icons/bi";
import Tiptap from "@components/reusable_components/Tiptap";
import ImagePreviewComponent from "@components/reusable_components/ImagePreviewComponent";
import { MdPublish } from "react-icons/md";
import Image from "next/image";
import { getAgencyId } from "@/action/hostEventAction";
import { fetchAgencyByRole } from "@/action/agencyAction";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import FormLogger from "@lib/utils/FormLogger";

export default function CreateAnnouncementForm({ agency, onSuccess }) {
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = useRef(null);
    const tiptapRef = useRef(null);

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            title: "",
            body: "",
            is_public: false, // Default to false for hosts/organizers
            file_url: null,
            file: null,
        },
    });

    const {
        watch,
        handleSubmit,
        setValue,
        setError,
        resetField,
        formState: { errors, isDirty },
    } = form;

    // Mutation for create
    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await storeAnnouncement(formData);
            if (!res.success) {
                throw res;
            }
            return res;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["host-announcements"],
            });
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            SweetAlert({
                title: "Announcement Created",
                text: response.message || "Announcement created successfully",
                icon: "success",
                confirmButtonText: "Done",
                onConfirm: () => onSuccess(),
            });
        },
        onError: (error) => {
            if (error?.type === "validation" && error?.errorArr?.length) {
                toastError(error);
            } else if (
                error?.type === "catch_validation_error" &&
                error?.errors?.length
            ) {
                toastCatchError(error, setError);
            } else {
                notify({
                    error: true,
                    message: error?.message || "Failed to create announcement",
                });
            }
        },
    });

    // Handle file upload and form submission
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setValue("file", file, { shouldValidate: true });
        }
    };

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Create Announcement",
            text: "Are you sure you want to create this announcement?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Create",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                let uploadErrors = false;
                if (formData.file && formData.file instanceof File) {
                    setIsUploading(true);
                    const result = await uploadPicture(formData.file);
                    setIsUploading(false);
                    if (result?.success) {
                        formData.file_url = result.file_data?.url || null;
                        setValue("file_url", result.file_data?.url);
                    } else {
                        uploadErrors = true;
                        notify({ error: true, message: result.message });
                    }
                }
                if (uploadErrors) return;
                mutate(formData);
            },
        });
    };

    const uploaded_file = watch("file");
    const uploaded_file_url = watch("file_url");
    const file =
        !errors?.file && uploaded_file
            ? URL.createObjectURL(uploaded_file)
            : uploaded_file_url || null;

    if (!agency) return <div>Agency information not available</div>;

    return (
        <Card className="mt-5 shadow-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <CardHeader>
                <CardTitle className="text-2xl">New Announcement</CardTitle>
                <CardDescription>
                    Create a new announcement for your agency. This announcement
                    will be visible only to your agency's donors
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LoadingModal isLoading={isPending || isUploading}>
                    {isPending ? "Creating..." : "Create Announcement"}
                </LoadingModal>
                <Form {...form}>
                    <form
                        id="form-modal"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <DisplayValidationErrors />

                        {/* Agency Information Display (read-only) */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                            <div className="w-32 h-32 flex-none">
                                <CustomAvatar
                                    avatar={
                                        agency?.file_url ||
                                        "/default_company_avatar.png"
                                    }
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    {agency?.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {agency?.agency_address}
                                </p>
                            </div>
                        </div>
                        {/* Title Field */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Title</InlineLabel>
                                    <Input
                                        {...field}
                                        placeholder="Enter announcement title"
                                        className="w-full"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Body Field with Tiptap */}
                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Content</InlineLabel>
                                    <Tiptap
                                        ref={tiptapRef}
                                        content={field.value}
                                        onContentChange={(content) => {
                                            field.onChange(content);
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image Upload */}
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field: { onChange, ...field } }) => (
                                <FormItem>
                                    <InlineLabel
                                        required={false}
                                        optional={true}
                                    >
                                        Upload Image{" "}
                                    </InlineLabel>
                                    <div className="space-y-4">
                                        {!file && (
                                            <div
                                                className={clsx(
                                                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                                                    errors.file
                                                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                                )}
                                                onDrop={handleDrop}
                                                onDragOver={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files[0];
                                                        if (file) {
                                                            onChange(file);
                                                            setValue(
                                                                "file",
                                                                file,
                                                                {
                                                                    shouldValidate: true,
                                                                }
                                                            );
                                                        }
                                                    }}
                                                />
                                                <div className="space-y-2">
                                                    <BiUpload className="mx-auto h-8 w-8 text-gray-400" />
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Drag and drop an image
                                                        here, or{" "}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                fileInputRef.current?.click()
                                                            }
                                                            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                                                        >
                                                            browse
                                                        </button>
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        Supports: JPG, PNG, GIF
                                                        (Max 5MB)
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Image Preview */}
                                        {file && (
                                            <div className="flex items-center gap-2 justify-center border">
                                                <div className="h-40 w-40">
                                                    <Image
                                                        src={file}
                                                        alt="Announcement Image"
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <ImagePreviewComponent
                                                        imgSrc={file}
                                                        className="btn-sm btn-outline"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            resetField("file");
                                                            resetField(
                                                                "file_url"
                                                            );
                                                            if (
                                                                fileInputRef.current
                                                            ) {
                                                                fileInputRef.current.value =
                                                                    "";
                                                            }
                                                        }}
                                                        className="btn-sm btn-outline"
                                                    >
                                                        <BiTrash className="h-4 w-4" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <CardFooter className="border-t py-2 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onSuccess}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={isPending || !isDirty}
                            >
                                <MdPublish />
                                Publish
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
                {/* <FormLogger watch={watch} errors={errors} /> */}
            </CardContent>
        </Card>
    );
}
