"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import {
    Building,
    Cog,
    Droplet,
    Phone,
    User2Icon,
    UserCheck,
    UserCircle,
    UserIcon,
} from "lucide-react";

// import UserProfileForm from "./UserProfileForm";
// import UserChangePassword from "./UserChangePassword";

import { useQuery } from "@tanstack/react-query";
import UserProfileForm from "@components/profile/UserProfileForm";
import UserChangePassword from "@components/profile/UserChangePassword";
import { getOrganizerProfile } from "@/action/hostCoordinatorAction";

import SessionLogger from "@lib/utils/SessionLogger";
import Skeleton_user from "@components/ui/Skeleton_user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import UpdateAgencyProfile from "@components/profile/UpdateAgencyProfile";
import { getDonorProfile } from "@/action/donorAction";
import DonorProfileTabForm from "./DonorProfileTabForm";
import BloodTypeTabForm from "./BloodTypeTabForm";
import AgencySettings from "@/(pages)/portal/(role_based)/donors/profile/AgencySettings";

export default function DonorProfilePage({ user }) {
    const userQuery = useQuery({
        queryKey: ["user", user?.id],
        queryFn: async () => await getDonorProfile(user?.id),
    });

    const { data: userData, isLoading, isFetching } = userQuery;

    if (isFetching || isLoading) return <Skeleton_user />;

    const agency = userData?.donor?.agency;

    // return <SessionLogger />;
    return (
        <Card className="md:p-5 bg-gray-100">
            <CardHeader className="text-2xl font-bold">
                <div className="flex items-center gap-2 md:justify-between">
                    <CardTitle>Account Information</CardTitle>
                    {userData?.donor?.donor_type === "agency" && (
                        <AgencySettings userData={userData} />
                    )}
                </div>
                <CardDescription>
                    <div>Update your account.</div>
                </CardDescription>
            </CardHeader>
            <CardContent id="form-modal" className="p-1 md:p-5">
                <Tabs defaultValue="user-profile" className="px-1 md:px-5">
                    <TabsList className="flex flex-row">
                        <TabsTrigger value="user-profile" title="User Profile">
                            <User2Icon className="w-4 h-4 mr-1" />
                            <span className="hidden md:inline-block">
                                User Profile
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="donor-profile"
                            title="Donor's Profile"
                        >
                            <UserCircle className="w-4 h-4 mr-1" />
                            <span className="hidden md:inline-block">
                                Donor's Profile
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="blood-type" title="Blood Type">
                            <Droplet className="w-4 h-4 mr-1" />
                            <span className="hidden md:inline-block">
                                Blood Type
                            </span>
                        </TabsTrigger>

                        {user.provider == "credentials" && (
                            <TabsTrigger
                                value="user-credentials"
                                title="Account Credentials"
                            >
                                <Cog className="w-4 h-4 mr-1" />
                                <span className="hidden md:inline-block">
                                    Account Credentials
                                </span>
                            </TabsTrigger>
                        )}
                        <TabsTrigger
                            value="agency-details"
                            title="Agency Details"
                        >
                            <Building className="w-4 h-4 mr-1" />
                            <span className="hidden md:inline-block">
                                Agency Details
                            </span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent className="md:p-2" value="user-profile">
                        <UserProfileForm userQuery={userQuery} />
                    </TabsContent>
                    <TabsContent className="p-2" value="donor-profile">
                        <DonorProfileTabForm donor={userData?.donor} />
                    </TabsContent>
                    <TabsContent className="p-2" value="blood-type">
                        <BloodTypeTabForm
                            donor={{
                                id: userData?.donor?.id,
                                blood_type_id: userData?.donor?.blood_type_id,
                                is_bloodtype_verified:
                                    userData?.donor?.is_bloodtype_verified,
                            }}
                        />
                    </TabsContent>
                    <TabsContent value="user-credentials">
                        <UserChangePassword userQuery={userQuery} />
                    </TabsContent>
                    <TabsContent value="agency-details">
                        <UpdateAgencyProfile
                            agency={agency}
                            isReadOnly={true}
                        />
                    </TabsContent>
                </Tabs>
                {/* <div>
                    <h1>Agency Data</h1>
                    <pre>{JSON.stringify(userData, null, 3)}</pre>
                    <SessionLogger />
                </div> */}
            </CardContent>
        </Card>
    );
}
