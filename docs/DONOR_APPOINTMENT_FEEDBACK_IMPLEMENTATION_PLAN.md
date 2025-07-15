# Donor Appointment Feedback Implementation Plan

## Overview

This plan outlines the steps to implement a feedback system for donor appointments, including a database model, multiple rating questions, UI/UX flow, and backend integration.

---

## 1. Database Model/Table

### Table: `DonorAppointmentFeedback`

| Field Name     | Type      | Description                         |
| -------------- | --------- | ----------------------------------- |
| id             | UUID/INT  | Primary key                         |
| appointment_id | UUID/INT  | Foreign key to DonorAppointmentInfo |
| donor_id       | UUID/INT  | Foreign key to Donor                |
| q1_rating      | INT (1-5) | Rating for Question 1               |
| q2_rating      | INT (1-5) | Rating for Question 2               |
| q3_rating      | INT (1-5) | Rating for Question 3               |
| comments       | TEXT      | Optional comments                   |
| created_at     | DATETIME  | Timestamp                           |
| updated_at     | DATETIME  | Timestamp                           |

-   Add indexes on `appointment_id` and `donor_id` for fast lookup.
-   Enforce one feedback per appointment per donor.

### Example Questions

1. How would you rate the overall donation experience?
2. How satisfied were you with the staff and facilities?
3. How likely are you to donate again?

---

## 2. UI/UX Flow

1. **Feedback Button**: Appears for each past appointment.
2. **Feedback Modal**:
    - Shows all questions with 1–5 star rating inputs.
    - Optional comments field.
    - Submit button (disabled until all questions are answered).
    - Shows average rating after submission (if desired).
3. **Feedback State**:
    - If feedback already exists for an appointment, show the average rating and disable the button.
    - Otherwise, allow feedback submission.

---

## 3. Backend Integration

-   **API Endpoint/Server Action**:
    -   `submitDonorAppointmentFeedback(appointmentId, donorId, ratings, comments)`
    -   Validates input, checks for existing feedback, saves to DB.
    -   Returns success or error.
-   **Fetch Feedback**:
    -   `getDonorAppointmentFeedback(appointmentId, donorId)`
    -   Used to display existing feedback and average rating.

---

## 4. Implementation Steps

1. **Create DB migration/model for DonorAppointmentFeedback**
2. **Add server actions for submit and fetch feedback**
3. **Build FeedbackModal component**
4. **Wire up PastAppointmentsList to open modal and display feedback state**
5. **Show average rating if feedback exists**
6. **Test end-to-end flow**

---

## 5. Future Enhancements

-   Add more questions or allow dynamic question management.
-   Allow admins to view/aggregate feedback for reporting.
-   Send thank-you notifications after feedback submission.
