"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";

import { Mail, Send, Text } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
// import { useTheme } from "next-themes";
import { userSchema } from "@lib/zod/userSchema";
import { createUser } from "@/action/userAction";
import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";

import { uploadPicture } from "@/action/uploads";
import { useRouter } from "next/navigation";

import CustomAvatar from "@components/reusable_components/CustomAvatar";

import { signIn } from "next-auth/react";
// import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { BiMaleFemale } from "react-icons/bi";
import FormLogger from "@lib/utils/FormLogger";
import { MdPassword } from "react-icons/md";

export default function NewUserForm({ role }) {
    const user_role = use(role);
    // const [isLoading, setIsLoading] = useState({});
    const router = useRouter();

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(userSchema),
        defaultValues: {
            profile_picture: null, // or some default value
            role_ids: [user_role.id],
            email: "mark@email.com",
            first_name: "Mark",
            last_name: "Roman",
            gender: "male",
            isChangePassword: true,
            password: "User@1234",
            password_confirmation: "User@1234",
        },
    });

    const {
        watch,
        control,
        handleSubmit,
        setValue,
        reset,
        resetField,
        formState: { errors, isDirty },
    } = form;

    const email = watch("email");
    const password = watch("password");

    const queryClient = useQueryClient();
    const { data, mutate, error, isError, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await createUser(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: () => {
            /** note: the return data will be accessible in the debugger
             *so no need to console the onSuccess(data) here **/
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["users"] });
            SweetAlert({
                title: "Registration Complete",
                text: "You've Successfully Registered",
                icon: "success",
                showCancelButton: true,
                cancelButtonText: "Cancel",
                confirmButtonText: "Proceed to Agency Registration",
                element_id: "user_form",
                onCancel: () => router.push("/"),
                onConfirm: async () => {
                    const res = await signIn("credentials", {
                        email,
                        password,
                        redirect: false,
                    });
                    if (res.ok) router.refresh();
                    reset();
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
                        <div className="collapse">
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

    const onSubmit = async (data) => {
        SweetAlert({
            title: "Confirmation",
            text: "Are you sure you want to proceed?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            element_id: "user_form",
            onConfirm: async () => {
                const fileUrl = watch("image");
                if (data?.profile_picture && !fileUrl) {
                    const result = await uploadPicture(data.profile_picture);
                    if (result?.success) {
                        data.image = result.file_data?.url || null;
                        setValue("image", result.file_data?.url);
                    }
                    console.log("Upload result:", result);
                }

                mutate(data);
            },
        });
    };

    const uploaded_avatar = watch("profile_picture");
    const avatar =
        !errors?.profile_picture && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : "/default_avatar.png";
    useEffect(() => {
        setValue("image", null);
    }, [uploaded_avatar]);

    return (
        <Card className="p-0 md:p-5 bg-slate-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>
                    Create New{" "}
                    <span className="font-bold">{user_role.role_name}</span>{" "}
                    Account
                </CardTitle>
                <CardDescription>
                    <div>Create User details.</div>
                </CardDescription>
            </CardHeader>
            <CardContent id="user_form">
                <Form {...form}>
                    {isError && (
                        <div className="alert alert-error text-gray-700 mb-5">
                            Error: {error.message}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-wrap xl:flex-nowrap justify-center gap-2 md:gap-5"
                    >
                        <FormField
                            control={control}
                            name="profile_picture"
                            render={({
                                field: { onChange, value, ...field },
                            }) => {
                                const fileInputRef = useRef(null);
                                const handleImageClick = () => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.click(); // Trigger the file input click
                                    }
                                };
                                return (
                                    <FormItem className="text-center">
                                        <div className="hidden">
                                            <InlineLabel>
                                                New Profile Picture
                                            </InlineLabel>
                                            <FormControl ref={fileInputRef}>
                                                <Input
                                                    type="file"
                                                    tabIndex={-1}
                                                    onChange={(e) =>
                                                        onChange(
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <CustomAvatar
                                            avatar={avatar}
                                            whenClick={handleImageClick}
                                            className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px]"
                                        />
                                        {uploaded_avatar && (
                                            <button
                                                onClick={() =>
                                                    resetField(
                                                        "profile_picture"
                                                    )
                                                }
                                                className="btn btn-ghost"
                                            >
                                                Clear
                                            </button>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <div className="w-full sm:min-w-[450px]">
                            <FormField
                                control={form.control}
                                name="role_ids"
                                render={({ field }) => (
                                    <FormItem className="hidden">
                                        <InlineLabel>Role: *</InlineLabel>

                                        <label
                                            className={clsx(
                                                "input w-full mt-1",
                                                errors?.role_ids
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <Text className="h-3" />
                                            <input
                                                type="text"
                                                tabIndex={-1}
                                                placeholder="Your Role ID"
                                                {...field}
                                            />
                                        </label>
                                        <FieldError field={errors?.role_ids} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>
                                            Email Address: *
                                        </InlineLabel>
                                        <label
                                            className={clsx(
                                                "input w-full mt-1",
                                                errors?.email
                                                    ? "input-error"
                                                    : "input-info"
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
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>First Name: *</InlineLabel>

                                        <label
                                            className={clsx(
                                                "input w-full mt-1",
                                                errors?.first_name
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <Text className="h-3" />
                                            <input
                                                type="text"
                                                tabIndex={2}
                                                placeholder="Enter user first name"
                                                {...field}
                                            />
                                        </label>
                                        <FieldError
                                            field={errors?.first_name}
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>Last Name: *</InlineLabel>

                                        <label
                                            className={clsx(
                                                "input w-full mt-1",
                                                errors?.last_name
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <Text className="h-3" />
                                            <input
                                                type="text"
                                                tabIndex={3}
                                                placeholder="Enter user last name"
                                                {...field}
                                            />
                                        </label>
                                        <FieldError field={errors?.last_name} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>Sex: *</InlineLabel>

                                        <label
                                            className={clsx(
                                                "input w-full mt-1",
                                                errors?.gender
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <BiMaleFemale className="h-3" />
                                            <select
                                                className="w-full dark:bg-inherit"
                                                tabIndex={4}
                                                {...field}
                                            >
                                                <option value="">
                                                    Select here
                                                </option>
                                                <option value="male">
                                                    Male
                                                </option>
                                                <option value="female">
                                                    Female
                                                </option>
                                            </select>
                                        </label>
                                        <FieldError field={errors?.gender} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>Password: *</InlineLabel>

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
                                                tabIndex={5}
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
                                        <InlineLabel>
                                            Confirm Password: *
                                        </InlineLabel>

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
                                                tabIndex={6}
                                                placeholder="Re-type your password"
                                                {...field}
                                            />
                                        </label>
                                        <FieldError
                                            field={
                                                errors?.password_confirmation
                                            }
                                        />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <button
                                    disabled={!isDirty || isPending}
                                    tabIndex={6}
                                    className="btn btn-neutral mt-4 hover:bg-neutral-800 hover:text-green-300 focus:ring-2"
                                >
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-bars loading-xs"></span>
                                            Submitting ...
                                        </>
                                    ) : (
                                        <>
                                            <Send />
                                            Submit
                                        </>
                                    )}
                                </button>
                            </div>
                            {errors.length && (
                                <div className="alert alert-error text-gray-700 mt-5">
                                    Error: {JSON.stringify(errors)}
                                </div>
                            )}
                        </div>
                    </form>
                </Form>

                <FormLogger watch={watch} errors={errors} data={data} />

                {/* <div className="divider">
                    or Sign Up with the following provider
                </div>

                <div className="p-5 border round">
                    <button
                        className="btn bg-black text-white border-black hover:bg-neutral-800 hover:text-green-300"
                        onClick={() => {
                            setIsLoading(() => ({
                                github: true,
                            }));
                            signIn("github", {
                                callbackUrl: "/register/organizers",
                            });
                        }}
                        disabled={isLoading?.github}
                    >
                        {isLoading?.github ? (
                            "Signing in..."
                        ) : (
                            <>
                                <GitHubLogoIcon />
                                Sign In with Github
                            </>
                        )}
                    </button>
                </div> */}
            </CardContent>
        </Card>
    );
}
