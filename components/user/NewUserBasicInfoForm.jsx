"use client";
import React, { useEffect, useRef } from "react";

import { CardContent } from "@components/ui/card";

import { Mail, Text } from "lucide-react";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
// import { useTheme } from "next-themes";
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

import CustomAvatar from "@components/reusable_components/CustomAvatar";

// import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { BiMaleFemale } from "react-icons/bi";
import { MdNextPlan, MdPassword } from "react-icons/md";
import { useRouter } from "next/navigation";
import { GiCancel } from "react-icons/gi";
import { useFormContext } from "react-hook-form";
import FormCardComponent from "@components/form/FormCardComponent";

export default function NewUserBasicInfoForm({
    children,
    triggerFields = [
        "profile_picture",
        "role_ids",
        "first_name",
        "middle_name",
        "last_name",
        "gender",
    ],
    details,
    onNext,
}) {
    const router = useRouter();
    const {
        trigger,
        control,
        watch,
        resetField,
        setValue,
        formState: { errors },
    } = useFormContext();

    const onSubmitNext = async () => {
        const valid = await trigger(triggerFields);
        if (valid) {
            onNext(1);
        } else {
            notify(
                {
                    error: true,
                    message: "Please provide the required information..",
                },
                "warning"
            );
        }
    };

    const uploaded_avatar = watch("profile_picture");
    console.log("uploaded_avatar", uploaded_avatar);
    const avatar =
        !errors?.profile_picture && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : "/upload-file-profile-pic.png";

    useEffect(() => {
        if (watch("image")) setValue("image", null);
    }, [uploaded_avatar]);

    return (
        <FormCardComponent details={details}>
            <CardContent className="flex flex-wrap gap-5">
                <FormField
                    control={control}
                    name="profile_picture"
                    render={({ field: { onChange, value, ...field } }) => {
                        const fileInputRef = useRef(null);
                        const handleImageClick = () => {
                            if (fileInputRef.current) {
                                fileInputRef.current.click(); // Trigger the file input click
                            }
                        };
                        return (
                            <FormItem className="flex-none text-center w-full md:w-max">
                                <div className="hidden">
                                    <FormControl ref={fileInputRef}>
                                        <Input
                                            type="file"
                                            tabIndex={-1}
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
                                    className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px]"
                                />
                                {uploaded_avatar ? (
                                    <button
                                        onClick={() =>
                                            resetField("profile_picture")
                                        }
                                        className="btn btn-ghost"
                                    >
                                        Clear
                                    </button>
                                ) : (
                                    <label className="text-center font-semibold italic text-slate-500">
                                        Profile Picture
                                    </label>
                                )}
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                <div className="flex-1 md:min-w-[350px] flex flex-col justify-evenly gap-2">
                    <FormField
                        control={control}
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
                        control={control}
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
                                        tabIndex={2}
                                        placeholder="Enter first name"
                                        {...field}
                                    />
                                </label>
                                <FieldError field={errors?.first_name} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="middle_name"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel required={false}>Middle Name: </InlineLabel>

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
                                        tabIndex={3}
                                        placeholder="Enter middle name"
                                        {...field}
                                    />
                                </label>
                                <FieldError field={errors?.middle_name} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
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
                                        tabIndex={3}
                                        placeholder="Enter last name"
                                        {...field}
                                    />
                                </label>
                                <FieldError field={errors?.last_name} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel>Sex: </InlineLabel>

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
                                        <option value="">Select here</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </label>
                                <FieldError field={errors?.gender} />
                            </FormItem>
                        )}
                    />
                    {children}

                    <div className="flex-none card-actions justify-between mt-5">
                        <button
                            onClick={() => router.replace("/")}
                            className="btn btn-default"
                            tabIndex={-1}
                        >
                            <GiCancel />{" "}
                            <span className="hidden sm:inline-block">
                                Cancel
                            </span>
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onSubmitNext}
                            tabIndex="4"
                        >
                            <MdNextPlan />{" "}
                            <span className="hidden sm:inline-block">Next</span>
                        </button>
                    </div>
                </div>
            </CardContent>
        </FormCardComponent>
    );
}
