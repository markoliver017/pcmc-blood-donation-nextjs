"use client";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";

import { userAccountCredentialSchema } from "@lib/zod/userSchema";
import { updateUserCredentials } from "@/action/userAction";
import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import { Form, FormField, FormItem } from "@components/ui/form";

import { uploadPicture } from "@/action/uploads";
import { GrUpdate } from "react-icons/gr";
import FormLogger from "@lib/utils/FormLogger";
import { MdPassword } from "react-icons/md";
import { signOut } from "next-auth/react";

export default function UserChangePassword({ userQuery }) {
    const queryClient = useQueryClient();

    const { data: userData } = userQuery;

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateUserCredentials(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            SweetAlert({
                title: "User Updated",
                text: "Your account credentials has been updated successfully. You will be signed out.",
                icon: "success",
                confirmButtonText: "Okay",
                onConfirm: () => {
                    signOut({ callbackUrl: "/login" });
                },
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
        resolver: zodResolver(userAccountCredentialSchema),
        defaultValues: {
            id: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
    });

    const {
        watch,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isDirty },
    } = form;

    useEffect(() => {
        if (userData) {
            reset({
                id: userData.id,
                email: userData?.email || "",
                password: "",
                password_confirmation: "",
            });
        }
    }, [userData, reset]);

    if (userQuery.isError)
        return (
            <div className="alert alert-error text-gray-700">
                Error: {userQuery.error.message}
            </div>
        );

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Confirmation",
            text: "Are you sure you want to update your credentials? This action will sign you out.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                formData.id = userData.id;
                mutate(formData);
            },
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2 px-2 md:px-5 py-5 shadow border rounded-2xl"
            >
                <p className="text-xl font-bold">Account Credentials</p>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <InlineLabel>Email Address: </InlineLabel>
                            <label
                                className={clsx(
                                    "input w-full",
                                    errors?.email ? "input-error" : "input-info"
                                )}
                            >
                                <Mail className="h-3" />
                                <input
                                    type="email"
                                    tabIndex={1}
                                    {...field}
                                    placeholder="example@email.com"
                                />
                            </label>

                            <FieldError field={errors?.email} />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <InlineLabel>Password: </InlineLabel>

                            <label
                                className={clsx(
                                    "input w-full mt-1",
                                    errors?.password
                                        ? "input-error"
                                        : "input-info"
                                )}
                            >
                                <MdPassword className="h-3" />
                                <input
                                    type="password"
                                    tabIndex={2}
                                    placeholder="Enter your password"
                                    {...field}
                                />
                            </label>
                            <FieldError field={errors?.password} />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                        <FormItem>
                            <InlineLabel>Confirm Password: </InlineLabel>

                            <label
                                className={clsx(
                                    "input w-full mt-1",
                                    errors?.password_confirmation
                                        ? "input-error"
                                        : "input-info"
                                )}
                            >
                                <MdPassword className="h-3" />
                                <input
                                    type="password"
                                    tabIndex={3}
                                    placeholder="Re-type your password"
                                    {...field}
                                />
                            </label>
                            <FieldError field={errors?.password_confirmation} />
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
            {/* <FormLogger watch={watch} errors={errors} /> */}
        </Form>
    );
}
