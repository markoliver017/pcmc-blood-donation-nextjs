"use client";
import React, { useEffect, useRef } from "react";

import { CardContent } from "@components/ui/card";

import { Calendar, File, Flag, Phone, Text, Users } from "lucide-react";
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
import { formatFormalName } from "@lib/utils/string.utils";
import { IoArrowUndoCircle } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import Skeleton_form from "@components/ui/Skeleton_form";
import FormCardComponent from "@components/form/FormCardComponent";
import { isOldEnoughToDonate } from "@lib/utils/checkMinAge";
import ImagePreviewComponent from "@components/reusable_components/ImagePreviewComponent";

const fetchCountries = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_NATIONALITY_API_URL);
    if (!res.ok) throw new Error("Failed to fetch countries");
    return res.json();
};

export default function DonorBasicInfoForm({ details, onNext }) {
    const {
        trigger,
        control,
        watch,
        resetField,
        setValue,
        getValues,
        setError,
        formState: { errors },
    } = useFormContext();

    const { data: nationalities, isLoading: nationalities_loading } = useQuery({
        queryKey: ["nationalities"],
        queryFn: fetchCountries,
        staleTime: 1000 * 60 * 60,
    });

    const onSubmitNext = async () => {
        const valid = await trigger([
            "date_of_birth",
            "civil_status",
            "nationality",
            "contact_number",
            "occupation",
            "file",
        ]);

        const min_age = 17;
        const isValidAge = isOldEnoughToDonate(
            getValues("date_of_birth"),
            min_age
        );
        if (!isValidAge) {
            setError("date_of_birth", {
                type: "manual",
                message: `Donor must be at least ${min_age} years old.`,
            });
            return;
        }
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

    const fileInputRef = useRef(null);
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input click
        }
    };

    const uploaded_avatar = watch("file");
    const avatar =
        !errors?.file && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : "/default-govt-issued-id.png";

    useEffect(() => {
        if (watch("id_url")) setValue("id_url", null);
    }, [uploaded_avatar]);

    if (nationalities_loading) return <Skeleton_form />;
    // return;
    return (
        <FormCardComponent details={details}>
            <CardContent className="flex flex-wrap gap-5">
                <div className="flex-none text-center w-full md:w-max">
                    <CustomAvatar
                        avatar={avatar}
                        whenClick={handleImageClick}
                        className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px]"
                    />
                    {uploaded_avatar ? (
                        <div className="flex justify-center gap-2">
                            <ImagePreviewComponent imgSrc={avatar} />
                            <button
                                onClick={() => resetField("file")}
                                className="btn btn-ghost"
                            >
                                Clear
                            </button>
                        </div>
                    ) : (
                        <label className="text-center font-semibold italic text-slate-500">
                            Gov't issued ID
                        </label>
                    )}
                </div>

                <div className="flex-1 md:min-w-[350px] flex flex-col gap-2 justify-evenly ">
                    <FormField
                        control={control}
                        name="date_of_birth"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel>Date of Birth: </InlineLabel>

                                <label
                                    className={clsx(
                                        "input w-full mt-1",
                                        errors?.date_of_birth
                                            ? "input-error"
                                            : "input-info"
                                    )}
                                >
                                    <Calendar className="h-3" />
                                    <input
                                        type="date"
                                        tabIndex={1}
                                        placeholder="Enter user birth date"
                                        {...field}
                                    />
                                </label>
                                <FieldError field={errors?.date_of_birth} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="civil_status"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel>Civil Status: </InlineLabel>

                                <label
                                    className={clsx(
                                        "input w-full mt-1",
                                        errors?.civil_status
                                            ? "input-error"
                                            : "input-info"
                                    )}
                                >
                                    <Users className="h-3" />
                                    <select
                                        className="w-full dark:bg-inherit"
                                        tabIndex={2}
                                        {...field}
                                    >
                                        <option value="">Select here</option>
                                        {[
                                            "single",
                                            "married",
                                            "divorced",
                                            "separated",
                                            "widowed",
                                        ].map((status, i) => (
                                            <option key={i} value={status}>
                                                {formatFormalName(status)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <FieldError field={errors?.civil_status} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="nationality"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel>Nationality: </InlineLabel>

                                <label
                                    className={clsx(
                                        "input w-full mt-1",
                                        errors?.nationality
                                            ? "input-error"
                                            : "input-info"
                                    )}
                                >
                                    <Flag className="h-3" />
                                    <select
                                        className="w-full dark:bg-inherit"
                                        tabIndex={3}
                                        {...field}
                                    >
                                        <option value="">Select here</option>
                                        {nationalities
                                            ?.map((country) => {
                                                const name =
                                                    country.name?.common;
                                                const nationality =
                                                    country.demonyms?.eng?.m ||
                                                    name;
                                                return (
                                                    <option
                                                        key={name}
                                                        value={nationality}
                                                    >
                                                        {nationality}
                                                    </option>
                                                );
                                            })
                                            .sort((a, b) =>
                                                a.props.value.localeCompare(
                                                    b.props.value
                                                )
                                            )}
                                    </select>
                                </label>
                                <FieldError field={errors?.nationality} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="contact_number"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel>Contact Number: </InlineLabel>
                                <label
                                    className={clsx(
                                        "input w-full mt-1",
                                        errors?.contact_number
                                            ? "input-error"
                                            : "input-info"
                                    )}
                                >
                                    <Phone className="h-3" />
                                    <span>+63</span>
                                    <input
                                        type="text"
                                        tabIndex={4}
                                        {...field}
                                        placeholder="Enter a valid mobile (9123456789) or landline (21234567 or 3456789) number"
                                    />
                                </label>

                                <FieldError field={errors?.contact_number} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="occupation"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel required={false} optional={true}>
                                    Occupation:{" "}
                                </InlineLabel>

                                <label
                                    className={clsx(
                                        "input w-full mt-1",
                                        errors?.occupation
                                            ? "input-error"
                                            : "input-info"
                                    )}
                                >
                                    <Text className="h-3" />
                                    <input
                                        type="text"
                                        tabIndex={5}
                                        placeholder="Enter user occupation"
                                        {...field}
                                    />
                                </label>
                                <FieldError field={errors?.occupation} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="file"
                        render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                                <InlineLabel required={false} optional={true}>
                                    Govt issued ID:{" "}
                                </InlineLabel>
                                <FormControl ref={fileInputRef}>
                                    <input
                                        type="file"
                                        tabIndex={6}
                                        onChange={(e) =>
                                            onChange(e.target.files[0])
                                        }
                                        className={clsx(
                                            "file-input w-full",
                                            errors?.file
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                        {...field}
                                    />
                                </FormControl>
                                <FieldError field={errors?.file} />
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
                            tabIndex="6"
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
