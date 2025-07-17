"use client";
import React, { useEffect } from "react";

import { CardContent } from "@components/ui/card";

import { Calendar, Text, Users } from "lucide-react";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
// import { useTheme } from "next-themes";
import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@components/ui/form";

import CustomAvatar from "@components/reusable_components/CustomAvatar";

import { MdNextPlan } from "react-icons/md";
import { useFormContext } from "react-hook-form";
import { IoArrowUndoCircle } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { getBloodTypes } from "@/action/bloodTypeAction";
import Skeleton_form from "@components/ui/Skeleton_form";
import FormCardComponent from "@components/form/FormCardComponent";

export default function DonorBloodDonationInfoForm({ details, onNext }) {
    const { data: bloodTypes, isLoading: bloodTypesLoading } = useQuery({
        queryKey: ["blood_types"],
        queryFn: getBloodTypes,
        staleTime: 1000 * 60 * 60,
    });

    const {
        trigger,
        control,
        watch,
        getValues,
        setValue,
        resetField,
        formState: { errors },
    } = useFormContext();

    const onSubmitNext = async () => {
        const isRegularDonor = getValues("is_regular_donor");

        let validateFields = ["is_regular_donor"];
        if (isRegularDonor) {
            validateFields.push(
                "blood_type_id",
                "donation_history_donation_date",
                "blood_service_facility"
            );
        }
        const valid = await trigger(validateFields);
        if (valid) {
            onNext(1);
        } else {
            notify(
                {
                    error: true,
                    message: "Please provide the required information..",
                },
                "warning"
            );
        }
    };

    const isRegular = watch("is_regular_donor");
    useEffect(() => {
        if (isRegular) return;
        resetField("blood_type_id");
        setValue("blood_type_label", "");
        resetField("donation_history_donation_date");
        resetField("blood_service_facility");
    }, [isRegular]);

    const bloodTypeId = watch("blood_type_id");
    useEffect(() => {
        if (!bloodTypeId || !bloodTypes) return;
        setValue(
            "blood_type_label",
            bloodTypes.find((type) => type.id == bloodTypeId)?.blood_type
        );
    }, [bloodTypeId, bloodTypes]);

    if (bloodTypesLoading) return <Skeleton_form />;

    return (
        <FormCardComponent details={details}>
            <CardContent className="flex flex-wrap gap-5">
                <div className="flex-none text-center w-full md:w-max">
                    <CustomAvatar
                        avatar="/donate-image.png"
                        className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px]"
                    />
                </div>

                <div className="flex-1 md:min-w-[350px] flex flex-col justify-evenly gap-2 ">
                    <FormField
                        control={control}
                        name="is_regular_donor"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel>Regular Donor ?</InlineLabel>

                                <div className="flex gap-7 mt-2">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="radio"
                                            className={clsx(
                                                "radio",
                                                errors?.is_regular_donor
                                                    ? "radio-error"
                                                    : "radio-info"
                                            )}
                                            tabIndex={1}
                                            value={true}
                                            checked={field.value === true}
                                            onChange={() =>
                                                field.onChange(true)
                                            }
                                        />
                                        <span
                                            className={clsx(
                                                "label-text mr-2",
                                                isRegular && "font-semibold"
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
                                                errors?.is_regular_donor
                                                    ? "radio-error"
                                                    : "radio-info"
                                            )}
                                            tabIndex={1}
                                            value={false}
                                            checked={field.value === false}
                                            onChange={() =>
                                                field.onChange(false)
                                            }
                                        />
                                        <span
                                            className={clsx(
                                                "label-text mr-2",
                                                !isRegular && "font-semibold"
                                            )}
                                        >
                                            No
                                        </span>
                                    </label>
                                </div>

                                <FieldError field={errors?.is_regular_donor} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="blood_type_id"
                        render={({ field }) => (
                            <FormItem className="mt-2">
                                <InlineLabel required={isRegular}>
                                    Blood Type:
                                </InlineLabel>

                                <label
                                    className={clsx(
                                        "input w-full mt-1",
                                        errors?.blood_type_id
                                            ? "input-error"
                                            : "input-info"
                                    )}
                                    disabled={!isRegular}
                                >
                                    <Users className="h-3" />
                                    <select
                                        className="w-full text-lg dark:bg-inherit"
                                        tabIndex={2}
                                        disabled={!isRegular}
                                        {...field}
                                    >
                                        <option value="">
                                            Select blood type
                                        </option>
                                        {bloodTypes.map((type) => (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.blood_type}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <FieldError field={errors?.blood_type_id} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="donation_history_donation_date"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel required={isRegular}>
                                    Last Donation Date:
                                </InlineLabel>

                                <label
                                    className={clsx(
                                        "input w-full mt-1",
                                        errors?.donation_history_donation_date
                                            ? "input-error"
                                            : "input-info"
                                    )}
                                    disabled={!isRegular}
                                >
                                    <Calendar className="h-3" />
                                    <input
                                        type="date"
                                        tabIndex={3}
                                        placeholder="Enter last donation date"
                                        {...field}
                                        disabled={!isRegular}
                                    />
                                </label>
                                <FieldError
                                    field={
                                        errors?.donation_history_donation_date
                                    }
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="blood_service_facility"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel required={isRegular}>
                                    Blood Service Facility/Hospital:{" "}
                                </InlineLabel>

                                <label
                                    className={clsx(
                                        "input w-full mt-1",
                                        errors?.blood_service_facility
                                            ? "input-error"
                                            : "input-info"
                                    )}
                                    disabled={!isRegular}
                                >
                                    <Text className="h-3" />
                                    <input
                                        type="text"
                                        tabIndex={4}
                                        placeholder="Enter your answer"
                                        {...field}
                                        disabled={!isRegular}
                                    />
                                </label>
                                <FieldError
                                    field={errors?.blood_service_facility}
                                />
                            </FormItem>
                        )}
                    />

                    <div className="flex-none card-actions justify-between mt-5">
                        <button
                            onClick={() => onNext(-1)}
                            className="btn btn-default"
                            tabIndex={-1}
                        >
                            <IoArrowUndoCircle />{" "}
                            <span className="hidden sm:inline-block">Back</span>
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onSubmitNext}
                            tabIndex="5"
                        >
                            <MdNextPlan />{" "}
                            <span className="hidden sm:inline-block">Next</span>
                        </button>
                    </div>
                </div>
            </CardContent>
        </FormCardComponent>
    );
}
