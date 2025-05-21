import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { User, UserCircle2Icon, UserCog } from "lucide-react";
import React from "react";
import { FaUserCog } from "react-icons/fa";

export default function page() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl">LOGIN PAGE</h1>
                </CardTitle>
                <CardContent className="border rounded min-h-96 flex flex-col justify-center items-center py-2 gap-3">
                    <button className="btn btn-wide">
                        <UserCog />
                        AGENCY HEAD
                    </button>
                    <button className="btn btn-wide">
                        <UserCircle2Icon />
                        AGENCY COORDINATOR
                    </button>
                    <button className="btn btn-wide">
                        <User />
                        AGENCY DONOR
                    </button>
                    <button className="btn btn-wide">
                        <FaUserCog />
                        MBD TEAM
                    </button>
                </CardContent>
            </CardHeader>
        </Card>
    );
}
