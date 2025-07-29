"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, Users2Icon } from "lucide-react";
import Skeleton from "@components/ui/skeleton";
import { Card } from "@components/ui/card";
import {
    getAllAgencyOptions,
    getAllEventOptions,
} from "@/action/adminEventAction";
import {
    getAllBloodCollections,
    getAllDonorsBloodCollections,
} from "@/action/bloodCollectionAction";
import { BloodCollectionsDatatable } from "@components/admin/blood-collections/BloodCollectionsDatatable";
import { bloodCollectionColumns } from "../[donor_id]/bloodCollectionColumns";
import { DonorCollectionsDatatable } from "@components/admin/blood-collections/DonorCollectionsDatatable";
import { donorCollectionColumns } from "./donorCollectionColumns";

export default function BloodCollecitionList() {
    const queryClient = useQueryClient();

    const {
        data: blood_donations,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["blood_donations"],
        queryFn: async () => {
            const res = await getAllBloodCollections();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    const {
        data: donor_blood_collections,
        error: donorCollectionsError,
        isLoading: donorCollectionsLoading,
    } = useQuery({
        queryKey: ["donor_blood_collections"],
        queryFn: async () => {
            const res = await getAllDonorsBloodCollections();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    const {
        data: eventOptions,
        errorEvents,
        isLoadingEvents,
    } = useQuery({
        queryKey: ["all-event-options"],
        queryFn: async () => {
            const res = await getAllEventOptions();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    const {
        data: agencyOptions,
        errorAgency,
        isLoadingAgency,
    } = useQuery({
        queryKey: ["all-agency-options"],
        queryFn: async () => {
            const res = await getAllAgencyOptions();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    if (
        isLoading ||
        isLoadingEvents ||
        isLoadingAgency ||
        donorCollectionsLoading
    )
        return <Skeleton />;

    if (error)
        return <div className="alert alert-error">{JSON.stringify(error)}</div>;
    if (donorCollectionsError)
        return (
            <div className="alert alert-error">
                {JSON.stringify(donorCollectionsError)}
            </div>
        );
    if (errorEvents)
        return (
            <div className="alert alert-error">
                {JSON.stringify(errorEvents)}
            </div>
        );
    if (errorAgency)
        return (
            <div className="alert alert-error">
                {JSON.stringify(errorAgency)}
            </div>
        );

    return (
        <div>
            {blood_donations.length === 0 ? (
                <Card className="col-span-full flex flex-col justify-center items-center text-center py-16 ">
                    <Users2Icon className="w-12 h-12 mb-4 text-primary" />
                    <h2 className="text-xl font-semibold">
                        No Blood Donations yet
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Blood Donations will appear here.
                    </p>
                </Card>
            ) : (
                <>
                    <div className="absolute right-10 top-[-40]">
                        <button
                            className="btn btn-circle btn-warning"
                            onClick={() =>
                                queryClient.invalidateQueries({
                                    queryKey: ["blood_donations"],
                                })
                            }
                        >
                            <RefreshCcw className="h-4" />
                        </button>
                    </div>
                    <DonorCollectionsDatatable
                        columns={donorCollectionColumns}
                        data={donor_blood_collections}
                        isLoading={isLoading}
                        eventOptions={eventOptions}
                        agencyOptions={agencyOptions}
                    />
                </>
            )}
        </div>
    );
}
