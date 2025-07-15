import InterceptModal from "@components/layout/InterceptModal";
import { fetchAgency, fetchAgencyByName } from "@/action/agencyAction";
import NewDonorForm from "@components/donors/NewDonorForm";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Card, CardContent } from "@components/ui/card";
import { HomeIcon, Pen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BiBuildings } from "react-icons/bi";
// import { ToastContainer } from "react-toastify";

export default async function page({ params }) {
    const { agency_id } = await params;
    const agency = await fetchAgency(agency_id);

    if (!agency) {
        redirect("/organizers");
    }

    return (
        <InterceptModal>
            {/* <ToastContainer /> */}
            <div
                id="form-modal"
                className="w-full h-full xl:w-9/10 mx-auto p-2 relative"
            >
                <Card className="p-3 shadow-lg/60 bg-slate-100">
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-wrap sm:flex-nowrap sm:px-5 gap-3 rounded-2xl w-full">
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
                                        <span className="font-semibold">
                                            Address:{" "}
                                        </span>
                                        <span>{agency.agency_address}</span>
                                    </div>
                                </div>
                                <Link
                                    href="/organizers"
                                    replace={true}
                                    className="btn btn-default"
                                    tabIndex={-1}
                                >
                                    <BiBuildings />{" "}
                                    <span className="hidden sm:inline-block">
                                        Select other agencies
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* Registration form */}
                        <div className="flex-1">
                            <NewDonorForm
                                role_name="Donor"
                                agency_id={agency_id}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* <pre>{JSON.stringify(agency, null, 3)}</pre> */}
        </InterceptModal>
    );
}
