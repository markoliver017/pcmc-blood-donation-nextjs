# 📝 Events List UI/UX Enhancement Plan (Admin)

## Overview

This plan outlines enhancements for the admin events page (`ListofEvents.jsx`), focusing on the Ongoing, Upcoming, All, and For-Approval tabs. The goal is to add flexible, modern, and visually appealing ways to view events—without removing the current data tables—by introducing additional view modes (e.g., Card/Grid view) and other improvements.

---

## TODO List

### 1. Add View Mode Tabs Inside Each Main Tab

-   [x] Add a secondary tab bar or segmented control inside each main tab (Ongoing, Upcoming, All, For-Approval)
-   [x] Options: **Table View** (default), **Card View**
-   [x] Use shadcn/ui or Radix Tabs for consistency

### 2. Card View Design

-   [x] Create an `AdminEventCard` component for card view (admin-specific, not used elsewhere)
-   [x] Card displays: Event title, date, agency, status, registration status, agency logo/avatar, status badges, quick stats, and actions
-   [x] Responsive grid layout (1 column on mobile, 2-3 on desktop)
-   [x] Add action buttons (View Details, Manage Event, Registered Donors, Approve/Reject, Registration Status, Cancel, etc.)
-   [x] **Card actions are now in a dropdown menu at the top right of each card for a clean UI**

### 3. Table View (Current)

-   [x] Keep the current DataTable as the default view
-   [ ] Enhance with row highlighting on hover
-   [ ] Add sticky headers for better navigation
-   [ ] Add a “View as Cards” button in the table header (optional)

### 4. Filtering and Sorting Enhancements

-   [ ] Add filter chips or dropdowns above the table/card area for quick filtering by agency, date, or status
-   [ ] Add a search bar for event title/agency

### 5. Event Details Modal/Drawer

-   [ ] Clicking a card or table row opens a modal or side drawer with full event details
-   [ ] Consistent design for both views

### 6. Empty State Improvements

-   [ ] For empty states, show a friendly illustration, message, and a call-to-action (e.g., “Create New Event”)

### 7. Performance & UX

-   [ ] Use skeleton loaders for both table and card views
-   [ ] Ensure all views are responsive (mobile & desktop)
-   [ ] Ensure accessibility (ARIA roles, keyboard navigation)

---

## Optional/Recommended Enhancements

-   [ ] Add a calendar view tab to visualize events by date
-   [ ] Add export/download options for admins
-   [ ] Enable bulk status updates or notifications
-   [ ] Show quick stats (e.g., total events, donors) above the tabs

---

**Status:** _In Progress. Card view and view mode toggle completed. Table view enhancements and advanced features pending._

---

## 1. **Filter & Search Bar Design**

-   **Location:** Above the Table/Card area, inside each main tab (Ongoing, Upcoming, All, For-Approval).
-   **Form Stack:** Use React Hook Form, Zod, and Shadcn/ui components.
-   **Features:**
    -   **Search:** Free-text search (event title, agency, etc.)
    -   **Date Range:** Filter by event date (from–to)
    -   **Status:** Multi-select (e.g., Ongoing, Upcoming, Completed, Cancelled)
    -   **Agency:** Async select (searchable, admin only)
    -   **Reset/Clear Filters** button

---

## 2. **Schema & Form Setup**

**lib/zod/eventFilterSchema.js**

```js
import { z } from "zod";

export const eventFilterSchema = z.object({
    search: z.string().optional(),
    dateRange: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
    status: z.array(z.string()).optional(),
    agency_id: z.string().optional(),
});
```

---

## 3. **Filter Form Component**

**components/admin/events/EventFilterBar.jsx**

```jsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFilterSchema } from "@lib/zod/eventFilterSchema";
import { Form, FormField, FormItem } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@components/ui/select";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { getSingleStyle } from "@/styles/select-styles";
import { useTheme } from "next-themes";
import { DateRangePicker } from "@components/ui/date-range-picker"; // If you have one

const AsyncSelectNoSSR = dynamic(() => import("react-select/async"), {
    ssr: false,
});

export default function EventFilterBar({
    onChange,
    defaultValues,
    statusOptions,
}) {
    const { resolvedTheme } = useTheme();
    const form = useForm({
        resolver: zodResolver(eventFilterSchema),
        defaultValues: defaultValues || {
            search: "",
            dateRange: { from: null, to: null },
            status: [],
            agency_id: "",
        },
    });

    // Fetch all agencies for admin
    const { data: agenciesRes, isLoading: isLoadingAgencies } = useQuery({
        queryKey: ["agencies"],
        queryFn: fetchAllAgencies, // implement this in your actions
        staleTime: 5 * 60 * 1000,
    });
    const agencies = agenciesRes?.success ? agenciesRes.data : [];

    // Client-side filter for react-select
    const loadAgencyOptions = async (inputValue) => {
        if (!agencies.length) return [];
        return agencies
            .filter((a) =>
                a.name.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((a) => ({ value: a.id, label: a.name }));
    };

    // Handle form changes (debounced)
    const handleChange = form.handleSubmit((values) => {
        onChange?.(values);
    });

    return (
        <Form {...form}>
            <form
                className="flex flex-wrap gap-4 items-end mb-4"
                onChange={handleChange}
                onSubmit={(e) => e.preventDefault()}
            >
                {/* Search */}
                <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem className="flex-1 min-w-[180px]">
                            <Input {...field} placeholder="Search events..." />
                        </FormItem>
                    )}
                />

                {/* Date Range */}
                <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                        <FormItem>
                            <DateRangePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Event date"
                            />
                        </FormItem>
                    )}
                />

                {/* Status Multi-select */}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <Select
                                multiple
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className="min-w-[120px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((s) => (
                                        <SelectItem
                                            key={s.value}
                                            value={s.value}
                                        >
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                {/* Agency Async Select */}
                <FormField
                    control={form.control}
                    name="agency_id"
                    render={({ field: { onChange, value, name, ref } }) => (
                        <FormItem className="min-w-[200px]">
                            <AsyncSelectNoSSR
                                name={name}
                                ref={ref}
                                isClearable
                                loadOptions={loadAgencyOptions}
                                onChange={(option) =>
                                    onChange(option?.value || "")
                                }
                                value={
                                    value
                                        ? {
                                              value,
                                              label:
                                                  agencies.find(
                                                      (a) => a.id === value
                                                  )?.name || "Loading...",
                                          }
                                        : null
                                }
                                styles={getSingleStyle(resolvedTheme)}
                                placeholder="Filter by agency"
                                isLoading={isLoadingAgencies}
                                noOptionsMessage={() => "No agencies found"}
                                loadingMessage={() => "Loading agencies..."}
                            />
                        </FormItem>
                    )}
                />

                {/* Reset/Clear */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        form.reset();
                        onChange?.(form.getValues());
                    }}
                >
                    Clear
                </Button>
            </form>
        </Form>
    );
}
```

---

## 4. **Usage in Events List Page**

**app/(pages)/portal/(role_based)/admin/(admin-events)/ListofEvents.jsx**

```jsx
import EventFilterBar from "@components/admin/events/EventFilterBar";

const statusOptions = [
    { value: "ongoing", label: "Ongoing" },
    { value: "upcoming", label: "Upcoming" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    // ...add more as needed
];

export default function ListofEvents() {
    const [filters, setFilters] = useState({});

    // Fetch events with filters (use TanStack Query or server action)
    const { data: events, isLoading } = useQuery({
        queryKey: ["admin-events", filters],
        queryFn: () => fetchAdminEvents(filters), // implement this
    });

    return (
        <div>
            <EventFilterBar
                onChange={setFilters}
                statusOptions={statusOptions}
            />
            {/* ...rest of your view mode tabs, Table/Card view, etc. */}
        </div>
    );
}
```

---

## 5. **Backend/Server Action Update**

-   Update your `fetchAdminEvents` server action to accept a filter object and apply filtering logic (search, date range, status, agency).
-   Use Zod validation for incoming filters.

---

## 6. **Guidelines Followed**

-   **Form stack:** React Hook Form, Zod, Shadcn/ui, TanStack Query, Async Select (see `FORM_DEVELOPMENT_GUIDELINES.md`)
-   **Patterns:** Debounced onChange, client-side filtering for selects, clear/reset, accessibility, and mobile-friendly layout.
-   **Extensible:** You can add more filters (e.g., event type, location) by extending the schema and form.

---

## 7. **Implementation Status**

✅ **COMPLETED:**

-   Created `lib/zod/eventFilterSchema.js` with proper Zod validation
-   Created `components/admin/events/EventFilterBar.jsx` with React Hook Form, debounced search, and expandable filters
-   Added `fetchAllAgencies` function to `app/action/agencyAction.js`
-   Integrated filter bars into all tabs (Ongoing, Upcoming, All, For-Approval) in `ListofEvents.jsx`
-   Implemented client-side filtering logic with `useMemo` for performance
-   Added filter-aware empty states with contextual messages
-   Updated all data sources to use filtered results

**Features Implemented:**

-   ✅ Search by event title, agency name, location, description
-   ✅ Date range filtering (from-to)
-   ✅ Status multi-select filtering
-   ✅ Agency async select filtering
-   ✅ Expandable filter interface
-   ✅ Clear/reset filters functionality
-   ✅ Debounced search (300ms delay)
-   ✅ Mobile-responsive design
-   ✅ Dark mode support
-   ✅ Loading states for agency data
-   ✅ Filter-aware empty states

---

## 8. **Next Steps**

-   Test the filtering functionality across all tabs
-   Consider adding sorting options (by date, title, agency, etc.)
-   Add export functionality for filtered results
-   Implement server-side filtering for large datasets if needed
