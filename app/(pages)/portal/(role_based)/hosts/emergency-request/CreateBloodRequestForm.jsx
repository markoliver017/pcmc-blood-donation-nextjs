"use client";

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
import { format } from "date-fns";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { getSingleStyle } from "@/styles/select-styles";
import {
    fetchBloodTypes,
    fetchAgencyDonors,
    storeBloodRequest,
} from "@action/bloodRequestAction";
import Skeleton from "@components/ui/skeleton";
import Skeleton_form from "@components/ui/Skeleton_form";
import InlineLabel from "@components/form/InlineLabel";
import clsx from "clsx";
import FormLogger from "@lib/utils/FormLogger";
import { toastCatchError, toastError } from "@lib/utils/toastError.utils";
import SweetAlert from "@components/ui/SweetAlert";

const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), {
    ssr: false,
});

export default function CreateBloodRequestForm({ onSuccess }) {
    const { resolvedTheme } = useTheme();
    const queryClient = useQueryClient();

    const form = useForm({
        mode: "onChange",
        // resolver: zodResolver(bloodRequestSchema),
        defaultValues: {
            blood_component: "",
            blood_type_id: "",
            no_of_units: "",
            diagnosis: "",
            date: format(new Date(), "yyyy-MM-dd"),
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
        formState: { errors, isDirty },
    } = form;

    const { data: bloodTypesResponse } = useQuery({
        queryKey: ["blood-types"],
        queryFn: fetchBloodTypes,
    });

    const bloodTypes = bloodTypesResponse?.success
        ? bloodTypesResponse.data
        : [];

    // TanStack Query for fetching all agency donors
    const { data: donors, isLoading: isLoadingDonors } = useQuery({
        queryKey: ["agency-donors"],
        queryFn: async () => {
            const response = await fetchAgencyDonors();
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await storeBloodRequest(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["blood-requests"] });
            SweetAlert({
                title: "Request Submitted",
                text: response.message,
                icon: "success",
                confirmButtonText: "Done",
                onConfirm: () => onSuccess(),
            });
        },
        onError: (error) => {
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

    const watchIsRegisteredDonor = form.watch("is_registered_donor");

    if (isLoadingDonors) return <Skeleton_form />;
    console.log("formData", watch());

    return (
        <Form {...form}>
            <form
                id="form-modal"
                onSubmit={form.handleSubmit(mutate)}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Blood Component
                        </label>
                        <Select
                            onValueChange={(value) =>
                                form.setValue("blood_component", value)
                            }
                            value={form.watch("blood_component")}
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
                        <FieldError
                            field={form.formState.errors.blood_component}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Blood Type
                        </label>
                        <Select
                            onValueChange={(value) =>
                                form.setValue("blood_type_id", value)
                            }
                            value={form.watch("blood_type_id")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                            <SelectContent>
                                {bloodTypes?.map((type) => (
                                    <SelectItem
                                        key={type.id}
                                        value={type.id.toString()}
                                    >
                                        {type.blood_type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError
                            field={form.formState.errors.blood_type_id}
                        />
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

                    {/* Show donor selection only if NOT a registered donor */}
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
                                                    form.setValue(
                                                        "patient_name",
                                                        ""
                                                    );
                                                    form.setValue(
                                                        "patient_date_of_birth",
                                                        ""
                                                    );
                                                    form.setValue(
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
                            <FieldError field={form.formState.errors.user_id} />
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
                                <FieldError
                                    field={form.formState.errors.patient_name}
                                />
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
                                    field={
                                        form.formState.errors
                                            .patient_date_of_birth
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Patient Gender
                                </label>
                                <Select
                                    onValueChange={(value) =>
                                        form.setValue("patient_gender", value)
                                    }
                                    value={form.watch("patient_gender")}
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
                                <FieldError
                                    field={form.formState.errors.patient_gender}
                                />
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
                        <FieldError field={form.formState.errors.no_of_units} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Date Needed
                        </label>
                        <Input type="date" {...form.register("date")} />
                        <FieldError field={form.formState.errors.date} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Hospital Name
                        </label>
                        <Input {...form.register("hospital_name")} />
                        <FieldError
                            field={form.formState.errors.hospital_name}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Diagnosis/Reason
                    </label>
                    <Textarea {...form.register("diagnosis")} />
                    <FieldError field={form.formState.errors.diagnosis} />
                </div>

                <DisplayValidationErrors errors={form.formState.errors} />

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
                        disabled={!form.formState.isDirty || isPending}
                        className="focus:ring-1 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {isPending ? "Creating..." : "Create Request"}
                    </Button>
                </div>
            </form>
            {/* <FormLogger watch={watch} errors={errors} /> */}
            <LoadingModal isLoading={isPending}>Processing...</LoadingModal>
        </Form>
    );
}
