import { fetchAgency, fetchAgencyByName } from "@/action/agencyAction";
import NewDonorForm from "@components/donors/NewDonorForm";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { formatFormalName } from "@lib/utils/string.utils";
import { Calendar, DropletIcon, HomeIcon, Pen, User, User2 } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { redirect } from "next/navigation";
import { BiBuildings } from "react-icons/bi";

export default async function page({ params }) {
    const { agency_id } = await params;
    const agency = await fetchAgency(agency_id);

    if (!agency) {
        redirect("/organizers");
    }

    return (
        <>
            <WrapperHeadMain
                icon={<User />}
                pageTitle="Donor Registration"
                breadcrumbs={[
                    { path: "/", icon: <HomeIcon className="w-4" />, title: "Home" },
                    { path: "/organizers", icon: <BiBuildings className="w-4" />, title: "Agencies" },
                    { path: `/organizers/${agency_id}/register`, icon: <Pen className="w-4" />, title: "Donor Registration" },
                ]}
            />
            <div className="w-full h-full xl:w-8/10 2xl:w-7/10 mx-auto p-5 relative">
                <Card className="p-3 shadow-lg/60 bg-slate-100">
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex px-5 gap-3 rounded-2xl w-full">
                            {/* Avatar + Agency Name */}
                            <div>
                                <Image
                                    width={150}
                                    height={150}
                                    className="w-full rounded-md object-cover border"
                                    src={
                                        agency.file_url ||
                                        "/default_company_avatar.png"
                                    }
                                    alt="Agency Avatar"
                                />
                            </div>
                            <div className="flex flex-col justify-center flex-1">

                                <h2 className="text-2xl font-bold">
                                    {agency.name.toUpperCase()}
                                </h2>
                                {/* Agency Details */}
                                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-5">
                                    <div>
                                        <span className="font-semibold">
                                            Email Address:{" "}
                                        </span>
                                        <span>{agency.head.email}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Address: </span>
                                        <span>
                                            {agency.agency_address}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Registration form */}
                        <div className="flex-1">

                            <NewDonorForm role_name="Donor" />
                        </div>

                    </CardContent>
                </Card >
            </div >
            {/* <pre>{JSON.stringify(agency, null, 3)}</pre> */}
        </>
    );
}


