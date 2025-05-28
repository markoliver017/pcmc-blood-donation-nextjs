"use client";
import React from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";

import { Mail } from "lucide-react";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
// import { useTheme } from "next-themes";
import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import {
    FormField,
    FormItem,
} from "@components/ui/form";

import { MdNextPlan, MdPassword } from "react-icons/md";
import { useRouter } from "next/navigation";
import { GiCancel } from "react-icons/gi";
import { useFormContext } from "react-hook-form";
import { IoArrowUndoCircle } from "react-icons/io5";

export default function NewUserCredentialsForm({ details, onNext }) {

    const router = useRouter();
    const {
        trigger,
        control,
        formState: { errors },
    } = useFormContext();

    const onSubmitNext = async () => {
        const valid = await trigger([
            "isChangePassword",
            "password",
            "password_confirmation",
        ]);
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




    return (
        <Card className="p-0 md:p-5 bg-slate-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle className="text-2xl">
                    {details.title}
                </CardTitle>
                <CardDescription>
                    <div>Please fill up all the * required fields.</div>
                </CardDescription>
            </CardHeader>
            <CardContent>

                <FormField
                    control={control}
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
                    control={control}
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
                    control={control}
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

                <div className="flex-none card-actions justify-between mt-5">
                    <button
                        onClick={() => onNext(-1)}
                        className="btn btn-default"
                        tabIndex={-1}
                    >
                        <IoArrowUndoCircle />{" "}
                        <span className="hidden sm:inline-block">Back</span>
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

            </CardContent>
        </Card >
    );
}
