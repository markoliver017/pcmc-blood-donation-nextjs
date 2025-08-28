import { format } from "date-fns";
import {
    CheckCircle,
    XCircle,
    Calendar,
    Clock,
    User,
    Tag,
    Building,
    MapPin,
    CalendarCheck,
} from "lucide-react";

async function getAppointmentDetails(apt_id) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/verify-appointment/${apt_id}`,
            {
                cache: "no-store", // Ensure fresh data
            }
        );

        if (!res.ok) {
            return {
                error: true,
                message: "Appointment not found or invalid.",
            };
        }

        const data = await res.json();

        return { appointment: data.appointment };
    } catch (error) {
        console.error("Verification page error:", error);
        return {
            error: true,
            message: "An error occurred while fetching appointment details.",
        };
    }
}

const VerificationPage = async ({ params }) => {
    const { apt_id } = await params;
    const { appointment, error, message } = await getAppointmentDetails(apt_id);

    const event = appointment?.event;
    const donor = appointment?.donor?.user;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                {error ? (
                    <div className="text-center">
                        <XCircle className="w-16 h-16 mx-auto text-red-500" />
                        <h1 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Verification Failed
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {message}
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                        <h1 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Appointment Verified
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            This appointment is valid and registered.
                        </p>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-left space-y-4">
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                Appointment Details
                            </h2>
                            <div>
                                <p className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-gray-500" />{" "}
                                    <strong>Donor:</strong>{" "}
                                    {donor?.name || "N/A"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-gray-500" />{" "}
                                    <strong>Appointment ID:</strong>{" "}
                                    {appointment?.appointment_reference_id}
                                </p>
                            </div>
                            <div>
                                <p className="flex items-center gap-2">
                                    <CalendarCheck className="w-5 h-5 text-gray-500" />{" "}
                                    <strong>Event:</strong>{" "}
                                    {event?.title || "N/A"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-gray-500" />{" "}
                                    <strong>Date:</strong>{" "}
                                    {format(event?.date, "PPPP")}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Building className="w-5 h-5 text-gray-500" />{" "}
                                    <strong>Agency:</strong>{" "}
                                    {event?.agency?.name || "N/A"}
                                </p>
                                <p className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 text-gray-500" />{" "}
                                    <strong>Location:</strong>{" "}
                                    {event?.agency?.agency_address || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationPage;
