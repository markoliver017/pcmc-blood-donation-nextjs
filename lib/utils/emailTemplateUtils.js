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
    event_title: "Event title (alias for event_name)",
    event_description: "Event description",
    event_organizer: "Event organizer name",

    // Blood request fields
    blood_request_id: "Blood request ID",
    blood_component: "Blood component type",
    patient_name: "Patient name",
    patient_gender: "Patient gender",
    patient_date_of_birth: "Patient date of birth",
    blood_type: "Blood type",
    no_of_units: "Number of units requested",
    diagnosis: "Patient diagnosis",
    hospital_name: "Hospital name",
    request_date: "Blood request date",
    request_status: "Blood request status",
    status_update_date: "Date of status update",
    status_remarks: "Remarks for status update",

    // Appointment-related fields
    appointment_date: "Appointment date",
    appointment_time: "Appointment time",
    appointment_status: "Appointment status",

    // System fields
    system_name: "System name (PCMC Pediatric Blood Center)",
    support_email: "Support email address",
    domain_url: "Portal domain URL",

    // Blood collection fields
    collection_date: "Blood collection date",
    collection_volume: "Blood collection volume",

    // Approval fields
    approval_status: "Approval status (Approved/Rejected)",
    approval_date: "Date of approval/rejection",
    approval_reason: "Reason for approval/rejection",

    // Contact number fields
    contact_number: "Contact number",
    registration_date: "Registration date",
    // Coordinator fields (aliases for user fields, used in agency notification templates)
    coordinator_name: "Coordinator's full name (alias for user_name)",
    coordinator_email: "Coordinator's email address (alias for user_email)",
    coordinator_contact:
        "Coordinator's contact number (alias for agency_contact)",
    // Donor fields (aliases for user fields, used in agency notification templates)
    donor_name: "Donor's full name (alias for user_name)",
    donor_email: "Donor's email address (alias for user_email)",
    donor_contact: "Donor's contact number (alias for contact_number)",
    rejection_reason: "Reason for rejection",
    rejected_by: "Juan Dela Cruz",

    status_message:
        "✅ Request Fulfilled<br>Your blood request has been successfully fulfilled. The blood units have been allocated and are ready for use.",
    status_style:
        "background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;",
    requested_by: "Juan Dela Cruz",

    // Contact form fields
    contact_name: "Contact form submitter name",
    contact_email: "Contact form submitter email",
    contact_phone: "Contact form submitter phone",
    contact_subject: "Contact form subject",
    contact_message: "Contact form message",
    submission_date: "Contact form submission date",
};

// Template categories
export const TEMPLATE_CATEGORIES = [
    "AGENCY_REGISTRATION",
    "AGENCY_COORDINATOR_REGISTRATION",
    "AGENCY_COORDINATOR_APPROVAL",
    "AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
    "AGENCY_DONOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
    "AGENCY_APPROVAL",
    "AGENCY_REJECTION",
    "DONOR_REGISTRATION",
    "DONOR_APPROVAL",
    "DONOR_REJECTION",
    "COORDINATOR_REJECTION",
    "COORDINATOR_DEACTIVATION",
    "COORDINATOR_REACTIVATION",
    "DONOR_DEACTIVATION",
    "DONOR_REACTIVATION",
    "EVENT_CREATION",
    "BLOOD_DRIVE_APPROVAL",
    "BLOOD_DRIVE_CANCELLATION",
    "APPOINTMENT_BOOKING",
    "BLOOD_COLLECTION",
    "SYSTEM_NOTIFICATION",
    "MBDT_NOTIFICATION",
    "GENERAL",
    "EVENT_DONOR_INVITATION",
    "BLOOD_REQUEST_APPROVAL",
    "NEW_BLOOD_REQUEST",
    "CONTACT_FORM",
];

