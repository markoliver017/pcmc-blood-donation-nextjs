"use client";
import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import { fetchBarangays, fetchCitiesMunicipalities, fetchluzonDemographics } from "@action/locationAction";
import { getSingleStyle } from "@/styles/select-styles";

import { CardContent } from "@components/ui/card";
import { FormField, FormItem } from "@components/ui/form";
import InlineLabel from "@components/form/InlineLabel";
import FieldError from "@components/form/FieldError";
import Skeleton_form from "@components/ui/Skeleton_form";
import { Text } from "lucide-react";
import { MdNextPlan } from "react-icons/md";
import { IoArrowUndoCircle } from "react-icons/io5";
import clsx from "clsx";
import notify from "@components/ui/notify";

const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), { ssr: false });

export default function DonorLocationForm({ onNext }) {
    const { resolvedTheme } = useTheme();
    const {
        trigger,
        control,
        watch,
        resetField,
        setValue,
        formState: { errors },
    } = useFormContext();

    const { data: city_provinces, status: city_provinces_status } = useQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
        staleTime: Infinity,
    });

    const selected_province_option = watch("province");
    const { data: cities_municipalities, isFetching: cities_isFetching } = useQuery({
        queryKey: ["cities_municipalities", selected_province_option],
        queryFn: () => fetchCitiesMunicipalities({ province: selected_province_option }),
        enabled: !!selected_province_option,
        staleTime: Infinity,
    });

    const selected_city_municipality_option = watch("city_municipality");
    const { data: barangays, isFetching: brgy_isFetching } = useQuery({
        queryKey: ["barangays", selected_city_municipality_option],
        queryFn: () => fetchBarangays({ city: selected_city_municipality_option }),
        enabled: !!selected_city_municipality_option,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (!selected_province_option) return;
        resetField("city_municipality");
        resetField("barangay");
    }, [selected_province_option, resetField]);
    
    useEffect(() => {
        if (!selected_city_municipality_option) return;
        resetField("barangay");
    }, [selected_city_municipality_option, resetField]);


    const onSubmitNext = async () => {
        const valid = await trigger(["address", "barangay", "city_municipality", "province", "region"]);
        if (valid) {
            onNext(1);
        } else {
            notify({ error: true, message: "Please provide the required information.." }, "warning");
        }
    };

    if (city_provinces_status !== "success") {
        return <Skeleton_form />;
    }

    const provinceOptions = city_provinces.provinces.map(p => ({ label: p.name, value: p.name }));
    const cityOptions = cities_municipalities?.map(c => ({ label: c.name, value: c.name })) || [];
    const barangayOptions = barangays?.map(b => ({ label: b.name, value: b.name })) || [];

    return (
        <CardContent className="flex flex-col gap-5">
            <FormField
                control={control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <InlineLabel>House No./Street/Subdivision: </InlineLabel>
                        <label className={clsx("input w-full mt-1", errors?.address ? "input-error" : "input-info")}>
                            <Text className="h-3" />
                            <input type="text" placeholder="Enter your address" {...field} />
                        </label>
                        <FieldError field={errors?.address} />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="region"
                render={({ field }) => (
                    <FormItem>
                        <InlineLabel>Region: </InlineLabel>
                        <input type="text" className="input input-bordered w-full" disabled {...field} value="Region III (Central Luzon)" />
                    </FormItem>
                )}
            />

            <Controller
                control={control}
                name="province"
                render={({ field: { onChange, value, name, ref } }) => (
                    <FormItem>
                        <InlineLabel>Province: </InlineLabel>
                        <CreatableSelectNoSSR
                            name={name} ref={ref} placeholder="Select Province"
                            value={provinceOptions.find(option => option.value === value) || null}
                            onChange={selectedOption => onChange(selectedOption ? selectedOption.value : null)}
                            options={provinceOptions} styles={getSingleStyle(resolvedTheme)} isValidNewOption={() => false}
                        />
                        <FieldError field={errors?.province} />
                    </FormItem>
                )}
            />

            <Controller
                control={control}
                name="city_municipality"
                render={({ field: { onChange, value, name, ref } }) => (
                    <FormItem>
                        <InlineLabel>City/Municipality: </InlineLabel>
                        <CreatableSelectNoSSR
                            name={name} ref={ref} placeholder="Select City/Municipality"
                            value={cityOptions.find(option => option.value === value) || null}
                            onChange={selectedOption => onChange(selectedOption ? selectedOption.value : null)}
                            options={cityOptions} styles={getSingleStyle(resolvedTheme)} isValidNewOption={() => false}
                            isDisabled={!selected_province_option || cities_isFetching}
                            isLoading={cities_isFetching}
                        />
                        <FieldError field={errors?.city_municipality} />
                    </FormItem>
                )}
            />

            <Controller
                control={control}
                name="barangay"
                render={({ field: { onChange, value, name, ref } }) => (
                    <FormItem>
                        <InlineLabel>Barangay: </InlineLabel>
                        <CreatableSelectNoSSR
                            name={name} ref={ref} placeholder="Select Barangay"
                            value={barangayOptions.find(option => option.value === value) || null}
                            onChange={selectedOption => onChange(selectedOption ? selectedOption.value : null)}
                            options={barangayOptions} styles={getSingleStyle(resolvedTheme)} isValidNewOption={() => false}
                            isDisabled={!selected_city_municipality_option || brgy_isFetching}
                            isLoading={brgy_isFetching}
                        />
                        <FieldError field={errors?.barangay} />
                    </FormItem>
                )}
            />

            <div className="flex-none card-actions justify-between mt-5">
                <button type="button" onClick={() => onNext(-1)} className="btn btn-default" tabIndex={-1}>
                    <IoArrowUndoCircle /> <span className="hidden sm:inline-block">Back</span>
                </button>
                <button type="button" className="btn btn-primary" onClick={onSubmitNext}>
                    <MdNextPlan /> <span className="hidden sm:inline-block">Next</span>
                </button>
            </div>
        </CardContent>
    );
}
