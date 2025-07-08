"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, FormField, FormItem } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";
import { bloodRequestSchema } from "@lib/zod/bloodRequestSchema";
import FieldError from "@components/form/FieldError";
import DisplayValidationErrors from "@components/form/DisplayValidationErrors";
import notify from "@components/ui/notify";
import LoadingModal from "@components/layout/LoadingModal";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { getSingleStyle } from "@/styles/select-styles";
import {
    fetchBloodTypes,
    fetchAgencyDonors,
    fetchBloodRequest,
    updateBloodRequest,
} from "@action/bloodRequestAction";
import Skeleton_form from "@components/ui/Skeleton_form";
import clsx from "clsx";
import { toastCatchError, toastError } from "@lib/utils/toastError.utils";
import SweetAlert from "@components/ui/SweetAlert";
import FormLogger from "@lib/utils/FormLogger";

const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), {
    ssr: false,
});

export default function UpdateBloodRequestForm({ bloodRequestId, onSuccess }) {
    const { resolvedTheme } = useTheme();
    const queryClient = useQueryClient();

    // Fetch the blood request to update
    const { data: requestResponse, isLoading: isLoadingRequest } = useQuery({
        queryKey: ["blood-request", bloodRequestId],
        queryFn: () => fetchBloodRequest(bloodRequestId),
        enabled: !!bloodRequestId,
    });

    // Fetch blood types
    const { data: bloodTypesResponse } = useQuery({
        queryKey: ["blood-types"],
        queryFn: fetchBloodTypes,
    });
    const bloodTypes = bloodTypesResponse?.success
        ? bloodTypesResponse.data
        : [];

    // Fetch agency donors
    const { data: donors, isLoading: isLoadingDonors } = useQuery({
        queryKey: ["agency-donors"],
        queryFn: async () => {
            const response = await fetchAgencyDonors();
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    // Setup form
    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(bloodRequestSchema),
        defaultValues: {
            blood_component: "",
            blood_type_id: "",
            no_of_units: "",
            diagnosis: "",
            date: "",
            hospital_name: "",
            user_id: null,
            patient_name: "",
            patient_date_of_birth: "",
            patient_gender: "male",
            is_registered_donor: true,
        },
    });
    const {
        watch,
        handleSubmit,
        setValue,
        setError,
        reset,
        formState: { errors, isDirty },
    } = form;

    // Populate form with fetched data
    useEffect(() => {
        if (requestResponse?.success && requestResponse.data) {
            const req = requestResponse.data;
            reset({
                blood_component: req.blood_component
                    ? String(req.blood_component)
                    : "",
                blood_type_id: req.blood_type_id
                    ? String(req.blood_type_id)
                    : "",
                no_of_units: req.no_of_units || "",
                diagnosis: req.diagnosis || "",
                date: req.date ? req.date.slice(0, 10) : "",
                hospital_name: req.hospital_name || "",
                user_id: req.user_id || null,
                patient_name: req.patient_name || "",
                patient_date_of_birth: req.patient_date_of_birth
                    ? req.patient_date_of_birth.slice(0, 10)
                    : "",
                patient_gender: req.patient_gender
                    ? String(req.patient_gender)
                    : "male",
                is_registered_donor: req.user_id ? true : false,
                id: req.id,
            });
        }
    }, [requestResponse, reset]);

    // Mutation for update
    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateBloodRequest({ ...formData, id });
            if (!res.success) {
                throw res;
            }
            return res;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["blood-requests"] });
            SweetAlert({
                title: "Request Updated",
                text: response.message || "Blood request updated successfully",
                icon: "success",
                confirmButtonText: "Done",
                onConfirm: () => onSuccess?.(),
            });
        },
        onError: (error) => {
            if (error?.type === "validation" && error?.errorArr?.length) {
                toastError(error);
            } else if (
                error?.type === "catch_validation_error" &&
                error?.errors?.length
            ) {
                toastCatchError(error, setError);
            } else {
                notify({
                    error: true,
                    message: error?.message || "Failed to update request",
                });
            }
        },
    });

    const watchIsRegisteredDonor = watch("is_registered_donor");

    if (isLoadingRequest || isLoadingDonors) return <Skeleton_form />;
    if (!requestResponse?.success) {
        return (
            <div className="text-center py-4 text-red-500">
                {requestResponse?.message || "Failed to load request"}
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                id="form-modal"
                onSubmit={handleSubmit(mutate)}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Blood Component
                        </label>
                        <Select
                            onValueChange={(value) =>
                                setValue("blood_component", value)
                            }
                            value={String(watch("blood_component") ?? "")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select component" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="whole blood">
                                    Whole Blood
                                </SelectItem>
                                <SelectItem value="plasma">Plasma</SelectItem>
                                <SelectItem value="platelets">
                                    Platelets
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FieldError field={errors?.blood_component} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Blood Type
                        </label>
                        <Select
                            onValueChange={(value) =>
                                setValue("blood_type_id", value)
                            }
                            value={String(watch("blood_type_id") ?? "")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                            <SelectContent>
                                {bloodTypes?.map((type) => (
                                    <SelectItem
                                        key={type.id}
                                        value={String(type.id)}
                                    >
                                        {type.blood_type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError field={errors?.blood_type_id} />
                    </div>

                    <FormField
                        control={form.control}
                        name="is_registered_donor"
                        render={({ field }) => (
                            <FormItem>
                                <label className="text-sm font-medium">
                                    Registered Donor?
                                </label>
                                <div className="flex gap-7 mt-2">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="radio"
                                            className={clsx(
                                                "radio",
                                                errors?.is_registered_donor
                                                    ? "radio-error"
                                                    : "radio-info"
                                            )}
                                            tabIndex={1}
                                            value={true}
                                            checked={field.value === true}
                                            onChange={() =>
                                                field.onChange(true)
                                            }
                                        />
                                        <span
                                            className={clsx("label-text mr-2")}
                                        >
                                            Yes
                                        </span>
                                    </label>
                                    <label className="label cursor-pointer">
                                        <input
                                            type="radio"
                                            className={clsx(
                                                "radio",
                                                errors?.is_registered_donor
                                                    ? "radio-error"
                                                    : "radio-info"
                                            )}
                                            tabIndex={1}
                                            value={false}
                                            checked={field.value === false}
                                            onChange={() =>
                                                field.onChange(false)
                                            }
                                        />
                                        <span
                                            className={clsx("label-text mr-2")}
                                        >
                                            No
                                        </span>
                                    </label>
                                </div>
                                <FieldError
                                    field={errors?.is_registered_donor}
                                />
                            </FormItem>
                        )}
                    />

                    {/* Show donor selection only if registered donor */}
                    {watchIsRegisteredDonor && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Select Registered Donor
                            </label>
                            <Controller
                                control={form.control}
                                name="user_id"
                                render={({
                                    field: { onChange, value, name, ref },
                                }) => {
                                    const donorsOptions = donors?.map(
                                        (donor) => ({
                                            value: donor?.user?.full_name,
                                            label: donor?.user?.full_name,
                                            user_id: donor?.user?.id,
                                        })
                                    );
                                    const selectedOption =
                                        donorsOptions.find(
                                            (option) =>
                                                option?.user_id === value
                                        ) || null;
                                    return (
                                        <CreatableSelectNoSSR
                                            name={name}
                                            ref={ref}
                                            value={selectedOption}
                                            isClearable
                                            onChange={(option) => {
                                                // Clear patient fields when donor is selected
                                                if (option?.value) {
                                                    setValue(
                                                        "patient_name",
                                                        ""
                                                    );
                                                    setValue(
                                                        "patient_date_of_birth",
                                                        ""
                                                    );
                                                    setValue(
                                                        "patient_gender",
                                                        "male"
                                                    );
                                                }
                                                onChange(
                                                    option
                                                        ? option.user_id
                                                        : null
                                                );
                                            }}
                                            styles={getSingleStyle(
                                                resolvedTheme
                                            )}
                                            isValidNewOption={() => false}
                                            placeholder="Search for registered donors..."
                                            options={donorsOptions}
                                            className="react-select"
                                            isLoading={isLoadingDonors}
                                            noOptionsMessage={() =>
                                                "No donors found"
                                            }
                                        />
                                    );
                                }}
                            />
                            <FieldError field={errors?.user_id} />
                        </div>
                    )}

                    {/* Show patient fields only if NOT a registered donor */}
                    {!watchIsRegisteredDonor && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Patient Name
                                </label>
                                <Input {...form.register("patient_name")} />
                                <FieldError field={errors?.patient_name} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Patient Date of Birth
                                </label>
                                <Input
                                    type="date"
                                    {...form.register("patient_date_of_birth")}
                                />
                                <FieldError
                                    field={errors?.patient_date_of_birth}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Patient Gender
                                </label>
                                <Select
                                    onValueChange={(value) =>
                                        setValue("patient_gender", value)
                                    }
                                    value={String(
                                        watch("patient_gender") ?? ""
                                    )}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">
                                            Male
                                        </SelectItem>
                                        <SelectItem value="female">
                                            Female
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError field={errors?.patient_gender} />
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Number of Units
                        </label>
                        <Input
                            type="number"
                            min="1"
                            {...form.register("no_of_units", {
                                valueAsNumber: true,
                            })}
                        />
                        <FieldError field={errors?.no_of_units} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Date Needed
                        </label>
                        <Input type="date" {...form.register("date")} />
                        <FieldError field={errors?.date} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Hospital Name
                        </label>
                        <Input {...form.register("hospital_name")} />
                        <FieldError field={errors?.hospital_name} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Diagnosis/Reason
                    </label>
                    <Textarea {...form.register("diagnosis")} />
                    <FieldError field={errors?.diagnosis} />
                </div>
                <DisplayValidationErrors errors={errors} />
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        tabIndex={-1}
                        onClick={() => onSuccess?.()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isDirty || isPending}
                        className="focus:ring-1 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {isPending ? "Updating..." : "Update Request"}
                    </Button>
                </div>
            </form>
            <FormLogger watch={watch} data={requestResponse?.data} />
            <LoadingModal isLoading={isPending}>Processing...</LoadingModal>
        </Form>
    );
}
