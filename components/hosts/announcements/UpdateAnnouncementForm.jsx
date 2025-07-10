"use client";

import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { updateAnnouncementSchema } from "@lib/zod/announcementSchema";
import DisplayValidationErrors from "@components/form/DisplayValidationErrors";
import notify from "@components/ui/notify";
import LoadingModal from "@components/layout/LoadingModal";
import {
    updateAnnouncement,
    fetchAnnouncement,
} from "@action/announcementAction";
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
import { fetchAgencyByRole } from "@/action/agencyAction";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import FormLogger from "@lib/utils/FormLogger";

export default function UpdateAnnouncementForm({ announcementId }) {
    // Fetch announcement data
    const { data: announcement, isLoading: isLoadingAnnouncement } = useQuery({
        queryKey: ["announcement", announcementId],
        queryFn: async () => {
            const res = await fetchAnnouncement(announcementId);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        enabled: !!announcementId,
    });

    if (isLoadingAnnouncement) return <Skeleton_form />;

    if (!announcement) return <div>Announcement not found</div>;
    if (!announcement?.agency)
        return <div>Agency information not available</div>;

    return (
        <AnnouncementForm
            announcement={announcement}
            agency={announcement?.agency}
        />
    );
}

function AnnouncementForm({ announcement, agency }) {
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = useRef(null);
    const tiptapRef = useRef(null);

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(updateAnnouncementSchema),
        defaultValues: {
            title: announcement?.title || "",
            body: announcement?.body || "",
            is_public: announcement?.is_public || false, // Keep existing value
            file_url: announcement?.file_url || null,
            file: null,
        },
    });

    const {
        watch,
        handleSubmit,
        setValue,
        setError,
        getValues,
        trigger,
        resetField,
        formState: { errors, isDirty },
    } = form;

    // Mutation for update
    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateAnnouncement(announcement.id, formData);
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
            queryClient.invalidateQueries({
                queryKey: ["announcement", announcement.id],
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
                    message: error?.message || "Failed to update announcement",
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

    const debouncedUpdate = debounce(
        async (value, name, trigger, getValues, mutate) => {
            const isValid = await trigger(name);
            if (isValid) {
                const formData = getValues();
                mutate(formData);
            }
        },
        1000
    );

    const uploaded_file = watch("file");
    const uploaded_file_url = watch("file_url");
    let file = null;
    if (!errors?.file && uploaded_file instanceof File) {
        file = URL.createObjectURL(uploaded_file);
    } else if (uploaded_file_url) {
        file = uploaded_file_url;
    }

    return (
        <Card className="mt-5 shadow-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-5">
                    <span>Update Announcement</span>
                    {(isPending || isUploading) && (
                        <span className="flex-items-center text-blue-500">
                            <span className="loading loading-bars loading-xs"></span>
                            <span className="italic text-md">Updating...</span>
                        </span>
                    )}
                </CardTitle>
                <CardDescription>
                    <span>Update the announcement details and content.</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form id="form-modal" className="space-y-6 ">
                        <DisplayValidationErrors />

                        {/* Agency Information Display (read-only) */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-md border dark:border-gray-700">
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
                                        onChange={(e) => {
                                            field.onChange(e);
                                            debouncedUpdate(
                                                e.target.value,
                                                e.target.name,
                                                trigger,
                                                getValues,
                                                mutate
                                            );
                                        }}
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
                                            debouncedUpdate(
                                                content,
                                                "body",
                                                trigger,
                                                getValues,
                                                mutate
                                            );
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
                            render={({
                                field: { onChange, value, ...field },
                            }) => {
                                const handleFileChange = async (e) => {
                                    const uploadedFile = e.target.files[0];
                                    if (uploadedFile) {
                                        setIsUploading(true);
                                        onChange(uploadedFile);

                                        const result = await uploadPicture(
                                            uploadedFile
                                        );
                                        if (!result.success) {
                                            notify({
                                                error: true,
                                                message:
                                                    result?.message ||
                                                    "Upload failed: Please re-upload and try again!",
                                            });
                                            setIsUploading(false);
                                            resetField("file");
                                            return;
                                        }

                                        const file_url =
                                            result.file_data?.url || null;
                                        setValue("file_url", file_url);
                                        const isValid = await trigger([
                                            "file",
                                            "file_url",
                                        ]);
                                        if (isValid) {
                                            const formData = getValues();
                                            mutate(formData);
                                        }
                                        setIsUploading(false);
                                    }
                                };
                                return (
                                    <FormItem>
                                        <InlineLabel
                                            required={false}
                                            optional={true}
                                        >
                                            Upload Image{" "}
                                        </InlineLabel>
                                        <div className="space-y-4">
                                            <FormControl
                                                ref={fileInputRef}
                                                className="hidden"
                                            >
                                                <Input
                                                    type="file"
                                                    tabIndex={-1}
                                                    onChange={handleFileChange}
                                                    {...field}
                                                />
                                            </FormControl>
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
                                                    <div className="space-y-2">
                                                        <BiUpload className="mx-auto h-8 w-8 text-gray-400" />
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Drag and drop an
                                                            image here, or{" "}
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
                                                            Supports: JPG, PNG,
                                                            GIF (Max 5MB)
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Image Preview */}
                                            {file && (
                                                <div className="flex items-center gap-2 justify-center border dark:border-gray-700 rounded-lg">
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
                                                                resetField(
                                                                    "file"
                                                                );
                                                                setValue(
                                                                    "file_url",
                                                                    null
                                                                );
                                                                debouncedUpdate(
                                                                    null,
                                                                    "file_url",
                                                                    trigger,
                                                                    getValues,
                                                                    mutate
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
                                );
                            }}
                        />
                    </form>
                </Form>
                <FormLogger watch={watch} errors={errors} />
            </CardContent>
        </Card>
    );
}
