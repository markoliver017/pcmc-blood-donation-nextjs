"use client";
import { createAgency } from "@/action/agencyAction";
import {
    fetchBarangays,
    fetchCitiesMunicipalities,
    fetchluzonDemographics,
} from "@/action/locationAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), {
    ssr: false,
});
import { getSingleStyle } from "@/styles/select-styles";
import clsx from "clsx";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Building, Building2Icon, Mail, Phone, Send, Text } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import Image from "next/image";
import { uploadPicture } from "@/action/uploads";
import FieldError from "@components/form/FieldError";
import Link from "next/link";
import { formatFormalName } from "@lib/utils/string.utils";
import { agencySchema } from "@lib/zod/agencySchema";

export default function CreateForm() {
    const { resolvedTheme } = useTheme();
    const queryClient = useQueryClient();
    const { data: city_provinces, status } = useQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    const {
        // data: newAgencyData,
        mutate,
        isPending,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await createAgency(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: () => {
            /** note: the return data will be accessible in the debugger
             *so no need to console the onSuccess(data) here **/
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["users"] });
            SweetAlert({
                title: "Submission Successful",
                text: "New agency has been successfully created.",
                icon: "success",
                confirmButtonText: "Done",
                onConfirm: reset,
            });
        },
        onError: (error) => {
            // Handle validation errors

            // SweetAlert({
            //     title: "New Agency Creation",
            //     text: error.message,
            //     icon: "warning",
            // });

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

    if (status != "success") {
        redirect("/agencies?error=locationApiError");
    }

    const form = useForm({
        mode: "onChange",
        // resolver: zodResolver(agencySchema),
        defaultValues: {
            name: "",
            contact_number: "",
            agency_email: "",
            address: "",
            barangay: "",
            city_municipality: "",
            province: "Metro Manila",
            comments: "",
            organization_type: "",
            selected_province_option: {
                code: "130000000",
                name: "Metro Manila",
                is_ncr: true,
            },
            file: null,
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

    const onSubmit = async (data) => {
        SweetAlert({
            title: "Confirmation",
            text: "Create New Agency?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",

            onConfirm: async () => {
                const fileUrl = watch("file_url");
                if (data?.file && !fileUrl) {
                    const result = await uploadPicture(data.file);
                    if (result?.success) {
                        data.file_url = result.file_data?.url || null;
                        setValue("file_url", result.file_data?.url);
                    }
                    console.log("Upload result:", result);
                }
                mutate(data);
            },
        });
    };

    const uploaded_avatar = watch("file");
    const avatar =
        !errors?.file && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : "/default_company_avatar.png";

    useEffect(() => {
        setValue("file_url", null);
    }, [uploaded_avatar]);

    const selected_province_option = watch("selected_province_option");
    const {
        data: cities_municipalities,
        status: cities_status,
        isFetching: cities_isFetching,
    } = useQuery({
        queryKey: ["cities_municipalities", selected_province_option],
        queryFn: async () =>
            fetchCitiesMunicipalities(selected_province_option),
        enabled: !!selected_province_option,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    const selected_city_municipality_option = watch(
        "selected_city_municipality_option"
    );
    const {
        data: barangays,
        status: brgy_status,
        isFetching: brgy_isFetching,
    } = useQuery({
        queryKey: ["barangays", selected_city_municipality_option],
        queryFn: async () => fetchBarangays(selected_city_municipality_option),
        enabled: !!selected_city_municipality_option,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    // useEffect(() => {
    //     console.log("watchall", watch());
    // }, [watch()]);

    useEffect(() => {
        if (!selected_province_option) return;
        resetField("city_municipality");
        setValue("selected_city_municipality_option", null);
    }, [selected_province_option]);

    return (
        <Card className="p-5 bg-gray-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Create New Agency</CardTitle>
                <CardDescription className="flex justify-between">
                    <div>New agency details.</div>
                    <Link href="/agencies" className="btn btn-link">
                        Back
                    </Link>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
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
                                    <FormItem className="text-center">
                                        <div className="hidden">
                                            <InlineLabel>
                                                Agency Avatar
                                            </InlineLabel>
                                            <FormControl ref={fileInputRef}>
                                                <Input
                                                    type="file"
                                                    onChange={(e) =>
                                                        onChange(
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <Image
                                            src={avatar}
                                            className="rounded-4xl mx-auto shadow-2xl"
                                            width={250}
                                            height={250}
                                            alt="Avatar"
                                            onClick={handleImageClick}
                                        />
                                        {uploaded_avatar && (
                                            <button
                                                onClick={() =>
                                                    resetField("file")
                                                }
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
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Agency Name: *</InlineLabel>
                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.name
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Building className="h-3" />
                                        <input
                                            type="text"
                                            {...field}
                                            placeholder="Your agency/orgranization name .."
                                        />
                                    </label>

                                    <FieldError field={errors?.name} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contact_number"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Contact Number: *</InlineLabel>
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
                            control={form.control}
                            name="agency_email"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        Agency Email Address: *
                                    </InlineLabel>
                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.agency_email
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Mail className="h-3" />
                                        <input
                                            type="email"
                                            {...field}
                                            placeholder="agency@email.com"
                                        />
                                    </label>

                                    <FieldError field={errors?.agency_email} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        House/Building Address: *{" "}
                                    </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.address
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Text className="h-3" />
                                        <input
                                            type="text"
                                            placeholder="House / Building / Lot / Block / Street Number "
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.address} />
                                </FormItem>
                            )}
                        />
                        <div className="mt-1">
                            <InlineLabel>Area: *</InlineLabel>
                            <fieldset className="fieldset w-full">
                                <Controller
                                    control={control}
                                    name="province"
                                    render={({
                                        field: { onChange, value, name, ref },
                                    }) => {
                                        const cityProvincesOptions = [
                                            {
                                                label: "NCR",
                                                options: city_provinces
                                                    .filter((loc) => loc.is_ncr)
                                                    .map((loc) => ({
                                                        value: loc.name,
                                                        label: loc.name,
                                                        code: loc.code,
                                                        is_ncr: loc.is_ncr,
                                                    })),
                                            },
                                            {
                                                label: "Luzon Provinces",
                                                options: city_provinces
                                                    .filter(
                                                        (loc) => !loc.is_ncr
                                                    )
                                                    .map((loc) => ({
                                                        value: loc.name,
                                                        label: loc.name,
                                                        code: loc.code,
                                                        is_ncr: loc.is_ncr,
                                                    })),
                                            },
                                        ];

                                        const selectedOption =
                                            cityProvincesOptions
                                                .flatMap(
                                                    (group) => group.options
                                                )
                                                .find(
                                                    (option) =>
                                                        option.value === value
                                                ) || null;

                                        return (
                                            <CreatableSelectNoSSR
                                                name={name}
                                                ref={ref}
                                                placeholder="Area "
                                                value={selectedOption}
                                                onChange={(selectedOption) => {
                                                    setValue(
                                                        "selected_province_option",
                                                        selectedOption
                                                    );

                                                    onChange(
                                                        selectedOption
                                                            ? selectedOption.value
                                                            : null
                                                    );
                                                }}
                                                isValidNewOption={() => false}
                                                options={cityProvincesOptions}
                                                styles={getSingleStyle(
                                                    resolvedTheme
                                                )}
                                                className="sm:text-lg"
                                                isClearable
                                            />
                                        );
                                    }}
                                />
                            </fieldset>
                            <FieldError field={errors?.province} />
                        </div>
                        {cities_isFetching && (
                            <>
                                <div className="skeleton w-full h-5"></div>
                                <div className="skeleton w-full h-5"></div>
                            </>
                        )}
                        {cities_status == "success" && (
                            <div className="mt-1">
                                <InlineLabel>City/Municipality: *</InlineLabel>
                                <fieldset className="fieldset w-full">
                                    <Controller
                                        control={control}
                                        name="city_municipality"
                                        render={({
                                            field: {
                                                onChange,
                                                value,
                                                name,
                                                ref,
                                            },
                                        }) => {
                                            const cityMunicipalityOptions =
                                                cities_municipalities.map(
                                                    (cm) => ({
                                                        label: cm.name,
                                                        value: cm.name,
                                                        code: cm.code,
                                                    })
                                                );
                                            const selectedOption =
                                                cityMunicipalityOptions.find(
                                                    (option) =>
                                                        option.value === value
                                                ) || null;
                                            return (
                                                <CreatableSelectNoSSR
                                                    name={name}
                                                    ref={ref}
                                                    placeholder="City/Municipality"
                                                    value={selectedOption}
                                                    onChange={(
                                                        selectedOption
                                                    ) => {
                                                        setValue(
                                                            "selected_city_municipality_option",
                                                            selectedOption
                                                        );

                                                        onChange(
                                                            selectedOption
                                                                ? selectedOption.value
                                                                : null
                                                        );
                                                    }}
                                                    isValidNewOption={() =>
                                                        false
                                                    }
                                                    options={
                                                        cityMunicipalityOptions
                                                    }
                                                    styles={getSingleStyle(
                                                        resolvedTheme
                                                    )}
                                                    className="sm:text-lg"
                                                    isClearable
                                                />
                                            );
                                        }}
                                    />
                                </fieldset>
                                <FieldError field={errors?.city_municipality} />
                            </div>
                        )}

                        {brgy_isFetching && (
                            <>
                                <div className="skeleton w-full h-5"></div>
                                <div className="skeleton w-full h-5"></div>
                            </>
                        )}
                        {brgy_status == "success" && (
                            <div className="mt-1">
                                <InlineLabel>Barangay: *</InlineLabel>
                                <fieldset className="fieldset w-full">
                                    <Controller
                                        control={control}
                                        name="barangay"
                                        render={({
                                            field: {
                                                onChange,
                                                value,
                                                name,
                                                ref,
                                            },
                                        }) => {
                                            const barangayOptions =
                                                barangays.map((brgy) => ({
                                                    label: brgy.name,
                                                    value: brgy.name,
                                                    code: brgy.code,
                                                }));
                                            const selectedOption =
                                                barangayOptions.find(
                                                    (option) =>
                                                        option.value === value
                                                ) || null;
                                            return (
                                                <CreatableSelectNoSSR
                                                    name={name}
                                                    ref={ref}
                                                    placeholder="Barangay"
                                                    value={selectedOption}
                                                    onChange={(
                                                        selectedOption
                                                    ) => {
                                                        onChange(
                                                            selectedOption
                                                                ? selectedOption.value
                                                                : null
                                                        );
                                                    }}
                                                    isValidNewOption={() =>
                                                        false
                                                    }
                                                    options={barangayOptions}
                                                    styles={getSingleStyle(
                                                        resolvedTheme
                                                    )}
                                                    className="sm:text-lg"
                                                    isClearable
                                                />
                                            );
                                        }}
                                    />
                                </fieldset>
                                <FieldError field={errors?.barangay} />
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="organization_type"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        Organization Type: *
                                    </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.organization_type
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Building2Icon className="h-3" />
                                        <select className="w-full" {...field}>
                                            <option value="">
                                                Select here
                                            </option>
                                            {[
                                                "business",
                                                "media",
                                                "government",
                                                "church",
                                                "education",
                                                "healthcare",
                                            ].map((org, i) => (
                                                <option key={i} value={org}>
                                                    {formatFormalName(org)}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <FieldError
                                        field={errors?.organization_type}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comments"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Any Message: </InlineLabel>

                                    <textarea
                                        className="textarea textarea-info h-24 w-full"
                                        placeholder="Your message"
                                        {...field}
                                    />
                                    <FieldError field={errors?.comments} />
                                </FormItem>
                            )}
                        />
                        {/*
                        <FormField
                            control={form.control}
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
                                            placeholder="Enter user middle name (optional)"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.middle_name} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Last Name: *</InlineLabel>

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
                                            placeholder="Enter user last name"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.last_name} />
                                </FormItem>
                            )}
                        />

                        */}

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
                                        <Send />
                                        Submit
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
