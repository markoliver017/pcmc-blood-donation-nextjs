"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { CardContent } from "@components/ui/card";
import { FormField, FormItem, FormControl } from "@components/ui/form";
import InlineLabel from "@components/form/InlineLabel";
import FieldError from "@components/form/FieldError";
import Skeleton_form from "@components/ui/Skeleton_form";
import { Calendar, Text, Users, Flag } from "lucide-react";
import { MdNextPlan } from "react-icons/md";
import clsx from "clsx";
import notify from "@components/ui/notify";
import { isOldEnoughToDonate } from "@lib/utils/checkMinAge";

const fetchCountries = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_NATIONALITY_API_URL);
    if (!res.ok) throw new Error("Failed to fetch countries");
    return res.json();
};

export default function DonorProfileForm({ onNext }) {
    const {
        trigger,
        control,
        getValues,
        setError,
        formState: { errors },
    } = useFormContext();

    const { data: nationalities, isLoading: nationalities_loading } = useQuery({
        queryKey: ["nationalities"],
        queryFn: fetchCountries,
        staleTime: Infinity, // Nationalities are static
    });

    const onSubmitNext = async () => {
        const valid = await trigger([
            "date_of_birth",
            "civil_status",
            "nationality",
            "occupation",
        ]);

        const min_age = 17;
        const isValidAge = isOldEnoughToDonate(getValues("date_of_birth"), min_age);
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
            notify({ error: true, message: "Please provide the required information." }, "warning");
        }
    };

    if (nationalities_loading) return <Skeleton_form />;

    return (
        <CardContent className="flex flex-col gap-5">
            <FormField
                control={control}
                name="date_of_birth"
                render={({ field }) => (
                    <FormItem>
                        <InlineLabel>Birthdate: </InlineLabel>
                        <label className={clsx("input w-full mt-1", errors?.date_of_birth ? "input-error" : "input-info")}>
                            <Calendar className="h-3" />
                            <input type="date" {...field} />
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
                        <FormControl>
                            <select className={clsx("select w-full mt-1", errors?.civil_status ? "select-error" : "select-info")} {...field}>
                                <option value="">Select status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="widowed">Widowed</option>
                                <option value="divorced">Divorced</option>
                            </select>
                        </FormControl>
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
                        <FormControl>
                            <select className={clsx("select w-full mt-1", errors?.nationality ? "select-error" : "select-info")} {...field}>
                                <option value="">Select nationality</option>
                                {nationalities.map((n) => (
                                    <option key={n.name.common} value={n.name.common}>
                                        {n.name.common}
                                    </option>
                                ))}
                            </select>
                        </FormControl>
                        <FieldError field={errors?.nationality} />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="occupation"
                render={({ field }) => (
                    <FormItem>
                        <InlineLabel required={false} optional={true}>Occupation:</InlineLabel>
                        <label className={clsx("input w-full mt-1", errors?.occupation ? "input-error" : "input-info")}>
                            <Text className="h-3" />
                            <input type="text" placeholder="Enter user occupation" {...field} />
                        </label>
                        <FieldError field={errors?.occupation} />
                    </FormItem>
                )}
            />

            <div className="flex-none card-actions justify-end mt-5">
                <button type="button" className="btn btn-primary" onClick={onSubmitNext}>
                    <MdNextPlan />
                    <span className="hidden sm:inline-block">Next</span>
                </button>
            </div>
        </CardContent>
    );
}
