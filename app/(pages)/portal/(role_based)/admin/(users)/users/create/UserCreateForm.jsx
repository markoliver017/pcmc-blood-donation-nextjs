"use client";
import React, { use, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), {
    ssr: false,
});
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
import { useTheme } from "next-themes";
import { getSingleStyle } from "@/styles/select-styles";
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
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import { BiMaleFemale } from "react-icons/bi";
import FormLogger from "@lib/utils/FormLogger";
import { MdPassword } from "react-icons/md";

const notAllowedRoles = [
    "Agency Administrator",
    "Donor",
    "Organizer"
]

export default function UserCreateForm({ fetchRoles }) {
    const router = useRouter();
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
                title: "Submission Successful",
                text: "New user has been successfully created.",
                icon: "success",
                confirmButtonText: "Done",
                onConfirm: reset,
                element_id: "user_form",
                onConfirm: () => router.back(),
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

    // useEffect(() => {
    //     console.log("useeffect error", error);
    //     console.log("useeffect data", data);
    // }, [data, error]);

    const { theme, resolvedTheme } = useTheme();
    const roles = use(fetchRoles);

    if (!roles.success) redirect("/users?error=userRoleNotFound");

    const roleOptions = roles.data.filter((role) => !notAllowedRoles.includes(role.role_name)).map((type) => ({
        value: type.role_name,
        label: type.role_name,
        id: type.id,
    }));

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(userSchema),
        defaultValues: {
            profile_picture: null, // or some default value
            role_ids: [],
            email: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            gender: "",
            isChangePassword: true,
            password: "User@1234",
            password_confirmation: "User@1234",
        },
    });

    const {
        register,
        watch,
        control,
        handleSubmit,
        setError,
        setValue,
        reset,
        resetField,
        formState: { errors, isDirty },
    } = form;

    const onSubmit = async (data) => {
        SweetAlert({
            title: "Confirmation",
            text: "Create New User?",
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
                // startTransition(async () => {
                //     formAction(data);
                // });
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

    // useEffect(() => {
    //     console.log("watchall", avatar);
    // }, [avatar]);

    return (
        <Card className="p-0 md:p-5 bg-slate-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Create New User</CardTitle>
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
                            <div className="mt-5">
                                <InlineLabel>Roles: </InlineLabel>
                                <fieldset className="fieldset w-full">
                                    <Controller
                                        control={control}
                                        name="role_ids"
                                        render={({
                                            field: {
                                                onChange,
                                                value,
                                                name,
                                                ref,
                                            },
                                        }) => {
                                            const selectedOptions =
                                                roleOptions.filter((option) =>
                                                    value?.includes(option.id)
                                                );

                                            return (
                                                <CreatableSelectNoSSR
                                                    name={name}
                                                    ref={ref}
                                                    placeholder="Roles * (required)"
                                                    value={selectedOptions}
                                                    onChange={(
                                                        selectedOptions
                                                    ) => {
                                                        setValue(
                                                            "selected_role_options",
                                                            selectedOptions
                                                        );

                                                        onChange(
                                                            selectedOptions.map(
                                                                (option) =>
                                                                    option.id
                                                            )
                                                        );
                                                    }}
                                                    isValidNewOption={() =>
                                                        false
                                                    }
                                                    options={roleOptions}
                                                    styles={getSingleStyle(
                                                        resolvedTheme
                                                    )}
                                                    className="sm:text-lg"
                                                    tabIndex={1}
                                                    isClearable
                                                    isMulti
                                                />
                                            );
                                        }}
                                    />
                                </fieldset>
                                <FieldError field={errors?.role_ids} />
                            </div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>
                                            Email Address:
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
                                                tabIndex={2}
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
                                        <InlineLabel>First Name: </InlineLabel>

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
                                                tabIndex={3}
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
                                name="middle_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>Middle Name: </InlineLabel>

                                        <label
                                            className={clsx(
                                                "input w-full mt-1",
                                                errors?.middle_name
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <Text className="h-3" />
                                            <input
                                                type="text"
                                                tabIndex={4}
                                                placeholder="Enter user middle name (optional)"
                                                {...field}
                                            />
                                        </label>
                                        <FieldError
                                            field={errors?.middle_name}
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>Last Name: </InlineLabel>

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
                                                tabIndex={5}
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
                                        <InlineLabel>Gender: </InlineLabel>

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
                                                tabIndex={6}
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
                                                tabIndex={7}
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
                                            Confirm Password:
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
                                                tabIndex={8}
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
                                    tabIndex={9}
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
                {/* <FormLogger watch={watch} errors={errors} data={data} /> */}
            </CardContent>
        </Card>
    );
}
