"use client";
import React, { useState } from "react";

import {
    CardContent,

} from "@components/ui/card";

import { Eye, EyeClosed, Mail } from "lucide-react";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
// import { useTheme } from "next-themes";
import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import { FormField, FormItem } from "@components/ui/form";

import { MdNextPlan, MdPassword } from "react-icons/md";

import { useFormContext } from "react-hook-form";
import { IoArrowUndoCircle } from "react-icons/io5";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import FormCardComponent from "@components/form/FormCardComponent";
import { GiSemiClosedEye } from "react-icons/gi";

export default function NewUserCredentialsForm({ details, onNext }) {
    const [showPassword, setShowPassword] = useState(false);
    const {
        trigger,
        control,
        getValues,
        setError,
        formState: { errors },
    } = useFormContext();

    const onSubmitNext = async () => {
        const valid = await trigger([
            "email",
            "password",
            "password_confirmation",
        ]);
        if (valid) {
            if (getValues("password") != getValues("password_confirmation")) {
                setError("password_confirmation", {
                    type: "manual", // or "validate", "custom", etc.
                    message: "Passwords do not match.",
                });
            } else {
                onNext(1);
            }
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

    return (
        <FormCardComponent details={details}>
            <CardContent className="flex flex-wrap p-0 gap-5">
                <div className="flex-none text-center w-full md:w-max">
                    <CustomAvatar
                        avatar="/credentials.png"
                        className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px]"
                    />
                </div>
                <div className="flex-1 md:min-w-[350px] flex flex-col justify-evenly">
                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel>Email Address: </InlineLabel>
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
                        control={control}
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
                                        type={showPassword ? "text" : "password"}
                                        tabIndex={2}
                                        placeholder="Enter your password"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-ghost rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPassword(!showPassword)
                                        }}>
                                        {showPassword ? (
                                            <EyeClosed className="cursor-pointer text-slate-700" />

                                        ) : (
                                            <Eye className="cursor-pointer text-slate-700" />
                                        )}
                                    </button>
                                </label>
                                <FieldError field={errors?.password} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
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
                                        type={showPassword ? "text" : "password"}
                                        tabIndex={3}
                                        placeholder="Re-type your password"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-ghost rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPassword(!showPassword)
                                        }}>
                                        {showPassword ? (
                                            <EyeClosed className="cursor-pointer text-slate-700" />

                                        ) : (
                                            <Eye className="cursor-pointer text-slate-700" />
                                        )}
                                    </button>
                                </label>
                                <FieldError
                                    field={errors?.password_confirmation}
                                />
                            </FormItem>
                        )}
                    />

                    <div className="flex-none card-actions justify-between mt-5">
                        <button
                            onClick={() => onNext(-1)}
                            className="btn btn-default"
                            tabIndex={-1}
                        >
                            <IoArrowUndoCircle />{" "}
                            <span className="hidden sm:inline-block">
                                Back
                            </span>
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onSubmitNext}
                            tabIndex="4"
                        >
                            <MdNextPlan />{" "}
                            <span className="hidden sm:inline-block">
                                Next
                            </span>
                        </button>
                    </div>
                </div>
            </CardContent>

        </FormCardComponent>
    );
}
