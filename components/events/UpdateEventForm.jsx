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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover";

import {
    CalendarIcon,
    CalendarPlus2,
    Save,
    Text,
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


import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SweetAlert from "@components/ui/SweetAlert";
import { toastError } from "@lib/utils/toastError.utils";
import Tiptap from "@components/reusable_components/Tiptap";
import FormLogger from "@lib/utils/FormLogger";

import { bloodDonationEventSchema } from "@lib/zod/bloodDonationSchema";
import {
    getAllEvents,
    getEventsById,
    updateEvent,
} from "@/action/hostEventAction";
import { uploadPicture } from "@/action/uploads";
import AllEventCalendar from "@components/organizers/AllEventCalendar";
import DrawerComponent from "@components/reusable_components/DrawerComponent";
import { DrawerTrigger } from "@components/ui/drawer";
import moment from "moment";
import ImagePreviewComponent from "@components/reusable_components/ImagePreviewComponent";
import { Calendar } from "@components/ui/calendar";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { format } from "date-fns";
import { PiCalendarCheckFill } from "react-icons/pi";
import { debounce } from "lodash";
import TimeScheduleUpdateForm from "./TimeScheduleUpdateForm";
import { FaArrowLeft } from "react-icons/fa";

export default function UpdateEventForm({ eventId }) {
    const router = useRouter();
    const queryClient = useQueryClient();


    const { data: bookedEvents, bookedEventsIsLoading } = useQuery({
        queryKey: ["all_event_schedules"],
        queryFn: getAllEvents,
    });
    const { data: event } = useQuery({
        queryKey: ["agency_events", eventId],
        queryFn: async () => await getEventsById(eventId),
        enabled: !!eventId,
        staleTime: 0,
    });

    const [calendarMonth, setCalendarMonth] = useState(
        event?.date ? new Date(event.date) : new Date()
    );
    const [isUploading, setIsUploading] = useState(false)

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
            queryClient.invalidateQueries({
                queryKey: ["agency_events"],
            });
            // SweetAlert({
            //     title: "Update Blood Donation Event",
            //     text: "You have successfully updated the blood donation event.",
            //     icon: "success",
            //     confirmButtonText: "Okay",
            //     onConfirm: () => {
            //         reset();
            //         router.back();
            //     },
            // });
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
        mode: "onBlur",
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
        trigger,
        getValues,
        handleSubmit,
        formState: { errors, isDirty },
    } = form;



    const debouncedUpdate = debounce(async (value, name, trigger, getValues, mutate) => {
        console.log(value)
        const isValid = await trigger(name);
        if (isValid) {
            const formData = getValues();
            mutate(formData);
        }
    }, 1000);

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

    if (bookedEventsIsLoading) {
        return <Skeleton_form />;
    }

    const bookedEventsExceptEventDate = Array.isArray(bookedEvents)
        ? bookedEvents
            ?.filter((ev) => ev.date !== event.date)
            .map((ev) => new Date(ev.date))
        : [];

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-5 shadow border rounded-2xl"
            >
                <Card className="md:p-4 bg-slate-100 p-3">
                    <CardHeader className="text-2xl font-bold">
                        <CardTitle className="flex justify-between">
                            <div className="text-2xl flex items-center gap-5">
                                <span>Update Blood Donation Event</span>
                                {isPending && (
                                    <span className="flex-items-center text-blue-500">
                                        <span className="loading loading-bars loading-xs"></span>
                                        <span className="italic  text-md">Updating ...</span>
                                    </span>
                                )}
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
                                const handleFileChange = async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        onChange(file); // Update RHF form state

                                        // Optional: clear file_url before upload to show "uploading" state
                                        setValue("file_url", null);
                                        setIsUploading(true)
                                        const result = await uploadPicture(file);
                                        if (!result.success) {
                                            console.error(result.message)
                                            notify({
                                                error: true,
                                                message: "Upload failed: Please re-upload and try again!",
                                            });
                                            setIsUploading(false);
                                            resetField("file");
                                            return;
                                        }

                                        const file_url = result.file_data?.url || null;
                                        setValue("file_url", file_url);

                                        // Optional: revalidate + auto-save
                                        const isValid = await trigger(["file", "file_url"]);
                                        if (isValid) {
                                            const formData = getValues();
                                            mutate(formData);
                                        }
                                        setIsUploading(false)

                                    }
                                };

                                return (
                                    <FormItem className="flex-none text-center w-full md:w-max">
                                        <div className="hidden">
                                            <FormControl ref={fileInputRef}>
                                                <Input
                                                    type="file"
                                                    tabIndex={-1}
                                                    onChange={handleFileChange}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <CustomAvatar
                                            avatar={avatar}
                                            whenClick={handleImageClick}
                                            className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px]"
                                        />
                                        {isUploading && (
                                            <span className="flex-items-center justify-center text-blue-500">
                                                <span className="loading loading-bars loading-xs"></span>
                                                <span className="italic  text-md">Uploading ...</span>
                                            </span>
                                        )}
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
                                                "input w-full mt-1 text-xl",
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
                                                // onBlur={handleSubmit((data) => {
                                                //     if (isDirty) mutate(data);
                                                // })}
                                                onChange={(e) => {
                                                    field.onChange(e); // make sure RHF still receives the change
                                                    debouncedUpdate(e.target.value, "title", trigger, getValues, mutate);
                                                }}
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
                                    <FormItem className="flex flex-col">
                                        <InlineLabel>Event Date: </InlineLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal mt-1 text-xl dark:!bg-[#181717] hover:text-slate-400",
                                                            !field.value &&
                                                            "text-muted-foreground"
                                                        )}
                                                        tabIndex={2}
                                                    >
                                                        <PiCalendarCheckFill className="mr-2 h-4 w-4" />
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP"
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        field.value
                                                            ? new Date(
                                                                field.value
                                                            )
                                                            : undefined
                                                    }
                                                    month={calendarMonth}
                                                    onMonthChange={
                                                        setCalendarMonth
                                                    }
                                                    className="bg-transparent p-5 [--cell-size:--spacing(10.5)]"
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            // Format as "yyyy-MM-dd"
                                                            field.onChange(
                                                                format(
                                                                    date,
                                                                    "yyyy-MM-dd"
                                                                )
                                                            );
                                                            handleSubmit((data) => {
                                                                if (isDirty) mutate(data);
                                                            })()
                                                        } else {
                                                            field.onChange("");
                                                        }
                                                    }}
                                                    disabled={[
                                                        {
                                                            dayOfWeek: [0, 6],
                                                        },
                                                        (date) =>
                                                            date < new Date(),
                                                        ...bookedEventsExceptEventDate,
                                                    ]}
                                                    modifiers={{
                                                        booked: bookedEventsExceptEventDate,
                                                    }}
                                                    modifiersClassNames={{
                                                        booked: "[&>button]:line-through font-bold bg-red-500 dark:bg-red-900 text-white  bg-opacity-50  rounded",
                                                    }}
                                                    captionLayout="dropdown"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {/* <FormDescription className="pl-5 dark:text-slate-300">
                                                                        * Dates filled with red are not
                                                                        available for booking.
                                                                    </FormDescription> */}
                                        <FormMessage />
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
                                                onContentChange={(newValue) => {
                                                    onChange(newValue); // update RHF
                                                    debouncedUpdate(newValue, "description", trigger, getValues, mutate); // validate + auto-save
                                                }}
                                            />
                                        </span>
                                        <FieldError
                                            field={errors?.description}
                                        />
                                    </FormItem>
                                )}
                            />

                            <TimeScheduleUpdateForm form={form} />

                            <div
                                className="space-y-2 mt-4 relative"
                                id="form-modal"
                            >
                                <button
                                    disabled={!isDirty || isPending}
                                    className="py-5 hidden rounded-2xl text-2xl btn btn-block btn-primary ring-offset-2 ring-offset-blue-500 hover:ring-2 "
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
                                <button
                                    onClick={() => router.back()}
                                    type="button"
                                    className="p-5 flex rounded-2xl text-2xl btn btn-outline btn-block btn-warning ring-offset-2 ring-offset-red-500 hover:ring-2"
                                >
                                    <FaArrowLeft /> Go Back and Save
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
            <FormLogger watch={watch} errors={errors} data={event} />
        </Form>
    );
}
