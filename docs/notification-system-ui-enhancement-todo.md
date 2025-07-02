# 📝 Notification System UI & Feature Enhancement Plan

This checklist guides the step-by-step enhancement of the notification system for the PCMC Pediatric Blood Center portal. It covers backend notification creation, frontend rendering, and UI/UX improvements for consistency with the latest site theme.

---

## ✅ Enhancement To-Do List

### 1. Backend: Notification Model & Actions

-   [x] Review and refactor `NotificationModel.js` for consistency and extensibility (DONE)
-   [x] Standardize notification types and payload format (e.g., subject, message, type, reference_id) (DONE)
-   [ ] Ensure all relevant actions create notifications (incremental, in-app and email):
    -   [ ] For each action, investigate if both in-app and email notifications are needed. Implement both if required.
    -   [ ] Agency Registration (storeAgency) — in-app + email
    -   [ ] Agency Approval/Rejection/Status Update (updateAgencyStatus)
    -   [ ] Agency Profile Update (updateAgency)
    -   [ ] Admin-Created Agency (createAgency)
    -   [ ] Coordinator Registration (storeCoordinator)
    -   [ ] Coordinator Update (updateCoordinator)
    -   [ ] Donor Registration
    -   [ ] Donor Approval/Status Update
    -   [ ] Donor Profile Update
    -   [ ] Appointment Booking, Update, or Cancellation
    -   [ ] Event Creation, Update, or Status Change
    -   [ ] Blood Collection Recorded
    -   [ ] Physical Exam Scheduled/Updated
    -   [ ] Password Change/Reset
    -   [ ] Role Change
    -   [ ] Account Deactivation/Deletion
-   [ ] Document a standard function/format for creating notifications in actions (e.g., `createNotification({ user_id, subject, message, type, reference_id, created_by })`)
-   [ ] Add tests or logs to verify notifications are created as expected

### 2. Frontend: NotificationComponent

-   [ ] Fetch notifications for the current user (API or server action)
-   [ ] Render notifications in NotificationComponent with unread/read state
-   [ ] Show notification count badge (unread only)
-   [ ] Mark notifications as read when opened or clicked
-   [ ] Add a "See All" or "View All Notifications" link/button
-   [ ] Display notification details (subject, message, time, type icon)
-   [ ] Add loading and empty states

### 3. UI/UX & Theming

-   [ ] Redesign NotificationComponent popover to match the latest theme (soft blues, reds, whites, darks, rounded corners, drop shadows)
-   [ ] Use modern icons for notification types (info, approval, system, etc.)
-   [ ] Ensure accessibility (ARIA roles, keyboard navigation, focus states)
-   [ ] Make the popover responsive and mobile-friendly
-   [ ] Add subtle animations for popover and notification items

### 4. Integration & Testing

-   [ ] Integrate NotificationComponent in the main layout (header/nav)
-   [ ] Test notification flow end-to-end (trigger, fetch, display, mark as read)
-   [ ] Solicit feedback and polish UI/UX

---

## 📋 List of Actions That Need Notifications

### Agency-Related Actions

-   [ ] Agency Registration (storeAgency): Notifies admin and MBDT when a new agency registers, notifies the registering user
-   [ ] Agency Approval/Rejection/Status Update (updateAgencyStatus): Notifies the agency head/user about approval, rejection, or status changes
-   [ ] Agency Profile Update (updateAgency): Notifies the agency head/user if their profile is updated (by admin or self)
-   [ ] Admin-Created Agency (createAgency): Notifies the new agency head/user about their account/role

### Coordinator-Related Actions

-   [ ] Coordinator Registration (storeCoordinator): Notifies the new coordinator and possibly the agency head/admin
-   [ ] Coordinator Update (updateCoordinator): Notifies the coordinator and/or agency head about changes

### Donor-Related Actions

-   [ ] Donor Registration: Notifies the donor and possibly admin/agency
-   [ ] Donor Approval/Status Update: Notifies the donor about approval, rejection, or status changes
-   [ ] Donor Profile Update: Notifies the donor if their profile is updated

### Appointment & Event Actions

-   [ ] Appointment Booking, Update, or Cancellation: Notifies the donor and event organizer/agency
-   [ ] Event Creation, Update, or Status Change: Notifies relevant users (admins, hosts, donors)

### Blood Collection/Physical Exam Actions

-   [ ] Blood Collection Recorded: Notifies the donor and possibly admin/agency
-   [ ] Physical Exam Scheduled/Updated: Notifies the donor

### System/User Actions

-   [ ] Password Change/Reset: Notifies the user
-   [ ] Role Change: Notifies the user
-   [ ] Account Deactivation/Deletion: Notifies the user

---

## 📝 Format for Creating a Notification

When adding notification logic to an action, use a standard format:

```js
await Notification.create({
    user_id, // Who should receive the notification
    subject, // Short title (e.g., "Agency Approved")
    message, // Detailed message
    type, // Enum: "AGENCY_APPROVAL", "GENERAL", etc.
    reference_id, // (Optional) Related entity ID
    created_by, // Who triggered the notification
});
```

**Instructions:**

-   Complete each step in order. After finishing a step, mark it as done (replace `[ ]` with `[x]`).
-   Once a step is done, notify your AI assistant to proceed to the next.
-   This plan is aligned with the project's goals and tech stack as described in the README.md.
