"use client";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@components/ui/card";
import { GrUpdate } from "react-icons/gr";
import { IoInformationCircle } from "react-icons/io5";
import { BiCollection } from "react-icons/bi";
import { PiStool } from "react-icons/pi";
import { Flag, Text } from "lucide-react";
import clsx from "clsx";
import InlineLabel from "@components/form/InlineLabel";
import FieldError from "@components/form/FieldError";
import notify from "@components/ui/notify";
import { appointmentDetailsSchema } from "@lib/zod/appointmentSchema";
import { updateAppointmentStatus } from "@/action/adminEventAction";
import { Form, FormItem } from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import FormLogger from "@lib/utils/FormLogger";

export default function EventDashboardAppointmentForm({
    appointment,
    eventId,
}) {
    const queryClient = useQueryClient();

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(appointmentDetailsSchema),
        defaultValues: {
            collection_method: appointment?.collection_method || "",
            donor_type: appointment?.donor_type || "",
            patient_name: appointment?.patient_name || "",
            relation: appointment?.relation || "",
            status: appointment?.status || "",
            comments: appointment?.comments || "",
        },
    });

    const {
        control,
        watch,
        handleSubmit,
        setValue,
        resetField,
        formState: { errors, isDirty },
    } = form;

    const donorType = watch("donor_type");

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            console.log("formData on mutationFn", formData);
            const res = await updateAppointmentStatus(appointment.id, formData);
            if (!res.success) {
                throw res;
            }
            return res;
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ["appointment", appointment.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["event-dashboard", eventId],
            });
            notify({
                error: false,
                message: "Appointment details updated successfully.",
            });
        },
        onError: (error) => {
            notify({
                error: true,
                message:
                    error?.message || "Failed to update appointment details.",
            });
        },
    });

    const onSubmit = (formData) => {
        mutate(formData);
    };

    const isEditable = appointment.status === "registered";
    const statusColors = {
        registered: "badge-primary",
        examined: "badge-warning",
        collected: "badge-success",
        cancelled: "badge-error",
        "no show": "badge-error",
    };
    const statusLabel = (status) => (status ? status.toUpperCase() : "UNKNOWN");

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2 flex flex-col gap-2 justify-center"
            >
                <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                    <div className="flex items-center gap-5">
                        <h1 className="text-xl font-bold flex-items-center">
                            <IoInformationCircle /> Appointment Details
                        </h1>
                        <span
                            className={`badge text-md font-semibold px-4 py-2 ${
                                statusColors[appointment.status] ||
                                "badge-ghost"
                            }`}
                        >
                            {statusLabel(appointment.status)}
                        </span>
                    </div>
                    {!isEditable && (
                        <div className="text-warning text-sm mb-2">
                            Appointment details can only be updated while status
                            is <b>REGISTERED</b>.
                        </div>
                    )}
                    <div className="pl-4 space-y-5">
                        {/* Collection Method */}
                        <Controller
                            control={control}
                            name="collection_method"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        Collection Method:{" "}
                                    </InlineLabel>
                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.collection_method
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        {" "}
                                        <BiCollection className="h-3" />
                                        <select
                                            className="w-full dark:bg-inherit"
                                            tabIndex={1}
                                            {...field}
                                            disabled={!isEditable}
                                        >
                                            <option value="">
                                                Select here
                                            </option>
                                            {["whole blood", "apheresis"].map(
                                                (method, i) => (
                                                    <option
                                                        key={i}
                                                        value={method}
                                                    >
                                                        {method
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            method.slice(1)}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </label>
                                    <FieldError
                                        field={errors?.collection_method}
                                    />
                                </FormItem>
                            )}
                        />
                        {/* Donor Type */}
                        <Controller
                            control={control}
                            name="donor_type"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Donor Type: </InlineLabel>
                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.donor_type
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        {" "}
                                        <PiStool className="h-3" />
                                        <select
                                            className="w-full dark:bg-inherit"
                                            tabIndex={2}
                                            {...field}
                                            disabled={!isEditable}
                                        >
                                            <option value="">
                                                Select here
                                            </option>
                                            {["replacement", "volunteer"].map(
                                                (type, i) => (
                                                    <option
                                                        key={i}
                                                        value={type}
                                                    >
                                                        {type
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            type.slice(1)}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </label>
                                    <FieldError field={errors?.donor_type} />
                                </FormItem>
                            )}
                        />
                        {/* Patient Name & Relation (if replacement) */}
                        {donorType === "replacement" && (
                            <>
                                <Controller
                                    control={control}
                                    name="patient_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <InlineLabel>
                                                Patient Name:{" "}
                                            </InlineLabel>
                                            <label
                                                className={clsx(
                                                    "input w-full mt-1",
                                                    errors?.patient_name
                                                        ? "input-error"
                                                        : "input-info"
                                                )}
                                            >
                                                {" "}
                                                <Text className="h-3" />
                                                <input
                                                    type="text"
                                                    tabIndex={3}
                                                    placeholder="Enter patient name"
                                                    {...field}
                                                    disabled={!isEditable}
                                                />
                                            </label>
                                            <FieldError
                                                field={errors?.patient_name}
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="relation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <InlineLabel>
                                                Relation:{" "}
                                            </InlineLabel>
                                            <label
                                                className={clsx(
                                                    "input w-full mt-1",
                                                    errors?.relation
                                                        ? "input-error"
                                                        : "input-info"
                                                )}
                                            >
                                                {" "}
                                                <Text className="h-3" />
                                                <input
                                                    type="text"
                                                    tabIndex={4}
                                                    placeholder="Enter relation"
                                                    {...field}
                                                    disabled={!isEditable}
                                                />
                                            </label>
                                            <FieldError
                                                field={errors?.relation}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        {/* Status */}
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        Appointment Status:{" "}
                                    </InlineLabel>
                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.status
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        {" "}
                                        <Flag className="h-3" />
                                        <select
                                            className="w-full dark:bg-inherit"
                                            tabIndex={5}
                                            {...field}
                                            disabled={!isEditable}
                                        >
                                            <option value="">
                                                Select status
                                            </option>
                                            {[
                                                "registered",
                                                "no show",
                                                "cancelled",
                                            ].map((status, i) => (
                                                <option key={i} value={status}>
                                                    {status.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <FieldError field={errors?.status} />
                                </FormItem>
                            )}
                        />
                        {/* Comments */}
                        <Controller
                            control={control}
                            name="comments"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Comments/Notes: </InlineLabel>
                                    <label
                                        className={clsx(
                                            "w-full mt-1",
                                            errors?.comments
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Textarea
                                            className="w-full min-h-[60px] resize-y dark:bg-inherit"
                                            tabIndex={6}
                                            placeholder="Enter comments or notes"
                                            {...field}
                                            disabled={!isEditable}
                                        />
                                    </label>
                                    <FieldError field={errors?.comments} />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            disabled={!isEditable || !isDirty || isPending}
                            className="btn btn-primary flex items-center gap-2"
                            tabIndex={7}
                        >
                            {isPending ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <GrUpdate className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </Card>
            </form>
            <FormLogger watch={watch} />
        </Form>
    );
}
