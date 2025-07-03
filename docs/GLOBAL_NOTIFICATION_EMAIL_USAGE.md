# Global Notification & Email Utility Usage

## Overview

The `sendNotificationAndEmail` utility provides a unified, reusable way to send in-app notifications and template-based emails to users from anywhere in the application. It is designed to be non-blocking and robust: if one notification or email fails, others will still proceed, and errors are logged for developer review.

---

## Importing the Utility

```js
import { sendNotificationAndEmail } from "@lib/notificationEmail.utils";
```

---

## Function Signature

```js
/**
 * Send notifications and/or emails to users.
 * @param {Object} options
 * @param {Array|Number} userIds - User ID(s) to notify
 * @param {Object} notificationData - { subject, message, type, reference_id, created_by }
 * @param {Object} emailData - { to, templateCategory, templateData }
 * @returns {Promise<Object>} - { notification: {success, ...}, email: {success, ...} }
 */
async function sendNotificationAndEmail({ userIds, notificationData, emailData })
```

---

## Usage Examples

### 1. Send a Notification to a User

```js
await sendNotificationAndEmail({
    userIds: userId,
    notificationData: {
        subject: "Welcome!",
        message: "Thank you for joining.",
        type: "GENERAL",
        reference_id: someId,
        created_by: adminId,
    },
});
```

### 2. Send a Template-Based Email

```js
await sendNotificationAndEmail({
    emailData: {
        to: "user@example.com",
        templateCategory: "WELCOME_EMAIL",
        templateData: {
            user_name: "John Doe",
            // ...other template variables
        },
    },
});
```

### 3. Send Both Notification and Email

```js
await sendNotificationAndEmail({
    userIds: userId,
    notificationData: {
        subject: "Action Required",
        message: "Please verify your account.",
        type: "ACTION",
        reference_id: someId,
        created_by: systemId,
    },
    emailData: {
        to: "user@example.com",
        templateCategory: "ACCOUNT_VERIFICATION",
        templateData: {
            user_name: "John Doe",
            // ...other template variables
        },
    },
});
```

---

## Best Practices

-   **Non-blocking:**
    -   Always wrap calls in `try/catch` if you want to ensure that a failure in one operation does not block others.
    -   In critical flows (like registration), run notification/email logic in a background async function so the user gets immediate feedback.
-   **Template-Only Email:**
    -   This utility only supports template-based emails (no HTML fallback). Ensure your template exists and is tested.
-   **Bulk Notifications:**
    -   You can pass an array of user IDs to `userIds` to notify multiple users at once.
-   **Error Handling:**
    -   Errors are returned in the result object and should be logged or handled as needed. In most user-facing flows, you do not need to inform the end user if a notification/email fails—just log the error for admin review.

---

## Example: Non-blocking Usage in Registration

```js
(async () => {
  try {
    await sendNotificationAndEmail({ ... }); // User notification
  } catch (err) { console.error("User notification failed:", err); }

  try {
    await sendNotificationAndEmail({ ... }); // Admin notification
  } catch (err) { console.error("Admin notification failed:", err); }

  try {
    await sendNotificationAndEmail({ ... }); // User email
  } catch (err) { console.error("User email failed:", err); }

  // ...etc
})();
```

---

## Notes

-   **User Experience:**
    -   End users will always receive a success/failure message for their main action (e.g., registration), regardless of notification/email delivery status.
    -   Notification/email failures are only visible to developers/admins via logs.
-   **Extensibility:**
    -   This utility can be extended to support SMS, push notifications, or other channels as needed.

---

## Contact

For questions or to add new notification/email templates, contact the development team or refer to the email template documentation.
