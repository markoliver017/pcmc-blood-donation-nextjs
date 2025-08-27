import { auth } from "@lib/auth";
import SessionTimer from "@lib/utils/SessionTimer";
import Dashboard from "./Dashboard";
import { LogIn } from "lucide-react";
import { PiHandHeart } from "react-icons/pi";

export default async function page() {
    const session = await auth();
    if (!session) throw "You are not allowed to access this page.";
    const { user } = session;
    return (
        <div className="p-5 overflow-scroll">
            <div className="flex flex-wrap gap-2 justify-between items-center border-b border-gray-200 dark:border-gray-800">
                <div className="font-bold">
                    <h1 className="text-base md:text-3xl flex-items-center">
                        <PiHandHeart /> WELCOME, {user.name}
                    </h1>
                    <h2 className="flex-items-center">
                        <LogIn className="h-4 w-4" /> Logged In as :{" "}
                        {user?.role_name || "Donor"}
                    </h2>
                </div>
                <SessionTimer />
            </div>

            <div className="py-2">
                <Dashboard />
            </div>
        </div>
    );
}
