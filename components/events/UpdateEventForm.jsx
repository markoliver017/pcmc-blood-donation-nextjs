"use client";
import React, { useEffect, useRef, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";

import {
    Calendar,
    CalendarPlus2,
    Maximize,
    Plus,
    Save,
    Text,
    Timer,
    X,
} from "lucide-react";
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
import { BiMaleFemale, BiTime } from "react-icons/bi";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SweetAlert from "@components/ui/SweetAlert";
import { toastError } from "@lib/utils/toastError.utils";
import FormCardSingleForm from "@components/form/FormCardSingleForm";
import Tiptap from "@components/reusable_components/Tiptap";
import FormLogger from "@lib/utils/FormLogger";
import { MdDeleteForever } from "react-icons/md";
import ToggleAny from "@components/reusable_components/ToggleAny";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { bloodDonationEventSchema } from "@lib/zod/bloodDonationSchema";
import {
    getEventsById,
    storeEvent,
    updateEvent,
} from "@/action/hostEventAction";
import { uploadPicture } from "@/action/uploads";
import AllEventCalendar from "@components/organizers/AllEventCalendar";
import DrawerComponent from "@components/reusable_components/DrawerComponent";
import { DrawerTrigger } from "@components/ui/drawer";
import moment from "moment";
import ImagePreviewComponent from "@components/reusable_components/ImagePreviewComponent";
// import DrawerComponent from "@components/reusable_components/Drawer";

export default function UpdateEventForm({ eventId }) {
    const router = useRouter();

    const queryClient = useQueryClient();

    const { data: event } = useQuery({
        queryKey: ["agency_events", eventId],
        queryFn: async () => await getEventsById(eventId),
        enabled: !!eventId,
        staleTime: 0,
    });

    const { data, mutate, isPending, isError, error } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateEvent(eventId, formData);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["blood_donation_events"],
            });
            queryClient.invalidateQueries({
                queryKey: ["all_event_schedules"],
            });
            queryClient.invalidateQueries({
                queryKey: ["all_events"],
            });
            SweetAlert({
                title: "Update Blood Donation Event",
                text: "You have successfully updated the blood donation event.",
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
            console.log("mutate error", error);
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
        resolver: zodResolver(bloodDonationEventSchema),
        defaultValues: {
            ...event,
            time_schedules: event?.time_schedules.map((sched) => ({
                ...sched,
                time_start: moment(sched.time_start, "HH:mm:ss").format(
                    "HH:mm"
                ),
                time_end: moment(sched.time_end, "HH:mm:ss").format("HH:mm"),
            })),
        },
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

    const { fields, append, remove } = useFieldArray({
        control,
        name: "time_schedules",
    });

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Confirmation",
            text: "Are you sure you want to update this Blood Donation Event?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                const fileUrl = watch("file_url");

                if (formData.file && !fileUrl) {
                    const result = await uploadPicture(formData.file);
                    if (result?.success) {
                        formData.file_url = result.file_data?.url || null;
                        setValue("file_url", result.file_data?.url);
                    }
                    console.log("Upload result:", result);
                }
                mutate(formData);
            },
        });
    };

    const uploaded_avatar = watch("file");
    const avatar =
        !errors?.file && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : event?.file_url || "/upload-event-photo.png";

    useEffect(() => {
        if (watch("file_url")) setValue("file_url", null);
    }, [uploaded_avatar]);

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-5 shadow border rounded-2xl"
            >
                <Card className="md:p-4 bg-slate-100 p-3">
                    <CardHeader className="text-2xl font-bold">
                        <CardTitle className="flex justify-between">
                            <div className="text-2xl">
                                Update Blood Donation Event
                            </div>
                            <div className="flex justify-end">
                                <DrawerComponent
                                    title="Event Calendar"
                                    trigger={
                                        <DrawerTrigger className="btn btn-primary">
                                            <CalendarPlus2 />{" "}
                                            <span className="hidden md:inline-block">
                                                Event Calendar
                                            </span>
                                        </DrawerTrigger>
                                    }
                                >
                                    <AllEventCalendar />
                                </DrawerComponent>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            <div className="text-orange-400">
                                Please fill up all the * required fields.
                            </div>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-wrap gap-5">
                        <FormField
                            control={control}
                            name="file"
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
                                    <FormItem className="flex-none text-center w-full md:w-max">
                                        <div className="hidden">
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
                                            className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px]"
                                        />
                                        {uploaded_avatar ? (
                                            // <button
                                            //     onClick={() =>
                                            //         resetField("file")
                                            //     }
                                            //     className="btn btn-ghost"
                                            // >
                                            //     Clear
                                            // </button>
                                            <div className="flex-items-center justify-center">
                                                <ImagePreviewComponent
                                                    imgSrc={avatar}
                                                />
                                                <button
                                                    onClick={() =>
                                                        resetField("file")
                                                    }
                                                    className="btn btn-ghost"
                                                >
                                                    Clear
                                                </button>
                                            </div>
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
                            {isError && (
                                <div className="alert alert-error">
                                    {error?.message}
                                </div>
                            )}
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
                                                tabIndex={1}
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
                                                tabIndex={2}
                                                placeholder="Enter start date"
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
                                        <InlineLabel
                                            required={false}
                                            optional={true}
                                        >
                                            Description:{" "}
                                        </InlineLabel>

                                        <span
                                            className={clsx(
                                                "w-full mt-1",
                                                errors?.description
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <Tiptap
                                                content={value}
                                                onContentChange={onChange}
                                            />
                                        </span>
                                        <FieldError
                                            field={errors?.description}
                                        />
                                    </FormItem>
                                )}
                            />

                            <Card className="mt-5 bg-inherit">
                                <CardTitle className="p-5 pb-2">
                                    Time Schedule Details
                                </CardTitle>
                                <CardDescription className="px-10 pb-2">
                                    <FieldError
                                        field={errors?.time_schedules?.root}
                                    />
                                </CardDescription>

                                <CardContent id="form-modal">
                                    <div className="flex gap-3 flex-wrap px-2">
                                        {fields.map((item, index) => (
                                            <Card
                                                key={item.id}
                                                className=" p-5 flex-1 mb-2 bg-inherit border-l-5 border-l-blue-900 dark:border-l-blue-600"
                                            >
                                                <CardTitle>
                                                    <div className="flex justify-between underline">
                                                        <p className="flex items-center gap-1">
                                                            <BiTime /> Time
                                                            Schedule {index + 1}
                                                        </p>
                                                        <div className="flex justify-end">
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    index == 0
                                                                }
                                                                onClick={() =>
                                                                    remove(
                                                                        index
                                                                    )
                                                                }
                                                                className="btn btn-error btn-sm btn-outline"
                                                            >
                                                                <MdDeleteForever />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </CardTitle>
                                                <CardContent className="py-2">
                                                    <FormField
                                                        control={control}
                                                        name={`time_schedules.${index}.time_start`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <div className="flex flex-wrap">
                                                                    <InlineLabel>
                                                                        Time
                                                                        Start:{" "}
                                                                    </InlineLabel>

                                                                    <label
                                                                        className={clsx(
                                                                            "input mt-1",
                                                                            errors
                                                                                ?.time_schedules?.[
                                                                                index
                                                                            ]
                                                                                ?.time_start
                                                                                ? "input-error"
                                                                                : "input-info"
                                                                        )}
                                                                    >
                                                                        <Timer className="h-3" />
                                                                        <input
                                                                            type="time"
                                                                            tabIndex={
                                                                                4
                                                                            }
                                                                            placeholder="Enter start time"
                                                                            {...field}
                                                                        />
                                                                    </label>
                                                                </div>
                                                                <div className="flex md:justify-center">
                                                                    <FormMessage />
                                                                </div>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={control}
                                                        name={`time_schedules.${index}.time_end`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <div className="flex flex-wrap">
                                                                    <InlineLabel>
                                                                        Time
                                                                        End:{" "}
                                                                    </InlineLabel>

                                                                    <label
                                                                        className={clsx(
                                                                            "input mt-1",
                                                                            errors
                                                                                ?.time_schedules?.[
                                                                                index
                                                                            ]
                                                                                ?.time_end
                                                                                ? "input-error"
                                                                                : "input-info"
                                                                        )}
                                                                    >
                                                                        <Timer className="h-3" />
                                                                        <input
                                                                            type="time"
                                                                            tabIndex={
                                                                                4
                                                                            }
                                                                            placeholder="Enter time end"
                                                                            {...field}
                                                                        />
                                                                    </label>
                                                                </div>
                                                                <div className="flex md:justify-center">
                                                                    <FormMessage />
                                                                </div>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={control}
                                                        name={`time_schedules.${index}.has_limit`}
                                                        render={({
                                                            field: {
                                                                value,
                                                                onChange,
                                                            },
                                                        }) => (
                                                            <FormItem className=" flex font-semibold py-1">
                                                                <ToggleAny
                                                                    value={
                                                                        value
                                                                    }
                                                                    onChange={() =>
                                                                        onChange(
                                                                            !value
                                                                        )
                                                                    }
                                                                >
                                                                    <span
                                                                        className={clsx(
                                                                            "text-sm font-semibold",
                                                                            value
                                                                                ? "text-green-600"
                                                                                : "text-warning"
                                                                        )}
                                                                    >
                                                                        {value
                                                                            ? "Has Limit"
                                                                            : "No Limit"}
                                                                    </span>
                                                                </ToggleAny>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    {watch(
                                                        `time_schedules.${index}.has_limit`
                                                    ) ? (
                                                        <FormField
                                                            control={control}
                                                            name={`time_schedules.${index}.max_limit`}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <div className="flex flex-wrap items-center">
                                                                        <InlineLabel>
                                                                            Max
                                                                            Limit:{" "}
                                                                        </InlineLabel>

                                                                        <label
                                                                            className={clsx(
                                                                                "input",
                                                                                errors
                                                                                    ?.time_schedules?.[
                                                                                    index
                                                                                ]
                                                                                    ?.max_limit
                                                                                    ? "input-error"
                                                                                    : "input-info"
                                                                            )}
                                                                        >
                                                                            <ExclamationTriangleIcon className="h-3" />
                                                                            <input
                                                                                type="number"
                                                                                min={
                                                                                    0
                                                                                }
                                                                                tabIndex={
                                                                                    4
                                                                                }
                                                                                placeholder="Enter max limit"
                                                                                {...field}
                                                                            />
                                                                        </label>
                                                                    </div>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    ) : (
                                                        ""
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                        <div className="flex p-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    append({
                                                        time_start: "",
                                                        time_end: "",
                                                        has_limit: false,
                                                        max_limit: 0,
                                                    })
                                                }
                                                className="h-full p-5 flex border rounded-2xl btn btn-dash btn-primary"
                                            >
                                                <Plus />{" "}
                                                <span className="hidden sm:inline-block">
                                                    Add time schedule
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => router.back()}
                                    type="button"
                                    className="btn btn-error"
                                >
                                    <X /> Cancel
                                </button>
                                <button
                                    disabled={!isDirty || isPending}
                                    className="btn btn-neutral hover:bg-neutral-800 hover:text-green-300"
                                >
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-bars loading-xs"></span>
                                            Submitting ...
                                        </>
                                    ) : (
                                        <>
                                            <Save />
                                            Update Event
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
            {/* <FormLogger watch={watch} errors={errors} data={event} /> */}
        </Form>
    );
}
