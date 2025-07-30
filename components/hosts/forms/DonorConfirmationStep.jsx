"use client";
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { CardContent } from '@components/ui/card';
import { IoArrowUndoCircle } from 'react-icons/io5';
import { Send } from 'lucide-react';
import { getBloodTypes } from '@action/bloodTypeAction';
import { format } from 'date-fns';

const DetailItem = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b">
        <span className="font-semibold text-gray-600">{label}</span>
        <span className="text-gray-800">{value || 'N/A'}</span>
    </div>
);

export default function DonorConfirmationStep({ onNext, isPending }) {
    const { watch, getValues } = useFormContext();
    const values = getValues();

    const { data: bloodTypes, isLoading: bloodTypesLoading } = useQuery({
        queryKey: ["blood_types"],
        queryFn: getBloodTypes,
        staleTime: Infinity,
    });

    const bloodTypeId = watch("blood_type_id");
    const bloodTypeLabel = bloodTypes?.find(bt => bt.id == bloodTypeId)?.blood_type || 'N/A';

    if (bloodTypesLoading) {
        return <p>Loading...</p>;
    }

    return (
        <CardContent>
            <h3 className="text-lg font-semibold mb-4 text-center">Please review your information</h3>
            <div className="space-y-2">
                <DetailItem label="Date of Birth" value={format(new Date(values.date_of_birth), 'MMMM d, yyyy')} />
                <DetailItem label="Civil Status" value={values.civil_status} />
                <DetailItem label="Nationality" value={values.nationality} />
                <DetailItem label="Occupation" value={values.occupation} />
                <DetailItem label="Address" value={`${values.address}, ${values.barangay}, ${values.city_municipality}, ${values.province}`} />
                <DetailItem label="Regular Donor" value={values.is_regular_donor ? 'Yes' : 'No'} />
                {values.is_regular_donor && (
                    <>
                        <DetailItem label="Blood Type" value={bloodTypeLabel} />
                        <DetailItem label="Last Donation Date" value={format(new Date(values.last_donation_date), 'MMMM d, yyyy')} />
                    </>
                )}
            </div>
            <div className="flex-none card-actions justify-between mt-8">
                <button type="button" onClick={() => onNext(-1)} className="btn btn-default" tabIndex={-1}>
                    <IoArrowUndoCircle /> <span className="hidden sm:inline-block">Back</span>
                </button>
                <button type="submit" className="btn btn-success" disabled={isPending}>
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
