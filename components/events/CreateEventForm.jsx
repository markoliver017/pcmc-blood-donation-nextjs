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
    CalendarCog,
    CalendarIcon,
    CalendarPlus2,
    Maximize,
    Plus,
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
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
import { toastCatchError, toastError } from "@lib/utils/toastError.utils";
import FormCardSingleForm from "@components/form/FormCardSingleForm";
import Tiptap from "@components/reusable_components/Tiptap";
import FormLogger from "@lib/utils/FormLogger";
import { MdDeleteForever } from "react-icons/md";
import ToggleAny from "@components/reusable_components/ToggleAny";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { bloodDonationEventSchema } from "@lib/zod/bloodDonationSchema";
import { getAllEvents, storeEvent } from "@/action/hostEventAction";
import { uploadPicture } from "@/action/uploads";
import AllEventCalendar from "@components/organizers/AllEventCalendar";
import DrawerComponent from "@components/reusable_components/DrawerComponent";
import { DrawerTrigger } from "@components/ui/drawer";
import ImagePreviewComponent from "@components/reusable_components/ImagePreviewComponent";
import { Button } from "@components/ui/button";
import { addDays, format } from "date-fns";
import { Calendar } from "@components/ui/calendar";
import { cn } from "@lib/utils";
import { PiCalendarCheckFill } from "react-icons/pi";
import LoadingModal from "@components/layout/LoadingModal";
import Skeleton_form from "@components/ui/Skeleton_form";
import { NotifyEventRegistration } from "./NotifyEventRegistration";

// import DrawerComponent from "@components/reusable_components/Drawer";

