"use client";
import FormLabel from "./FormLabel";
import { Calendar, Cross } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { BiError, BiMaleFemale } from "react-icons/bi";
import { MdNextPlan } from "react-icons/md";
import notify from "@components/ui/notify";
import { GiCancel } from "react-icons/gi";
import clsx from "clsx";
import { useEffect } from "react";
import { createReportsSchema } from "@lib/zod/reportSchema";

const height_units = {
    cm: 1,
    m: 100,
    in: 0.393701,
    ft: 0.0328084,
};

const weight_units = {
    kg: 1,
    lb: 2.20462,
};

const age_units = ["Year", "Month", "Week", "Day", "Hour"];

export default function FirstForm({ setIsProceedForm, onNext }) {
    const {
        register,
        trigger,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const onSubmitNext = async () => {
        const valid = await trigger([
            "report_date",
            "error_date",
            "patient_sex",
            "patient_age",
            "patient_weight",
            "patient_height",
            "age_unit",
            "weight_unit",
            "height_unit",
            "converted_height",
            "converted_weight",
        ]);
        if (valid) {
            onNext(1);
        } else {
            notify(
                {
                    error: true,
                    message: "Please provide the necessary information..",
                },
                "warning"
            );
        }
    };

    const height = watch("patient_height");
    const heightUnitKey = watch("height_unit");
    const heightUnit = height_units[heightUnitKey];

    let converted = height || 0;
    if (!isNaN(height) && Number(height) > 0 && heightUnitKey != "cm") {
        converted = height * heightUnit;
    }
    const convertedHeightToolTip =
        heightUnitKey != "cm" ? `${converted} in cm` : "";

    const weight = watch("patient_weight");
    const weightUnitKey = watch("weight_unit");
    const weightUnit = weight_units[weightUnitKey];

    let convertedWeight = weight || 0;
    if (!isNaN(weight) && Number(weight) > 0 && weightUnitKey != "kg") {
        convertedWeight = weight * weightUnit;
    }
    const convertedWeightToolTip =
        weightUnitKey != "kg" ? `${convertedWeight} in kg` : "";

    useEffect(() => {
        setValue("converted_height", converted);
    }, [watch("patient_height"), watch("height_unit")]);

    useEffect(() => {
        setValue("converted_weight", convertedWeight);
    }, [watch("patient_weight"), watch("weight_unit")]);

    return (
        <section className="flex-1 h-full flex flex-col">
            <div className="flex-1">
                <div className="flex flex-wrap sm:gap-5">
                    <h2 className="card-title text-2xl">Patient Details</h2>
                    <div className="text-orange-600 italic">
                        * required fields
                    </div>
                </div>

                <div className="mt-5 hidden">
                    <FormLabel labelText="Report Date: <sup>default now</sup>" />
                    <label className="input mt-1 border border-gray-300 dark:text-white">
                        <Calendar className="h-3" />
                        <input
                            type="date"
                            {...register("report_date")}
                            readOnly
                        />
                    </label>
                    <p className="text-red-500 text-sm">
                        {errors.report_date && (
                            <span>{errors.report_date?.message}</span>
                        )}
                    </p>
                </div>
                <div className="mt-5 flex flex-wrap">
                    <FormLabel labelText="Date of the medication error happened: *" />

                    <label className="input validator mt-1 border w-full lg:w-96 border-gray-300 dark:text-white">
                        <Calendar className="h-3" />
                        <input
                            {...register("error_date")}
                            type="date"
                            tabIndex="1"
                        />
                    </label>
                </div>
                <div className="flex">
                    <FormLabel labelText="" />
                    {errors.error_date && (
                        <p className="text-red-500 text-sm flex-items-center">
                            <BiError />
                            {errors.error_date?.message}
                        </p>
                    )}
                </div>
                <div className="mt-5 flex items-center flex-wrap">
                    <FormLabel labelText="Sex of the patient: *" />
                    <div className="w-full lg:w-96">
                        <label className="select border border-gray-300 w-full dark:text-white">
                            <span className="label">
                                <BiMaleFemale />{" "}
                            </span>
                            <select
                                {...register("patient_sex", {
                                    required: "Patient sex is required.",
                                })}
                                tabIndex="2"
                            >
                                <option value="">Select here</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="unknown">Unknown</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div className="flex">
                    <FormLabel labelText="" />
                    {errors.patient_sex && (
                        <p className="text-red-500 text-sm w-full flex-items-center">
                            <BiError />
                            {errors.patient_sex?.message}
                        </p>
                    )}
                </div>

                {/****** Age ******/}
                <div className="mt-5 flex items-center flex-wrap">
                    <FormLabel labelText="Age of the patient: *" />
                    <div className="w-full lg:w-96">
                        <label className="input w-full border border-gray-300 dark:text-white">
                            <input
                                type="number"
                                {...register("patient_age")}
                                placeholder="Enter age"
                                tabIndex="3"
                                min={0}
                            />
                            <select
                                {...register("age_unit", {
                                    required: "Age unit measure is required.",
                                })}
                                className="dark:bg-inherit"
                                tabIndex={-1}
                            >
                                {age_units.map((u, i) => (
                                    <option key={i} value={u}>
                                        {u.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
                <div className="flex">
                    <FormLabel labelText="" />
                    {errors.patient_age && (
                        <p className="text-red-500 text-sm flex-items-center">
                            <BiError />
                            {errors.patient_age?.message}
                        </p>
                    )}
                </div>

                {/******* * Weight *********/}
                <div
                    className={clsx(
                        "flex flex-wrap items-center",
                        convertedWeightToolTip && "tooltip"
                    )}
                    data-tip={convertedWeightToolTip}
                >
                    <div className="mt-5 w-full flex items-center flex-wrap ">
                        <FormLabel labelText="Weight of the patient: *" />
                        <div className="w-full lg:w-96 ">
                            <label className="input w-full border border-gray-300 dark:text-white">
                                <input
                                    type="number"
                                    {...register("patient_weight")}
                                    placeholder="Enter weight"
                                    tabIndex="4"
                                    className="w-full"
                                    min={0}
                                />
                                <select
                                    {...register("weight_unit", {
                                        required: "Weight unit is required.",
                                    })}
                                    className="dark:bg-inherit"
                                    tabIndex={-1}
                                >
                                    {Object.keys(weight_units).map((w, i) => (
                                        <option key={i} value={w}>
                                            ({w.toUpperCase()})
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
                <input
                    type="hidden"
                    {...register("converted_weight")}
                    value={convertedWeight}
                />
                <div className="flex">
                    <FormLabel labelText="" />
                    {errors.patient_weight && (
                        <p className="text-red-500 text-sm flex-items-center">
                            <BiError />
                            {errors.patient_weight?.message}
                        </p>
                    )}
                </div>

                {/******* * Height *********/}
                <div
                    className={clsx(
                        "mt-5 flex flex-wrap items-center",
                        convertedHeightToolTip && "tooltip"
                    )}
                    data-tip={convertedHeightToolTip}
                >
                    <div>
                        <FormLabel labelText="Height of the patient: " />
                        <sup></sup>
                    </div>
                    <label className="input border border-gray-300 w-full lg:w-96 dark:text-white">
                        <input
                            type="text"
                            tabIndex="5"
                            {...register("patient_height")}
                            placeholder="Enter height or 'N/A' if not applicable."
                        />

                        <select
                            {...register("height_unit", {
                                required: "Height unit measure is required.",
                            })}
                            className="dark:bg-inherit"
                            tabIndex={-1}
                        >
                            {Object.keys(height_units).map((u, i) => (
                                <option key={i} value={u}>
                                    ({u.toUpperCase()})
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <input
                    type="hidden"
                    {...register("converted_height")}
                    value={converted}
                />
                <div className="flex">
                    <FormLabel labelText="" />
                    {errors.patient_height && (
                        <p className="text-red-500 text-sm flex items-start gap-1">
                            <BiError />
                            {errors.patient_height?.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex-none card-actions justify-between mt-5">
                <button
                    onClick={() => setIsProceedForm(false)}
                    className="btn btn-default"
                    tabIndex={-1}
                >
                    <GiCancel />{" "}
                    <span className="hidden sm:inline-block">Cancel</span>
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onSubmitNext}
                    tabIndex="6"
                >
                    <MdNextPlan />{" "}
                    <span className="hidden sm:inline-block">Next</span>
                </button>
            </div>
        </section>
    );
}
