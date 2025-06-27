"use client";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import dynamic from "next/dynamic";
const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), {
    ssr: false,
});

import { Card } from "@components/ui/card";
import { Calendar, Flag, Text } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";

import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@components/ui/form";

import { GrUpdate } from "react-icons/gr";
import FormLogger from "@lib/utils/FormLogger";
import { formatFormalName } from "@lib/utils/string.utils";

import { BiCollection } from "react-icons/bi";
import { IoInformationCircle } from "react-icons/io5";
import { toastError } from "@lib/utils/toastError.utils";
import { PiStool } from "react-icons/pi";
import { getSingleStyle } from "@/styles/select-styles";
import { useTheme } from "next-themes";
import { appointmentDetailsSchema } from "@lib/zod/appointmentSchema";
import { updateAppointmentDetails } from "@/action/donorAppointmentAction";

export default function AppointmentStatusTabForm({ appointment }) {
    const { resolvedTheme } = useTheme();
    const queryClient = useQueryClient();

    const { data, mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateAppointmentDetails(
                appointment?.id,
                formData
            );
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        onSuccess: () => {
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["appointment"] });
            SweetAlert({
                title: "Donor's Appointment Details",
                text: "The Donor's appointment details has been updated successfully.",
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
        resolver: zodResolver(appointmentDetailsSchema),
        defaultValues: {
            donor_type: appointment?.donor_type || "",
            collection_method: appointment?.collection_method || "",
            patient_name: appointment?.patient_name || "",
            relation: appointment?.relation || "",
            status: appointment?.status || "",
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
            title: "Update Donor's appointment details?",
            text: "Are you sure you want to save these changes?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                mutate(formData);
            },
        });
    };

    const donorType = watch("donor_type");

    useEffect(() => {
        if (donorType === "replacement") {
            resetField("patient_name");
            resetField("relation");
        } else {
            setValue("patient_name", "");
            setValue("relation", "");
        }
    }, [donorType]);

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2 flex flex-col gap-2 justify-center"
            >
                <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1">
                    <div className="flex items-center gap-5">
                        <h1 className="text-xl font-bold flex-items-center">
                            <IoInformationCircle /> Donor Appointment Details:
                        </h1>
                    </div>
                    <div className="pl-4 space-y-5">
                        <FormField
                            control={control}
                            name="collection_method"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        Collection Method:{" "}
                                    </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.collection_method
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <BiCollection className="h-3" />
                                        <select
                                            className="w-full dark:bg-inherit"
                                            tabIndex={1}
                                            {...field}
                                        >
                                            <option value="">
                                                Select here
                                            </option>
                                            {["whole blood", "apheresis"].map(
                                                (method, i) => (
                                                    <option
                                                        key={i}
                                                        value={method}
                                                    >
                                                        {formatFormalName(
                                                            method
                                                        )}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </label>
                                    <FieldError
                                        field={errors?.collection_method}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="donor_type"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Donor Type: </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.donor_type
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <PiStool className="h-3" />
                                        <select
                                            className="w-full dark:bg-inherit"
                                            tabIndex={2}
                                            {...field}
                                        >
                                            <option value="">
                                                Select here
                                            </option>
                                            {["replacement", "volunteer"].map(
                                                (type, i) => {
                                                    return (
                                                        <option
                                                            key={i}
                                                            value={type}
                                                        >
                                                            {formatFormalName(
                                                                type
                                                            )}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </label>
                                    <FieldError field={errors?.donor_type} />
                                </FormItem>
                            )}
                        />
                        {donorType === "replacement" && (
                            <div>
                                <FormField
                                    control={control}
                                    name="patient_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <InlineLabel>
                                                Patient Name:{" "}
                                            </InlineLabel>

                                            <label
                                                className={clsx(
                                                    "input w-full mt-1",
                                                    errors?.patient_name
                                                        ? "input-error"
                                                        : "input-info"
                                                )}
                                            >
                                                <Text className="h-3" />
                                                <input
                                                    type="text"
                                                    tabIndex={3}
                                                    placeholder="Enter patient name"
                                                    {...field}
                                                />
                                            </label>
                                            <FieldError
                                                field={errors?.patient_name}
                                            />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="relation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <InlineLabel>
                                                Relation:{" "}
                                            </InlineLabel>

                                            <label
                                                className={clsx(
                                                    "input w-full mt-1",
                                                    errors?.relation
                                                        ? "input-error"
                                                        : "input-info"
                                                )}
                                            >
                                                <Text className="h-3" />
                                                <input
                                                    type="text"
                                                    tabIndex={4}
                                                    placeholder="Enter relation"
                                                    {...field}
                                                />
                                            </label>
                                            <FieldError
                                                field={errors?.relation}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <div className="mt-1">
                            <InlineLabel>Appointment Status: </InlineLabel>
                            <fieldset className="fieldset w-full">
                                <Controller
                                    control={control}
                                    name="status"
                                    render={({
                                        field: { onChange, value, name, ref },
                                    }) => {
                                        const statusOptions = [
                                            "registered",
                                            "no show",
                                            "cancelled",
                                            "examined",
                                            "collected",
                                        ].map((status) => ({
                                            value: status,
                                            label: status.toUpperCase(),
                                        }));

                                        const selectedOption =
                                            statusOptions.find(
                                                (option) =>
                                                    option.value === value
                                            ) || null;

                                        const isDisabled =
                                            selectedOption &&
                                            (selectedOption.value ===
                                                "examined" ||
                                                selectedOption.value ===
                                                    "collected" ||
                                                selectedOption.value ===
                                                    "cancelled");

                                        return (
                                            <CreatableSelectNoSSR
                                                name={name}
                                                ref={ref}
                                                placeholder="Appointment status "
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
                                                isOptionDisabled={(option) =>
                                                    option.value ===
                                                        "examined" ||
                                                    option.value ===
                                                        "collected" ||
                                                    option.value === "cancelled"
                                                }
                                                isDisabled={isDisabled}
                                                className="sm:text-lg"
                                                tabIndex={4}
                                                isClearable
                                            />
                                        );
                                    }}
                                />
                            </fieldset>
                            <FormDescription>
                                Cancellation, Examined, Collected are
                                automatically set by the system
                            </FormDescription>
                            <FieldError field={errors?.province} />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            disabled={!isDirty || isPending}
                            className="btn btn-neutral mt-4 hover:bg-neutral-800 hover:text-green-300"
                            tabIndex={5}
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
                initialData={appointment}
                data={data}
            /> */}
        </Form>
    );
}