export default function CreateEventForm({ agency }) {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(new Date());

    const queryClient = useQueryClient();
    const { data: bookedEvents, bookedEventsIsLoading } = useQuery({
        queryKey: ["all_event_schedules"],
        queryFn: getAllEvents,
    });
    const { data, mutate, isPending, isError, error } = useMutation({
        mutationFn: async (formData) => {
            const res = await storeEvent(formData);
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
                queryKey: ["agency-dashboard"],
            });
            queryClient.invalidateQueries({
                queryKey: ["agency_events"],
            });
            SweetAlert({
                title: "Event Request Submitted",
                text: "Your blood donation event request has been successfully submitted. The Mobile Blood Donation team will review your request within 2-3 business days. You can track the status of your request in the 'For Approval' tab.",
                icon: "success",
                confirmButtonText: "I understand",
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
            } else if (
                error?.type === "catch_validation_error" &&
                error?.errors?.length
            ) {
                toastCatchError(error, setError);
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
            agency_id: agency?.id,
            title: "",
            description:
                "",
            date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
            file: null,
            file_url: null,
            time_schedules: [
                {
                    time_start: "08:00",
                    time_end: "17:00",
                    has_limit: false,
                    max_limit: 0,
                },
            ],
        },
    });

    const {
        control,
        watch,
        resetField,
        reset,
        setValue,
        setError,
        handleSubmit,
        formState: { errors, isDirty },
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "time_schedules",
    });

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Submit Blood Donation Event Request",
            text: "Your event request will be sent to the Mobile Blood Donation team for review and approval. Would you like to proceed?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Submit Request",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                setIsUploading(true);
                let uploadErrors = false;
                const fileUrl = watch("file_url");
                if (formData.file && !fileUrl) {
                    const result = await uploadPicture(formData.file);
                    if (result?.success) {
                        formData.file_url = result.file_data?.url || null;
                        setValue("file_url", result.file_data?.url);
                    } else {
                        uploadErrors = true;
                        notify({
                            error: true,
                            message: result.message,
                        });
                    }
                    console.log("Upload result:", result);
                }
                setIsUploading(false);
                if (uploadErrors) return;

                mutate(formData);
            },
        });
    };

    const uploaded_avatar = watch("file");
    const avatar =
        !errors?.file && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : "/upload-event-photo.png";

    useEffect(() => {
        if (watch("file_url")) setValue("file_url", null);
    }, [uploaded_avatar]);

    if (bookedEventsIsLoading) {
        return <Skeleton_form />;
    }

    return (
        <Form {...form}>
            <LoadingModal
                imgSrc="/loader_2.gif"
                isLoading={isPending || isUploading}
            />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-5 shadow border rounded-2xl"
            >
                <Card className="md:p-4 bg-slate-100 p-3">
                    <CardHeader className="text-2xl font-bold">
                        <CardTitle className="flex justify-between">
                            <div className="text-2xl">
                                Blood Donation Event Request
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
                                            // <button
                                            //     onClick={() =>
                                            //         resetField("file")
                                            //     }
                                            //     className="btn btn-ghost"
                                            // >
                                            //     Clear
                                            // </button>
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
                                        <Popover modal={true}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal mt-1 text-xl dark:!bg-[#181717] hover:!text-slate-300",
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
                                                    className="bg-transparent p-5 [--cell-size:--spacing(10.5)] dark:text-white dark:bg-black"
                                                    // classNames={{
                                                    //     caption_dropdowns:
                                                    //         "bg-slate-900 text-white dark:!bg-slate-900 dark:text-white border border-slate-700 rounded",
                                                    // }}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            // Format as "yyyy-MM-dd"
                                                            field.onChange(
                                                                format(
                                                                    date,
                                                                    "yyyy-MM-dd"
                                                                )
                                                            );
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
                                                        ...(Array.isArray(
                                                            bookedEvents
                                                        )
                                                            ? bookedEvents?.map(
                                                                (event) =>
                                                                    new Date(
                                                                        event.date
                                                                    )
                                                            )
                                                            : []),
                                                        // (date) => isWithin90DaysOfBooked(date, bookedEvents),
                                                    ]}
                                                    modifiers={{
                                                        booked: Array.isArray(
                                                            bookedEvents
                                                        )
                                                            ? bookedEvents?.map(
                                                                (event) =>
                                                                    new Date(
                                                                        event.date
                                                                    )
                                                            )
                                                            : [],
                                                    }}
                                                    modifiersClassNames={{
                                                        booked: "[&>button]:line-through font-bold bg-red-500 dark:bg-red-900 text-white  bg-opacity-50  rounded",
                                                    }}
                                                    captionLayout="dropdown"
                                                    fromYear={new Date().getFullYear()} // Earliest year selectable
                                                    toYear={
                                                        new Date().getFullYear() +
                                                        5
                                                    }
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

                                <CardContent>
                                    <div className="flex gap-3 flex-col px-2">
                                        {fields.map((item, index) => (
                                            <Card
                                                key={item.id}
                                                className=" p-5 flex-1 mb-2 bg-inherit border-l-5 border-l-blue-900 dark:border-l-blue-600"
                                            >
                                                <CardTitle>
                                                    <div className="flex justify-between ">
                                                        <p className="flex items-center text-2xl gap-1">
                                                            <BiTime /> Time
                                                            Schedule {index + 1}
                                                        </p>
                                                        <div className="flex justify-end">
                                                            <FormField
                                                                control={
                                                                    control
                                                                }
                                                                name={`time_schedules.${index}.has_limit`}
                                                                render={({
                                                                    field: {
                                                                        value,
                                                                        onChange,
                                                                    },
                                                                }) => (
                                                                    <FormItem className=" flex items-center gap-2 font-semibold py-1">
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
                                                                        <ToggleAny
                                                                            value={
                                                                                value
                                                                            }
                                                                            onChange={() =>
                                                                                onChange(
                                                                                    !value
                                                                                )
                                                                            }
                                                                        ></ToggleAny>
                                                                    </FormItem>
                                                                )}
                                                            />
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
                                                                className="btn btn-error btn-sm btn-outline hidden"
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

                                        <div className="hidden p-2 ">
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
                                                className="h-full p-5 flex border rounded-2xl btn btn-dash btn-block btn-primary"
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

                            <div
                                className="space-y-2 mt-4 relative"
                                id="form-modal"
                            >
                                <button
                                    disabled={!isDirty || isPending}
                                    className="py-5 flex rounded-2xl text-2xl btn btn-block btn-primary ring-offset-2 ring-offset-blue-500 hover:ring-2 "
                                >
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-bars loading-xs"></span>
                                            Submitting ...
                                        </>
                                    ) : (
                                        <>
                                            <CalendarPlus2 />
                                            Request Event
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => router.back()}
                                    type="button"
                                    className="p-5 flex rounded-2xl text-2xl btn btn-outline btn-block btn-error ring-offset-2 ring-offset-red-500 hover:ring-2"
                                >
                                    <X /> Cancel
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
            {/* <FormLogger watch={watch} errors={errors} data={agency} /> */}
        </Form>
    );
}
