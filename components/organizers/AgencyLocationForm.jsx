"use client";
import { Controller, useFormContext } from "react-hook-form";

import notify from "@components/ui/notify";

import dynamic from "next/dynamic";
const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), {
    ssr: false,
});
import { getSingleStyle } from "@/styles/select-styles";

import {
    fetchBarangays,
    fetchCitiesMunicipalities,
    fetchluzonDemographics,
} from "@/action/locationAction";

import clsx from "clsx";
import { useEffect } from "react";
import { MdNextPlan } from "react-icons/md";
import { IoArrowUndoCircle } from "react-icons/io5";
import { FormField, FormItem } from "@components/ui/form";

import InlineLabel from "@components/form/InlineLabel";
import { Text } from "lucide-react";
import FieldError from "@components/form/FieldError";

import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import Skeleton_form from "@components/ui/Skeleton_form";
import Preloader3 from "@components/layout/Preloader3";
import CustomAvatar from "@components/reusable_components/CustomAvatar";

export default function AgencyLocationForm({ details, onNext }) {
    const { resolvedTheme } = useTheme();

    const { data: city_provinces, status: city_provinces_status } = useQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    const {
        trigger,
        control,
        watch,
        resetField,
        setValue,
        formState: { errors },
    } = useFormContext();

    const onSubmitNext = async () => {
        const valid = await trigger([
            "address",
            "barangay",
            "city_municipality",
            "province",
        ]);
        if (valid) {
            onNext(1);
        } else {
            notify(
                {
                    error: true,
                    message: "Please provide the required information..",
                },
                "warning"
            );
        }
    };

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

    useEffect(() => {
        if (!selected_province_option) return;
        const city_municipality = watch("city_municipality");
        if (
            !cities_municipalities?.find((cm) => cm.name == city_municipality)
        ) {
            resetField("city_municipality");
            resetField("barangay");
            setValue("selected_city_municipality_option", null);
        }
    }, [selected_province_option]);

    if (city_provinces_status != "success") {
        return <Skeleton_form />;
    }

    return (
        <>
            <Preloader3 />
            <Card className="p-0 md:p-5 bg-slate-100">
                <CardHeader className="text-2xl font-bold">
                    <CardTitle className="text-2xl">{details.title}</CardTitle>
                    <CardDescription>
                        <div>Please fill up all the * required fields.</div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-5">
                    <div className="flex-none text-center w-full md:w-max">
                        <CustomAvatar
                            avatar="/agency-location.png"
                            className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px]"
                        />
                    </div>
                    <div className="flex-1 md:min-w-[350px] flex flex-col justify-evenly">
                        <FormField
                            control={control}
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
                                            tabIndex={1}
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
                                                tabIndex={2}
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
                                                    tabIndex={2}
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
                                                    tabIndex={3}
                                                    isClearable
                                                />
                                            );
                                        }}
                                    />
                                </fieldset>
                                <FieldError field={errors?.barangay} />
                            </div>
                        )}
                        <div className="flex-none card-actions justify-between mt-5">
                            <button
                                onClick={() => onNext(-1)}
                                className="btn btn-default"
                                tabIndex={-1}
                            >
                                <IoArrowUndoCircle />{" "}
                                <span className="hidden sm:inline-block">
                                    Back
                                </span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={onSubmitNext}
                                tabIndex="6"
                            >
                                <MdNextPlan />{" "}
                                <span className="hidden sm:inline-block">
                                    Next
                                </span>
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
