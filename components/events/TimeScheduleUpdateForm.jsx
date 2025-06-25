"use client";
import React, { useEffect, useRef, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,

    CardTitle,
} from "@components/ui/card";


import {
    Plus,
    Timer,

} from "lucide-react";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
// import { useTheme } from "next-themes";
import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import {
    FormField,
    FormItem,
    FormMessage,
} from "@components/ui/form";

// import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { BiTime } from "react-icons/bi";

import { MdDeleteForever } from "react-icons/md";
import ToggleAny from "@components/reusable_components/ToggleAny";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useFieldArray } from "react-hook-form";
import { debounce } from "lodash";
import { updateEventTimeSchedule } from "@/action/hostEventAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError } from "@lib/utils/toastError.utils";

export default function TimeScheduleUpdateForm({ form }) {

    const queryClient = useQueryClient();
    const {
        control,
        watch,
        trigger,
        getValues,
        formState: { errors, isDirty },
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "time_schedules",
    });

    const { mutate: updateSchedule, isPending } = useMutation({
        mutationFn: async ({ id, data }) => {
            console.log("id>>>>>>>>>>>", id)
            const res = await updateEventTimeSchedule(id, data);
            if (!res.success) {
                throw res;
            }
            return res;
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

        },
        onError: (error) => {
            if (error?.type === "validation" && error?.errorArr.length) {
                toastError(error);
            } else {

                notify({
                    error: true,
                    message: error?.message,
                });
            }
        },
    });

    const debouncedUpdateSchedule = debounce(
        async (index, scheduleId, trigger, getValues, updateSchedule) => {
            const isValid = await trigger(`time_schedules.${index}`);
            if (isValid && isDirty) {
                const values = getValues(`time_schedules.${index}`);
                updateSchedule({ id: values.id, data: values });
            }
        },
        1000
    );

    return (
        <Card className="mt-5 bg-inherit">
            <CardTitle className="p-5 pb-2">
                Time Schedule Details
                {isPending && (
                    <span className="flex-items-center text-blue-500">
                        <span className="loading loading-bars loading-xs"></span>
                        <span className="italic  text-md">Updating ...</span>
                    </span>
                )}
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
                                <div className="flex justify-between">
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
                                                <FormItem className=" flex items-center gap-2 font-semibold">
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
                                                        onChange={() => {
                                                            onChange(
                                                                !value
                                                            )
                                                            debouncedUpdateSchedule(index, fields[index].id, trigger, getValues, updateSchedule)
                                                        }}

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
                                                        onBlur={() =>
                                                            debouncedUpdateSchedule(index, fields[index].id, trigger, getValues, updateSchedule)
                                                        }
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
                                                        onBlur={() =>
                                                            debouncedUpdateSchedule(index, fields[index].id, trigger, getValues, updateSchedule)
                                                        }
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
                                                            onBlur={() =>
                                                                debouncedUpdateSchedule(index, fields[index].id, trigger, getValues, updateSchedule)
                                                            }
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
                    <div className="hidden p-2">
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
    )
}
