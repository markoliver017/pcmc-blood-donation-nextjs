"use client";
import React, { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@components/ui/card";
import {
    Calendar,
    Eye,
    Flag,
    Phone,
    ShieldCheck,
    ShieldOff,
    Text,
    Upload,
    Users,
} from "lucide-react";

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

import { uploadPicture } from "@/action/uploads";
import { GrUpdate } from "react-icons/gr";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import { userWithDonorSchema } from "@lib/zod/donorSchema";
import { formatFormalName } from "@lib/utils/string.utils";
import Skeleton_form from "@components/ui/Skeleton_form";
import Link from "next/link";
import {
    fetchCitiesMunicipalities,
    fetchluzonDemographics,
} from "@/action/locationAction";
import LocationFields from "@components/organizers/LocationFields";
import { updateUserDonor } from "@/action/donorAction";
import Image from "next/image";
import { BiMaleFemale } from "react-icons/bi";
import { IoInformationCircle } from "react-icons/io5";
import ImagePreviewComponent from "@components/reusable_components/ImagePreviewComponent";
import { Input } from "@components/ui/input";
import FormLogger from "@lib/utils/FormLogger";
import DisplayValidationErrors from "@components/form/DisplayValidationErrors";
import { toast } from "sonner";

const fetchCountries = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_NATIONALITY_API_URL);
    if (!res.ok) throw new Error("Failed to fetch countries");
    return res.json();
};

