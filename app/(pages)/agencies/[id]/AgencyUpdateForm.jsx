"use client";
import {
    fetchAgency,
    updateAgency,
    updateAgencyStatus,
} from "@/action/agencyAction";
import {
    fetchBarangays,
    fetchCitiesMunicipalities,
    fetchluzonDemographics,
} from "@/action/locationAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
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
import {
    Building,
    Building2Icon,
    CheckIcon,
    Mail,
    Phone,
    Send,
    Text,
} from "lucide-react";

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
import { useRouter } from "next/navigation";
import RejectDialog from "./RejectDialog";
import { toastError } from "@lib/utils/toastError.utils";
import VerifyAgency from "./VerifyAgency";

export default function AgencyUpdateForm({ agency_id }) {
    const { resolvedTheme } = useTheme();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: agency, isFetching } = useQuery({
        queryKey: ["agency", agency_id],
        queryFn: async () => {
            const res = await fetchAgency(agency_id);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        enabled: !!agency_id,
    });

    const { data: city_provinces, status } = useQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    const existingSelectedProvince = city_provinces.find(
        (loc) => loc.name == agency?.province
    );
    const [selectedProvince, setSelectedProvince] = useState(
        existingSelectedProvince
    );

    const {
        data: cities_municipalities,
        status: cities_status,
        isFetching: cities_isFetching,
    } = useQuery({
        queryKey: ["cities_municipalities", selectedProvince],
        queryFn: async () => fetchCitiesMunicipalities(selectedProvince),
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        enabled: !!selectedProvince,
    });

    const [selectedCityMunicipality, setSelectedCityMunicipality] =
        useState(null);

    useEffect(() => {
        if (cities_municipalities) {
            const existingSelectedCityMunicipality = cities_municipalities.find(
                (loc) => loc.name == agency?.city_municipality
            );
            setSelectedCityMunicipality(existingSelectedCityMunicipality);
        }
    }, [cities_municipalities, agency?.city_municipality]);

    const {
        data: barangays,
        status: brgy_status,
        isFetching: brgy_isFetching,
    } = useQuery({
        queryKey: ["barangays", selectedCityMunicipality],
        queryFn: async () => fetchBarangays(selectedCityMunicipality),
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        enabled: !!selectedCityMunicipality,
    });

    const {
        // data: newAgencyData,
        mutate,
        isPending,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateAgency(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agency"] });
            router.push("/agencies");
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

            if (error?.type === "validation" && error?.errorArr.length) {
                toastError(error);
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
            id: agency?.id || null,
            head_id: agency?.head_id || null,
            name: agency?.name || "",
            contact_number: agency?.contact_number || "",
            agency_email: agency?.agency_email || "",
            address: agency?.address || "",
            barangay: agency?.barangay || "",
            city_municipality: agency?.city_municipality || "",
            province: agency?.province || "",
            comments: agency?.comments || "",
            organization_type: agency?.organization_type || "",
            file: null,
            file_url: agency?.file_url,
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
            text: "Update Agency?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",

            onConfirm: async () => {
                const fileUrl = watch("file_url");
                console.log("fileUrl", fileUrl);
                console.log("data.profile_picture", data.file);
                if (data.file && (fileUrl == agency?.file_url || !fileUrl)) {
                    const result = await uploadPicture(data.file);
                    if (result?.success) {
                        data.file_url = result.file_data?.url || null;
                        setValue("file_url", data.file_url);
                    }
                    console.log("Upload resulttt:", result);
                }
                mutate(data);
            },
        });
    };

    // console.log("RHF errors", errors);

    const uploaded_avatar = watch("file");
    const avatar =
        !errors?.file && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : agency?.file_url || "/default_company_avatar.png";
    useEffect(() => {
        setValue("file_url", agency?.file_url || null);
    }, [uploaded_avatar]);

    // useEffect(() => {
    //     console.log("watchall", watch());
    //     // console.log("selectedCityMunicipality", selectedCityMunicipality);
    // }, [watch()]);

    const province = watch("province");
    const city_municipality = watch("city_municipality");
    const barangay = watch("barangay");
    useEffect(() => {
        if (!cities_municipalities || !province) return;
        if (
            !cities_municipalities.find(
                (data) => data.name == city_municipality
            )
        ) {
            setValue("city_municipality", "");
        }
    }, [cities_municipalities, province]);
    useEffect(() => {
        if (!barangays || !city_municipality) return;
        if (!barangays.find((data) => data.name == barangay)) {
            setValue("barangay", "");
        }
    }, [barangays, city_municipality]);

    return (
        <Card className="p-5 bg-gray-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Update Agency</CardTitle>
                <CardDescription className="flex justify-between">
                    <div>Update agency details.</div>
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
                                        <div
                                            style={{
                                                width: "250px",
                                                height: "250px",
                                                position: "relative",
                                            }}
                                            className="rounded-4xl mx-auto shadow-2xl overflow-hidden"
                                            onClick={handleImageClick}
                                        >
                                            <Image
                                                src={avatar}
                                                alt="Avatar"
                                                fill
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
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
                        <button
                            type="button"
                            onClick={async () => {
                                const res = await updateAgencyStatus({
                                    id: agency.id,
                                    verified_by: agency.head_id,
                                    status: "rejected",
                                });
                                console.log("Response", res);
                            }}
                            className="btn btn-ghost"
                        >
                            Verify
                        </button>
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
                                                    setSelectedProvince(
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
                                                        setSelectedCityMunicipality(
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

                        <div className="flex justify-end">
                            <button
                                type="submit"
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
                <div className="mt-5 flex justify-end gap-3">
                    <RejectDialog agencyId={agency.id} />
                    <VerifyAgency
                        agencyData={{ id: agency.id, status: "deactivated" }}
                        label="Deactivate"
                        className="btn-warning"
                        icon={<CheckIcon />}
                    />
                    <VerifyAgency
                        agencyData={{ id: agency.id, status: "activated" }}
                        label="Activate"
                        className="btn-success"
                        icon={<CheckIcon />}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
