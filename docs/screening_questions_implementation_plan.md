# Admin Screening Questions – Implementation Checklist

> Goal: Provide admins the ability to **list, add, edit, and delete** screening questions used during donor pre-screening.

---

-   [x] **1. Database & Model Validation**

    -   [x] Ensure `ScreeningQuestionModel.js` matches DB table (`screening_questions`).
    -   [x] Confirm relations (none required, but `ScreeningDetail` references it).
    -   [x] Run migration/seed to ensure table contains sample data (optional).

-   [x] **2. Zod Schema Review**

    -   [x] Re-use existing `lib/zod/screeningQuestionSchema.js` (`question`, `is_active`).
    -   [x] Export a helper `validateScreeningQuestion(input)` for server actions.

-   [x] **3. Server Actions / API**

    -   [x] Create `app/action/screeningQuestionAction.js` with async fns:
        -   `getAllScreeningQuestions()` – return paginated list.
        -   `createScreeningQuestion(data)` – Zod-validate, insert.
        -   `updateScreeningQuestion(id, data)` – validate & update.
        -   `deleteScreeningQuestion(id)` – soft-delete or destroy.
    -   [x] Protect with `requireRole('Admin')` wrapper.
    -   [x] _Note: API Routes are not used; all calls go through Server Actions._

-   [x] **4. Front-End Page Structure** (`app/(pages)/portal/(role_based)/admin/screening-questions/page.jsx`)

    -   [x] Wrap in `<WrapperHeadMain>` with breadcrumbs.
    -   [x] Initialise **TanStack Query** client & provider.
    -   [x] Fetch list via `useQuery(['screeningQuestions'], getAll...)`.
    -   [x] Render `DataTable` component:
            | Column | Description |
            | --- | --- |
            | Question | `question` text |
            | Status | Badge Active/Inactive |
            | Created | `created_at` formatted |
            | Actions | Edit / Delete buttons |

-   [x] **5. Add Screen Question Modal**

    -   [x] Component `AddQuestionModal.jsx` with **RHF** + Zod resolver.
    -   [x] On submit → `createScreeningQuestion` → invalidate query & close.

-   [x] **6. Edit Question Modal**

    -   [x] Prefill with selected row data.
    -   [x] On save → `updateScreeningQuestion` → invalidate list.

-   [x] **7. Delete Confirmation Dialog**

    -   [x] `AlertDialog` (shadcn/ui) asking “Are you sure?”.
    -   [x] On confirm → `deleteScreeningQuestion` → success toast.

-   [x] **8. Optimistic Updates & Toasts**

    -   [x] Show loading spinners, `react-hot-toast` success/error.

-   [x] **9. Sidebar Navigation**

    -   [x] Add link under Admin sidebar (`components/admin/AdminSidebar.jsx`).

-   [x] **10. Unit & E2E Tests**

    -   [x] Jest tests for actions (create/update validation).
    -   [x] Cypress happy-path: list → add → edit → delete.

-   [x] **11. Documentation**

    -   [x] Update `README.md` Features & Admin section.
    -   [ ] Add UAT cases to Admin spreadsheet (done separately).

-   [x] **12. Manual QA**
    -   [x] Smoke-test in browser under Admin role.
    -   [x] Verify audit trail entries for CRUD actions.

---

_After all boxes are checked, commit with message:_ **feat(admin): CRUD for screening questions**
