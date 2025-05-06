"use client";

import { useEffect, useState } from "react";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReportsSchema } from "@lib/zod/reportSchema";

import FirstForm from "./FirstForm";
import SecondForm from "./SecondForm";
import ThirdForm from "./ThirdForm";
import FourthForm from "./FourthForm";
import FifthForm from "./FifthForm";
import ConfirmationPage from "./ConfirmationPage";

import clsx from "clsx";
import notify from "@components/ui/notify";
import { Card } from "@components/ui/card";

const form_sections = [
    {
        title: "Patient Details",
        class: "progress-info",
        percent: 10,
        bg: "/bg-3.jpg",
    },
    {
        title: "Medication Error Details 1",
        class: "progress-info",
        percent: 30,
        bg: "/bg-4.jpg",
    },
    {
        title: "Medication Error Details 2",
        class: "progress-info",
        percent: 50,
        bg: "/bg-5.jpg",
    },
    {
        title: "Medication Error Details 3",
        class: "progress-info",
        percent: 70,
        bg: "/bg-6.jpg",
    },
    {
        title: "Medication Error Details 4",
        class: "progress-info",
        percent: 90,
        bg: "/bg-1.jpg",
    },
    {
        title: "Confirm",
        class: "progress-success",
        percent: 100,
        bg: "/bg-2.jpg",
    },
];

