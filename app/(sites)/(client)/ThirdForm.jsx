import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import FormLabel from "./FormLabel";

import { IoArrowUndoCircle } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { MdDone } from "react-icons/md";
import notify from "@components/ui/notify";

export default function ThirdForm({ onNext }) {
    const {
        register,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useFormContext();

    const handleNext = async () => {
        const valid = await trigger([
            "exact_prescription",
            "incident_description",
            "workplace_environment",
            // "patient_condition",
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

    return (
        <section className="dark:text-white flex-1 flex flex-col h-full">
            <div className="flex-1">

                <div className="flex flex-wrap sm:gap-5">
                    <h2 className="card-title text-2xl">
                        Medication Error Details
                    </h2>

                    <div className="text-orange-600 italic">* required fields</div>
                </div>

                <div className="mt-5">
                    <FormLabel labelText="Exact medication prescription as ordered for the patient: *" />
                    <fieldset className="fieldset">
                        <textarea
                            className="textarea h-24 w-full border border-gray-300"
                            placeholder="Medication prescription"
                            {...register("exact_prescription", {
                                required: "Medication prescription is required.",
                                minLength: {
                                    value: 3,
                                    message:
                                        "Medication prescription must be at least 3 characters long.",
                                },
                            })}
                        ></textarea>
                    </fieldset>
                    {errors.exact_prescription && (
                        <p className="text-red-500 text-sm flex-items-center">
                            <BiError />
                            {errors.exact_prescription?.message}
                        </p>
                    )}
                </div>
                <div className="mt-5">
                    <FormLabel labelText="Narrative description of the medication error incident: *" />
                    <fieldset className="fieldset">
                        <textarea
                            className="textarea h-24 w-full border border-gray-300"
                            placeholder="Your answer"
                            name="incident_description"
                            {...register("incident_description", {
                                required: "Incident description is required.",
                                minLength: {
                                    value: 3,
                                    message:
                                        "Incident description must be at least 3 characters long.",
                                },
                            })}
                        ></textarea>
                    </fieldset>
                    {errors.incident_description && (
                        <p className="text-red-500 text-sm flex-items-center">
                            <BiError />
                            {errors.incident_description?.message}
                        </p>
                    )}
                </div>

                <div className="mt-5">
                    <FormLabel labelText="Workplace environment description before, during, and after the medication error incident: *" />
                    <fieldset className="fieldset">
                        <textarea
                            className="textarea h-24 w-full border border-gray-300"
                            placeholder="Your answer"
                            name="workplace_environment"
                            {...register("workplace_environment", {
                                required:
                                    "Workplace environment description is required.",
                                minLength: {
                                    value: 3,
                                    message:
                                        "Workplace environment description must be at least 3 characters long.",
                                },
                            })}
                        ></textarea>
                    </fieldset>
                    {errors.workplace_environment && (
                        <p className="text-red-500 text-sm flex-items-center">
                            <BiError />
                            {errors.workplace_environment?.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="card-actions justify-between mt-5">
                <button
                    type="button"
                    onClick={() => onNext(-1)}
                    className="btn btn-default"
                    tabIndex={-1}
                >
                    <IoArrowUndoCircle />{" "}
                    <span className="hidden sm:inline-block">Back</span>
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary"
                >
                    <MdDone />{" "}
                    <span className="hidden sm:inline-block">Next</span>
                </button>
            </div>
        </section>
    );
}
