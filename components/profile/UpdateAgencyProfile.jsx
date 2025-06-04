"use client";
import React, { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Card } from "@components/ui/card";
import { Building2Icon, Phone, Text } from "lucide-react";

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
import { formatFormalName } from "@lib/utils/string.utils";
import AgencyLocationFields from "@components/organizers/AgencyLocationFields";
import {
    fetchCitiesMunicipalities,
    fetchluzonDemographics,
} from "@/action/locationAction";
import { agencySchema } from "@lib/zod/agencySchema";
import { updateAgency } from "@/action/agencyAction";

export default function UpdateAgencyProfile({ agency }) {
    const fileInputRef = useRef(null);

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateAgency(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: (data) => {
            console.log("Success: Updated Data:", data);
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["user"] });
            SweetAlert({
                title: "Agency Updated",
                text: "The agency information has been successfully updated.",
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
        resolver: zodResolver(agencySchema),
        defaultValues: {
            id: agency?.id || "",
            file: null,
            file_url: agency?.file_url || null,
            name: agency?.name || "",
            contact_number: agency?.contact_number || "",
            organization_type: agency?.organization_type || "",
            address: agency?.address || "",
            barangay: agency?.barangay || "",
            city_municipality: agency?.city_municipality || "",
            province: agency?.province || "",
            selected_province_option: null,
            selected_city_municipality_option: null,
        },
    });

    const {
        watch,
        control,
        handleSubmit,
        setValue,
        resetField,
        getValues,
        formState: { errors, isDirty },
    } = form;

    const uploaded_avatar = watch("file");
    const avatar =
        !errors?.file && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : agency?.file_url || "/default-agency-logo.png";

    useEffect(() => {
        if (watch("file_url")) setValue("file_url", null);
    }, [uploaded_avatar]);

    const onSubmit = async (formData) => {
        SweetAlert({
            title: "Confirmation",
            text: "Update Agency Information?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                const fileUrl = watch("file_url");
                if (
                    formData.file &&
                    (fileUrl == agency?.file_url || !fileUrl)
                ) {
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

    const { data: city_provinces, status: city_provinces_status } = useQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    useEffect(() => {
        const initializeLocation = async () => {
            if (city_provinces_status === "success" && agency?.province) {
                const matchedProvince = city_provinces.find(
                    (item) => item.name === agency.province
                );

                setValue("selected_province_option", matchedProvince || null);

                if (matchedProvince) {
                    const cities_municipalities =
                        await fetchCitiesMunicipalities(matchedProvince);

                    const matchedCity = cities_municipalities.find(
                        (item) => item.name === agency.city_municipality
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
        agency?.province,
        agency?.city_municipality,
    ]);

    if (!agency) {
        return <div className='text-center alert alert-error'>Agency not found.</div>
    }

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2 flex flex-wrap gap-2 justify-center"
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
                    <div className="shadow p-3">
                        <label className="font-semibold">Agency Administrator:</label>
                        <h3>{agency.head.name}</h3>
                        <h4 className="text-blue-700 italic">{agency.head.email}</h4>
                    </div>
                </div>

                <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                    <h1 className="text-xl font-bold">Basic Information:</h1>
                    <div className="pl-4">
                        <FormField
                            control={control}
                            name="id"
                            render={({ field }) => (
                                <input type="hidden" {...field} />
                            )}
                        />
                        <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Agency Name: </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full",
                                            errors?.name
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Text className="h-3" />
                                        <input
                                            type="text"
                                            placeholder="Enter user agency name"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.name} />
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
                                            tabIndex={2}
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
                            name="organization_type"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        Organization Type:{" "}
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
                                        <select
                                            className="w-full dark:bg-inherit"
                                            tabIndex={3}
                                            {...field}
                                        >
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
                    </div>

                    {city_provinces_status === "success" ? (
                        <>
                            <h1 className="text-xl font-bold">Location:</h1>
                            <div className="pl-4">
                                <AgencyLocationFields
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
            <FormLogger watch={watch} errors={errors} />
        </Form>
    );
}
