import SweetAlert from "@components/ui/SweetAlert";

export const showBookingSuccessAlert = (eventDetails) =>
    SweetAlert({
        title: "Booking Confirmed!",
        html: `
            <div class="text-left space-y-4">
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 class="font-semibold text-lg mb-2">${eventDetails.title}</h3>
                    <p class="text-sm text-gray-600">
                        <strong>Date:</strong> ${eventDetails.date}<br>
                        <strong>Time:</strong> ${eventDetails.time}<br>
                        <strong>Location:</strong> ${eventDetails.location}<br>
                        <strong>Reference No:</strong> ${eventDetails.id}
                    </p>
                </div>
                
                <div class="mt-4">
                    <h4 class="font-medium mb-2">Important Reminders:</h4>
                    <ul class="list-disc list-inside text-sm text-gray-600">
                        <li>Please arrive 15 minutes before your scheduled time</li>
                        <li>Bring a valid ID</li>
                        <li>Ensure you have had adequate rest and meals</li>
                        <li>Stay hydrated before the donation</li>
                    </ul>
                </div>
            </div>
        `,
        icon: "success",
        confirmButtonText: "Great! Thanks",
        confirmButtonColor: "#059669",
    });
