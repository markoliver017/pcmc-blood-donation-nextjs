"use client";
import React, { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Mail, Text } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { BiMaleFemale } from "react-icons/bi";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
import { useTheme } from "next-themes";
import { getSingleStyle } from "@/styles/select-styles";
import { userSchema } from "@lib/zod/userSchema";
import { getUser, updateUser } from "@/action/userAction";
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
import UserStatusUpdater from "./UserStatusUpdater";
// import FormLogger from "@lib/utils/FormLogger";
import { MdPassword } from "react-icons/md";
import ToggleChangePassword from "@components/reusable_components/ToggleChangePassword";
import { fetchRoles } from "@/action/roleAction";
import Skeleton_user from "@components/ui/Skeleton_user";

export default function UserUpdateForm({ userId }) {
    const router = useRouter();

    const fileInputRef = useRef(null);

    const queryClient = useQueryClient();
    const rolesQuery = useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const res = await fetchRoles();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    const userQuery = useQuery({
        queryKey: ["user", userId],
        queryFn: async () => {
            const res = await getUser(userId);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
    });

    const { data: userData } = userQuery;
    const { data: roles } = rolesQuery;

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateUser(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            console.log("update user", res);
            return res.data;
        },
        onSuccess: (data) => {
            console.log("Success: Updated Data:", data);
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user"] });

            SweetAlert({
                title: "User Updated",
                text: "The user information has been updated successfully .",
                icon: "success",
                showCancelButton: true,
                cancelButtonText: "Back",
                confirmButtonText: "Done",
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
    const { theme, resolvedTheme } = useTheme();

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(userSchema),
        defaultValues: {
            profile_picture: null,
            role_ids: [],
            email: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            gender: "",
            isChangePassword: false,
            password: "",
            password_confirmation: "",
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
        if (userData && roles) {
            reset({
                profile_picture: null,
                role_ids: userData?.roles.map((role) => role.id) || [],
                email: userData?.email || "",
                first_name: userData?.first_name || "",
                middle_name: userData?.middle_name || "",
                last_name: userData?.last_name || "",
                gender: userData?.gender || "",
                image: userData?.image || null,
                isChangePassword: false,
                password: "",
                password_confirmation: "",
            });
        }
    }, [userData, roles, reset]);

    /* For profile picture data logic */
    const uploaded_avatar = watch("profile_picture");
    let avatar = userData?.image || "/default_avatar.png";
    if (!errors?.profile_picture && uploaded_avatar) {
        avatar = URL.createObjectURL(uploaded_avatar);
    }
    useEffect(() => {
        setValue("image", userData?.image || null);
    }, [uploaded_avatar]);

    if (rolesQuery.isLoading || userQuery.isLoading) return <Skeleton_user />;
    if (userQuery.isError)
        return (
            <div className="alert alert-error text-gray-700">
                Error: {userQuery.error.message}
            </div>
        );
    if (rolesQuery.isError)
        return (
            <div className="alert alert-error text-gray-700">
                Error: {rolesQuery.error.message}
            </div>
        );

    const roleOptions = roles.map((type) => ({
        value: type.role_name,
        label: type.role_name,
        id: type.id,
    }));

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Confirmation",
            text: "Update User?",
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

                formData.id = userData.id;
                console.log("submitted formData>>>>>>>", formData);
                mutate(formData);
            },
        });
    };

    return (
        <Card className="md:p-5 bg-gray-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Update User</CardTitle>
                <CardDescription>
                    <div>Update User details.</div>
                </CardDescription>
            </CardHeader>
            <CardContent id="form-modal">
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-2 flex flex-wrap gap-2 justify-center"
                    >
                        <div className="w-full md:w-min">
                            <FormField
                                control={control}
                                name="profile_picture"
                                render={({
                                    field: { onChange, value, ...field },
                                }) => {
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
                                                                e.target
                                                                    .files[0]
                                                            )
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
                            {/* <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field: { value, onChange } }) => (
                                    <FormItem className="mt-5 flex flex-col items-center font-semibold md:justify-end">
                                        <Toggle value={value} onChange={onChange} />
                                    </FormItem>
                                )}
                            /> */}
                            <UserStatusUpdater
                                userData={{
                                    id: userData.id,
                                    is_active: userData.is_active,
                                }}
                            />
                        </div>

                        <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                            <div>
                                <InlineLabel>Roles:</InlineLabel>
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

                                            console.log(
                                                "selectedOptions",
                                                selectedOptions
                                            );
                                            return (
                                                <CreatableSelectNoSSR
                                                    name={name}
                                                    ref={ref}
                                                    placeholder="Roles (required)"
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
                                                "input w-full",
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
                                        <InlineLabel>First Name:</InlineLabel>

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
                                        <InlineLabel>Last Name:</InlineLabel>

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
                                        <InlineLabel>Gender:</InlineLabel>

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
                                name="isChangePassword"
                                render={({ field: { value, onChange } }) => (
                                    <FormItem className="mt-5 flex flex-col font-semibold md:justify-end">
                                        <ToggleChangePassword
                                            value={value}
                                            onChange={() => onChange(!value)}
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>Password:</InlineLabel>

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
                                                disabled={
                                                    !watch("isChangePassword")
                                                }
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
                                                disabled={
                                                    !watch("isChangePassword")
                                                }
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
                </Form>
                {/* <FormLogger watch={watch} errors={errors} /> */}
            </CardContent>
        </Card>
    );
}
