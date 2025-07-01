# Event Dashboard Implementation Plan

## Overview

Create a comprehensive event dashboard for admin users to track donor/applicant statuses for specific blood donation events. The dashboard will display real-time statistics and detailed views of donors categorized by their appointment statuses.

## Current Status Analysis

Based on the codebase analysis, the following statuses are available in the system:

### DonorAppointmentInfo Statuses:

-   `registered` - Donor has booked an appointment
-   `cancelled` - Appointment was cancelled
-   `no show` - Donor didn't show up
-   `examined` - Physical examination completed
-   `collected` - Blood collection completed

### PhysicalExamination Eligibility Statuses:

-   `ACCEPTED` - Donor passed physical examination
-   `TEMPORARILY-DEFERRED` - Donor temporarily deferred
-   `PERMANENTLY-DEFERRED` - Donor permanently deferred

## Implementation Plan

### Phase 1: Backend Development

#### 1.1 Create Event Dashboard Action

-   [x] **Task 1.1.1**: Create `getEventDashboardData` function in `app/action/adminEventAction.js`
    -   Fetch event details by ID
    -   Get all appointments for the event
    -   Calculate status statistics
    -   Include donor and examination data
    -   Return formatted dashboard data

#### 1.2 Create Status-Specific Data Fetching Functions

-   [x] **Task 1.2.1**: Create `getEventAppointmentsByStatus` function

    -   Filter appointments by status
    -   Include related donor, examination, and collection data
    -   Support pagination and filtering

-   [x] **Task 1.2.2**: Create `getEventStatistics` function
    -   Calculate counts for each status
    -   Calculate success rates
    -   Calculate blood collection volumes
    -   Return real-time statistics

#### 1.3 Create Status Update Functions

-   [x] **Task 1.3.1**: Create `updateAppointmentStatus` function
    -   Update appointment status
    -   Handle status transitions
    -   Log audit trails
    -   Validate status changes

### Phase 2: Frontend Components Development

#### 2.1 Create Dashboard Layout Components

-   [x] **Task 2.1.1**: Create `EventDashboardLayout.jsx`

    -   Main dashboard container
    -   Header with event information
    -   Navigation tabs for different views
    -   Responsive grid layout

-   [x] **Task 2.1.2**: Create `EventDashboardHeader.jsx`
    -   Event title and date
    -   Event status and location
    -   Quick action buttons
    -   Event progress indicator

#### 2.2 Create Statistics Cards Components

-   [x] **Task 2.2.1**: Create `EventStatisticsCards.jsx`

    -   Total registered donors card
    -   Pending examination card
    -   Completed examinations card
    -   Successful collections card
    -   Deferred/No-show card
    -   Total blood volume and success rate cards
    -   Progress bars and trend indicators
    -   Responsive grid layout with hover effects

-   [x] **Task 2.2.2**: Create `StatusCard.jsx`
    -   Reusable status card component
    -   Color-coded status indicators
    -   Count and percentage display
    -   Click to view details functionality
    -   Trend indicators (up/down/neutral)
    -   Badge support and customizable styling

#### 2.3 Create Status-Specific List Components

-   [x] **Task 2.3.1**: Create `PendingDonorsList.jsx`

    -   List of registered donors awaiting examination
    -   Quick actions (mark as examined, no-show)
    -   Donor details and appointment time
    -   Search and filter functionality
    -   Status update modal integration
    -   Responsive card layout with donor avatars

-   [x] **Task 2.3.2**: Create `ExaminedDonorsList.jsx`

    -   List of donors who completed physical examination
    -   Examination results (accepted/deferred)
    -   Next action indicators
    -   Blood collection status
    -   Detailed examination results display
    -   Eligibility badges and medical notes

-   [x] **Task 2.3.3**: Create `CollectedDonorsList.jsx`

    -   List of successful blood collections
    -   Collection volume and method
    -   Collection timestamp
    -   Donor feedback/comments
    -   Summary card with total volume
    -   Certificate download and details actions

-   [x] **Task 2.3.4**: Create `DeferredDonorsList.jsx`
    -   List of deferred and no-show donors
    -   Deferral reasons and medical notes
    -   Filter tabs for deferred vs no-show
    -   Follow-up actions and details view
    -   Summary cards for each category
    -   Deferral type badges (temporary/permanent)

#### 2.4 Create Data Table Components

-   [x] **Task 2.4.1**: Create `EventDashboardDataTable.jsx`

    -   Comprehensive data table for all donors
    -   Status-based filtering with dropdowns
    -   Blood type and agency filtering
    -   Export functionality
    -   Sortable columns with visual indicators
    -   Advanced search functionality
    -   Action dropdown menus for each row

#### 2.5 Create Modal Components

-   [x] **Task 2.5.1**: Create `UpdateStatusModal.jsx`

    -   Modal for updating donor status
    -   Status transition validation
    -   Comments and remarks field
    -   Confirmation dialog
    -   Current status information display
    -   Examination status integration
    -   Form validation and error handling

-   [ ] **Task 2.5.2**: Create `DonorDetailsModal.jsx`
    -   Detailed donor information view
    -   Appointment history
    -   Examination results
    -   Collection history

