import EventCalendar from "@components/dashboard/EventCalendar";
import { auth } from "@lib/auth";
import SessionTimer from "@lib/utils/SessionTimer";

export default async function page() {
    const session = await auth();
    if (!session) throw "You are not allowed to access this page.";
    const { user } = session;
    return (
        <div className="p-5 h-screen">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl">WELCOME, {user.name} </h1>
                    <h2>Logged In as : {user?.role_name || "Donor"}</h2>
                </div>
                <SessionTimer />
            </div>

            <div className="">
                <EventCalendar />
            </div>
        </div>
    );
}
