### Plan: Register Existing User as a Donor

This plan outlines the steps to create a new tab in the Host/Organizer profile page that allows them to register as a donor using their existing account.

---

#### ✅ **Phase 1: Backend Development**

1.  **Create Zod Schema for Donor Registration**
    *   **File**: `lib/zod/donorSchema.js`
    *   **Action**: Create and export a new Zod schema named `existingUserAsDonorSchema`.
    *   **Details**: This schema will only include fields required for the `Donor` model that are not already present in the `User` model (e.g., `blood_type_id`, `height`, `weight`).

2.  **Create the Server Action**
    *   **File**: `app/action/donorAction.js`
    *   **Action**: Create and export a new server action: `registerExistingUserAsDonor(formData)`.
    *   **Logic**:
        *   The function must start with `"use server";`.
        *   Get the current user's session using `await auth()`.
        *   Check if the user already has the "Donor" role. If so, return `{ success: false, message: "You are already registered as a donor." }`.
        *   Call `getAgencyId()` from `hostEventAction.js` to get the user's `agency_id`.
        *   Validate the `formData` using the `existingUserAsDonorSchema`.
        *   Use `sequelize.transaction()` to perform the following database operations:
            1.  **Create Donor Record**: Create a new entry in the `donors` table, linking it to the `user.id` and the retrieved `agency_id`.
            2.  **Assign Donor Role**: Find the `id` of the "Donor" role from the `roles` table.
            3.  **Create UserRole Record**: Create a new entry in the `user_roles` table linking the `user.id` and the Donor role `id`.
        *   Log the audit trail for the registration event.
        *   Return `{ success: true, message: "You have successfully registered as a donor!" }`.
        *   Implement comprehensive `try...catch` blocks for error handling, using `logErrorToFile` as per the global rules.

---

#### ✅ **Phase 2: Frontend Development**

1.  **Create the Registration Form Component**
    *   **File**: `components/hosts/BecomeDonorForm.jsx` (new file)
    *   **Action**: Create a new client component for the registration form.
    *   **Details**:
        *   The component must start with `"use client";`.
        *   Use `react-hook-form` and the `zodResolver` with the `existingUserAsDonorSchema`.
        *   The form should include inputs for all fields in the schema (e.g., a dropdown for blood type).
        *   Use `useMutation` from `@tanstack/react-query` to call the `registerExistingUserAsDonor` server action.
        *   On mutation success, display a success toast/alert.
        *   On mutation error, display an error toast/alert and use `form.setError` to show field-specific errors if available.

2.  **Update the Host Profile Page**
    *   **File**: `app/(pages)/portal/(role_based)/hosts/profile/page.jsx`
    *   **Action**: Modify the profile page to include the new feature within a tab.
    *   **Details**:
        *   Add a new `<TabsTrigger value="become-donor">Become a Donor</TabsTrigger>`.
        *   Add a new `<TabsContent value="become-donor">`.
        *   Inside this new `TabsContent`, render the `<BecomeDonorForm />` component.
        *   Add a check to only show this tab if the user does *not* already have the "Donor" role. This can be done by passing the user's roles from the page to the component.

---