export default function ReportForm({
    error_types,
    generic_medicines,
    medicine_routes,
    setIsProceedForm,
}) {
    const methods = useForm({
        mode: "onChange",
        resolver: zodResolver(createReportsSchema),
        defaultValues: {
            report_date: new Date().toISOString().slice(0, 10),
            error_date: new Date().toISOString().slice(0, 10),
            error_type_id: "",
            other_error_type: "",
            patient_age: "",
            patient_weight: "",
            patient_height: "",
            height_unit: "cm",
            weight_unit: "kg",
            converted_weight: "",
            converted_height: "",
            exact_prescription: "",
            incident_description: "",
            workplace_environment: "",
            patient_condition: "",
            immediate_actions: "",
            corrective_actions: "",
            preventive_actions: "",
            // exact_prescription:
            //     "The doctor prescribed Amoxicillin 500 mg tablets to be taken twice daily for 7 days to treat a bacterial infection.",
            // incident_description:
            //     "During administration, the nurse mistakenly gave the patient 500 mg of Ibuprofen instead of the prescribed Amoxicillin 500 mg due to a labeling error in the medication storage area.",
            // workplace_environment:
            //     "Before the incident, the workplace was moderately busy, with staff multitasking to handle patient check-ins and medication preparation. During the incident, there was a rush to meet patient schedules, and the storage area was poorly lit and disorganized.After the incident, the staff became aware of the error and immediately stopped further medication administration to other patients, reviewing all prescription records.",
            // patient_condition:
            //     "Before: The patient was experiencing mild symptoms of bacterial infection, including a sore throat and mild fever.During: After receiving the incorrect medication (Ibuprofen), the patient reported dizziness and stomach upset.After: The patient's bacterial infection persisted, requiring additional medical intervention.",
            // immediate_actions:
            //     "The nurse immediately informed the attending physician, documented the error in the patient record, and monitored the patient for adverse reactions to Ibuprofen. The correct medication was then administered promptly.",
            // corrective_actions:
            //     "The storage area for medications was reorganized to ensure clear labeling of all drugs. Staff received additional training on medication verification processes to prevent future errors.",
            // preventive_actions:
            //     "Introduced a barcode scanning system to verify medications before administration, ensuring the correct match between prescription and drug. Conducted regular audits of medication storage and administration procedures.",
            medicines: [
                {
                    medicine_generic_id: null,
                    medicine_route_id: null,
                    // other_generic_medicine: "",
                    // other_medicine_route: "",
                },
            ],
        },
    });
    const {
        watch,
        reset,
        formState: { errors },
    } = methods;

    // const validInput = {
    //     report_date: "2025-05-01",
    //     error_date: "2025-05-01",
    //     patient_age: 30,
    //     patient_sex: "male",
    //     patient_weight: 70,
    //     patient_height: "170",
    //     age_unit: "Year",
    //     weight_unit: "kg",
    //     height_unit: "cm",
    //     exact_prescription: "Amoxicillin 500mg",
    //     error_type_id: 1,
    //     selected_error_type: `{"value":"Others","label":"Others","id":13,"is_medicine_needed":false}`,
    //     incident_description: "Incorrect dosage administered.",
    //     workplace_environment: "Busy hospital ward.",
    //     patient_condition: "Stable.",
    //     immediate_actions: "Stopped medication.",
    //     corrective_actions: "Correct dosage administered.",
    //     // preventive_actions: "Staff training.",
    //     medicines: [
    //         {
    //             medicine_generic_id: null,
    //             medicine_route_id: null,
    //             other_generic_medicine: "",
    //             other_medicine_route: "",
    //         },
    //     ],
    // };

    // const invalidInput = {
    //     ...validInput,
    //     error_type_id: "13", // "Other" error type
    //     other_error_type: "", // Should trigger superRefine error
    // };

    // const result = createReportsSchema.safeParse(invalidInput);
    // console.log("debug errorsssssss", result?.error?.flatten().fieldErrors);
    // useEffect(() => {
    //     console.log("global watch>>>>>>>>>", watch());
    //     console.log("global errors>>>>>>>>>", errors);
    // console.log("createReportsSchema", result.error.format());
    // console.log("createReportsSchema", result.error.format());
    // }, [watch()]);

    const [errorTypeOptions, setErrorTypeOptions] = useState([]);
    const [selectedErrorType, setSelectedErrorType] = useState({});
    const [genericMedicineOptions, setGenericMedicineOptions] = useState([]);
    const [medicineRouteOptions, setMedicineRouteOptions] = useState([]);
    const [sectionNo, setSectionNo] = useState(0);

    const handleNext = (n) => {
        setSectionNo((prev) => prev + n);
    };

    const handleReset = () => {
        setSectionNo(0);
        reset();
    };

    useEffect(() => {
        if (error_types && !error_types.error) {
            setErrorTypeOptions(
                error_types.map((type) => ({
                    value: type.name,
                    label: type.name,
                    id: type.id,
                    is_medicine_needed: type.is_medicine_needed,
                }))
            );
            return;
        }
        notify({ error: true, message: error_types.message }, "error");
        setIsProceedForm(false);
    }, [error_types]);

    useEffect(() => {
        if (generic_medicines && !generic_medicines.error) {
            setGenericMedicineOptions(
                generic_medicines.map((type) => ({
                    value: type.name,
                    label: type.name,
                    id: type.id,
                }))
            );
            return;
        }
        notify({ error: true, message: generic_medicines.message }, "error");
        setIsProceedForm(false);
    }, [generic_medicines]);

    useEffect(() => {
        if (medicine_routes && !medicine_routes.error) {
            setMedicineRouteOptions(
                medicine_routes.map((type) => ({
                    value: type.name,
                    label: type.name,
                    id: type.id,
                }))
            );
            return;
        }
        notify({ error: true, message: medicine_routes.message }, "error");
        setIsProceedForm(false);
    }, [medicine_routes]);

    return (
        <>
            <div
                className={`absolute inset-0 bg-no-repeat bg-center bg-cover opacity-50 pointer-events-none z-0 shadow-2xl rounded`}
                style={{
                    backgroundImage: `url('${form_sections[sectionNo].bg}')`,
                }}
                aria-hidden="true"
            />
            <Card className="static card w-full h-full sm:w-3/4 shadow-[5px_5px_0px_0px_rgba(0,_0,_0,_0.5),inset_0px_2px_4px_0px_rgba(0,_0,_0,_0.3)] opacity-85">
                <div className="relative p-5 pb-0 w-3/4 mx-auto">
                    <progress
                        className={clsx(
                            "progress h-5",
                            form_sections[sectionNo].class
                        )}
                        value={form_sections[sectionNo].percent}
                        max="100"
                    ></progress>
                    {/* <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  font-bold">
                        {form_sections[sectionNo].percent}%
                    </span> */}
                </div>
                {/* <div className="flex pt-2 justify-center items-center dark:bg-slate-800 ">
                    <ul className="steps ">
                        {form_sections.map((sec, i) => (
                            <li
                                key={i}
                                className={clsx(
                                    "step px-2",
                                    i <= sectionNo && sec.class
                                )}
                            // onClick={() => setSectionNo(i)}
                            >
                                <small className="italic">{sec.title}</small>
                            </li>
                        ))}
                    </ul>
                </div> */}
                <div className="card-body">
                    <FormProvider {...methods}>
                        <form className="sm:px-5 rounded-lg h-full">
                            {sectionNo == 0 ? (
                                <FirstForm
                                    setIsProceedForm={setIsProceedForm}
                                    onNext={handleNext}
                                />
                            ) : (
                                ""
                            )}

                            {sectionNo == 1 ? (
                                <SecondForm
                                    errorTypeOptions={errorTypeOptions}
                                    selectedErrorType={selectedErrorType}
                                    setSelectedErrorType={setSelectedErrorType}
                                    genericMedicineOptions={
                                        genericMedicineOptions
                                    }
                                    medicineRouteOptions={medicineRouteOptions}
                                    onNext={handleNext}
                                />
                            ) : (
                                ""
                            )}

                            {sectionNo == 2 ? (
                                <ThirdForm onNext={handleNext} />
                            ) : (
                                ""
                            )}

                            {sectionNo == 3 ? (
                                <FourthForm onNext={handleNext} />
                            ) : (
                                ""
                            )}

                            {sectionNo == 4 ? (
                                <FifthForm onNext={handleNext} />
                            ) : (
                                ""
                            )}

                            {sectionNo == 5 ? (
                                <ConfirmationPage
                                    onNext={handleNext}
                                    resetForm={handleReset}
                                    methods={methods}
                                    genericMedicineOptions={
                                        genericMedicineOptions
                                    }
                                    medicineRouteOptions={medicineRouteOptions}
                                />
                            ) : (
                                ""
                            )}
                        </form>
                    </FormProvider>
                </div>
            </Card>
        </>
    );
}
