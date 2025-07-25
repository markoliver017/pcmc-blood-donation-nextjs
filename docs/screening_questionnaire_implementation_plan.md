# Donor Screening Questionnaire – Implementation Plan

> This feature enables registered donors to answer the mandatory screening questionnaire for each blood-donation appointment. Answers are persisted in `ScreeningDetailModel` and linked to `DonorAppointmentInfoModel`.

---

## Prerequisites

-   [ ] Confirm latest **`ScreeningQuestionModel`** includes `expected_response`, `is_active` and enums (`GENERAL`, `MEDICAL`, `TRAVEL`, `LIFESTYLE`).
-   [ ] Verify **`ScreeningDetailModel`** has correct FKs: `donor_appointment_info_id`, `question_id`, `response`, `additional_info`.
-   [ ] Verify **`DonorAppointmentInfoModel`** exists with primary key `id`.
-   [ ] Path aliases in **`jsconfig.json`** are up-to-date (e.g. `@models/*`, `@action/*`).
-   [ ] Review **Form Development Guidelines** (`docs/FORM_DEVELOPMENT_GUIDELINES.md`).

---

## Checklist / To-Do

### 1. Database / ORM layer

-   [x] Add _ON DELETE CASCADE_ association in `DonorAppointmentInfoModel.hasMany(ScreeningDetail)` (if missing).
-   [x] Create migration/seed to ensure at least one active screening question exists.

### 2. Validation Schema

-   [x] Create **`lib/zod/screeningDetailSchema.js`** (if not yet) mirroring `ScreeningDetailModel` with:
    -   [x] `donor_appointment_info_id` → number().int().positive()
    -   [x] `question_id` → number().int().positive()
    -   [x] `response` → enum(["YES","NO","N/A"])
    -   [x] `additional_info` → string().optional()

### 3. Server Actions

-   [x] `app/action/screeningDetailAction.js`
    -   [x] `upsertManyScreeningDetails(appointmentId, answers[])` – bulk create/update inside a transaction using `updateOnDuplicate`.
    -   [x] `getScreeningDetails(appointmentId)` - fetch existing answers for a given appointment.
    -   [x] Guard all actions by session role = **Donor** and ownership of appointment.
    -   [x] Return structured `{ success, message, data }`.
-   [x] `getActiveScreeningQuestions()` – fetch ordered list where `is_active = true`.

### 4. Page Routing & ACL

-   [x] File: `app/(pages)/portal/(role_based)/donors/appointments/[id]/screening-questionaires/page.jsx`
    -   [x] Accept `params` and extract `id` as **donor_appointment_info_id**.
    -   [x] Server-side `auth()` to ensure user is the owner of the appointment.

### 5. Data Fetching (React Query)

-   [x] `useQuery` → `getActiveScreeningQuestions()`.
-   [x] `useQuery` → `getScreeningDetails(appointmentId)` to fetch existing answers and support update functionality.

### 6. Form Construction (React Hook Form + Zod)

-   [x] Dynamically build a form list from questions.
    -   [x] Radio group **YES/NO/N/A**.
    -   [x] Conditional `additional_info` textarea when response == "YES".
-   [x] Pre-fill form with existing answers if available.

### 7. Submission Flow

-   [x] `useMutation` → `upsertManyScreeningDetails`.
-   [x] On submit, show a confirmation modal summarizing answers.
-   [x] On final confirmation, on success → toast + `router.push` to appointments list.

### 8. UI Polishing

-   [x] Disable submit until all questions answered.
-   [x] Show progress indicator while saving.
-   [x] Responsive design for mobile.
-   [x] Dynamic submit button label ("Submit" vs "Update").

### 9. Testing

-   [x] Jest unit tests for `screeningDetailSchema`.
-   [x] Integration tests for `getScreeningDetails` and `upsertManyScreeningDetails` actions (create, update, auth).
-   [x] Cypress E2E: donor completes, confirms, and updates questionnaire.

### 10. Documentation

-   [x] Update **README.md** workflow diagram.
-   [x] Add UAT cases to this document to reflect new functionality.
-   [ ] Record loom video demo (optional).

### 11. UAT Cases

| Case ID | User Role | Description                                                                                             | Steps                                                                                                                                                                                            | Expected Result                                                                                                                            |
| :------ | :-------- | :------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| UAT-001 | Donor     | **Happy Path: Complete and Submit Questionnaire**                                                       | 1. Log in as a Donor. <br> 2. Navigate to "My Appointments". <br> 3. Click on an appointment requiring screening. <br> 4. Answer all questions. <br> 5. Click Submit. <br> 6. Review answers in the confirmation modal. <br> 7. Click "Confirm & Submit". | The form submits successfully with a success toast. The user is redirected to the appointments list. The appointment status is updated.       |
| UAT-002 | Donor     | **Validation: Attempt to Submit Incomplete Form**                                                       | 1. Follow steps 1-3 from UAT-001. <br> 2. Leave one or more questions unanswered. <br> 3. Attempt to click the submit button.                                                                       | The submit button is disabled. If enabled, clicking it shows validation errors for each unanswered question. The form does not submit.      |
| UAT-003 | Donor     | **Conditional Field: Answer "YES" to a question**                                                       | 1. Follow steps 1-3 from UAT-001. <br> 2. For a question, select the "YES" option.                                                                                                             | An "additional info" textarea appears below the question. The user can type in it.                                                         |
| UAT-004 | Donor     | **Authorization: Attempt to access another donor's questionnaire**                                      | 1. Log in as Donor A. <br> 2. Attempt to access the URL for Donor B's questionnaire (`/portal/donors/appointments/[donor_B_appt_id]/screening-questionaires`).                                    | The page displays an "Appointment not found or you do not have permission" error message. The questionnaire is not visible.                  |
| UAT-005 | Admin     | **Authorization: Attempt to access a donor's questionnaire**                                            | 1. Log in as an Admin. <br> 2. Attempt to access the URL for any donor's questionnaire.                                                                                                        | The page displays an "Appointment not found or you do not have permission" error message.                                                  |
| UAT-006 | Donor     | **Update Flow: Edit and re-submit a completed questionnaire**                                           | 1. Complete and submit a questionnaire (UAT-001). <br> 2. Navigate back to the questionnaire URL. <br> 3. Change an answer. <br> 4. Click "Update Questionnaire". <br> 5. Confirm changes in the modal. | The form is pre-filled with previous answers. The button says "Update Questionnaire". The submission is successful and data is updated.     |
| UAT-007 | Donor     | **Confirmation Modal: Cancel submission to edit answers**                                               | 1. Follow steps 1-5 from UAT-001. <br> 2. In the confirmation modal, click "Go Back & Edit".                                                                                                 | The modal closes. The user is returned to the form with their answers intact, and can continue editing before re-submitting.                |

---

## ⏭️ Next Steps

Once this plan is approved, proceed with step **1** and work sequentially.
