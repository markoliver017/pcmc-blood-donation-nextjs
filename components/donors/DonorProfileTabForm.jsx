"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Card } from "@components/ui/card";
import { Calendar, Eye, Flag, Phone, Text, Upload, Users } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";

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

import { uploadPicture } from "@/action/uploads";
import { GrUpdate } from "react-icons/gr";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import FormLogger from "@lib/utils/FormLogger";
import { donorSchema } from "@lib/zod/donorSchema";
import { formatFormalName } from "@lib/utils/string.utils";
import Skeleton_form from "@components/ui/Skeleton_form";
import Link from "next/link";
import {
    fetchCitiesMunicipalities,
    fetchluzonDemographics,
} from "@/action/locationAction";
import LocationFields from "@components/organizers/LocationFields";
import { updateDonor } from "@/action/donorAction";
import ImagePreviewComponent from "@components/reusable_components/ImagePreviewComponent";
import { toastCatchError, toastError } from "@lib/utils/toastError.utils";
import LoadingModal from "@components/layout/LoadingModal";
import DisplayValidationErrors from "@components/form/DisplayValidationErrors";

const fetchCountries = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_NATIONALITY_API_URL);
    if (!res.ok) throw new Error("Failed to fetch countries");
    return res.json();
};

export default function DonorProfileTabForm({ donor }) {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const queryClient = useQueryClient();

    const { data: nationalities, isLoading: nationalities_loading } = useQuery({
        queryKey: ["nationalities"],
        queryFn: fetchCountries,
        staleTime: 1000 * 60 * 60,
    });

    const {
        mutate,
        isPending,
        error: mutationError,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateDonor(formData);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        onSuccess: (data) => {
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["user"] });
            SweetAlert({
                title: "Donor's Profile",
                text: "The Donor's profile has been updated successfully.",
                icon: "success",
                confirmButtonText: "Okay",
            });
            reset();
        },
        onError: (error) => {
            // Handle validation errors
            if (error?.type === "validation" && error?.errorArr.length) {
                toastError(error);
            } else if (
                error?.type === "catch_validation_error" &&
                error?.errors?.length
            ) {
                toastCatchError(error, setError);
            } else {
                setError("root", {
                    type: "custom",
                    message: error?.message || "Unknown error",
                });
                notify({
                    error: true,
                    message: error?.message,
                });
                alert(error?.message);
            }
        },
    });

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(donorSchema),
        defaultValues: {
            ...donor,
            blood_type_id: donor?.blood_type_id
                ? donor?.blood_type_id.toString()
                : "",
        },
    });

    const {
        register,
        watch,
        control,
        handleSubmit,
        setError,
        setValue,
        reset,
        resetField,
        formState: { errors, isDirty },
    } = form;

    /* For profile picture data logic */
    const uploaded_avatar = watch("file");
    const avatar =
        !errors?.file && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : donor?.id_url || "/default-govt-issued-id.png";

    useEffect(() => {
        if (watch("id_url")) setValue("id_url", null);
    }, [uploaded_avatar]);

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Confirmation",
            text: "Update Donor's profile?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                const fileUrl = watch("id_url");

                if (formData.file && (fileUrl == donor?.id_url || !fileUrl)) {
                    setIsUploading(true);
                    const result = await uploadPicture(formData.file);
                    setIsUploading(false);
                    if (result?.success) {
                        formData.id_url = result.file_data?.url || null;
                        setValue("id_url", result.file_data?.url);
                    } else {
                        setError("root", {
                            type: "custom",
                            message: result.message,
                        });
                        notify({
                            error: true,
                            message:
                                result?.message || "Failed to upload image",
                        });
                        return;
                    }
                    console.log("Upload result:", result);
                }
                mutate(formData);
            },
        });
    };

    const { data: city_provinces, status: city_provinces_status } = useQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    useEffect(() => {
        const initializeLocation = async () => {
            if (city_provinces_status === "success" && donor?.province) {
                const matchedProvince = city_provinces.find(
                    (item) => item.name === donor?.province
                );

                setValue("selected_province_option", matchedProvince || null);

                if (matchedProvince) {
                    const cities_municipalities =
                        await fetchCitiesMunicipalities(matchedProvince);

                    const matchedCity = cities_municipalities.find(
                        (item) => item.name === donor?.city_municipality
                    );

                    setValue(
                        "selected_city_municipality_option",
                        matchedCity || null
                    );
                }
            }
        };

        initializeLocation();
    }, [
        city_provinces_status,
        city_provinces,
        donor?.province,
        donor?.city_municipality,
    ]);

    const govtId = watch("file");
    const govtIdFile = {
        name: govtId?.name,
        size: govtId?.size,
        type: govtId?.type,
        lastModified: govtId?.lastModified,
    };

    if (nationalities_loading) return <Skeleton_form />;

    return (
        <Form {...form}>
            <LoadingModal isLoading={isPending || isUploading} />
            <DisplayValidationErrors
                errors={errors}
                mutationError={mutationError}
            />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2 flex flex-wrap gap-2 mt-2 justify-center"
            >
                <div className="w-full md:w-min">
                    <FormField
                        control={control}
                        name="file"
                        render={({ field: { onChange, value, ...field } }) => {
                            const handleImageClick = () => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.click(); // Trigger the file input click
                                }
                            };

                            return (
                                <FormItem className="text-center">
                                    <div className="hidden">
                                        <FormControl ref={fileInputRef}>
                                            <Input
                                                type="file"
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
                                        className="w-[250px] h-[250px]"
                                    />
                                    <div className="flex justify-center gap-2">
                                        <ImagePreviewComponent
                                            imgSrc={avatar}
                                            triggerContent={
                                                <>
                                                    <Eye /> View ID
                                                </>
                                            }
                                        />

                                        <button
                                            onClick={handleImageClick}
                                            type="button"
                                            className="btn"
                                        >
                                            <Upload /> Upload
                                        </button>
                                    </div>

                                    {uploaded_avatar && (
                                        <button
                                            onClick={() => resetField("file")}
                                            className="btn btn-ghost"
                                        >
                                            Clear
                                        </button>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                </div>

                <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                    <h1 className="text-xl font-bold">Basic Information:</h1>
                    <div className="pl-4 space-y-5">
                        <FormField
                            control={control}
                            name="id"
                            render={({ field }) => (
                                <input type="hidden" {...field} />
                            )}
                        />
                        <FormField
                            control={control}
                            name="agency_id"
                            render={({ field }) => (
                                <input type="hidden" {...field} />
                            )}
                        />
                        <FormField
                            control={control}
                            name="date_of_birth"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Date of Birth: </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.date_of_birth
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Calendar className="h-3" />
                                        <input
                                            type="date"
                                            tabIndex={1}
                                            placeholder="Enter user birth date"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.date_of_birth} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="civil_status"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Civil Status: </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.civil_status
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Users className="h-3" />
                                        <select
                                            className="w-full dark:bg-inherit"
                                            tabIndex={2}
                                            {...field}
                                        >
                                            <option value="">
                                                Select here
                                            </option>
                                            {[
                                                "single",
                                                "married",
                                                "divorced",
                                                "separated",
                                                "widowed",
                                            ].map((status, i) => (
                                                <option key={i} value={status}>
                                                    {formatFormalName(status)}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <FieldError field={errors?.civil_status} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="nationality"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Nationality: </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.nationality
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Flag className="h-3" />
                                        <select
                                            className="w-full dark:bg-inherit"
                                            tabIndex={3}
                                            {...field}
                                        >
                                            <option value="">
                                                Select here
                                            </option>
                                            {nationalities
                                                .map((country) => {
                                                    const name =
                                                        country.name?.common;
                                                    const nationality =
                                                        country.demonyms?.eng
                                                            ?.m || name;
                                                    return (
                                                        <option
                                                            key={name}
                                                            value={nationality}
                                                        >
                                                            {nationality}
                                                        </option>
                                                    );
                                                })
                                                .sort((a, b) =>
                                                    a.props.value.localeCompare(
                                                        b.props.value
                                                    )
                                                )}
                                        </select>
                                    </label>
                                    <FieldError field={errors?.nationality} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="contact_number"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Contact Number: </InlineLabel>
                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.contact_number
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Phone className="h-3" />
                                        +63
                                        <input
                                            type="text"
                                            tabIndex={4}
                                            {...field}
                                            placeholder="+63#########"
                                        />
                                    </label>

                                    <FieldError
                                        field={errors?.contact_number}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="occupation"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel
                                        required={false}
                                        optional={true}
                                    >
                                        Occupation:{" "}
                                    </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.occupation
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Text className="h-3" />
                                        <input
                                            type="text"
                                            tabIndex={5}
                                            placeholder="Enter user occupation"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.occupation} />
                                </FormItem>
                            )}
                        />
                    </div>

                    {city_provinces_status === "success" ? (
                        <>
                            <h1 className="text-xl font-bold">Location:</h1>
                            <div className="pl-4">
                                <LocationFields
                                    form={form}
                                    city_provinces={city_provinces}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="skeleton w-full h-5"></div>
                            <div className="skeleton w-full h-5"></div>
                        </>
                    )}

                    {donor?.is_regular_donor && (
                        <div>
                            <h1 className="text-xl font-semibold ">
                                Blood Donation History before registration:
                            </h1>
                            <span className="italic text-warning">
                                * You are not allowed already to modify this
                                fields
                            </span>
                            <div className="pl-3 space-y-2 mt-2">
                                <FormField
                                    control={control}
                                    name="donation_history_donation_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <InlineLabel required={false}>
                                                Donation Date:
                                            </InlineLabel>

                                            <label
                                                className={clsx(
                                                    "input w-full mt-1",
                                                    errors?.donation_history_donation_date
                                                        ? "input-error"
                                                        : "input-info"
                                                )}
                                            >
                                                <Calendar className="h-3" />
                                                <input
                                                    type="date"
                                                    tabIndex={3}
                                                    placeholder="Enter last donation date"
                                                    {...field}
                                                    readOnly
                                                />
                                            </label>
                                            <FieldError
                                                field={
                                                    errors?.donation_history_donation_date
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="blood_service_facility"
                                    render={({ field }) => (
                                        <FormItem>
                                            <InlineLabel required={false}>
                                                Blood Service Facility/Hospital:{" "}
                                            </InlineLabel>

                                            <label
                                                className={clsx(
                                                    "input w-full mt-1",
                                                    errors?.blood_service_facility
                                                        ? "input-error"
                                                        : "input-info"
                                                )}
                                            >
                                                <Text className="h-3" />
                                                <input
                                                    type="text"
                                                    tabIndex={4}
                                                    placeholder="Enter your answer"
                                                    {...field}
                                                    readOnly
                                                />
                                            </label>
                                            <FieldError
                                                field={
                                                    errors?.blood_service_facility
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    )}

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
                                    <GrUpdate />
                                    Update
                                </>
                            )}
                        </button>
                    </div>
                </Card>
            </form>
            {/* <FormLogger watch={watch} errors={errors} /> */}
            {/*<pre>
                <b>Govt ID File: </b> {JSON.stringify(govtIdFile)}
            </pre> */}
        </Form>
    );
}
