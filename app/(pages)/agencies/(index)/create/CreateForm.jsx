"use client"
import { fetchluzonDemographics } from '@/action/agencyAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import React from 'react'

export default function CreateForm() {
    const { resolvedTheme } = useTheme();
    const queryClient = useQueryClient();
    const { data: city_provinces, status } = useQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
    const { data, mutate, error, isError, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await createUser(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: () => {
            /** note: the return data will be accessible in the debugger
             *so no need to console the onSuccess(data) here **/
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["users"] });
            SweetAlert({
                title: "Submission Successful",
                text: "New user has been successfully created.",
                icon: "success",
                confirmButtonText: "Done",
                onConfirm: reset,
            });
        },
        onError: (error) => {
            // Handle validation errors
            if (error?.type === "validation" && error?.errorArr.length) {
                let detailContent = "";
                const { errorArr: details, message } = error;

                detailContent = (
                    <ul className="list-disc list-inside">
                        {details.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                );
                notify({
                    error: true,
                    message: (
                        <div tabIndex={0} className="collapse">
                            <input type="checkbox" />
                            <div className="collapse-title font-semibold">
                                {message}
                                <br />
                                <small className="link link-warning">
                                    See details
                                </small>
                            </div>
                            <div className="collapse-content text-sm">
                                {detailContent}
                            </div>
                        </div>
                    ),
                });
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

    const cityProvincesOptions = city_provinces.map((loc) => ({
        value: loc.name,
        label: loc.name,
        code: loc.code,
        is_ncr: loc?.is_ncr || false
    }))

    console.log("cityProvincesOptions", cityProvincesOptions);

    return (
        <div>
            <h1>Create Agency</h1>
        </div>
    )
}
