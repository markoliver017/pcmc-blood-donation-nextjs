# Admin Dashboard Optimization Plan

This document outlines a detailed plan to optimize the Admin Dashboard page (`/portal/admin`). The goal is to improve performance, enhance user experience, and increase code maintainability.

## 1. Data Fetching and State Management Strategy

The current dashboard uses multiple `useQuery` hooks to fetch data. We can centralize and streamline this process.

### To-Do List:

-   [x] **Consolidate Data Fetching:**
    -   [x] Modify the `getAdminDashboard` server action to include the counts for `forApprovalEvents` and `forApprovalAgencies` directly. This will reduce the number of separate database queries and network requests on page load from three to one.
    -   [x] Update the `useQuery` hook in `Dashboard.jsx` to rely solely on the consolidated `getAdminDashboard` action.

-   [x] **Leverage Suspense for Data Loading:**
    -   [x] Wrap the `Dashboard` component in `page.js` with a React `<Suspense>` boundary.
    -   [x] Create a dedicated loading skeleton component (e.g., `DashboardSkeleton.jsx`) that mimics the layout of the dashboard. This will provide a better initial loading experience than the current inline skeleton elements.
    -   [x] This allows the page to render instantly with a fallback UI while data is being fetched on the server.

-   [ ] **Prefetch Data on Navigation:**
    -   For links pointing to the admin dashboard from other pages, use Next.js's `prefetch` prop or a custom prefetching strategy with TanStack Query to load the dashboard data before the user even clicks the link.

## 2. Component-Level Performance Optimization

We can optimize individual components to prevent unnecessary re-renders and improve rendering speed.

### To-Do List:

-   [ ] **Memoize Components:**
    -   Wrap the main sections of the dashboard (e.g., `Metrics`, `Calendar`, `ActionPanel`) in `React.memo` to prevent them from re-rendering if their props haven't changed.

-   [x] **Lazy Load Heavy Components:**
    -   [x] The `AllEventCalendar` component is likely complex. Use `next/dynamic` to lazy-load it. This will reduce the initial JavaScript bundle size, as the calendar code will only be loaded when the component is about to be rendered.
    -   [x] Provide a simple skeleton loader for the lazy-loaded calendar.

    ```javascript
    // Example in Dashboard.jsx
    import dynamic from 'next/dynamic';

    const AllEventCalendar = dynamic(() => import('@components/organizers/AllEventCalendar'), {
      loading: () => <div className="skeleton h-96 w-full"></div>,
      ssr: false // If the calendar is client-side only
    });
    ```

-   [ ] **Optimize Lists:**
    -   Ensure that the `ForApprovalEventList` and `ForApprovalAgencyList` components use the `key` prop correctly on the root element of the mapped items. This is crucial for efficient list re-rendering.
    -   If these lists can become very long, consider implementing virtualization (windowing) with a library like `react-window` or `tanstack-virtual` to only render the items currently in the viewport.

## 3. Code Structure and Reusability

Refactoring the code will improve its readability and make it easier to maintain and extend.

### To-Do List:

-   [x] **Create Granular Components:**
    -   [x] Break down the main `Dashboard.jsx` into smaller, reusable components like `MetricCard.jsx` and `ActionPanel.jsx`.
    -   [x] Each component should be responsible for a single piece of the UI.

-   [x] **Centralize TanStack Query Keys:**
    -   [x] Create a dedicated file (e.g., `lib/queryKeys.js`) to store all TanStack Query keys. This avoids magic strings and makes managing keys across the application easier.

    ```javascript
    // lib/queryKeys.js
    export const adminKeys = {
      dashboard: () => ['admin-dashboard'],
      // ... other keys
    };
    ```

## 4. User Experience (UX) Enhancements

These changes will make the dashboard feel faster and more responsive to the user.

### To-Do List:

-   [ ] **Implement Optimistic Updates:**
    -   When an admin approves or rejects an event or agency from the dashboard, use TanStack Query's optimistic updates feature. The UI should update instantly, assuming the action will succeed, and then revert only if the server returns an error. This makes the application feel instantaneous.

