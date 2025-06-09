"use client";
import React, { useEffect, useRef } from "react";

import { CardContent } from "@components/ui/card";

import { Calendar, CalendarPlus2, Text } from "lucide-react";
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

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SweetAlert from "@components/ui/SweetAlert";
import { toastError } from "@lib/utils/toastError.utils";
import FormCardSingleForm from "@components/form/FormCardSingleForm";
import Tiptap from "@components/reusable_components/Tiptap";
import FormLogger from "@lib/utils/FormLogger";

export default function CreateEventForm() {
    const router = useRouter();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            // const res = await updateCoordinator(formData);
            // if (!res.success) {
            //     throw res; 
            // }
            // return res.data;
            return formData;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["blood_donation_events"] });
            SweetAlert({
                title: "New Blood Donation Event",
                text: "You have successfully created a new blood donation event.",
                icon: "success",
                confirmButtonText: "Okay",
                onConfirm: () => {
                    reset();
                    router.back();
                },
            });
        },
        onError: (error) => {
            // Handle validation errors
            if (error?.type === "validation" && error?.errorArr.length) {
                toastError(error);
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
        // resolver: zodResolver(),
        defaultValues: {
            title: "",
            description: "",
            date: "",
            file: null,
            file_url: null,
            time_schedules: [
                {
                    time_start: "",
                    time_end: "",
                    has_limit: false,
                    max_limit: 1,
                }
            ]
        }
    });

    const {
        control,
        watch,
        resetField,
        reset,
        setValue,
        handleSubmit,
        formState: { errors, isDirty },
    } = form;

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Confirmation",
            text: "Are you sure you want to create new Blood Donation Event?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            onConfirm: async () => {

                mutate(formData);
            },
        });
    };


    const uploaded_avatar = watch("file");
    const avatar =
        !errors?.file && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : "/upload-file-profile-pic.png";

    useEffect(() => {
        if (watch("file_url")) setValue("file_url", null);
    }, [uploaded_avatar]);

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 shadow border rounded-2xl">
                <FormCardSingleForm details={{ title: "Create New Blood Donation Event" }}>
                    <CardContent className="flex flex-wrap gap-5">
                        <FormField
                            control={control}
                            name="file"
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
                                                    resetField("file")
                                                }
                                                className="btn btn-ghost"
                                            >
                                                Clear
                                            </button>
                                        ) : (
                                            <label className="text-center font-semibold italic text-slate-500">
                                                Event Photo
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
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>Title: </InlineLabel>

                                        <label
                                            className={clsx(
                                                "input w-full mt-1",
                                                errors?.title
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <Text className="h-3" />
                                            <input
                                                type="text"
                                                tabIndex={2}
                                                placeholder="Enter event title"
                                                {...field}
                                            />
                                        </label>
                                        <FieldError field={errors?.title} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>Event Date: </InlineLabel>

                                        <label
                                            className={clsx(
                                                "input w-full mt-1",
                                                errors?.date
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <Calendar className="h-3" />
                                            <input
                                                type="date"
                                                tabIndex={1}
                                                placeholder="Enter event date"
                                                {...field}
                                            />
                                        </label>
                                        <FieldError field={errors?.date} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="description"
                                render={({ field: { value, onChange } }) => (
                                    <FormItem>
                                        <InlineLabel>Description: </InlineLabel>

                                        <span
                                            className={clsx(
                                                "w-full mt-1",
                                                errors?.description
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <Tiptap content={value} onContentChange={onChange} />
                                        </span>
                                        <FieldError field={errors?.description} />
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
                                            <CalendarPlus2 />
                                            Add Event
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    </CardContent>
                </FormCardSingleForm>
            </form>
            <FormLogger watch={watch} errors={errors} />
        </Form>
    );
}
