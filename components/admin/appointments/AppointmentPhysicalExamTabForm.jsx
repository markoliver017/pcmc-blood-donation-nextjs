"use client";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import dynamic from "next/dynamic";
const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), {
    ssr: false,
});

import { Card } from "@components/ui/card";
import { Flag, Gauge, ScanHeart, Text, Weight } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";

import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@components/ui/form";

import { GrUpdate } from "react-icons/gr";
import FormLogger from "@lib/utils/FormLogger";
import { userWithDonorSchema } from "@lib/zod/donorSchema";
import { formatFormalName } from "@lib/utils/string.utils";

import { updateUserDonor } from "@/action/donorAction";
import { BiCollection } from "react-icons/bi";
import { IoInformationCircle } from "react-icons/io5";
import { toastError } from "@lib/utils/toastError.utils";
import { PiStool } from "react-icons/pi";
import { getSingleStyle } from "@/styles/select-styles";
import { useTheme } from "next-themes";
import { FaTemperatureHigh } from "react-icons/fa";

export default function AppointmentPhysicalExamTabForm({ appointment }) {
    const { resolvedTheme } = useTheme();
    const queryClient = useQueryClient();

    const { data, mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateUserDonor(user.id, formData);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        onSuccess: () => {
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["appointment"] });
            SweetAlert({
                title: "Physical Exam",
                text: "The Donor's physical exam has been submitted successfully.",
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

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(userWithDonorSchema),
        defaultValues: appointment,
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
            title: "Donor's Physical Exam?",
            text: "Are you sure you want to submit this information?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                mutate(formData);
            },
        });
    };

    const eligibilityStatus = watch("eligibility_status");

    useEffect(() => {
        if (eligibilityStatus !== "ACCEPTED") {
            resetField("deferral_reason");
        } else {
            setValue("deferral_reason", "");
        }
    }, [eligibilityStatus]);

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2 flex flex-col gap-2 justify-center"
            >
                <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                    <div className="flex items-center gap-5">
                        <h1 className="text-xl font-bold flex-items-center">
                            <IoInformationCircle /> Physical Exam Details:
                        </h1>
                    </div>
                    <div className="pl-4 space-y-5">
                        <FormField
                            control={control}
                            name="blood_pressure"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Blood Pressure: </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.blood_pressure
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Gauge className="h-3" />
                                        <input
                                            type="text"
                                            tabIndex={1}
                                            placeholder="Enter blood pressure"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError
                                        field={errors?.blood_pressure}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="pulse_rate"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        Pulse Rate: (bpm){" "}
                                    </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.pulse_rate
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <ScanHeart className="h-3" />
                                        <input
                                            type="number"
                                            tabIndex={2}
                                            placeholder="Enter pulse rate"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.pulse_rate} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="hemoglobin_level"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        Hemoglobin Level: (g/dl){" "}
                                    </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.hemoglobin_level
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <ScanHeart className="h-3" />
                                        <input
                                            type="number"
                                            tabIndex={3}
                                            placeholder="Enter hemoglobin level"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError
                                        field={errors?.hemoglobin_level}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Weight: (kg) </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.weight
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Weight className="h-3" />
                                        <input
                                            type="number"
                                            tabIndex={3}
                                            placeholder="Enter weight"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.weight} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="temperature"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Temperature: </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.temperature
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <FaTemperatureHigh className="h-3" />
                                        <input
                                            type="number"
                                            tabIndex={4}
                                            placeholder="Enter temperature"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.temperature} />
                                </FormItem>
                            )}
                        />

                        <div className="mt-1">
                            <InlineLabel>Eligibility Status: </InlineLabel>
                            <fieldset className="fieldset w-full">
                                <Controller
                                    control={control}
                                    name="eligibility_status"
                                    render={({
                                        field: { onChange, value, name, ref },
                                    }) => {
                                        const statusOptions = [
                                            "ACCEPTED",
                                            "TEMPORARILY-DEFERRED",
                                            "PERMANENTLY-DEFERRED",
                                        ].map((status) => ({
                                            value: status,
                                            label: status,
                                        }));

                                        const selectedOption =
                                            statusOptions.find(
                                                (option) =>
                                                    option.value === value
                                            ) || null;

                                        return (
                                            <CreatableSelectNoSSR
                                                name={name}
                                                ref={ref}
                                                placeholder="Eligibility Status"
                                                value={selectedOption}
                                                onChange={(selectedOption) => {
                                                    onChange(
                                                        selectedOption
                                                            ? selectedOption.value
                                                            : null
                                                    );
                                                }}
                                                isValidNewOption={() => false}
                                                options={statusOptions}
                                                styles={getSingleStyle(
                                                    resolvedTheme
                                                )}
                                                className="sm:text-lg"
                                                tabIndex={4}
                                                isClearable
                                            />
                                        );
                                    }}
                                />
                            </fieldset>
                            <FieldError field={errors?.eligibility_status} />
                        </div>
                        {eligibilityStatus &&
                            eligibilityStatus !== "ACCEPTED" && (
                                <FormField
                                    control={control}
                                    name="deferral_reason"
                                    render={({ field }) => (
                                        <FormItem>
                                            <InlineLabel>
                                                Deferral Reason:{" "}
                                            </InlineLabel>

                                            <textarea
                                                className="textarea textarea-info h-24 w-full"
                                                placeholder="Your message"
                                                {...field}
                                            />
                                            <FieldError
                                                field={errors?.deferral_reason}
                                            />
                                        </FormItem>
                                    )}
                                />
                            )}
                        <FormField
                            control={control}
                            name="remarks"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel
                                        required={false}
                                        optional={true}
                                    >
                                        Any Remarks:{" "}
                                    </InlineLabel>

                                    <textarea
                                        className="textarea textarea-info h-24 w-full"
                                        placeholder="Your message"
                                        {...field}
                                    />
                                    <FieldError
                                        field={errors?.deferral_reason}
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
            <FormLogger
                watch={watch}
                errors={errors}
                initialData={appointment}
                data={data}
            />
        </Form>
    );
}
