import { addDays, isWithinInterval } from "date-fns";

// Helper to check if a date is within 90 days after any booked event
export const isWithin90DaysOfBooked = (date, bookedEvents) => {
    if (!Array.isArray(bookedEvents)) return false;
    return bookedEvents.some((event) => {
        const eventDate = new Date(event.date);
        return isWithinInterval(date, {
            start: eventDate,
            end: addDays(eventDate, 89), // 89 so 90 days total including the event day
        });
    });
};

export const isEventsWithin90DaysBeforeOrAfterDonationDate = (
    date = "2025-06-25",
    bookedEvents
) => {
    if (!Array.isArray(bookedEvents)) return false;
    const checkDate = new Date(date);
    return bookedEvents.some((event) => {
        const baseDate = new Date(event.date);
        return isWithinInterval(checkDate, {
            start: subDays(baseDate, 90),
            end: addDays(baseDate, 89),
        });
    });
};
// "You cannot book a donation within 90 days before or after an existing event. Please select a different date."

export const isWithin90DaysBeforeOrAfterDonationDate = (
    date = "2025-06-25",
    donationDate = "2025-04-23"
) => {
    if (!donationDate) return false;
    const checkDate = new Date(date);
    const baseDate = new Date(donationDate);

    return isWithinInterval(checkDate, {
        start: subDays(baseDate, 90),
        end: addDays(baseDate, 89),
    });
};
