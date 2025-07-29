import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getDonorById } from "@/action/donorAction";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import ShowDonor from "@components/donors/ShowDonor";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { IoInformation } from "react-icons/io5";
import { MdDetails } from "react-icons/md";

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["donor", id],
        queryFn: async () => await getDonorById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <WrapperHeadMain
                icon={<IoInformation />}
                pageTitle="Donor Information"
                breadcrumbs={[
                    {
                        path: "/portal/admin/donors",
                        icon: <User className="w-4" />,
                        title: "Appointments",
                    },
                    {
                        path: `/portal/admin/donors/${id}`,
                        icon: <MdDetails className="w-4" />,
                        title: "Donor Information",
                    },
                ]}
            />
            <div className="w-full md:w-8/10 2xl:w-3/4 mx-auto relative pb-10">
                <Link
                    href="/portal/admin/donors"
                    className="absolute top-5 right-4"
                >
                    <button
                        className="btn btn-circle btn-default w-max p-3"
                        tabIndex={-1}
                    >
                        <ArrowLeft />
                        <span className="hidden sm:inline-block">
                            Back
                        </span>{" "}
                    </button>
                </Link>
                <ShowDonor donorId={id} />
            </div>
        </HydrationBoundary>
    );
}
