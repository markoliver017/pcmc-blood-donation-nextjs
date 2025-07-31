"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { CardContent } from "@components/ui/card";
import { IoArrowUndoCircle } from "react-icons/io5";
import { Send } from "lucide-react";
import { getBloodTypes } from "@action/bloodTypeAction";
import { format } from "date-fns";
import { safeFormatDate } from "@lib/utils/date.utils";
import ImagePreviewComponent from "@components/reusable_components/ImagePreviewComponent";
import { formatFormalName } from "@lib/utils/string.utils";

const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b">
        <span className="font-semibold text-gray-600">{label}</span>
        <span className="text-gray-800">{value || "N/A"}</span>
    </div>
);

export default function DonorConfirmationStep({ onNext, isPending }) {
    const { getValues } = useFormContext();
    const values = getValues();

    const uploaded_file = values?.file
        ? URL.createObjectURL(values?.file)
        : null;

    return (
        <CardContent>
            <h3 className="text-lg font-semibold mb-4 text-center">
                Please review your information
            </h3>
            <div className="space-y-2">
                {uploaded_file && (
                    <DetailItem
                        label="Uploaded Gov't ID"
                        value={<ImagePreviewComponent imgSrc={uploaded_file} />}
                    />
                )}
                <DetailItem
                    label="Date of Birth"
                    value={safeFormatDate(values?.date_of_birth)}
                />
                <DetailItem
                    label="Civil Status"
                    value={formatFormalName(values.civil_status)}
                />
                <DetailItem
                    label="Contact Number"
                    value={`(+63) ${values.contact_number}`}
                />
                <DetailItem label="Nationality" value={values.nationality} />
                <DetailItem label="Occupation" value={values.occupation} />
                <DetailItem
                    label="Address"
                    value={`${values.address}, ${values.barangay}, ${values.city_municipality}, ${values.province}`}
                />
                <DetailItem
                    label="Regular Donor"
                    value={values.is_regular_donor ? "Yes" : "No"}
                />
                {values.is_regular_donor && (
                    <>
                        <DetailItem
                            label="Blood Type"
                            value={values.blood_type_label}
                        />
                        <DetailItem
                            label="Last Donation Date"
                            value={safeFormatDate(
                                values?.donation_history_donation_date || ""
                            )}
                        />
                        <DetailItem
                            label="Blood Service Facility"
                            value={values?.blood_service_facility || "N/A"}
                        />
                    </>
                )}
            </div>
            <div className="flex-none card-actions justify-between mt-8">
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
                    type="submit"
                    className="btn btn-success"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <span className="loading loading-bars loading-xs"></span>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send /> Submit
                        </>
                    )}
                </button>
            </div>
        </CardContent>
    );
}
