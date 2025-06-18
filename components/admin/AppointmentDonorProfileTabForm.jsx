"use client";
import React, { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Card } from "@components/ui/card";
import { Calendar, Eye, Flag, Phone, ShieldCheck, ShieldOff, Text, Upload, Users } from "lucide-react";

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
import { userWithDonorSchema } from "@lib/zod/donorSchema";
import { formatFormalName } from "@lib/utils/string.utils";
import Skeleton_form from "@components/ui/Skeleton_form";
import Link from "next/link";
import {
    fetchCitiesMunicipalities,
    fetchluzonDemographics,
} from "@/action/locationAction";
import LocationFields from "@components/organizers/LocationFields";
import { updateDonor, updateUserDonor } from "@/action/donorAction";
import Image from "next/image";
import { BiMaleFemale } from "react-icons/bi";
import { IoInformationCircle } from "react-icons/io5";

const fetchCountries = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_NATIONALITY_API_URL);
    if (!res.ok) throw new Error("Failed to fetch countries");
    return res.json();
};

export default function AppointmentDonorProfileTabForm({ donor }) {
    const user = donor.user;

    const fileInputRef = useRef(null);

    const queryClient = useQueryClient();

    const { data: nationalities, isLoading: nationalities_loading } = useQuery({
        queryKey: ["nationalities"],
        queryFn: fetchCountries,
        staleTime: 1000 * 60 * 60,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateUserDonor(user.id, formData);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        onSuccess: () => {
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["appointment"] });
            SweetAlert({
                title: "Donor's Profile",
                text: "The Donor's profile has been updated successfully.",
                icon: "success",
                confirmButtonText: "Okay",
            });
        },
        onError: (error) => {
            // Handle validation errors
            if (error?.type === "validation" && error?.errorArr.length) {
                let detailContent = "";
                const { errorArr: details, message } = error;

                detailContent = (
                    <ul className="list-disc list-inside">
                        {details.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                );
                notify({
                    error: true,
                    message: (
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
                    ),
                });
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
        resolver: zodResolver(userWithDonorSchema),
        defaultValues: {
            ...donor,
            user_id: user.id,
            first_name: user?.first_name,
            last_name: user?.last_name,
            middle_name: user?.middle_name || "",
            gender: user.gender,
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

    /* For profile picture data logic */
    const uploaded_avatar = watch("file");
    const avatar =
        !errors?.file && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : donor?.id_url || "/default-govt-issued-id.png";

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Update Donor's Profile?",
            text: "Are you sure you want to save these changes?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                const fileUrl = watch("id_url");

                if (formData.file && (fileUrl == donor?.id_url || !fileUrl)) {
                    const result = await uploadPicture(formData.file);
                    if (result?.success) {
                        formData.id_url = result.file_data?.url || null;
                        setValue("id_url", result.file_data?.url);
                    }
                    console.log("Upload result:", result);
                }
                console.log("submitted formData>>>>>>>", formData);
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
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2 flex flex-col gap-2 justify-center"
            >
                <div className="w-full md:w-min hidden">
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
                                        <Link
                                            href={avatar}
                                            className="btn"
                                            target="_blank"
                                        >
                                            <Eye /> View ID
                                        </Link>
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
                    <div className="flex items-center gap-5">

                        <h1 className="text-xl font-bold flex-items-center"><IoInformationCircle /> Basic Information:</h1>
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
                                            tabIndex={2}
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
                                            tabIndex={3}
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

                    <h1 className="text-xl font-bold">
                        Uploaded Govt Issued ID:
                    </h1>
                    <div className="h-50 border relative">
                        <Image
                            src={avatar}
                            alt="Government Issued ID"
                            fill
                            className="object-cover rounded"
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            {donor?.id_url ? (
                                <Link
                                    href={donor?.id_url}
                                    target="_blank"
                                    className="btn btn-ghost btn-wide bg-white bg-opacity-80"
                                >
                                    View
                                </Link>
                            ) : (
                                <div className="btn btn-ghost btn-wide bg-white text-red-600 bg-opacity-80">
                                    No Uploaded Govt ID
                                </div>
                            )}
                        </div>
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

                            <div className="pl-3 space-y-2 mt-2">
                                <FormField
                                    control={control}
                                    name="last_donation_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <InlineLabel required={false}>
                                                Donation Date:
                                            </InlineLabel>

                                            <label
                                                className={clsx(
                                                    "input w-full mt-1",
                                                    errors?.last_donation_date
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
                                                />
                                            </label>
                                            <FieldError
                                                field={
                                                    errors?.last_donation_date
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

                    <FormField
                        control={control}
                        name="is_data_verified"
                        render={({ field }) => (
                            <FormItem className="pt-10 pl-5 md:pl-15">
                                <label className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        className="checkbox border-indigo-600 bg-indigo-500 checked:border-green-500 checked:bg-green-400 checked:text-green-800"
                                        {...field}
                                        checked={
                                            field.value
                                        }
                                    />
                                    <span className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-gray-300">
                                        Verify Donor's Information
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                    </span>
                                </label>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Mark this checkbox if you’ve confirmed all donor details.
                                </p>
                                <FormMessage />
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
                                    <GrUpdate />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </Card>
            </form>
            {/* <FormLogger watch={watch} errors={errors} data={donor} /> */}
        </Form>
    );
}
