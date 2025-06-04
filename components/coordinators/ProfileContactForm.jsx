"use client";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import { Form, FormField, FormItem } from "@components/ui/form";

import { GrUpdate } from "react-icons/gr";
import { coordinatorSchema } from "@lib/zod/agencySchema";
import { Phone } from "lucide-react";
import FormLogger from "@lib/utils/FormLogger";
import { updateCoordinator } from "@/action/agencyAction";

export default function ProfileContactForm({ coordinator }) {


    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateCoordinator(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            SweetAlert({
                title: "Contact Information Updated",
                text: "Your contact details has been updated successfully .",
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
        resolver: zodResolver(coordinatorSchema),
        defaultValues: {
            id: coordinator.id,
            agency_id: coordinator.agency_id,
            contact_number: coordinator.contact_number
        },
    });

    const {
        watch,
        handleSubmit,
        formState: { errors, isDirty },
    } = form;




    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Confirmation",
            text: "Are you sure you want to update your contact information?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            onConfirm: async () => {

                mutate(formData);
            },
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 shadow border rounded-2xl">
                <FormField
                    control={form.control}
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
                                <input
                                    type="text"
                                    tabIndex={2}
                                    {...field}
                                    placeholder="+63#########"
                                />
                            </label>

                            <FieldError
                                field={errors?.contact_number}
                            />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <button
                        disabled={!isDirty || isPending}
                        tabIndex={4}
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
            </form>
            <FormLogger watch={watch} errors={errors} />
        </Form>
    );
}
