import React from "react";
import { Calendar, MapPin, Clock, X } from "lucide-react";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const AppointmentDetailModal = ({ isOpen, appointment, onClose }) => {
  if (!isOpen) return null;

  const event = appointment?.time_schedule?.event;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-2">Appointment Details</h2>
        {appointment ? (
          <div className="space-y-2">
            <div className="font-semibold text-lg text-blue-700 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {event?.title || "Untitled Event"}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {formatDate(event?.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {appointment.time_schedule?.formatted_time || "-"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event?.agency?.agency_address || "No location"}
              </span>
              <span className="flex items-center gap-1">
                Status:
                <span className="font-bold uppercase ml-1">
                  {appointment.status}
                </span>
              </span>
            </div>
            {/* Add more details as needed */}
          </div>
        ) : (
          <div className="text-gray-600">No appointment selected.</div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailModal; 