export default function EventDashboardDonorProfileForm({ donor, eventId }) {
    const user = donor?.user;
    const fileInputRef = useRef(null);
    const queryClient = useQueryClient();

    // Fetch nationalities
    const { data: nationalities, isLoading: nationalities_loading } = useQuery({
        queryKey: ["nationalities"],
        queryFn: fetchCountries,
        staleTime: 1000 * 60 * 60,
    });

    // Fetch location data
    const { data: city_provinces, status: city_provinces_status } = useQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    // Update donor mutation
    const {
        mutate,
        isPending,
        error: mutationError,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateUserDonor(user.id, formData);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({
                queryKey: ["event-dashboard"],
            });
            queryClient.invalidateQueries({
                queryKey: ["event-statistics", eventId],
            });
            queryClient.invalidateQueries({ queryKey: ["appointment"] });

            toast.success(
                <div>Donor's profile has been updated successfully.</div>
            );
        },
        onError: (error) => {
            // Handle validation errors
            if (error?.type === "validation" && error?.errorArr?.length) {
                let detailContent = "";
                const { errorArr: details, message } = error;

                detailContent = (
                    <ul className="list-disc list-inside">
                        {details.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                );
                toast.error(
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
                );
            } else {
                // Handle server errors
                toast.error(error?.message || "Failed to update donor profile");
            }
        },
    });

    // Form setup
    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(userWithDonorSchema),
        defaultValues: {
            ...donor,
            user_id: user?.id,
            first_name: user?.first_name,
            last_name: user?.last_name,
            middle_name: user?.middle_name || "",
            gender: user?.gender,
            blood_type_id: donor?.blood_type_id
                ? donor?.blood_type_id.toString()
                : "",
        },
    });

    const {
        watch,
        control,
        handleSubmit,
        setValue,
        resetField,
        formState: { errors, isDirty },
    } = form;

    // Profile picture logic
    const uploaded_avatar = watch("file");
    const avatar =
        !errors?.file && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : donor?.id_url || "/default-govt-issued-id.png";

    // Initialize location data
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
        setValue,
    ]);

    // Form submission
    const onSubmit = async (formData) => {
        const fileUrl = watch("id_url");

        if (formData.file && (fileUrl == donor?.id_url || !fileUrl)) {
            const result = await uploadPicture(formData.file);
            if (result?.success) {
                formData.id_url = result.file_data?.url || null;
                setValue("id_url", result.file_data?.url);
            } else {
                notify({
                    error: true,
                    message: result?.message || "Failed to upload picture",
                });
            }
        }

        mutate(formData);
    };

    if (nationalities_loading) return <Skeleton_form />;

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Picture Section */}
                <DisplayValidationErrors
                    errors={errors}
                    mutationError={mutationError}
                />
                <div className="w-full md:w-min hidden">
                    <FormField
                        control={control}
                        name="file"
                        render={({ field: { onChange, value, ...field } }) => {
                            const handleImageClick = () => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.click();
                                }
                            };

                            return (
                                <FormItem className="text-center">
                                    <div>
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

                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                </div>

                {/* Basic Information Card */}
                <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                    <div className="flex items-center gap-5">
                        <h1 className="text-xl font-bold flex-items-center">
                            <IoInformationCircle /> Basic Information:
                        </h1>
                        {donor?.is_data_verified ? (
                            <div className="badge badge-success text-md gap-2 p-4 font-semibold">
                                <ShieldCheck className="w-4 h-4" />
                                Verified
                            </div>
                        ) : (
                            <div className="badge badge-warning text-md gap-2 p-4 font-semibold">
                                <ShieldOff className="w-4 h-4" />
                                Not Verified
                            </div>
                        )}
                    </div>
                    <div className="pl-4 space-y-5">
                        {/* Hidden fields */}
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
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>First Name: </InlineLabel>

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
                                            tabIndex={1}
                                            placeholder="Enter first name"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.first_name} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="middle_name"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Middle Name: </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.middle_name
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Text className="h-3" />
                                        <input
                                            type="text"
                                            tabIndex={2}
                                            placeholder="Enter middle name"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.middle_name} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Last Name: </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.last_name
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Text className="h-3" />
                                        <input
                                            type="text"
                                            tabIndex={3}
                                            placeholder="Enter last name"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.last_name} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Sex: </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.gender
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <BiMaleFemale className="h-3" />
                                        <select
                                            className="w-full dark:bg-inherit"
                                            tabIndex={4}
                                            {...field}
                                        >
                                            <option value="">
                                                Select here
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">
                                                Female
                                            </option>
                                        </select>
                                    </label>
                                    <FieldError field={errors?.gender} />
                                </FormItem>
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
                                            tabIndex={5}
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
                                            tabIndex={6}
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
                                            tabIndex={7}
                                            {...field}
                                        >
                                            <option value="">
                                                Select here
                                            </option>
                                            {nationalities
                                                ?.map((country) => {
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
                                            tabIndex={8}
                                            placeholder="+63#########"
                                            {...field}
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
                                    <InlineLabel optional={true}>
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
                                            tabIndex={9}
                                            placeholder="Enter occupation"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.occupation} />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                {/* Government ID Section */}
                <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                    <h1 className="text-xl font-bold flex-items-center">
                        Government Issued ID:
                    </h1>
                    <div className="pl-4">
                        <div className="h-50 border relative rounded-lg overflow-hidden">
                            <Image
                                src={avatar}
                                alt="Government Issued ID"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                {donor?.id_url ? (
                                    <ImagePreviewComponent
                                        imgSrc={donor?.id_url}
                                    />
                                ) : (
                                    <div className="bg-white bg-opacity-80 px-4 py-2 rounded text-red-600 font-medium">
                                        No Uploaded Govt ID
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Location Section */}
                {city_provinces_status === "success" ? (
                    <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                        <h1 className="text-xl font-bold flex-items-center">
                            Location:
                        </h1>
                        <div className="pl-4">
                            <LocationFields
                                form={form}
                                city_provinces={city_provinces}
                            />
                        </div>
                    </Card>
                ) : (
                    <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                        <div className="pl-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </Card>
                )}

                {/* Blood Donation History (for regular donors) */}
                {donor?.is_regular_donor && (
                    <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                        <h1 className="text-xl font-bold flex-items-center">
                            Blood Donation History before registration:
                        </h1>
                        <div className="pl-4 space-y-5">
                            <FormField
                                control={control}
                                name="donation_history_donation_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel required={false}>
                                            Donation Date:{" "}
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
                                                tabIndex={6}
                                                placeholder="Enter donation date"
                                                {...field}
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
                                                tabIndex={7}
                                                placeholder="Enter facility name"
                                                {...field}
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
                    </Card>
                )}

                {/* Verification Checkbox */}
                <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                    <FormField
                        control={control}
                        name="is_data_verified"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-success border bg-red-400 dark:bg-red-500 border-red-500 checked:border-green-500"
                                        {...field}
                                        tabIndex={10}
                                        checked={field.value}
                                    />
                                    <div>
                                        <label className="flex items-center gap-2 text-lg font-semibold">
                                            Verify Donor's Information
                                            <ShieldCheck className="h-5 w-5 text-success" />
                                        </label>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Mark this checkbox if you've
                                            confirmed all donor details.
                                        </p>
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!isDirty || isPending}
                        className="btn btn-primary flex items-center gap-2"
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
            </form>
            {/* <FormLogger watch={form.watch} errors={errors} /> */}
        </Form>
    );
}
