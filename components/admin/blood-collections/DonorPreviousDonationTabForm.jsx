"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Card } from "@components/ui/card";
import { Gauge, Text } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";

import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import { Form, FormField, FormItem } from "@components/ui/form";

import { GrUpdate } from "react-icons/gr";
import FormLogger from "@lib/utils/FormLogger";
import { IoInformationCircle } from "react-icons/io5";
import { toastError } from "@lib/utils/toastError.utils";
import { physicalExaminationSchema } from "@lib/zod/physicalExaminationSchema";

import { storeUpdatePrevDonation } from "@/action/bloodDonationHistoryAction";
import { bloodHistorySchema } from "@lib/zod/bloodHistorySchema";

export default function DonorPreviousDonationTabForm({ donor }) {
    const queryClient = useQueryClient();

    const { data, mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await storeUpdatePrevDonation(donor?.id, formData);
            if (!res.success) {
                throw res;
            }
            return res;
        },
        onSuccess: (res) => {
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({
                queryKey: ["donor-blood-collections"],
            });
            SweetAlert({
                title: "Donor's Previous Donations",
                text: res?.message || "Submission successful!",
                icon: "success",
                confirmButtonText: "Okay",
            });
        },
        onError: (error) => {
            // Handle validation errors
            if (error?.type === "validation" && error?.errorArr.length) {
                toastError(error);
            } else {
                // Handle server errors
                notify({
                    error: true,
                    message: error?.message || "unknown error",
                });
            }
        },
    });

    const prevDonations = donor?.blood_history;

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(bloodHistorySchema),
        defaultValues: {
            previous_donation_count:
                prevDonations?.previous_donation_count || "",
            previous_donation_volume:
                prevDonations?.previous_donation_volume || "",
        },
    });

    const {
        watch,
        control,
        handleSubmit,
        setValue,
        resetField,
        formState: { errors, isDirty },
    } = form;

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Donor's Previous Donations?",
            text: "Are you sure you want to submit this data?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                mutate(formData);
            },
        });
    };

    if (!donor)
        return (
            <div className="alert alert-error">
                No donor's information found! Please refresh your browser and
                try again!
            </div>
        );

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2 flex flex-col gap-2 justify-center"
            >
                <Card className="px-2 md:px-4 py-3 md:py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                    <div className="flex items-center gap-5">
                        <h1 className="text-xl font-bold flex-items-center">
                            <IoInformationCircle /> Previous Donations:
                        </h1>
                    </div>
                    <div className="pl-4 space-y-5">
                        <FormField
                            control={control}
                            name="previous_donation_count"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        Number of Donations Before System
                                        Records:{" "}
                                    </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.previous_donation_count
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Text className="h-3" />
                                        <input
                                            type="number"
                                            tabIndex={1}
                                            placeholder="Enter previous donation count"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError
                                        field={errors?.previous_donation_count}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="previous_donation_volume"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel
                                        required={false}
                                        optional={true}
                                    >
                                        Total Volume Donated Before System (ml):{" "}
                                    </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.previous_donation_volume
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Gauge className="h-3" />
                                        <input
                                            type="number"
                                            tabIndex={1}
                                            placeholder="Enter total volume"
                                            {...field}
                                        />
                                        ML
                                    </label>
                                    <FieldError
                                        field={errors?.previous_donation_volume}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            disabled={!isDirty || isPending}
                            className="btn btn-neutral mt-4 hover:bg-neutral-800 hover:text-green-300"
                        >
                            {isPending ? (
                                <>
                                    <span className="loading loading-bars loading-xs"></span>
                                    Submitting ...
                                </>
                            ) : (
                                <>
                                    <GrUpdate />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </Card>
            </form>
            {/* <FormLogger
                watch={watch}
                errors={errors}
                initialData={donor}
                data={data}
            /> */}
        </Form>
    );
}
