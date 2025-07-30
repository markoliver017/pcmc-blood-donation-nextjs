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
import { toastCatchError } from "@lib/utils/toastError.utils";

// Import Step Components (will be created next)
import DonorProfileForm from "./forms/DonorProfileForm";
import DonorLocationForm from "./forms/DonorLocationForm";
import DonorDonationHistoryForm from "./forms/DonorDonationHistoryForm";
import DonorConfirmationStep from "./forms/DonorConfirmationStep";

const form_sections = [
    { title: "Donor's Profile", class: "progress-info", percent: 25 },
    { title: "Location Details", class: "progress-info", percent: 50 },
    { title: "Blood Donation History", class: "progress-info", percent: 75 },
    { title: "Confirm", class: "progress-success", percent: 100 },
];

export default function BecomeDonorWizard() {
    const [sectionNo, setSectionNo] = useState(0);
    const queryClient = useQueryClient();

    const methods = useForm({
        resolver: zodResolver(existingUserAsDonorSchema),
        defaultValues: {
            date_of_birth: "",
            civil_status: "",
            nationality: "Philippines",
            occupation: "",
            address: "",
            barangay: "",
            city_municipality: "",
            province: "",
            region: "Region III (Central Luzon)",
            is_regular_donor: false,
            blood_type_id: "",
            last_donation_date: "",
            comments: "",
        },
    });

    const { mutate, isPending, error: mutationError, setError } = useMutation({
        mutationFn: async (formData) => {
            const res = await registerExistingUserAsDonor(formData);
            if (!res.success) throw res;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user_profile"] });
            SweetAlert({
                title: "Registration Complete!",
                text: "You have successfully registered as a donor. Thank you for your willingness to help.",
                icon: "success",
            });
        },
        onError: (error) => {
            toastCatchError(error);
        },
    });

    const handleNext = (n) => {
        setSectionNo((prev) => prev + n);
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        data.is_regular_donor = String(data.is_regular_donor);
        for (const key in data) {
            formData.append(key, data[key] === null ? "" : data[key]);
        }
        mutate(formData);
    };

    return (
        <FormProvider {...methods}>
            <LoadingModal isLoading={isPending} />
            <Card>
                <CardHeader>
                    <CardTitle>Become a Donor</CardTitle>
                    <progress
                        className={`progress ${form_sections[sectionNo].class} w-full`}
                        value={form_sections[sectionNo].percent}
                        max="100"
                    ></progress>
                    <p className="text-sm font-semibold">{form_sections[sectionNo].title}</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        {mutationError?.message && (
                            <DisplayValidationErrors error={mutationError} />
                        )}

                        {/* Render steps based on sectionNo */}
                        {sectionNo === 0 && <DonorProfileForm onNext={handleNext} />}
                        {sectionNo === 1 && <DonorLocationForm onNext={handleNext} />}
                        {sectionNo === 2 && <DonorDonationHistoryForm onNext={handleNext} />}
                        {sectionNo === 3 && <DonorConfirmationStep onNext={handleNext} isPending={isPending} />}

                    </form>
                </CardContent>
            </Card>
        </FormProvider>
    );
}
