# Appointments Page UI/UX Improvement Plan

This document outlines a detailed plan to refactor and enhance the admin appointments page, focusing on UI/UX improvements, dashboarding, and advanced filtering.

## 1. UI/UX Overhaul: Dashboard & Tabbed View

### 1.1. Appointments Dashboard

**Goal:** Provide administrators with a high-level overview of appointment activity.

**Implementation:**

-   **Create a `DashboardStats` component** to be displayed at the top of the appointments page.
-   **Display key metrics** in stat cards, such as:
    -   Total Appointments Today
    -   Registered
    -   Collected
    -   Cancelled / No Show
-   **Add a date range filter** to the dashboard to allow admins to view stats for specific periods.

### 1.2. Tabbed Navigation for Statuses

**Goal:** Organize appointments by status for easier management and a cleaner interface.

**Implementation:**

-   **Integrate the `Tabs` component** from `shadcn/ui`.
-   **Create tabs for each appointment status:** `All`, `Registered`, `Examined`, `Collected`, `Cancelled`, `Deferred`, and `No Show`.
-   Each tab will render the `AppointmentDatatable` component, passing a filter prop to display the relevant appointments.

## 2. Advanced Filtering

### 2.1. Date Range Filtering (Backend)

**Goal:** Allow users to filter appointments by a specific date range.

**Implementation:**

-   **Add a `DatePickerWithRange` component** to the UI.
-   When a date range is selected, the component will trigger a new data fetch from the server, passing the start and end dates as query parameters.
-   The server action will be updated to filter the appointments based on the provided date range.

### 2.2. Retain Client-Side Filtering

**Goal:** Maintain the fast, responsive filtering for the currently displayed data.

**Implementation:**

-   The existing front-end filtering capabilities (search, dropdowns per column) will be preserved. This allows users to quickly refine the data set that has been loaded for the selected tab and date range.

## 3. Component & Code Quality Improvements

### 3.1. Refactor `appointmentsColumns.js`

**Goal:** Improve maintainability and reusability of the data table columns.

**Implementation:**

-   **Break down complex columns** into smaller, dedicated components (e.g., `AvatarColumn`, `NameColumn`, `StatusColumn`).
-   **Move utility functions** like `calculateAge` to a central `lib/utils` directory.

### 3.2. Create Reusable `StatusBadge` Component

**Goal:** Standardize the display of status information.

**Implementation:**

-   **Create a generic `StatusBadge` component** that accepts a `status` prop and dynamically renders the appropriate color and text based on the appointment status.

### 3.3. Enhance Loading States

**Goal:** Provide better visual feedback while data is being fetched.

**Implementation:**

-   **Create a `DataTableSkeleton` component** that mimics the structure of the data table, providing a more informative loading state than a generic spinner.

### 3.4. Code Quality

**Goal:** Ensure the codebase is clean, consistent, and easy to maintain.

**Implementation:**

-   **Use `moment.js`** (an existing dependency) for all date calculations to ensure accuracy.
-   **Add JSDoc annotations** to all new components and functions to improve code clarity and enable static analysis.