// Sample data for template preview
export const SAMPLE_DATA = {
    // User sample data
    user_name: "John Doe",
    user_email: "john.doe@example.com",
    user_first_name: "John",
    user_last_name: "Doe",

    // Agency sample data
    agency_name: "Sample Agency Blood Bank",
    agency_address: "123 Main Street, City, Province",
    agency_contact: "9123456789",

    // Event sample data
    event_name: "Community Blood Drive",
    event_date: "2025-01-15",
    event_organizer: "John Doe",
    event_description: "Community Blood Drive",
    approval_reason: "All requirements met",
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

    // Contact number sample data
    contact_number: "9123456789",
    registration_date: "2025-01-10",

    // Blood request sample data
    blood_request_id: "REQ-2025-001",
    blood_component: "Whole Blood",
    patient_name: "Maria Santos",
    patient_gender: "Female",
    patient_date_of_birth: "1990-05-10",
    no_of_units: "5",
    diagnosis: "Severe Anemia",
    hospital_name: "St. Luke's Medical Center",
    request_date: "2025-01-15",
    request_status: "Pending",
    status_update_date: "2025-01-15",
    status_remarks: "Initial request submitted.",
    status_message:
        "✅ Request Fulfilled<br>Your blood request has been successfully fulfilled. The blood units have been allocated and are ready for use.",
    status_style:
        "background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;",

    // New blood request sample data
    new_blood_request_id: "REQ-2025-002",
    new_blood_component: "Platelets",
    new_patient_name: "Juan Dela Cruz",
    new_patient_gender: "Male",
    new_patient_date_of_birth: "1985-03-15",
    new_no_of_units: "3",
    new_diagnosis: "Leukemia",
    new_hospital_name: "Makati Medical Center",
    new_request_date: "2025-02-10",
    new_blood_type: "A+",
    new_requested_by: "Coordinator Maria Lopez",

    // Contact form sample data
    contact_name: "Maria Santos",
    contact_email: "maria.santos@example.com",
    contact_phone: "09123456789",
    contact_subject: "Blood Donation Appointment",
    contact_message:
        "I would like to schedule a blood donation appointment. I am available on weekdays from 9 AM to 5 PM. Please let me know the available slots.",
    submission_date: "2025-01-15",
};

/**
 * Get sample data for a specific category
 */
