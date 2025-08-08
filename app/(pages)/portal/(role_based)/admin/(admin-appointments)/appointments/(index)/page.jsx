import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import AppointmentList from "./AppointmentList";
import { Calendar } from "lucide-react";
import { Toaster } from "sonner";

export default function Page() {
    return (
        <>
            <WrapperHeadMain
                icon={<Calendar />}
                pageTitle="List of Appointments"
                breadcrumbs={[
                    {
                        path: "/portal/admin/appointments",
                        icon: <Calendar className="w-4" />,
                        title: "Appointments",
                    },
                ]}
            />
            <Toaster />
            <div className="w-full h-full 2xl:px-5 mx-auto shadow-lg mt-5  space-y-3">
                <AppointmentList />
            </div>
        </>
    );
}
