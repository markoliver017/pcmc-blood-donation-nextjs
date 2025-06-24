"use client";
import { fetchAgency, updateAgency } from "@/action/agencyAction";
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
    ArrowLeft,
    Building,
    Building2Icon,
    CheckIcon,
    Command,
    Eye,
    Mail,
    MoreHorizontal,
    Navigation,
    Phone,
    Send,
    SquareMenu,
    Text,
    XIcon,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Input } from "@components/ui/input";

import { uploadPicture } from "@/action/uploads";
import FieldError from "@components/form/FieldError";
import Link from "next/link";
import { formatFormalName } from "@lib/utils/string.utils";

import RejectDialog from "./RejectDialog";
import VerifyAgency from "./VerifyAgency";
import { toastError } from "@lib/utils/toastError.utils";

import CustomAvatar from "@components/reusable_components/CustomAvatar";
import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";

export default function AgencyUpdateForm({ agency_id }) {
    const { resolvedTheme } = useTheme();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: agency } = useQuery({
        queryKey: ["agency", agency_id],
        queryFn: async () => {
            const res = await fetchAgency(agency_id);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        staleTime: 0,
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
            // router.push("/agencies");
            SweetAlert({
                title: "Submission Successful",
                text: "New agency has been successfully created.",
                icon: "success",
                confirmButtonText: "Done",
                // onConfirm: reset,
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
        <Card className="px md:px-2 bg-gray-100">
            <CardHeader className="text-2xl font-bold">
                <div className="flex justify-end mb-5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="default" className="h-8 w-min p-0">
                                <span className="sr-only">Open menu</span>
                                {formatFormalName(agency.status)}
                                <SquareMenu className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="flex items-center space-x-2">
                                <Command className="w-3 h-3" />
                                <span>Actions</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="space-x-2">
                                <Button
                                    onClick={() =>
                                        router.push(
                                            `/portal/admin/agencies/${agency.id}`
                                        )
                                    }
                                    variant="secondary"
                                    className=" hover:bg-orange-300 active:ring-2 active:ring-orange-800 dark:active:ring-orange-200 btn-block"
                                >
                                    <Eye />
                                    Details
                                </Button>
                            </DropdownMenuItem>

                            {agency.status == "for approval" ? (
                                <>
                                    <DropdownMenuItem className="space-x-2 flex justify-between">
                                        <VerifyAgency
                                            agencyData={{
                                                id: agency.id,
                                                status: "activated",
                                            }}
                                            label="Approve"
                                            className="btn btn-block btn-success"
                                            formClassName="w-full"
                                            icon={<CheckIcon />}
                                        />
                                    </DropdownMenuItem>
                                    <div className="px-2 flex justify-between">
                                        <RejectDialog
                                            agencyId={agency.id}
                                            className="w-full btn-error"
                                        />
                                    </div>
                                </>
                            ) : (
                                ""
                            )}
                            {agency.status == "activated" ? (
                                <DropdownMenuItem className="space-x-2">
                                    <VerifyAgency
                                        agencyData={{
                                            id: agency.id,
                                            status: "deactivated",
                                        }}
                                        label="Deactivate"
                                        className="btn btn-block btn-warning hover:text-warning"
                                        formClassName="w-full"
                                        icon={<XIcon />}
                                    />
                                </DropdownMenuItem>
                            ) : (
                                ""
                            )}
                            {agency.status == "deactivated" ? (
                                <DropdownMenuItem className="space-x-2">
                                    <VerifyAgency
                                        agencyData={{
                                            id: agency.id,
                                            status: "activated",
                                        }}
                                        label="Activate"
                                        className="btn btn-block btn-success"
                                        formClassName="w-full"
                                        icon={<CheckIcon />}
                                    />
                                </DropdownMenuItem>
                            ) : (
                                ""
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardTitle>Update Agency</CardTitle>
                <CardDescription className="mt-2">
                    <div>Update agency details.</div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        id="form-modal"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-2 flex flex-wrap gap-3 justify-center"
                    >
                        <div className="w-full md:w-min">
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
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>

                                            <CustomAvatar
                                                avatar={avatar}
                                                whenClick={handleImageClick}
                                                className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px]"
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
                        </div>
                        <Card className="px-4 py-5 space-y-5 bg-gray-100 flex-1 md:min-w-[400px]">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <InlineLabel>
                                            Agency Name: *
                                        </InlineLabel>
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
                                        <InlineLabel>
                                            Contact Number: *
                                        </InlineLabel>
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

                                        <FieldError
                                            field={errors?.agency_email}
                                        />
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
                                            field: {
                                                onChange,
                                                value,
                                                name,
                                                ref,
                                            },
                                        }) => {
                                            const cityProvincesOptions = [
                                                {
                                                    label: "NCR",
                                                    options: city_provinces
                                                        .filter(
                                                            (loc) => loc.is_ncr
                                                        )
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
                                                            option.value ===
                                                            value
                                                    ) || null;

                                            return (
                                                <CreatableSelectNoSSR
                                                    name={name}
                                                    ref={ref}
                                                    placeholder="Area "
                                                    value={selectedOption}
                                                    onChange={(
                                                        selectedOption
                                                    ) => {
                                                        setSelectedProvince(
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
                                                        cityProvincesOptions
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
                                    <InlineLabel>
                                        City/Municipality: *
                                    </InlineLabel>
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
                                                            option.value ===
                                                            value
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
                                    <FieldError
                                        field={errors?.city_municipality}
                                    />
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
                                                            option.value ===
                                                            value
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
                                                        options={
                                                            barangayOptions
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
                                            <select
                                                className="w-full dark:bg-inherit"
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
                                                    "others",
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
                        </Card>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
