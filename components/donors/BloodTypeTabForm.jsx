"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Card } from "@components/ui/card";
import { CheckCircle, Users } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";

import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import { Form, FormField, FormItem } from "@components/ui/form";
import { GrUpdate } from "react-icons/gr";
import FormLogger from "@lib/utils/FormLogger";
import { bloodtypeSchema } from "@lib/zod/donorSchema";
import Skeleton_form from "@components/ui/Skeleton_form";

import { getBloodTypes } from "@/action/bloodTypeAction";
import { updateDonorBloodType } from "@/action/donorAction";
import { MdBloodtype } from "react-icons/md";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { id } from "date-fns/locale";

export default function BloodTypeTabForm({ donor }) {
    const queryClient = useQueryClient();

    const { data: bloodTypes, isLoading: bloodTypesLoading } = useQuery({
        queryKey: ["blood_types"],
        queryFn: getBloodTypes,
        staleTime: 1000 * 60 * 60,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateDonorBloodType(formData);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        onSuccess: (data) => {
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["user"] });
            SweetAlert({
                title: "Donor's Blood Type",
                text: "Your Blood type has been successfully  updated.",
                icon: "success",
                confirmButtonText: "Okay",
            });
        },
        onError: (error) => {
            // Handle validation errors
            if (error?.type === "validation" && error?.errorArr.length) {
                let detailContent = "";
                const { errorArr: details, message } = error;

                detailContent = (
                    <ul className="list-disc list-inside">
                        {details.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                );
                notify({
                    error: true,
                    message: (
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
                    ),
                });
            } else {
                // Handle server errors
                notify({
                    error: true,
                    message: error?.message,
                });
            }
        },
    });

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(bloodtypeSchema),
        defaultValues: {
            id: donor?.id,
            blood_type_id: donor?.blood_type_id
                ? donor?.blood_type_id.toString()
                : "",
        },
    });

    const {
        watch,
        control,
        handleSubmit,

        formState: { errors, isDirty },
    } = form;

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Confirmation",
            text: "Update your Blood type?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                mutate(formData);
            },
        });
    };

    if (bloodTypesLoading) return <Skeleton_form />;

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="px-4 py-5 space-y-5 bg-gray-100">
                    <div className="pl-4 space-y-5">
                        <FormField
                            control={control}
                            name="id"
                            render={({ field }) => (
                                <input type="hidden" {...field} />
                            )}
                        />
                        <FormField
                            control={control}
                            name="blood_type_id"
                            render={({ field }) => (
                                <FormItem className="mt-2">
                                    <div className="flex flex-wrap items-center gap-5">
                                        <h1 className="text-xl font-bold">
                                            Blood Type:
                                        </h1>

                                        <label
                                            className={clsx(
                                                "input flex-1 w-full min-w-40 mt-1",
                                                errors?.blood_type_id
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <MdBloodtype className="h-3" />
                                            <select
                                                className="w-full text-2xl dark:bg-inherit"
                                                tabIndex={2}
                                                disabled={
                                                    donor?.is_bloodtype_verified
                                                }
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
                                        {donor?.is_bloodtype_verified ? (
                                            <div className="badge badge-success px-2 py-5">
                                                <CheckCircle />
                                                Verified
                                            </div>
                                        ) : (
                                            <div className="badge badge-warning px-2 py-5">
                                                <QuestionMarkCircledIcon /> Not
                                                Verified
                                            </div>
                                        )}
                                    </div>
                                    <FieldError field={errors?.blood_type_id} />
                                </FormItem>
                            )}
                        />
                    </div>

                    {!donor?.is_bloodtype_verified && (
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
                                        Update
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </Card>
            </form>
            {/* <FormLogger watch={watch} errors={errors} /> */}
        </Form>
    );
}