export function getSampleDataForCategory(category) {
    // Note: coordinator_* fields are aliases for user fields, used for agency notification templates
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
        AGENCY_COORDINATOR_REGISTRATION: {
            agency_name: SAMPLE_DATA.agency_name,
            user_name: SAMPLE_DATA.user_name,
            user_email: SAMPLE_DATA.user_email,
            user_first_name: SAMPLE_DATA.user_first_name,
            user_last_name: SAMPLE_DATA.user_last_name,
            contact_number: SAMPLE_DATA.agency_contact,
            registration_date: SAMPLE_DATA.approval_date,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
        AGENCY_COORDINATOR_APPROVAL: {
            agency_name: SAMPLE_DATA.agency_name,
            user_name: SAMPLE_DATA.user_name,
            user_email: SAMPLE_DATA.user_email,
            user_first_name: SAMPLE_DATA.user_first_name,
            user_last_name: SAMPLE_DATA.user_last_name,
            contact_number: SAMPLE_DATA.agency_contact,
            approval_date: SAMPLE_DATA.approval_date,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
        AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY: {
            agency_name: SAMPLE_DATA.agency_name,
            coordinator_name: SAMPLE_DATA.user_name,
            coordinator_email: SAMPLE_DATA.user_email,
            coordinator_contact: SAMPLE_DATA.agency_contact,
            registration_date: SAMPLE_DATA.approval_date,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
        AGENCY_DONOR_REGISTRATION_NOTIFICATION_TO_AGENCY: {
            agency_name: SAMPLE_DATA.agency_name,
            donor_name: SAMPLE_DATA.user_name,
            donor_email: SAMPLE_DATA.user_email,
            donor_contact: SAMPLE_DATA.contact_number,
            blood_type: SAMPLE_DATA.blood_type,
            registration_date: SAMPLE_DATA.approval_date,
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
            domain_url: SAMPLE_DATA.domain_url,
        },
        AGENCY_REJECTION: {
            agency_name: SAMPLE_DATA.agency_name,
            user_name: SAMPLE_DATA.user_name,
            user_email: SAMPLE_DATA.user_email,
            user_first_name: SAMPLE_DATA.user_first_name,
            user_last_name: SAMPLE_DATA.user_last_name,
            agency_address: SAMPLE_DATA.agency_address,
            agency_contact: SAMPLE_DATA.agency_contact,
            approval_status: "Rejected",
            approval_date: SAMPLE_DATA.approval_date,
            approval_reason: "Application requirements not met",
            rejection_reason: "Application requirements not met",
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
            rejected_by: "Admin User",
        },
        DONOR_REGISTRATION: {
            user_name: SAMPLE_DATA.user_name,
            agency_name: SAMPLE_DATA.agency_name,
            user_email: SAMPLE_DATA.user_email,
            user_first_name: SAMPLE_DATA.user_first_name,
            user_last_name: SAMPLE_DATA.user_last_name,
            blood_type: SAMPLE_DATA.blood_type,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
        },
        DONOR_APPROVAL: {
            user_name: SAMPLE_DATA.user_name,
            agency_name: SAMPLE_DATA.agency_name,
            user_email: SAMPLE_DATA.user_email,
            approval_status: SAMPLE_DATA.approval_status,
            approval_date: SAMPLE_DATA.approval_date,
            approval_reason: SAMPLE_DATA.approval_reason,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
        },
        DONOR_REJECTION: {
            user_name: SAMPLE_DATA.user_name,
            agency_name: SAMPLE_DATA.agency_name,
            user_email: SAMPLE_DATA.user_email,
            user_first_name: SAMPLE_DATA.user_first_name,
            user_last_name: SAMPLE_DATA.user_last_name,
            approval_status: "Rejected",
            approval_date: SAMPLE_DATA.approval_date,
            approval_reason: "Application requirements not met",
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
        COORDINATOR_REJECTION: {
            user_name: SAMPLE_DATA.user_name,
            agency_name: SAMPLE_DATA.agency_name,
            user_email: SAMPLE_DATA.user_email,
            user_first_name: SAMPLE_DATA.user_first_name,
            user_last_name: SAMPLE_DATA.user_last_name,
            approval_status: "Rejected",
            approval_date: SAMPLE_DATA.approval_date,
            approval_reason: "Application requirements not met",
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
        COORDINATOR_DEACTIVATION: {
            user_name: SAMPLE_DATA.user_name,
            agency_name: SAMPLE_DATA.agency_name,
            user_email: SAMPLE_DATA.user_email,
            user_first_name: SAMPLE_DATA.user_first_name,
            user_last_name: SAMPLE_DATA.user_last_name,
            deactivation_date: SAMPLE_DATA.approval_date,
            deactivation_reason: "Account deactivated by agency/admin.",
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
        COORDINATOR_REACTIVATION: {
            user_name: SAMPLE_DATA.user_name,
            agency_name: SAMPLE_DATA.agency_name,
            user_email: SAMPLE_DATA.user_email,
            user_first_name: SAMPLE_DATA.user_first_name,
            user_last_name: SAMPLE_DATA.user_last_name,
            reactivation_date: SAMPLE_DATA.approval_date,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
        DONOR_DEACTIVATION: {
            user_name: SAMPLE_DATA.user_name,
            agency_name: SAMPLE_DATA.agency_name,
            user_email: SAMPLE_DATA.user_email,
            user_first_name: SAMPLE_DATA.user_first_name,
            user_last_name: SAMPLE_DATA.user_last_name,
            deactivation_date: SAMPLE_DATA.approval_date,
            deactivation_reason: "Account deactivated by agency/admin.",
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
        DONOR_REACTIVATION: {
            user_name: SAMPLE_DATA.user_name,
            agency_name: SAMPLE_DATA.agency_name,
            user_email: SAMPLE_DATA.user_email,
            user_first_name: SAMPLE_DATA.user_first_name,
            user_last_name: SAMPLE_DATA.user_last_name,
            reactivation_date: SAMPLE_DATA.approval_date,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
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

        BLOOD_DRIVE_APPROVAL: {
            event_name: SAMPLE_DATA.event_name,
            event_date: SAMPLE_DATA.event_date,
            agency_name: SAMPLE_DATA.agency_name,
            event_organizer: SAMPLE_DATA.event_organizer,
            event_description: SAMPLE_DATA.event_description,
            approval_status: SAMPLE_DATA.approval_status,
            approval_date: SAMPLE_DATA.approval_date,
            approval_reason: SAMPLE_DATA.approval_reason,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
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
        MBDT_NOTIFICATION: {
            agency_name: SAMPLE_DATA.agency_name,
            user_name: SAMPLE_DATA.user_name,
            user_email: SAMPLE_DATA.user_email,
            agency_address: SAMPLE_DATA.agency_address,
            agency_contact: SAMPLE_DATA.agency_contact,
            registration_date: SAMPLE_DATA.approval_date,
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
        EVENT_DONOR_INVITATION: {
            event_name: SAMPLE_DATA.event_name,
            event_date: SAMPLE_DATA.event_date,
            event_time: SAMPLE_DATA.event_time,
            event_location: SAMPLE_DATA.event_location,
            event_organizer: SAMPLE_DATA.user_name,
            system_name: SAMPLE_DATA.system_name,
            agency_name: SAMPLE_DATA.agency_name,
            support_email: SAMPLE_DATA.support_email,
        },
        BLOOD_REQUEST_APPROVAL: {
            blood_request_id: SAMPLE_DATA.blood_request_id,
            blood_component: SAMPLE_DATA.blood_component,
            patient_name: SAMPLE_DATA.patient_name,
            patient_gender: SAMPLE_DATA.patient_gender,
            patient_date_of_birth: SAMPLE_DATA.patient_date_of_birth,
            blood_type: SAMPLE_DATA.blood_type,
            no_of_units: SAMPLE_DATA.no_of_units,
            diagnosis: SAMPLE_DATA.diagnosis,
            hospital_name: SAMPLE_DATA.hospital_name,
            request_date: SAMPLE_DATA.request_date,
            request_status: SAMPLE_DATA.request_status,
            status_update_date: SAMPLE_DATA.status_update_date,
            status_remarks: SAMPLE_DATA.status_remarks,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
            status_message: SAMPLE_DATA.status_message,
            status_style: SAMPLE_DATA.status_style,
        },
        NEW_BLOOD_REQUEST: {
            blood_request_id: SAMPLE_DATA.new_blood_request_id,
            blood_component: SAMPLE_DATA.new_blood_component,
            patient_name: SAMPLE_DATA.new_patient_name,
            patient_gender: SAMPLE_DATA.new_patient_gender,
            patient_date_of_birth: SAMPLE_DATA.new_patient_date_of_birth,
            blood_type: SAMPLE_DATA.new_blood_type,
            no_of_units: SAMPLE_DATA.new_no_of_units,
            diagnosis: SAMPLE_DATA.new_diagnosis,
            hospital_name: SAMPLE_DATA.new_hospital_name,
            request_date: SAMPLE_DATA.new_request_date,
            requested_by: SAMPLE_DATA.new_requested_by,
            system_name: SAMPLE_DATA.system_name,
            support_email: SAMPLE_DATA.support_email,
            domain_url: SAMPLE_DATA.domain_url,
        },
        CONTACT_FORM: {
            contact_name: SAMPLE_DATA.contact_name,
            contact_email: SAMPLE_DATA.contact_email,
            contact_phone: SAMPLE_DATA.contact_phone,
            contact_subject: SAMPLE_DATA.contact_subject,
            contact_message: SAMPLE_DATA.contact_message,
            submission_date: SAMPLE_DATA.submission_date,
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
        AGENCY_REJECTION: "bg-red-100 text-red-800",
        DONOR_REGISTRATION: "bg-purple-100 text-purple-800",
        DONOR_APPROVAL: "bg-yellow-100 text-yellow-800",
        DONOR_REJECTION: "bg-red-100 text-red-800",
        COORDINATOR_REJECTION: "bg-red-100 text-red-800",
        COORDINATOR_DEACTIVATION: "bg-red-100 text-red-800",
        COORDINATOR_REACTIVATION: "bg-red-100 text-red-800",
        DONOR_DEACTIVATION: "bg-red-100 text-red-800",
        DONOR_REACTIVATION: "bg-red-100 text-red-800",
        EVENT_CREATION: "bg-indigo-100 text-indigo-800",
        BLOOD_DRIVE_APPROVAL: "bg-indigo-2100 text-indigo-700",
        APPOINTMENT_BOOKING: "bg-pink-100 text-pink-800",
        BLOOD_COLLECTION: "bg-red-100 text-red-800",
        SYSTEM_NOTIFICATION: "bg-gray-100 text-gray-800",
        GENERAL: "bg-gray-100 text-gray-800",
        EVENT_DONOR_INVITATION: "bg-blue-100 text-blue-800",
        BLOOD_REQUEST_APPROVAL: "bg-orange-100 text-orange-800",
    };

    return colors[category] || colors.GENERAL;
}