-   [ ] **Add Transitions for Loading States:**
    -   Use a library like `framer-motion` or simple CSS transitions to smoothly fade in content as it loads, rather than having it pop into place. This creates a more polished feel.

-   [ ] **Refine Refresh Intervals:**
    -   Review the `staleTime` and `cacheTime` for the dashboard queries. Consider adding a manual "Refresh" button and setting a longer `staleTime` to prevent unnecessary background refetching, while still allowing the user to get fresh data on demand.

## 5. Analytics and Visualizations

To provide deeper insights into the platform's operations, a dedicated analytics section with charts and graphs should be added to the admin dashboard. Based on the available data models (`Donor`, `BloodDonationEvent`, `BloodDonationCollection`, etc.), the following visualizations are recommended.

**Recommended Library:** [**Recharts**](https://recharts.org/) - A composable charting library built on React components, making it an excellent choice for a Next.js application.

### To-Do List:

-   [ ] **Integrate a Charting Library:**
    -   Install and configure `recharts` in the project.

-   [ ] **Create New Server Actions for Analytics Data:**
    -   Develop dedicated server actions to query and aggregate the data needed for each chart (e.g., `getDonationTrends`, `getDonorDemographics`). These actions should perform the necessary grouping and counting on the database side for efficiency.

-   [ ] **Develop Analytics Components:**
    -   Create a new `AnalyticsDashboard` component to house all the charts.
    -   For each chart, create a separate, reusable component (e.g., `DonationTrendChart`, `BloodTypeDistributionChart`).

### Recommended Charts & Graphs:

1.  **Donor Insights:**
    -   **Chart Type:** Line Chart
    -   **Data:** `Donor` registrations over time (grouped by month/year).
    -   **Purpose:** To visualize the growth of the donor community.

2.  **Blood Collection Trends:**
    -   **Chart Type:** Bar Chart
    -   **Data:** `BloodDonationCollection` volume by `BloodType`.
    -   **Purpose:** To show which blood types are most and least collected.

3.  **Event Performance:**
    -   **Chart Type:** Bar Chart
    -   **Data:** Total donations per `BloodDonationEvent`.
    -   **Purpose:** To identify the most successful blood drives.

4.  **Agency Contributions:**
    -   **Chart Type:** Pie Chart or Bar Chart
    -   **Data:** Number of events or total donations associated with each `Agency`.
    -   **Purpose:** To highlight the contributions of partner agencies.

5.  **Blood Request vs. Collection:**
    -   **Chart Type:** Combined Line/Bar Chart
    -   **Data:** `BloodRequest` volume vs. `BloodDonationCollection` volume over time.
    -   **Purpose:** To track supply and demand, identifying potential shortages.

6.  **Appointment Success Rate:**
    -   **Chart Type:** Donut Chart
    -   **Data:** `DonorAppointmentInfo` status breakdown (e.g., 'Completed', 'Cancelled', 'No-show').
    -   **Purpose:** To monitor the effectiveness of the appointment system.

By systematically implementing these optimizations, the admin dashboard will become significantly more performant, scalable, and enjoyable to use.

-   [x] **Donations Over Time (Line Chart):**
    -   [x] Display the trend of blood donations over the last 6-12 months.

-   [x] **Blood Type Distribution (Pie Chart):**
    -   [x] Show the percentage of each blood type collected.

-   [ ] **Event Success Rate (Bar Chart):**
    -   Compare `total_participants` vs. `successful_donations` for the last 5-10 completed events.

## 6. Code Quality & Maintainability

-   [x] **Centralize TanStack Query Keys:**
    -   [x] Create a dedicated file (e.g., `lib/queryKeys.js`) to store all TanStack Query keys. This avoids magic strings and makes managing keys across the application easier.

-   [ ] **Data Prefetching:**
    -   Use TanStack Query's `prefetchQuery` on the server-side in `page.js` to fetch initial dashboard data before the client-side render. This will make the data available in the cache immediately, improving perceived load times.

## 7. UX Enhancements (Future Scope)
