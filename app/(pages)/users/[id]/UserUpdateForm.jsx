"use client";
import React, {
    startTransition,
    use,
    useActionState,
    useEffect,
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

import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiError, BiMaleFemale } from "react-icons/bi";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
import { useTheme } from "next-themes";
import { getSingleStyle } from "@/styles/select-styles";
import { userSchema } from "@lib/zod/userSchema";
import { createUser } from "@/action/userAction";
import FieldError from "@components/form/FieldError";
import clsx from "clsx";

export default function UserUpdateForm({ fetchRoles }) {
    const { theme, resolvedTheme } = useTheme();
    const roles = use(fetchRoles);
    const [state, formAction, isLoading] = useActionState(createUser, {
        success: false,
        message: "",
    });
    const [roleOptions, setRoleOptions] = useState([]);

    useEffect(() => {
        if (roles && !roles.error) {
            setRoleOptions(
                roles.map((type) => ({
                    value: type.role_name,
                    label: type.role_name,
                    id: type.id,
                }))
            );
            return;
        }
        notify({ error: true, message: roles.message }, "error");
    }, [roles]);

    const {
        register,
        watch,
        control,
        handleSubmit,
        setError,
        setValue,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        mode: "onChange",
        resolver: zodResolver(userSchema),
        defaultValues: {},
    });
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
            text: "Create New User?.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            onConfirm: () => {
                startTransition(async () => {
                    formAction(data);
                });
            },
        });
    };

    // useEffect(() => {
    //     console.log("watchall", watch());
    // }, [watch()]);

    return (
        <Card className="p-5 bg-gray-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Create New User</CardTitle>
                <CardDescription className="text-justify pt-1">
                    Create User details.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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
                    <div>
                        <InlineLabel>Email Address: *</InlineLabel>
                        <label
                            className={clsx(
                                "input w-full mt-1",
                                errors?.email ? "input-error" : "input-info"
                            )}
                        >
                            <Mail className="h-3" />
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="example@email.com"
                            />
                        </label>

                        <FieldError field={errors?.email} />
                    </div>
                    <div>
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
                                {...register("first_name")}
                                placeholder="Enter user first name"
                            />
                        </label>
                        <FieldError field={errors?.first_name} />
                    </div>
                    <div>
                        <InlineLabel>Last Name: *</InlineLabel>

                        <label
                            className={clsx(
                                "input w-full mt-1",
                                errors?.last_name ? "input-error" : "input-info"
                            )}
                        >
                            <Text className="h-3" />
                            <input
                                type="text"
                                {...register("last_name")}
                                placeholder="Enter user last name"
                            />
                        </label>
                        <FieldError field={errors?.last_name} />
                    </div>
                    <div>
                        <InlineLabel>Gender: *</InlineLabel>

                        <label
                            className={clsx(
                                "input w-full mt-1",
                                errors?.gender ? "input-error" : "input-info"
                            )}
                        >
                            <BiMaleFemale className="h-3" />
                            <select {...register("gender")} className="w-full">
                                <option value="">Select here</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="unknown">Unknown</option>
                            </select>
                        </label>
                        <FieldError field={errors?.gender} />
                    </div>

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
            </CardContent>
        </Card>
    );
}
