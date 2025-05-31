"use client";
import CustomAvatar from '@components/reusable_components/CustomAvatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { fetchAgencyByStatus } from '@/action/agencyAction';
import Skeleton_user from '@components/ui/Skeleton_user';
import { useQuery } from '@tanstack/react-query'
import { formatFormalName } from '@lib/utils/string.utils';
import moment from 'moment';
import ApprovalRejectComponent from '@components/organizers/ApprovalRejectComponent';


export default function ForApprovalAgencyList() {

    const { data: agencies, isLoading: agencyIsFetching } = useQuery({
        queryKey: ["agencies", "for approval"],
        queryFn: async () => fetchAgencyByStatus("for approval"),
        staleTime: 10 * 60 * 1000,
        cacheTime: 20 * 60 * 1000,
    });

    if (agencyIsFetching) return (
        <>
            <Skeleton_user />
            <Skeleton_user />
            <Skeleton_user />
        </>
    );

    return (
        <>
            {agencies.map((agency) => (

                <Card key={agency.id} className="hover:ring-2 hover:ring-blue-400 group transition shadow-lg/40">
                    <CardHeader>
                        <CardTitle className="flex flex-wrap justify-between">
                            <span className='text-xl'>{agency.name}</span>
                            <span className='text-sm text-slate-600'>{moment(agency.createdAt).format("MMM DD, YYYY")}</span>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap flex-col gap-1">
                            <div className='flex justify-between'>

                                <span>{formatFormalName(agency.organization_type)}</span>
                                <ApprovalRejectComponent agency={agency} />

                            </div>
                            <span>{agency.agency_address}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-center gap-4 px-2 md:px-15 transform transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-110">
                        <div>
                            <CustomAvatar
                                avatar={agency?.file_url || "/default_company_avatar.png"}
                                className="flex-none w-[150px] h-[150px] "
                            />
                        </div>
                        <div className='md:flex-1 flex flex-col gap-2'>
                            <span className='text-lg text-slate-800 font-semibold'>{agency.head.full_name}</span>
                            <span className='text-blue-700 italic'>{agency.head.email.toLowerCase()}</span>
                            <span className=' text-slate-700 italic'>{agency.contact_number}</span>


                        </div>
                    </CardContent>
                </Card>

            ))}
        </>
    )
}
