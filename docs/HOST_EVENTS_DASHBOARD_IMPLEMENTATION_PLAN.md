# Host Events Dashboard Implementation Plan

## Objective

Replicate the admin events dashboard UI/UX for the host events page, but scoped to display only the host's agency events and restrict all event management actions (view-only). This ensures hosts have a rich, informative dashboard experience similar to admins, but with appropriate permissions and data scoping.

---

## 1. Analyze Admin Events Dashboard Features

-   Tabs: Dashboard, Ongoing, Upcoming, All, For-Approval
-   View Modes: Card/Table for event lists
-   Filters: Search, date range, agency, status
-   Analytics: Dashboard stats, charts, quick actions
-   Event Details: View, edit, manage, approve/reject (admin only)
-   Data: All events across agencies

## 2. Compare Host Events Page Implementation

-   Tabs: Approved, For-Approval, Others
-   View: Table only, no dashboard/analytics
-   Filters: Minimal or none
-   Data: Only agency events (already scoped)
-   Actions: Edit/view (should be view-only)
-   Missing: Dashboard/analytics, parity in tabs, filters, view modes

## 3. Design Host Events Dashboard (View-Only, Agency-Scoped)

-   Tabs:
    -   Dashboard (stats/analytics for agency events only)
    -   Ongoing (agency events, card/table view, no edit/manage)
    -   Upcoming (agency events, card/table view, no edit/manage)
    -   All (agency events, card/table view, no edit/manage)
    -   For-Approval (agency events, view-only)
-   Filters:
    -   Search, date range, status (agency only, no agency filter)
-   View Modes:
    -   Card/Table toggle for event lists
-   Analytics:
    -   Dashboard stats and charts for agency events only
-   Actions:
    -   All management actions (edit, approve, reject, etc.) must be hidden/disabled
    -   Only "View Details" and "See Donors" allowed

## 4. Refactor/Reuse Components

-   Extract and generalize dashboard, analytics, event card, datatable, and filter bar components to support both admin and host contexts
-   Add props/context for agency scoping and view-only mode
-   Ensure no admin-only actions are exposed to hosts

## 5. Implementation Steps

1. **Refactor shared components** to accept agencyId and viewOnly props
2. **Add dashboard and analytics tabs** to host events page, using agency-scoped data
3. **Implement Ongoing, Upcoming, All, For-Approval tabs** with card/table view toggle, filters, and agency-only data
4. **Remove/hide all management actions** for hosts (edit, approve, reject, etc.)
5. **Test all tabs and views** for correct data, UI/UX parity, and permission restrictions

## 6. Testing

-   Verify only agency events are shown
-   Confirm all management actions are hidden/disabled
-   Check all tabs, filters, and view modes work as expected
-   Ensure dashboard/analytics reflect only agency data
-   Compare UI/UX with admin dashboard for consistency

## 7. Documentation

-   Update/add documentation for the new host events dashboard
-   Note agency scoping, view-only restrictions, and shared component usage
-   Reference this plan in relevant README or feature docs

---

## TODO Checklist

-   [x] Analyze admin events dashboard UI/logic
-   [x] Compare host events page to admin dashboard
-   [ ] Design new host events dashboard (agency-scoped, view-only)
-   [ ] Refactor reusable components for shared use
-   [ ] Implement new host events dashboard UI/UX
-   [ ] Test for correct scoping, permissions, and UI/UX
-   [ ] Document the new dashboard and shared components
