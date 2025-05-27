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
        <Card className="md:p-5 bg-gray-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Update User</CardTitle>
                <CardDescription>
                    <div>Update User details.</div>
                </CardDescription>
            </CardHeader>
            <CardContent id="form-modal">
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
                    <div className="tab-content bg-base-100 border-base-300 p-6">
                        <UserProfileForm userQuery={userQuery} />
                    </div>
                    {provider == "credentials" && (
                        <>
                            <label className="tab gap-2 min-w-full sm:min-w-1/2">
                                <input type="radio" name="user_profile_tabs" />
                                <Cog />
                                Account Credentials
                            </label>
                            <div className="tab-content bg-base-100 border-base-300 p-6">
                                <UserChangePassword userQuery={userQuery} />
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
