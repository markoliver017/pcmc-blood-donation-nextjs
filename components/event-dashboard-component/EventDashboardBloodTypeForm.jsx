"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@components/ui/card";
import { CheckCircle, ShieldCheck, ShieldOff, Users } from "lucide-react";

import notify from "@components/ui/notify";
import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import { Form, FormField, FormItem, FormMessage } from "@components/ui/form";
import { GrUpdate } from "react-icons/gr";
import Skeleton_form from "@components/ui/Skeleton_form";

import { getBloodTypes } from "@/action/bloodTypeAction";
import { updateDonorBloodType } from "@/action/donorAction";
import { MdBloodtype } from "react-icons/md";
import { bloodtypeSchema } from "@lib/zod/donorSchema";
import FormLogger from "@lib/utils/FormLogger";
import { toast } from "sonner";

export default function EventDashboardBloodTypeForm({ donor, eventId }) {
    const queryClient = useQueryClient();

    // Fetch blood types
    const { data: bloodTypes, isLoading: bloodTypesLoading } = useQuery({
        queryKey: ["blood_types"],
        queryFn: getBloodTypes,
        staleTime: 1000 * 60 * 60,
    });

    // Update blood type mutation
    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateDonorBloodType(formData);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        onSuccess: () => {
            console.log("Blood type update successful, calling onRefresh");

            // Invalidate relevant queries for real-time updates
            queryClient.invalidateQueries({
                queryKey: ["event-dashboard"],
            });
            queryClient.invalidateQueries({
                queryKey: ["event-statistics", eventId],
            });
            queryClient.invalidateQueries({ queryKey: ["appointment"] });

            toast.success("Donor's blood type has been successfully updated.");
        },
        onError: (error) => {
            // Handle validation errors
            if (error?.type === "validation" && error?.errorArr?.length) {
                let detailContent = "";
                const { errorArr: details, message } = error;

                detailContent = (
                    <ul className="list-disc list-inside">
                        {details.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                );
                toast.error(
                    <div tabIndex={0} className="collapse">
                        <input type="checkbox" />
                        <div className="collapse-title font-semibold">
                            {message}
                            <br />
                            <small className="link link-warning">
                                See details
                            </small>
                        </div>
                        <div className="collapse-content text-sm">
                            {detailContent}
                        </div>
                    </div>
                );
            } else {
                // Handle server errors
                toast.error(error?.message || "Failed to update blood type");
            }
        },
    });

    // Form setup
    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(bloodtypeSchema),
        defaultValues: {
            ...donor,
            blood_type_id: donor?.blood_type_id
                ? donor?.blood_type_id.toString()
                : "",
        },
    });

    const {
        control,
        watch,
        handleSubmit,
        formState: { errors, isDirty },
    } = form;

    const onSubmit = async (formData) => {
        mutate(formData);
    };

    if (bloodTypesLoading) return <Skeleton_form />;

    const isBloodTypeVerified = donor?.is_bloodtype_verified;

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                    <h1 className="text-xl font-bold flex-items-center">
                        Blood Type Management:
                    </h1>
                    <div className="pl-4 space-y-5">
                        {/* Hidden donor ID field */}
                        <FormField
                            control={control}
                            name="id"
                            render={({ field }) => (
                                <input type="hidden" {...field} />
                            )}
                        />

                        {/* Blood Type Selection */}
                        <FormField
                            control={control}
                            name="blood_type_id"
                            render={({ field }) => (
                                <FormItem className="mt-2">
                                    <div className="flex flex-wrap items-center gap-5">
                                        <h2 className="text-lg font-semibold">
                                            Blood Type:
                                        </h2>

                                        <label
                                            className={clsx(
                                                "input flex-1 w-full min-w-40",
                                                errors?.blood_type_id
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <MdBloodtype className="h-3" />
                                            <select
                                                className="w-full text-2xl dark:bg-inherit"
                                                tabIndex={1}
                                                disabled={isBloodTypeVerified}
                                                {...field}
                                            >
                                                <option value="">
                                                    Select blood type
                                                </option>
                                                {bloodTypes?.map((type) => (
                                                    <option
                                                        key={type.id}
                                                        value={type.id}
                                                    >
                                                        {type.blood_type}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        {/* Verification Status Badge */}
                                        {donor?.is_bloodtype_verified ? (
                                            <div className="badge badge-success px-2 py-5">
                                                <ShieldCheck />
                                                Verified
                                            </div>
                                        ) : (
                                            <div className="badge badge-warning px-2 py-5">
                                                <ShieldOff /> Not Verified
                                            </div>
                                        )}
                                    </div>
                                    <FieldError field={errors?.blood_type_id} />
                                </FormItem>
                            )}
                        />

                        {/* Blood Type Verification Checkbox */}
                        <FormField
                            control={control}
                            name="is_bloodtype_verified"
                            render={({ field }) => (
                                <FormItem className="pt-10 pl-5 md:pl-15">
                                    <label className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            className="checkbox bg-red-500 checkbox-success border"
                                            {...field}
                                            disabled={isBloodTypeVerified}
                                            checked={field.value}
                                        />
                                        <span className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-gray-300">
                                            Verify Donor's Blood Type
                                            <ShieldCheck className="w-5 h-5 text-success" />
                                        </span>
                                    </label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        Mark this checkbox if you've confirmed
                                        the blood type of the donor.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button - Only show if not verified */}
                    {!donor?.is_bloodtype_verified && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={!isDirty || isPending}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <GrUpdate className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </Card>
            </form>
            {/* <FormLogger watch={watch} /> */}
        </Form>
    );
}
