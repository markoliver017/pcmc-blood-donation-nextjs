"use client";
import React, {
    startTransition,
    use,
    useActionState,
    useEffect,
    useRef,
    useState,
} from "react";
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
import { BiMaleFemale } from "react-icons/bi";
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
import Image from "next/image";
import { uploadPicture } from "@/action/uploads";
import { redirect } from "next/navigation";

export default function UserCreateForm({ fetchRoles }) {
    const { theme, resolvedTheme } = useTheme();
    const roles = use(fetchRoles);
    const [state, formAction, isLoading] = useActionState(createUser, {
        success: false,
        message: "",
    });
    if (!roles.success) redirect("/users?error=userRoleNotFound");

    const roleOptions = roles.data.map((type) => ({
        value: type.role_name,
        label: type.role_name,
        id: type.id,
    }));

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(userSchema),
        defaultValues: {
            profile_picture: null, // or some default value
            role_id: null,
            email: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            gender: "",
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

    useEffect(() => {
        console.log("Submitted: state", state);

        if (state.success) {
            SweetAlert({
                title: "Submission Successful",
                text: "New user has been successfully created.",
                icon: "success",
                confirmButtonText: "Done",
                onConfirm: reset,
            });
        }

        if (!state.success) {
            if (state?.type == "validation" && state?.errorArr) {
                let detailContent = "";
                const { errorArr: details, message } = state;
                // If it's an array, show a list
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
            }

            if (state?.type == "server") {
                notify({
                    error: true,
                    message: state?.message,
                });
            }
        }
    }, [state]);

    const onSubmit = async (data) => {
        SweetAlert({
            title: "Confirmation",
            text: "Create New User?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",

            onConfirm: async () => {
                if (data.profile_picture) {
                    const result = await uploadPicture(data.profile_picture);
                    if (result?.success) {
                        data.image = result.file_data?.url || null;
                    }
                    console.log("Upload result:", result);
                }
                console.log(">>>>>>>>>>>>>>>>>>>", data);
                startTransition(async () => {
                    formAction(data);
                });
            },
        });
    };

    const uploaded_avatar = watch("profile_picture");
    const avatar =
        !errors?.profile_picture && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : "/default_avatar.png";

    // useEffect(() => {
    //     console.log("watchall", avatar);
    // }, [avatar]);

    return (
        <Card className="p-5 bg-gray-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Create New User</CardTitle>
                <CardDescription className="text-justify pt-1">
                    Create User details.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-2"
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
                                                    onChange={(e) =>
                                                        onChange(
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <Image
                                            src={avatar}
                                            className="rounded-4xl mx-auto shadow-2xl"
                                            width={250}
                                            height={250}
                                            alt="Avatar"
                                            onClick={handleImageClick}
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
                        <div className="mt-5">
                            <InlineLabel>Role: *</InlineLabel>
                            <fieldset className="fieldset w-full">
                                <Controller
                                    control={control}
                                    name="role_id"
                                    render={({
                                        field: { onChange, value, name, ref },
                                    }) => {
                                        const selectedOption =
                                            roleOptions.find(
                                                (option) => option.id === value
                                            ) || null;
                                        return (
                                            <CreatableSelectNoSSR
                                                name={name}
                                                ref={ref}
                                                placeholder="Type of medication error * (required)"
                                                value={selectedOption}
                                                onChange={(selectedOption) => {
                                                    setValue(
                                                        "selected_role_option",
                                                        selectedOption
                                                    );

                                                    onChange(
                                                        selectedOption
                                                            ? selectedOption.id
                                                            : null
                                                    );
                                                }}
                                                isValidNewOption={() => false}
                                                options={roleOptions}
                                                styles={getSingleStyle(
                                                    resolvedTheme
                                                )}
                                                className="sm:text-lg"
                                                isClearable
                                            />
                                        );
                                    }}
                                />
                            </fieldset>
                            <FieldError field={errors?.role_id} />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Email Address: *</InlineLabel>
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
                                            placeholder="Enter user first name"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.first_name} />
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
                                            placeholder="Enter user middle name (optional)"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.middle_name} />
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
                                    <InlineLabel>Gender: *</InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.gender
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <BiMaleFemale className="h-3" />
                                        <select className="w-full" {...field}>
                                            <option value="">
                                                Select here
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">
                                                Female
                                            </option>
                                            <option value="unknown">
                                                Unknown
                                            </option>
                                        </select>
                                    </label>
                                    <FieldError field={errors?.gender} />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <button
                                disabled={!isDirty}
                                className="btn btn-neutral mt-4 hover:bg-neutral-800 hover:text-green-300"
                            >
                                {isLoading ? (
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
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
