"use client";
import { useQuery } from "@tanstack/react-query";
import ForApprovalDonorList from "../(index)/ForApprovalDonorList";
import { getHostDonorsByStatus } from "@/action/hostDonorAction";

export default function Page() {
    const { data: donorsForApproval, isLoading: donorsIsFetching } = useQuery({
        queryKey: ["donors", "for approval"],
        queryFn: async () => getHostDonorsByStatus("for approval"),
        staleTime: 0,
        cacheTime: 0,
    });
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-3 w-full">
                <ForApprovalDonorList
                    donors={donorsForApproval}
                    isFetching={donorsIsFetching}
                    avatarClassName="md:w-[150px] md:h-[150px]"
                />
            </div>
        </>
    );
}
