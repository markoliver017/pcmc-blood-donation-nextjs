import React from "react";
import Link from "next/link";
import { PlusCircle, Heart, Sparkles } from "lucide-react";

const BookAppointmentButton = () => {
    return (
        <div className="relative b-red">
            <Link
                href="/portal/donors/events"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
                aria-label="Book a new appointment"
            >
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                        <PlusCircle className="w-6 h-6" />
                    </div>
                    <span>Book New Appointment</span>
                    <Heart className="w-5 h-5 text-red-300 group-hover:text-red-200 transition-colors duration-300" />
                </div>
                <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                </div>
            </Link>
            <div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    🩸 Save lives in your community
                </p>
            </div>
        </div>
    );
};

export default BookAppointmentButton;
