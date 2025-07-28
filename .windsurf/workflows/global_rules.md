---
description: global rules
---

### **Global Coding Rules for `c:\nextJs\blood-bank-portal`**

#### **1. Tech Stack & Core Libraries**

-   **Framework**: Next.js 15+ (App Router)
-   **Language**: JavaScript (with JSDoc for type-hinting)
-   **Database ORM**: Sequelize with MySQL.
-   **UI**:
    -   **Components**: `shadcn/ui` built on Radix UI primitives.
    -   **Styling**: Tailwind CSS.
    -   **Utility Classes**: DaisyUI can be used where appropriate.
-   **State Management**:
    -   **Client-side Cache**: TanStack Query (`@tanstack/react-query`) for server state.
    -   **Form State**: React Hook Form (`react-hook-form`).
-   **Validation**: Zod for schema definition and validation, integrated with React Hook Form via `@hookform/resolvers`.
-   **Authentication**: NextAuth.js for session management and role-based access control.

#### **2. Import & Module Conventions**

-   **ES Modules**: The project is configured with `"type": "module"`. Use `import`/`export` syntax.
-   **Path Aliases**: Always use the aliases defined in `jsconfig.json` for cleaner imports:
    -   `@/*`: `app/*`
    -   `@lib/*`: `lib/*`
    -   `@components/*`: `components/*`
    -   `@pages/*`: `app/(pages)/*`
    -   `@role_based/*`: `app/(pages)/portal/(role_based)/*`
    -   `@action/*`: `app/action/*`

#### **3. Server Actions (`app/action/*.js`)**

-   **Directive**: Start every server action file with `"use server";`.
-   **Naming**: Name files according to the entity they manage (e.g., `agencyAction.js`, `donorAction.js`).
-   **Structure**:
    1.  **Authentication**: Begin actions by checking user session and roles using the `@lib/auth` utility.
    2.  **Validation**: Validate incoming `formData` against a Zod schema.
    3.  **Database Logic**: Use Sequelize models for database interactions, preferably within a `sequelize.transaction()`.
    4.  **Return Value**: Return a consistent object shape:
        -   **Success**: `{ success: true, data: ... }`
        -   **Error**: `{ success: false, message: "...", error: ... }`
-   **Error Handling**: Use the `handleValidationError` or `handleServerError` utilities from `@lib/utils/validationErrorHandler` to process errors.

#### **4. Form Development**

-   **Directive**: All form components must be client components (`"use client";`)
-   **Structure**:
    -   **Schema**: Define Zod schemas in `lib/zod/[entity]Schema.js`.
    -   **Form Hook**: Use the `useForm` hook with `zodResolver`.
    -   **Server State**: Use `useMutation` from TanStack Query to call server actions.
    -   **UI**: Build forms using `shadcn/ui` components (`<Form>`, `<FormField>`, `<FormControl>`, etc.).
-   **File Organization**:
    -   **Reusable Fields**: Place generic form components in `components/form/`.
    -   **Entity Forms**: Create entity-specific forms in `components/[entity]/`.

#### **5. Error Handling**

-   **Server-Side**: Use `handleServerError` in server actions to catch and format errors.
-   **Client-Side (Forms)**: `useMutation`'s `onError` callback should be used to display server validation errors, often by setting form errors with `form.setError()`.
-   **General Errors**: Use `extractErrorMessage` for simple, string-based error messages where structured responses are not needed.
