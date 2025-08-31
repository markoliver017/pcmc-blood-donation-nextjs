"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, FormField, FormItem } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";
import { bloodRequestSchema } from "@lib/zod/bloodRequestSchema";
import FieldError from "@components/form/FieldError";
import DisplayValidationErrors from "@components/form/DisplayValidationErrors";
import notify from "@components/ui/notify";
import LoadingModal from "@components/layout/LoadingModal";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { getSingleStyle } from "@/styles/select-styles";
import {
    fetchBloodTypes,
    fetchAgencyDonors,
    fetchBloodRequest,
    updateBloodRequest,
} from "@action/bloodRequestAction";
import Skeleton_form from "@components/ui/Skeleton_form";
import clsx from "clsx";
import { toastCatchError, toastError } from "@lib/utils/toastError.utils";
import SweetAlert from "@components/ui/SweetAlert";
import FormLogger from "@lib/utils/FormLogger";
import InlineLabel from "@components/form/InlineLabel";
import { uploadPdfFile, uploadPicture } from "@/action/uploads";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from "@components/ui/card";
import React from "react";
import { BiExport, BiTrash, BiUpload } from "react-icons/bi";

// Disable SSR for PdfPreviewComponent
const PdfPreviewComponent = dynamic(
    () => import("@components/reusable_components/PdfPreviewComponent"),
    { ssr: false }
);

const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), {
    ssr: false,
});

