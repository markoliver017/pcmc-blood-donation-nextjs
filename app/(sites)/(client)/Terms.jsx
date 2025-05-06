"use client";

import { Card } from "@components/ui/card";
import SweetAlert from "@components/ui/SweetAlert";
import clsx from "clsx";
import React, { use, useState } from "react";
import { FaWpforms } from "react-icons/fa";
import { HiMiniInformationCircle } from "react-icons/hi2";
import ReportForm from "./ReportForm";
import { FileArchive } from "lucide-react";
import Link from "next/link";

export default function Terms({
    fetch_error_types,
    fetch_generic_medicines,
    fetch_medicine_routes,
}) {
    const error_types = use(fetch_error_types);
    const generic_medicines = use(fetch_generic_medicines);
    const medicine_routes = use(fetch_medicine_routes);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isProceedForm, setIsProceedForm] = useState(false);

    if (isProceedForm == false) {
        return (
            <div className="h-full flex justify-center items-center relative p-5">
                <div
                    className="absolute inset-0 bg-[url('/bg-2.jpg')] bg-no-repeat bg-center bg-cover opacity-50 pointer-events-none z-0 shadow-2xl rounded"
                    aria-hidden="true"
                />
                {/* Terms Section */}
                <Card className="w-full md:w-3/4 min-h-[30vh] z-10 opacity-85">
                    <div className="card-body text-lg">
                        <h2 className="card-title text-2xl">
                            <FileArchive /> Confidentiality
                        </h2>

                        <p>
                            Please be assured that all information submitted to
                            the{" "}
                            <b className="italic font-semibold">
                                PCMC Integrated National Medication Error
                                Reporting System
                            </b>{" "}
                            will be kept strictly confidential. We do not
                            collect sensitive personal identifiers of the
                            reporter, the patient, or PCMC. The data you provide
                            will be securely protected and accessible only to
                            authorized personnel involved in analyzing and
                            following up on reported incidents. The information
                            collected is used solely to improve medication
                            safety and prevent future errors. Reports will never
                            be used for punitive actions against healthcare
                            professionals or patients. We encourage open and
                            honest reporting in a safe environment to promote a
                            culture of safety and continuous improvement.
                        </p>
                        <p>
                            If you require medication error data for academic,
                            quality improvement, or patient safety purposes, you
                            will need to provide some personal and professional
                            information. Please complete and submit a request on{" "}
                            <Link href="/request" className="link link-primary">
                                Medication Error Data Request Form
                            </Link>
                            {", "}
                            then wait for our response. Thank you.
                        </p>

                        <p className="mt-5">
                            <label className="label cursor-pointer font-semibold w-full truncate text-xs md:text-base">
                                <input
                                    type="checkbox"
                                    className="checkbox border-indigo-600 bg-orange-300 checked:bg-green-400 checked:text-green-800 checked:border-green-800"
                                    checked={isAccepted}
                                    onChange={(e) => {
                                        setIsAccepted(e.target.checked);
                                    }}
                                />
                                I accept the confidentiality agreement
                            </label>
                        </p>
                        <div className="card-actions justify-center">
                            <button
                                aria-disabled={!isAccepted}
                                className={clsx(
                                    "btn w-full truncate text-xs md:text-base",
                                    isAccepted
                                        ? "btn-primary"
                                        : "btn-gray text-gray-500 cursor-not-allowed"
                                )}
                                // className="btn btn-gray text-gray-500 hover:cursor-not-allowed"
                                onClick={() => {
                                    if (!isAccepted) {
                                        SweetAlert({
                                            title: "Confidentiality Agreement",
                                            text: "Please accept the confidentiality agreement to proceed.",
                                            icon: "warning",
                                        });
                                        return;
                                    }
                                    setIsProceedForm(true);
                                }}
                            >
                                {isAccepted ? (
                                    <>
                                        <FaWpforms /> Continue to Form
                                    </>
                                ) : (
                                    <>
                                        <HiMiniInformationCircle /> Please agree
                                        to the Confidentiality Agreement to
                                        continue.
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    } else {
        return (
            <div className="h-full flex justify-center items-center relative p-2">
                <ReportForm
                    error_types={error_types}
                    generic_medicines={generic_medicines}
                    medicine_routes={medicine_routes}
                    setIsProceedForm={setIsProceedForm}
                />
            </div>
        );
    }
}
