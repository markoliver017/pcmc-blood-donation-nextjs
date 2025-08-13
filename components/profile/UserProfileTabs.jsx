"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Cog, User2Icon } from "lucide-react";

import UserProfileForm from "./UserProfileForm";
import { getUser } from "@/action/userAction";
import { useQuery } from "@tanstack/react-query";
import UserChangePassword from "./UserChangePassword";

export default function UserProfileTabs({ userId, provider }) {
    const userQuery = useQuery({
        queryKey: ["user", userId],
        queryFn: async () => {
            const res = await getUser(userId);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
    });

    return (
        <Card className="p-0 md:p-5 bg-gray-100">
            <CardHeader className="text-base sm:text-lg md:text-2xl font-bold">
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                    <div>Update your account.</div>
                </CardDescription>
            </CardHeader>
            <CardContent id="form-modal" className="p-1 md:p-5">
                <div className="tabs tabs-lift">
                    <label className="tab gap-2  min-w-full sm:min-w-1/2">
                        <input
                            type="radio"
                            name="user_profile_tabs"
                            defaultChecked
                        />
                        <User2Icon />
                        User Profile
                    </label>
                    <div className="tab-content bg-base-100 border-base-300 p-1 md:p-5">
                        <UserProfileForm userQuery={userQuery} />
                    </div>
                    {provider == "credentials" && (
                        <>
                            <label className="tab gap-2 min-w-full sm:min-w-1/2">
                                <input type="radio" name="user_profile_tabs" />
                                <Cog />
                                Account Credentials
                            </label>
                            <div className="tab-content bg-base-100 border-base-300 p-1 md:p-5">
                                <UserChangePassword userQuery={userQuery} />
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