export default function UpdateBloodRequestForm({ bloodRequestId, onSuccess }) {
    // Fetch the blood request to update
    const { data: requestResponse, isLoading: isLoadingRequest } = useQuery({
        queryKey: ["blood-request", bloodRequestId],
        queryFn: () => fetchBloodRequest(bloodRequestId),
        enabled: !!bloodRequestId,
        staleTime: 0,
        cacheTime: 0,
    });

    const req = requestResponse?.data;

    // Fetch blood types
    const { data: bloodTypesResponse } = useQuery({
        queryKey: ["blood-types"],
        queryFn: fetchBloodTypes,
    });
    const bloodTypes = bloodTypesResponse?.success
        ? bloodTypesResponse.data
        : [];

    // Fetch agency donors
    const { data: donors, isLoading: isLoadingDonors } = useQuery({
        queryKey: ["agency-donors"],
        queryFn: async () => {
            const response = await fetchAgencyDonors();
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    // Setup form

    if (!requestResponse?.success) {
        return (
            <div className="text-center py-4 text-red-500">
                {requestResponse?.message || "Failed to load request"}
            </div>
        );
    }

    if (isLoadingRequest || isLoadingDonors) return <Skeleton_form />;

    return (
        <BloodRequestForm
            req={req}
            donors={donors}
            bloodTypes={bloodTypes}
            onSuccess={onSuccess}
        />
    );
}

function BloodRequestForm({ req, donors, bloodTypes, onSuccess }) {
    const { resolvedTheme } = useTheme();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = useRef(null);

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(bloodRequestSchema),
        defaultValues: {
            id: req?.id || "",
            agency_id: req?.agency_id || "",
            blood_component: req?.blood_component
                ? String(req.blood_component)
                : "",
            blood_type_id: req?.blood_type_id ? String(req.blood_type_id) : "",
            no_of_units: req?.no_of_units || "",
            diagnosis: req?.diagnosis || "",
            date: req?.date ? req.date.slice(0, 10) : "",
            hospital_name: req?.hospital_name || "",
            user_id: req?.user_id || null,
            patient_name: req?.patient_name || "",
            patient_date_of_birth: req?.patient_date_of_birth
                ? req.patient_date_of_birth.slice(0, 10)
                : "",
            patient_gender: req?.patient_gender
                ? String(req.patient_gender)
                : "",
            is_registered_donor: req?.user_id ? true : false,
            file_url: req?.file_url || null,
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

    // Mutation for update
    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateBloodRequest(req.id, formData);
            if (!res.success) {
                throw res;
            }
            return res;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["blood-requests"] });
            queryClient.invalidateQueries({
                queryKey: ["blood-request", req.id],
            });
            SweetAlert({
                title: "Request Updated",
                text: response.message || "Blood request updated successfully",
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
                    message: error?.message || "Failed to update request",
                });
            }
        },
    });

    const watchIsRegisteredDonor = watch("is_registered_donor");
    useEffect(() => {
        if (!watchIsRegisteredDonor) {
            setValue("user_id", null);
        }
    }, [watchIsRegisteredDonor]);

    const uploaded_file = watch("file");
    const uploaded_file_url = watch("file_url");
    const file =
        !errors?.file && uploaded_file
            ? URL.createObjectURL(uploaded_file)
            : uploaded_file_url || null;

    console.log("file_url", watch("file_url"));

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            setValue("file", file, { shouldValidate: true });
        }
    };

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Update Blood Request",
            text: "Are you sure you want to update this request?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                let uploadErrors = false;
                if (formData.file && formData.file instanceof File) {
                    setIsUploading(true);
                    const result = await uploadPdfFile(formData.file);
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

    return (
        <Card className=" shadow-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Blood Request - {req?.blood_request_reference_id || req?.id}
                </CardTitle>
                <CardDescription>
                    Update the blood request details.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        id="form-modal"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="blood_component"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Blood Component
                                        </label>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={req?.status !== "pending"}
                                            tabIndex={1}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select component" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="whole blood">
                                                    Whole Blood
                                                </SelectItem>
                                                <SelectItem value="plasma">
                                                    Plasma
                                                </SelectItem>
                                                <SelectItem value="platelets">
                                                    Platelets
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FieldError
                                            field={errors?.blood_component}
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="blood_type_id"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Blood Type
                                        </label>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={req?.status !== "pending"}
                                            tabIndex={2}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select blood type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bloodTypes?.map((type) => (
                                                    <SelectItem
                                                        key={type.id}
                                                        value={String(type.id)}
                                                    >
                                                        {type.blood_type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError
                                            field={errors?.blood_type_id}
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_registered_donor"
                                render={({ field }) => (
                                    <FormItem>
                                        <label className="text-sm font-medium">
                                            Registered Donor?
                                        </label>
                                        <div className="flex gap-7 mt-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    className={clsx(
                                                        "radio",
                                                        errors?.is_registered_donor
                                                            ? "radio-error"
                                                            : "radio-info"
                                                    )}
                                                    tabIndex={3}
                                                    disabled={
                                                        req?.status !==
                                                        "pending"
                                                    }
                                                    value={true}
                                                    checked={
                                                        field.value === true
                                                    }
                                                    onChange={() =>
                                                        field.onChange(true)
                                                    }
                                                />
                                                <span
                                                    className={clsx(
                                                        "label-text mr-2"
                                                    )}
                                                >
                                                    Yes
                                                </span>
                                            </label>
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    className={clsx(
                                                        "radio",
                                                        errors?.is_registered_donor
                                                            ? "radio-error"
                                                            : "radio-info"
                                                    )}
                                                    tabIndex={1}
                                                    value={false}
                                                    checked={
                                                        field.value === false
                                                    }
                                                    onChange={() =>
                                                        field.onChange(false)
                                                    }
                                                />
                                                <span
                                                    className={clsx(
                                                        "label-text mr-2"
                                                    )}
                                                >
                                                    No
                                                </span>
                                            </label>
                                        </div>
                                        <FieldError
                                            field={errors?.is_registered_donor}
                                        />
                                    </FormItem>
                                )}
                            />

                            {/* Show donor selection only if registered donor */}
                            {watchIsRegisteredDonor && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Select Registered Donor
                                    </label>
                                    <Controller
                                        control={form.control}
                                        name="user_id"
                                        render={({
                                            field: {
                                                onChange,
                                                value,
                                                name,
                                                ref,
                                            },
                                        }) => {
                                            const donorsOptions = donors?.map(
                                                (donor) => ({
                                                    value: donor?.user
                                                        ?.full_name,
                                                    label: donor?.user
                                                        ?.full_name,
                                                    user_id: donor?.user?.id,
                                                })
                                            );
                                            const selectedOption =
                                                donorsOptions.find(
                                                    (option) =>
                                                        option?.user_id ===
                                                        value
                                                ) || null;
                                            return (
                                                <CreatableSelectNoSSR
                                                    name={name}
                                                    ref={ref}
                                                    value={selectedOption}
                                                    onChange={(option) => {
                                                        // Clear patient fields when donor is selected
                                                        if (option?.value) {
                                                            setValue(
                                                                "patient_name",
                                                                ""
                                                            );
                                                            setValue(
                                                                "patient_date_of_birth",
                                                                ""
                                                            );
                                                            setValue(
                                                                "patient_gender",
                                                                "male"
                                                            );
                                                        }
                                                        onChange(
                                                            option
                                                                ? option.user_id
                                                                : null
                                                        );
                                                    }}
                                                    styles={getSingleStyle(
                                                        resolvedTheme
                                                    )}
                                                    tabIndex={4}
                                                    isOptionDisabled={() =>
                                                        req?.status !==
                                                        "pending"
                                                    }
                                                    isClearable={
                                                        req?.status ===
                                                        "pending"
                                                    }
                                                    isValidNewOption={() =>
                                                        false
                                                    }
                                                    placeholder="Search for registered donors..."
                                                    options={donorsOptions}
                                                    className="react-select"
                                                    noOptionsMessage={() =>
                                                        "No donors found"
                                                    }
                                                />
                                            );
                                        }}
                                    />
                                    <FieldError field={errors?.user_id} />
                                </div>
                            )}

                            {/* Show patient fields only if NOT a registered donor */}
                            {!watchIsRegisteredDonor && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Patient Name
                                        </label>
                                        <Input
                                            {...form.register("patient_name")}
                                            disabled={req?.status !== "pending"}
                                            tabIndex={5}
                                        />
                                        <FieldError
                                            field={errors?.patient_name}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Patient Date of Birth
                                        </label>
                                        <Input
                                            type="date"
                                            {...form.register(
                                                "patient_date_of_birth"
                                            )}
                                            disabled={req?.status !== "pending"}
                                            tabIndex={6}
                                        />
                                        <FieldError
                                            field={
                                                errors?.patient_date_of_birth
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Patient Gender
                                        </label>
                                        <Select
                                            onValueChange={(value) =>
                                                setValue(
                                                    "patient_gender",
                                                    value
                                                )
                                            }
                                            value={String(
                                                watch("patient_gender") ?? ""
                                            )}
                                            disabled={req?.status !== "pending"}
                                            tabIndex={7}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">
                                                    Male
                                                </SelectItem>
                                                <SelectItem value="female">
                                                    Female
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FieldError
                                            field={errors?.patient_gender}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Number of Units
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    {...form.register("no_of_units", {
                                        valueAsNumber: true,
                                    })}
                                    disabled={req?.status !== "pending"}
                                    tabIndex={8}
                                />
                                <FieldError field={errors?.no_of_units} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Date Needed
                                </label>
                                <Input
                                    type="date"
                                    {...form.register("date")}
                                    disabled={req?.status !== "pending"}
                                    tabIndex={9}
                                />
                                <FieldError field={errors?.date} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Hospital Name
                                </label>
                                <Input
                                    {...form.register("hospital_name")}
                                    disabled={req?.status !== "pending"}
                                    tabIndex={10}
                                />
                                <FieldError field={errors?.hospital_name} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Diagnosis/Reason
                                </label>
                                <Textarea
                                    className="dark:bg-inherit"
                                    {...form.register("diagnosis")}
                                    disabled={req?.status !== "pending"}
                                    tabIndex={11}
                                />
                                <FieldError field={errors?.diagnosis} />
                            </div>
                        </div>
                        {/* File Upload Field */}
                        <div className="space-y-2">
                            <InlineLabel>Attachment (PDF only)</InlineLabel>
                            <FormField
                                control={form.control}
                                name="file"
                                render={({ field }) => (
                                    <FormItem>
                                        <Input
                                            type="file"
                                            className="hidden"
                                            accept="application/pdf"
                                            ref={fileInputRef}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    field.onChange(file);
                                                }
                                            }}
                                        />
                                        {!file && (
                                            <div
                                                className={clsx(
                                                    "flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-blue-400 transition",
                                                    {
                                                        "bg-green-50 border-green-400":
                                                            file,
                                                    }
                                                )}
                                                onDrop={handleDrop}
                                                onDragOver={(e) =>
                                                    e.preventDefault()
                                                }
                                                onClick={() =>
                                                    fileInputRef.current.click()
                                                }
                                            >
                                                <BiUpload className="text-3xl text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    Drag and drop a PDF file
                                                    here, or{" "}
                                                    <span className="underline">
                                                        click to select
                                                    </span>
                                                </p>
                                                {file && (
                                                    <p className="mt-2 text-sm text-green-700 font-medium">
                                                        {file.name}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        {/* Show file name if already uploaded or selected */}
                                        {file && (
                                            <div className="flex flex-wrap justify-between">
                                                <PdfPreviewComponent
                                                    pdfSrc={file}
                                                    triggerContent={
                                                        <>
                                                            <BiExport />
                                                            Preview -
                                                            <span className="text-xs max-w-56 truncate text-ellipsis">
                                                                {field?.value
                                                                    ?.name ||
                                                                    uploaded_file_url}
                                                            </span>
                                                        </>
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline btn-error btn-sm"
                                                    onClick={() => {
                                                        resetField("file");
                                                        setValue(
                                                            "file_url",
                                                            null
                                                        );
                                                    }}
                                                >
                                                    <BiTrash />
                                                    Remove
                                                </button>
                                            </div>
                                        )}

                                        <FieldError field={errors?.file_url} />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DisplayValidationErrors errors={errors} />
                        <CardFooter className="flex justify-end gap-4 p-0 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                tabIndex={-1}
                                onClick={() => onSuccess?.()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={
                                    !isDirty ||
                                    isPending ||
                                    isUploading ||
                                    req?.status !== "pending"
                                }
                                tabIndex={13}
                            >
                                {isPending || isUploading
                                    ? "Updating..."
                                    : "Update Request"}
                            </Button>
                        </CardFooter>
                    </form>
                    {/* <FormLogger watch={watch} data={req} /> */}
                    <LoadingModal isLoading={isPending || isUploading}>
                        Processing...
                    </LoadingModal>
                </Form>
            </CardContent>
        </Card>
    );
}
