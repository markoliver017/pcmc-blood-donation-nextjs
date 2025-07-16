import React from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

const BookAppointmentButton = () => {
    return (
        <Link
            href="/portal/donors/events"
            className="btn btn-primary flex items-center gap-2 px-4 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Book a new appointment"
        >
            <PlusCircle className="w-5 h-5" />
            Book New Appointment
        </Link>
    );
};

export default BookAppointmentButton;
