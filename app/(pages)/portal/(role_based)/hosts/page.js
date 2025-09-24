import { auth } from "@lib/auth";
import SessionTimer from "@lib/utils/SessionTimer";
import Dashboard from "./Dashboard";
import { PiHandHeart } from "react-icons/pi";
import { LogIn } from "lucide-react";

export default async function page() {
    const session = await auth();
    if (!session) throw "You are not allowed to access this page.";
    const { user } = session;
    return (
        <div className="p-1 md:p-5 overflow-scroll">
            <div className="flex flex-wrap md:flex-nowrap justify-between border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-xl md:text-3xl font-bold flex-items-center">
                        <PiHandHeart /> WELCOME, {user.name}
                    </h1>
                    <h2 className="text-xs md:text-base flex-items-center">
                        <LogIn className="h-4" /> Logged In as :{" "}
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
