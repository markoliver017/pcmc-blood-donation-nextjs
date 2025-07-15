import React from "react";
import { Calendar, MapPin, Clock, History, Download, MessageCircle } from "lucide-react";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const PastAppointmentsList = ({ appointments = [], onViewDetails }) => {
  if (!appointments.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded shadow text-gray-500">
        <History className="w-8 h-8 mb-2 text-gray-400" />
        <div className="font-semibold text-lg">No Past Appointments</div>
        <div className="text-sm">Your past appointments will appear here.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.slice(-5).reverse().map((appt) => {
        const event = appt.time_schedule?.event;
        const canDownload = appt.status === "donated";
        return (
          <div
            key={appt.id}
            className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-lg shadow border border-gray-100"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                <History className="w-5 h-5" />
                {event?.title || "Untitled Event"}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {formatDate(event?.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {appt.time_schedule?.formatted_time || "-"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event?.agency?.agency_address || "No location"}
                </span>
                <span className="flex items-center gap-1">
                  Status:
                  <span className="font-bold uppercase ml-1">
                    {appt.status}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => onViewDetails && onViewDetails(appt)}
                aria-label="View appointment details"
              >
                View Details
              </button>
              <button
                className={`btn btn-sm btn-outline flex items-center gap-1 ${canDownload ? '' : 'opacity-60 cursor-not-allowed'}`}
                disabled={!canDownload}
                aria-label="Download certificate"
                title={canDownload ? 'Download Certificate' : 'Certificate available after donation'}
              >
                <Download className="w-4 h-4" />
                Certificate
              </button>
              <button
                className="btn btn-sm btn-outline flex items-center gap-1"
                aria-label="Give feedback"
                title="Give Feedback (coming soon)"
                // onClick={() => ...}
              >
                <MessageCircle className="w-4 h-4" />
                Feedback
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PastAppointmentsList; 