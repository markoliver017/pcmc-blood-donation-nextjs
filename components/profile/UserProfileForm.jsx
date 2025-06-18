"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Card } from "@components/ui/card";
import { Mail, Text } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { BiMaleFemale } from "react-icons/bi";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";

import { getUserBasicInformationSchema } from "@lib/zod/userSchema";
import { updateUserBasicInfo } from "@/action/userAction";
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
import { GrUpdate } from "react-icons/gr";
import { useRouter } from "next/navigation";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import FormLogger from "@lib/utils/FormLogger";
import { useSession } from "next-auth/react";

export default function UserProfileForm({ userQuery }) {
    const router = useRouter();

    const session = useSession();

    console.log(">>>>>>>", session);

    const isDonor =
        session?.status === "authenticated" &&
        session.data?.user?.role_name === "Donor";

    const userBasicInformationSchema = useMemo(() => {
        return getUserBasicInformationSchema(isDonor);
    }, [isDonor]);

    const fileInputRef = useRef(null);

    const queryClient = useQueryClient();

    const { data: userData } = userQuery;

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateUserBasicInfo(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            console.log("update user", res);
            return res.data;
        },
        onSuccess: (data) => {
            console.log("Success: Updated Data:", data);
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["user"] });
            SweetAlert({
                title: "Update Profile",
                text: "Your user profile information has been updated successfully .",
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
        resolver: zodResolver(userBasicInformationSchema),
        defaultValues: {
            id: "",
            profile_picture: null,
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
        if (userData) {
            reset({
                id: userData?.id,
                profile_picture: null,
                first_name: userData?.first_name || "",
                middle_name: userData?.middle_name || "",
                last_name: userData?.last_name || "",
                gender: userData?.gender || "",
                image: userData?.image || null,
            });
        }
    }, [userData, reset]);

    /* For profile picture data logic */
    const uploaded_avatar = watch("profile_picture");
    let avatar = userData?.image || "/default_avatar.png";
    if (!errors?.profile_picture && uploaded_avatar) {
        avatar = URL.createObjectURL(uploaded_avatar);
    }
    useEffect(() => {
        setValue("image", userData?.image || null);
    }, [uploaded_avatar]);

    if (userQuery.isError)
        return (
            <div className="alert alert-error text-gray-700">
                Error: {userQuery.error.message}
            </div>
        );

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Confirmation",
            text: "Update your profile?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                const fileUrl = watch("image");

                if (
                    formData.profile_picture &&
                    (fileUrl == userData?.image || !fileUrl)
                ) {
                    const result = await uploadPicture(
                        formData.profile_picture
                    );
                    if (result?.success) {
                        formData.image = result.file_data?.url || null;
                        setValue("image", result.file_data?.url);
                    }
                    console.log("Upload result:", result);
                }
                console.log("submitted formData>>>>>>>", formData);
                mutate(formData);
            },
        });
    };

    let user = null;
    if (session.status == "authenticated") {
        user = session.data.user;
    }

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2 flex flex-wrap gap-2 justify-center"
            >
                <div className="w-full md:w-min">
                    <FormField
                        control={control}
                        name="profile_picture"
                        render={({ field: { onChange, value, ...field } }) => {
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
                                                    onChange(e.target.files[0])
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <CustomAvatar
                                        avatar={avatar}
                                        whenClick={handleImageClick}
                                        className="w-[250px] h-[250px]"
                                    />
                                    {uploaded_avatar && (
                                        <button
                                            onClick={() =>
                                                resetField("profile_picture")
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
                </div>

                <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <input type="hidden" {...field} />
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
                                        "input w-full",
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
                                <InlineLabel required={false}>
                                    Middle Name:{" "}
                                </InlineLabel>

                                <label
                                    className={clsx(
                                        "input w-full",
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
                                <InlineLabel>Last Name: </InlineLabel>

                                <label
                                    className={clsx(
                                        "input w-full",
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
                                <InlineLabel>Sex: </InlineLabel>

                                <label
                                    className={clsx(
                                        "input w-full",
                                        errors?.gender
                                            ? "input-error"
                                            : "input-info"
                                    )}
                                >
                                    <BiMaleFemale className="h-3" />
                                    <select
                                        className="w-full dark:bg-inherit"
                                        {...field}
                                    >
                                        <option value="">Select here</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </label>
                                <FieldError field={errors?.gender} />
                            </FormItem>
                        )}
                    />

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
                </Card>
            </form>
            {/* <FormLogger watch={watch} errors={errors} /> */}
        </Form>
    );
}
