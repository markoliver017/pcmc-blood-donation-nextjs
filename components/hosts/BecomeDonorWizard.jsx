"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { existingUserAsDonorSchema } from "@lib/zod/donorSchema";
import { registerExistingUserAsDonor } from "@action/donorAction";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import SweetAlert from "@components/ui/SweetAlert";
import LoadingModal from "@components/layout/LoadingModal";
import DisplayValidationErrors from "@components/form/DisplayValidationErrors";
import { toastCatchError, toastError } from "@lib/utils/toastError.utils";

// Import Step Components (will be created next)
import DonorProfileForm from "./forms/DonorProfileForm";
import DonorLocationForm from "./forms/DonorLocationForm";
import DonorDonationHistoryForm from "./forms/DonorDonationHistoryForm";
import DonorConfirmationStep from "./forms/DonorConfirmationStep";
import DonorBasicInfoForm from "@components/donors/DonorBasicInfoForm";
import { uploadPicture } from "@/action/uploads";
import notify from "@components/ui/notify";
import AgencyLocationForm from "@components/organizers/AgencyLocationForm";
import DonorBloodDonationInfoForm from "@components/donors/DonorBloodDonationInfoForm";
import FormLogger from "@lib/utils/FormLogger";
import { useSession } from "next-auth/react";

const form_sections = [
    { title: "Donor's Profile", class: "progress-info", percent: 25 },
    { title: "Location Details", class: "progress-info", percent: 50 },
    { title: "Blood Donation History", class: "progress-info", percent: 75 },
    { title: "Confirm", class: "progress-success", percent: 100 },
];

export default function BecomeDonorWizard() {
    const { update } = useSession();
    const [sectionNo, setSectionNo] = useState(0);
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);

    const methods = useForm({
        mode: "onChange",
        resolver: zodResolver(existingUserAsDonorSchema),
        defaultValues: {
            file: "", //govt id file input
            id_url: null, //govt id url
            date_of_birth: "", ////
            civil_status: "", ////
            contact_number: "", ////
            nationality: "Filipino", ////
            occupation: "", ////
            address: "", ////
            barangay: "", ////
            city_municipality: "", ////
            province: "Metro Manila", ////
            selected_province_option: {
                code: "130000000",
                name: "Metro Manila",
                is_ncr: true,
            }, ////
            is_regular_donor: false, ////
            blood_type_id: "", ////
            blood_type_label: "", ////
            donation_history_donation_date: "", ////
            blood_service_facility: "", ////
        },
    });

    const {
        watch,
        handleSubmit,
        setValue,
        formState: { errors },
    } = methods;

    const {
        mutate,
        isPending,
        error: mutationError,
        setError,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await registerExistingUserAsDonor(formData);
            if (!res.success) throw res;
            return res;
        },
        onSuccess: (res) => {
            SweetAlert({
                title: "Registration Complete!",
                text: "You have successfully registered as a donor. Thank you for your willingness to help. You can now switch to donor login.",
                icon: "success",
                onConfirm: async () => {
                    console.log("Registration Complete response", res);
                    await update({
                        updated_roles: res.updated_roles,
                        role_name: "",
                    });
                    window.location.replace("/portal/change-role");
                },
            });
        },
        onError: (error) => {
            if (error?.type === "validation" && error?.errorArr.length) {
                toastError(error);
            } else if (
                error?.type === "catch_validation_error" &&
                error?.errors?.length
            ) {
                toastCatchError(error, setError);
            } else {
                setError("root", {
                    type: "custom",
                    message: error?.message || "Unknown error",
                });
                notify({
                    error: true,
                    message: error?.message,
                });
                alert(error?.message);
            }
        },
    });

    const handleNext = (n) => {
        setSectionNo((prev) => prev + n);
    };

    const onSubmit = async (data) => {
        SweetAlert({
            title: "Become a Donor",
            text: "Are you sure you want to become a donor?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Proceed",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                let uploadErrors = false;
                const fileUrl = watch("id_url");
                if (data?.file && !fileUrl) {
                    setIsUploading(true);
                    const result = await uploadPicture(data.file);
                    if (result?.success) {
                        data.id_url = result.file_data?.url || null;
                        setValue("id_url", result.file_data?.url);
                    } else {
                        uploadErrors = true;
                        setError("root", {
                            type: "custom",
                            message: result?.message || "Upload error",
                        });
                        notify({
                            error: true,
                            message: result?.message || "Upload error",
                        });
                    }
                    console.log("Upload result:", result);
                }

                setIsUploading(false);
                if (uploadErrors) return;
                mutate(data);
            },
        });
    };

    return (
        <FormProvider {...methods}>
            <LoadingModal isLoading={isPending || isUploading} />
            <Card>
                <CardHeader>
                    <CardTitle>Become a Donor</CardTitle>
                    <progress
                        className={`progress ${form_sections[sectionNo]?.class} w-full`}
                        value={form_sections[sectionNo]?.percent}
                        max="100"
                    ></progress>
                    {/* <p className="text-sm font-semibold">
                        {form_sections[sectionNo].title}
                    </p> */}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <DisplayValidationErrors
                                errors={errors}
                                mutationError={mutationError}
                            />
                        </div>

                        {/* Render steps based on sectionNo */}
                        {sectionNo === 0 && (
                            <DonorBasicInfoForm
                                details={form_sections[sectionNo]}
                                onNext={handleNext}
                            />
                        )}
                        {sectionNo === 1 && (
                            <AgencyLocationForm
                                details={form_sections[sectionNo]}
                                onNext={handleNext}
                            />
                        )}
                        {sectionNo === 2 && (
                            <DonorBloodDonationInfoForm
                                details={form_sections[sectionNo]}
                                onNext={handleNext}
                            />
                        )}
                        {sectionNo === 3 && (
                            <DonorConfirmationStep
                                onNext={handleNext}
                                isPending={isPending}
                            />
                        )}
                    </form>
                </CardContent>
                {/* <FormLogger watch={watch} errors={errors} /> */}
            </Card>
        </FormProvider>
    );
}
