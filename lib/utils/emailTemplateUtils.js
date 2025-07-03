// Dynamic fields available for email templates
export const DYNAMIC_FIELDS = {
    // User-related fields
    user_name: "Full name of the user",
    user_email: "User's email address",
    user_first_name: "User's first name",
    user_last_name: "User's last name",

    // Agency-related fields
    agency_name: "Name of the agency",
    agency_address: "Agency address",
    agency_contact: "Agency contact number",

    // Event-related fields
    event_name: "Name of the blood donation event",
    event_date: "Event date",
    event_time: "Event time",
    event_location: "Event location",

    // Appointment-related fields
    appointment_date: "Appointment date",
    appointment_time: "Appointment time",
    appointment_status: "Appointment status",

    // System fields
    system_name: "System name (PCMC Pediatric Blood Center)",
    support_email: "Support email address",
    domain_url: "Portal domain URL",

    // Blood collection fields
    blood_type: "Donor's blood type",
    collection_date: "Blood collection date",
    collection_volume: "Blood collection volume",

    // Approval fields
    approval_status: "Approval status (Approved/Rejected)",
    approval_date: "Date of approval/rejection",
    approval_reason: "Reason for approval/rejection",
};

// Template categories
export const TEMPLATE_CATEGORIES = [
    "AGENCY_REGISTRATION",
    "AGENCY_APPROVAL",
    "DONOR_REGISTRATION",
    "DONOR_APPROVAL",
    "EVENT_CREATION",
    "APPOINTMENT_BOOKING",
    "BLOOD_COLLECTION",
    "SYSTEM_NOTIFICATION",
    "GENERAL",
];

// Sample data for template preview
export const SAMPLE_DATA = {
    // User sample data
    user_name: "John Doe",
    user_email: "john.doe@example.com",
    user_first_name: "John",
    user_last_name: "Doe",

    // Agency sample data
    agency_name: "Sample Blood Bank",
    agency_address: "123 Main Street, City, Province",
    agency_contact: "09123456789",

    // Event sample data
    event_name: "Community Blood Drive",
    event_date: "2025-01-15",
    event_time: "9:00 AM - 5:00 PM",
    event_location: "City Hall Plaza",

    // Appointment sample data
    appointment_date: "2025-01-15",
    appointment_time: "10:00 AM",
    appointment_status: "Confirmed",

    // System sample data
    system_name: "PCMC Pediatric Blood Center",
    support_email: "support@pcmc.gov.ph",
    domain_url: "https://blood-donation.pcmc.gov.ph",

    // Blood collection sample data
    blood_type: "O+",
    collection_date: "2025-01-15",
    collection_volume: "450ml",

    // Approval sample data
    approval_status: "Approved",
    approval_date: "2025-01-10",
    approval_reason: "All requirements met",
};

/**
 * Get sample data for a specific category
 */
export function getSampleDataForCategory(category) {
    const categoryData = {
        AGENCY_REGISTRATION: {
            agency_name: SAMPLE_DATA.agency_name,
            user_name: SAMPLE_DATA.user_name,
            user_email: SAMPLE_DATA.user_email,
            agency_address: SAMPLE_DATA.agency_address,
            agency_contact: SAMPLE_DATA.agency_contact,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
        AGENCY_APPROVAL: {
            agency_name: SAMPLE_DATA.agency_name,
            user_name: SAMPLE_DATA.user_name,
            approval_status: SAMPLE_DATA.approval_status,
            approval_date: SAMPLE_DATA.approval_date,
            approval_reason: SAMPLE_DATA.approval_reason,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
        },
        DONOR_REGISTRATION: {
            user_name: SAMPLE_DATA.user_name,
            user_email: SAMPLE_DATA.user_email,
            user_first_name: SAMPLE_DATA.user_first_name,
            user_last_name: SAMPLE_DATA.user_last_name,
            blood_type: SAMPLE_DATA.blood_type,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
        },
        DONOR_APPROVAL: {
            user_name: SAMPLE_DATA.user_name,
            user_email: SAMPLE_DATA.user_email,
            approval_status: SAMPLE_DATA.approval_status,
            approval_date: SAMPLE_DATA.approval_date,
            approval_reason: SAMPLE_DATA.approval_reason,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
        },
        EVENT_CREATION: {
            event_name: SAMPLE_DATA.event_name,
            event_date: SAMPLE_DATA.event_date,
            event_time: SAMPLE_DATA.event_time,
            event_location: SAMPLE_DATA.event_location,
            agency_name: SAMPLE_DATA.agency_name,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
        },
        APPOINTMENT_BOOKING: {
            user_name: SAMPLE_DATA.user_name,
            user_email: SAMPLE_DATA.user_email,
            appointment_date: SAMPLE_DATA.appointment_date,
            appointment_time: SAMPLE_DATA.appointment_time,
            appointment_status: SAMPLE_DATA.appointment_status,
            event_name: SAMPLE_DATA.event_name,
            event_location: SAMPLE_DATA.event_location,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
        },
        BLOOD_COLLECTION: {
            user_name: SAMPLE_DATA.user_name,
            user_email: SAMPLE_DATA.user_email,
            blood_type: SAMPLE_DATA.blood_type,
            collection_date: SAMPLE_DATA.collection_date,
            collection_volume: SAMPLE_DATA.collection_volume,
            event_name: SAMPLE_DATA.event_name,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
        },
        SYSTEM_NOTIFICATION: {
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
        GENERAL: {
            user_name: SAMPLE_DATA.user_name,
            user_email: SAMPLE_DATA.user_email,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
    };

    return categoryData[category] || SAMPLE_DATA;
}

/**
 * Format category name for display
 */
export function formatCategoryName(category) {
    return category
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
}

/**
 * Get category color for UI
 */
export function getCategoryColor(category) {
    const colors = {
        AGENCY_REGISTRATION: "bg-blue-100 text-blue-800",
        AGENCY_APPROVAL: "bg-green-100 text-green-800",
        DONOR_REGISTRATION: "bg-purple-100 text-purple-800",
        DONOR_APPROVAL: "bg-yellow-100 text-yellow-800",
        EVENT_CREATION: "bg-indigo-100 text-indigo-800",
        APPOINTMENT_BOOKING: "bg-pink-100 text-pink-800",
        BLOOD_COLLECTION: "bg-red-100 text-red-800",
        SYSTEM_NOTIFICATION: "bg-gray-100 text-gray-800",
        GENERAL: "bg-gray-100 text-gray-800",
    };

    return colors[category] || colors.GENERAL;
}
