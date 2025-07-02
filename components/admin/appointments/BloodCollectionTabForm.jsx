"use client";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Card } from "@components/ui/card";
import { Volume } from "lucide-react";

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

import { IoInformationCircle } from "react-icons/io5";
import { toastError } from "@lib/utils/toastError.utils";
import { bloodCollectionchema } from "@lib/zod/bloodCollectionSchema";
import FormLogger from "@lib/utils/FormLogger";
import { storeUpdateBloodCollection } from "@/action/bloodCollectionAction";

export default function BloodCollectionTabForm({ appointment }) {
    const queryClient = useQueryClient();

    const { data, mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await storeUpdateBloodCollection(
                appointment?.id,
                formData
            );
            if (!res.success) {
                throw res;
            }
            return res;
        },
        onSuccess: (res) => {
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({
                queryKey: ["event-dashboard"],
            });
            queryClient.invalidateQueries({
                queryKey: ["event-statistics"],
            });
            queryClient.invalidateQueries({ queryKey: ["appointment"] });
            SweetAlert({
                title: "Blood Collection",
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

    const bloodCollection = appointment?.blood_collection;

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(bloodCollectionchema),
        defaultValues: {
            volume: bloodCollection?.volume || "",
            remarks: bloodCollection?.remarks || "",
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
            title: "Blood Collection?",
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

    if (!appointment)
        return (
            <div className="alert alert-error">
                No appointment found! Please refresh your browser and try again!
            </div>
        );

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                id="form-modal"
                className="space-y-2 flex flex-col gap-2 justify-center"
            >
                <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                    <div className="flex items-center gap-5">
                        <h1 className="text-xl font-bold flex-items-center">
                            <IoInformationCircle /> Blood Collection Details:
                        </h1>
                    </div>
                    <div className="pl-4 space-y-5">
                        <FormField
                            control={control}
                            name="volume"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        Volume:{" "}
                                        <span className="text-xs text-slate-600">
                                            (ml)
                                        </span>{" "}
                                    </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.volume
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Volume className="h-3" />
                                        <input
                                            type="number"
                                            tabIndex={1}
                                            placeholder="Enter volume (ml)"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.volume} />
                                </FormItem>
                            )}
                        />

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
                                        tabIndex={2}
                                        {...field}
                                    />
                                    <FieldError field={errors?.remarks} />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            disabled={!isDirty || isPending}
                            className="btn btn-neutral mt-4 hover:bg-neutral-800 hover:text-green-300"
                            tabIndex={3}
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
                initialData={bloodCollection}
                data={data}
            /> */}
        </Form>
    );
}
