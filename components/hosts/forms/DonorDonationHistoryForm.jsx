"use client";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { CardContent } from "@components/ui/card";
import { FormField, FormItem, FormControl } from "@components/ui/form";
import InlineLabel from "@components/form/InlineLabel";
import FieldError from "@components/form/FieldError";
import Skeleton_form from "@components/ui/Skeleton_form";
import { getBloodTypes } from "@action/bloodTypeAction";
import { Calendar } from "lucide-react";
import { MdNextPlan } from "react-icons/md";
import { IoArrowUndoCircle } from "react-icons/io5";
import clsx from "clsx";
import notify from "@components/ui/notify";

export default function DonorDonationHistoryForm({ onNext }) {
    const { data: bloodTypes, isLoading: bloodTypesLoading } = useQuery({
        queryKey: ["blood_types"],
        queryFn: getBloodTypes,
        staleTime: Infinity,
    });

    const {
        trigger,
        control,
        watch,
        getValues,
        resetField,
        formState: { errors },
    } = useFormContext();

    const isRegular = watch("is_regular_donor");

    useEffect(() => {
        if (isRegular) return;
        resetField("blood_type_id");
        resetField("last_donation_date");
    }, [isRegular, resetField]);

    const onSubmitNext = async () => {
        const isRegularDonor = getValues("is_regular_donor");
        let validateFields = ["is_regular_donor"];
        if (isRegularDonor) {
            validateFields.push("blood_type_id", "last_donation_date");
        }
        const valid = await trigger(validateFields);
        if (valid) {
            onNext(1);
        } else {
            notify({ error: true, message: "Please provide the required information.." }, "warning");
        }
    };

    if (bloodTypesLoading) return <Skeleton_form />;

    return (
        <CardContent className="flex flex-col gap-5">
            <FormField
                control={control}
                name="is_regular_donor"
                render={({ field }) => (
                    <FormItem>
                        <InlineLabel>Are you a regular donor?</InlineLabel>
                        <div className="flex gap-7 mt-2">
                            <label className="label cursor-pointer">
                                <input type="radio" className="radio radio-info" {...field} value={true} checked={field.value === true} onChange={() => field.onChange(true)} />
                                <span className="label-text ml-2">Yes</span>
                            </label>
                            <label className="label cursor-pointer">
                                <input type="radio" className="radio radio-info" {...field} value={false} checked={field.value === false} onChange={() => field.onChange(false)} />
                                <span className="label-text ml-2">No</span>
                            </label>
                        </div>
                        <FieldError field={errors?.is_regular_donor} />
                    </FormItem>
                )}
            />

            {isRegular && (
                <>
                    <FormField
                        control={control}
                        name="blood_type_id"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel>Blood Type:</InlineLabel>
                                <FormControl>
                                    <select className={clsx("select w-full mt-1", errors?.blood_type_id ? "select-error" : "select-info")} {...field}>
                                        <option value="">Select blood type</option>
                                        {bloodTypes.map((bt) => (
                                            <option key={bt.id} value={bt.id}>
                                                {bt.blood_type}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FieldError field={errors?.blood_type_id} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="last_donation_date"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel>Last Donation Date:</InlineLabel>
                                <label className={clsx("input w-full mt-1", errors?.last_donation_date ? "input-error" : "input-info")}>
                                    <Calendar className="h-3" />
                                    <input type="date" {...field} />
                                </label>
                                <FieldError field={errors?.last_donation_date} />
                            </FormItem>
                        )}
                    />
                </>
            )}

            <div className="flex-none card-actions justify-between mt-5">
                <button type="button" onClick={() => onNext(-1)} className="btn btn-default" tabIndex={-1}>
                    <IoArrowUndoCircle /> <span className="hidden sm:inline-block">Back</span>
                </button>
                <button type="button" className="btn btn-primary" onClick={onSubmitNext}>
                    <MdNextPlan /> <span className="hidden sm:inline-block">Next</span>
                </button>
            </div>
        </CardContent>
    );
}