### Phase 3: Main Dashboard Page Implementation

#### 3.1 Create Main Dashboard Page

-   [x] **Task 3.1.1**: Update `app/(pages)/portal/(role_based)/admin/(admin-events)/events/[id]/event-dashboard/page.jsx`
    -   Server-side data fetching with authentication checks
    -   Event validation and access control
    -   Comprehensive error handling with proper HTTP status codes
    -   Loading states and metadata generation
    -   Admin role verification and redirects

#### 3.2 Create Dashboard Client Component

-   [x] **Task 3.2.1**: Create `EventDashboardClient.jsx`
    -   Client-side state management with React hooks
    -   Real-time updates with auto-refresh (30-second intervals)
    -   User interactions and status updates
    -   Tab-based navigation with dynamic content
    -   Error handling and retry mechanisms
    -   Loading overlays and progress indicators

### Phase 4: Advanced Features

#### 4.1 Real-time Updates

-   [ ] **Task 4.1.1**: Implement WebSocket or polling for real-time updates
    -   Live status updates
    -   New appointment notifications
    -   Status change alerts

#### 4.2 Export and Reporting

-   [ ] **Task 4.2.1**: Create export functionality
    -   PDF report generation
    -   Excel/CSV export
    -   Event summary reports

#### 4.3 Analytics and Charts

-   [ ] **Task 4.3.1**: Add visualization components
    -   Status distribution pie chart
    -   Timeline chart of appointments
    -   Success rate trends
    -   Blood collection volume chart

### Phase 5: Integration and Testing

#### 5.1 Navigation Integration

-   [ ] **Task 5.1.1**: Add dashboard link to event navigation
    -   Update event page navigation
    -   Add breadcrumb navigation
    -   Ensure proper routing

#### 5.2 API Integration

-   [ ] **Task 5.2.1**: Integrate with existing appointment actions
    -   Connect with status update functions
    -   Integrate with examination actions
    -   Connect with collection actions

#### 5.3 Testing and Validation

-   [ ] **Task 5.3.1**: Test all status transitions
    -   Validate status update logic
    -   Test edge cases
    -   Performance testing

## Technical Specifications

### Data Structure

```javascript
// Dashboard Data Structure
{
  event: {
    id: number,
    title: string,
    date: string,
    status: string,
    location: string
  },
  statistics: {
    total_registered: number,
    pending_examination: number,
    examined: number,
    collected: number,
    deferred: number,
    no_show: number,
    success_rate: number
  },
  appointments: {
    pending: Array<Appointment>,
    examined: Array<Appointment>,
    collected: Array<Appointment>,
    deferred: Array<Appointment>,
    no_show: Array<Appointment>
  }
}
```

### Status Flow

```
registered → examined → collected
     ↓           ↓
  no_show    deferred
```

### Color Coding

-   **Registered/Pending**: Blue (`badge-primary`)
-   **Examined**: Orange (`badge-warning`)
-   **Collected**: Green (`badge-success`)
-   **Deferred**: Yellow (`badge-warning`)
-   **No Show**: Red (`badge-error`)

## File Structure

```
app/(pages)/portal/(role_based)/admin/(admin-events)/events/[id]/event-dashboard/
├── page.jsx                           # Main dashboard page
├── components/
│   ├── EventDashboardClient.jsx       # Client component
│   ├── EventDashboardHeader.jsx       # Header component
│   ├── EventStatisticsCards.jsx       # Statistics cards
│   ├── StatusCard.jsx                 # Individual status card
│   ├── PendingDonorsList.jsx          # Pending donors list
│   ├── ExaminedDonorsList.jsx         # Examined donors list
│   ├── CollectedDonorsList.jsx        # Collected donors list
│   ├── DeferredNoShowList.jsx         # Deferred/no-show list
│   ├── EventDonorsDataTable.jsx       # Main data table
│   ├── UpdateStatusModal.jsx          # Status update modal
│   └── DonorDetailsModal.jsx          # Donor details modal
└── columns/
    └── eventDonorsColumns.js          # Data table columns
```

## Dependencies

-   React Query for data fetching
-   React Hook Form for forms
-   Zod for validation
-   Lucide React for icons
-   DaisyUI for styling
-   SweetAlert for confirmations

## Success Criteria

-   [ ] Dashboard displays real-time statistics
-   [ ] All donor statuses are properly tracked
-   [ ] Status updates work correctly
-   [ ] UI is responsive and user-friendly
-   [ ] Performance is optimized
-   [ ] Error handling is comprehensive
-   [ ] Audit trails are maintained
-   [ ] Export functionality works
-   [ ] Real-time updates function properly

## Timeline Estimate

-   **Phase 1 (Backend)**: 2-3 days
-   **Phase 2 (Components)**: 3-4 days
-   **Phase 3 (Integration)**: 1-2 days
-   **Phase 4 (Advanced Features)**: 2-3 days
-   **Phase 5 (Testing)**: 1-2 days

**Total Estimated Time**: 9-14 days

---

**Note**: This plan should be reviewed and approved before implementation begins. Each task should be checked off as it's completed.
