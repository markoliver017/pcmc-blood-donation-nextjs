# Announcements Feature Implementation Plan

## Overview

This plan outlines the step-by-step implementation of the Announcements feature for the PCMC Pediatric Blood Center portal. The feature will support three user roles:

-   **Admin**: Can create public announcements visible to all users and agency-specific announcements
-   **Agency Administrators (Hosts)**: Can create announcements visible only to their assigned donors
-   **Organizers (Agency Coordinators)**: Can create announcements visible only to their assigned donors

**Note**: Agency Administrators and Organizers share the same announcements interface and functionality since they have the same access level and permissions within their respective agencies.

## Implementation Checklist

### Phase 1: Backend Foundation

-   [x] **Step 1.1**: Create Zod validation schema for announcements

    -   [x] Create `lib/zod/announcementSchema.js`
    -   [x] Define validation rules for title, body, is_public, file_url
    -   [x] Include role-based validation (admin vs agency vs organizer)

-   [x] **Step 1.2**: Create server actions for announcements

    -   [x] Create `app/action/announcementAction.js`
    -   [x] Implement `fetchAnnouncements()` - get announcements based on user role
    -   [x] Implement `fetchAnnouncement(id)` - get single announcement
    -   [x] Implement `storeAnnouncement(formData)` - create new announcement
    -   [x] Implement `updateAnnouncement(id, formData)` - update existing announcement
    -   [x] Implement `deleteAnnouncement(id)` - delete announcement
    -   [x] Add proper error handling and validation

-   [x] **Step 1.3**: Implement role-based data access
    -   [x] Admin: Fetch all announcements (public and agency-specific)
    -   [x] Agency Administrator: Fetch only their agency's announcements and public ones
    -   [x] Organizer: Fetch only their agency's announcements and public ones
    -   [x] Add proper authorization checks for all roles

### Phase 2: Admin Interface

-   [x] **Step 2.1**: Create admin announcements page structure

    -   [x] Update `app/(pages)/portal/(role_based)/admin/announcements/page.jsx`
    -   [x] Add state management for modal visibility
    -   [x] Integrate with React Query for data fetching

-   [x] **Step 2.2**: Create admin announcements list component

    -   [x] Create `components/admin/announcements/AnnouncementsList.jsx`
    -   [x] Implement data table with sorting and filtering
    -   [x] Add action buttons (view, edit, delete)
    -   [x] Include status indicators and timestamps

-   [x] **Step 2.3**: Create admin announcement form components

    -   [x] Create `components/admin/announcements/CreateAnnouncementForm.jsx`
    -   [x] Create `components/admin/announcements/UpdateAnnouncementForm.jsx`
    -   [x] Use Tiptap rich text editor for body content
    -   [x] Use uploadPicture utility for image uploads
    -   [x] Use ImagePreviewComponent for image previews
    -   [x] Include agency selection for private announcements
    -   [x] Add form validation and error handling

-   [x] **Step 2.4**: Create admin announcement view component
    -   [x] Create `components/admin/announcements/ViewAnnouncementModal.jsx`
    -   [x] Display announcement details with rich formatting
    -   [x] Show associated agency information
    -   [x] Include image preview if available
    -   [x] Integrate ViewAnnouncementModal into admin announcements page
    -   [x] Add view functionality to AnnouncementsList component
    -   [x] Implement seamless transition from view to edit mode

### Phase 3: Host/Organizer Announcements Page (Shared Implementation)

**Note**: This implementation serves both "Agency Administrator" (hosts) and "Organizer" (agency coordinators) roles since they have the same functionality and access level.

-   [x] **Step 3.1**: Create host/organizer announcements page structure

    -   [x] Update `app/(pages)/portal/(role_based)/hosts/announcements/page.jsx`
    -   [x] Add page header with "Create Announcement" button
    -   [x] Add statistics cards (Total, Public, Agency-specific)
    -   [x] Add placeholder for announcements list component
    -   [x] **Functionality**: Works for both Agency Administrators and Organizers

-   [x] **Step 3.2**: Create host/organizer announcements list component

    -   [x] Create `components/hosts/announcements/AnnouncementsList.jsx`
    -   [x] Implement data table with columns: Title, Visibility, Created, Attachment, Actions
    -   [x] Add view, edit and delete action buttons
    -   [x] Integrate with host announcements page
    -   [x] Use host-specific query key for data fetching
    -   [x] **Functionality**: Works for both Agency Administrators and Organizers

-   [ ] **Step 3.3**: Create host/organizer announcement form components
    -   [ ] Create `components/hosts/announcements/CreateAnnouncementForm.jsx`
    -   [ ] Create `components/hosts/announcements/UpdateAnnouncementForm.jsx`
    -   [ ] Include fields: Title, Body, Public/Private toggle, File upload
    -   [ ] Auto-assign agency_id based on current user's agency (works for both roles)
    -   [ ] Implement form validation and error handling
    -   [ ] **Functionality**: Works for both Agency Administrators and Organizers

### Phase 4: Role-Based Access Control (RBAC) Implementation

-   [ ] **Step 4.1**: Implement role-based data filtering in server actions

    -   [ ] Update `fetchAnnouncements()` to filter by user role and agency
    -   [ ] Agency Administrators: See their agency's announcements + public ones
    -   [ ] Organizers: See their agency's announcements + public ones (via coordinator relationship)
    -   [ ] Ensure proper authorization checks

-   [ ] **Step 4.2**: Add role-based UI adaptations

    -   [ ] Update page title based on user role ("My Announcements" vs "Agency Announcements")
    -   [ ] Adjust empty state messages for different roles
    -   [ ] Ensure proper navigation access for both roles

-   [ ] **Step 4.3**: Test role-based functionality
    -   [ ] Test Agency Administrator access and permissions
    -   [ ] Test Organizer access and permissions
    -   [ ] Verify data isolation between different agencies
    -   [ ] Test public announcement visibility for both roles

### Phase 5: Form Implementation Details

-   [ ] **Step 5.1**: Implement announcement form fields

    -   [ ] Title field (required, max 255 characters)
    -   [ ] Body field (required, rich text or textarea)
    -   [ ] Public/Private toggle (checkbox or radio buttons)
    -   [ ] File upload field (optional, PDF/image support)
    -   [ ] Agency selection (admin only, dropdown)

-   [ ] **Step 5.2**: Add form validation and error handling

    -   [ ] Client-side validation using Zod schema
    -   [ ] Server-side validation in actions
    -   [ ] Display validation errors using `FieldError` component
    -   [ ] Show form-level errors using `DisplayValidationErrors`

-   [ ] **Step 5.3**: Implement file upload functionality
    -   [ ] Use existing `uploadPdfFile` action for file uploads
    -   [ ] Add file preview component
    -   [ ] Handle file removal functionality
    -   [ ] Add file size and type validation

### Phase 6: UI/UX Implementation

-   [ ] **Step 6.1**: Implement modal dialogs

    -   [ ] Create announcement modal for forms
    -   [ ] Add confirmation dialogs for delete actions
    -   [ ] Implement loading states with `LoadingModal`
    -   [ ] Add success/error notifications

-   [ ] **Step 6.2**: Add responsive design

    -   [ ] Ensure mobile-friendly layout
    -   [ ] Implement responsive data tables
    -   [ ] Add proper spacing and typography
    -   [ ] Test on different screen sizes

-   [ ] **Step 6.3**: Implement search and filtering
    -   [ ] Add search by title functionality
    -   [ ] Add filter by public/private status
    -   [ ] Add date range filtering
    -   [ ] Implement debounced search

### Phase 7: Data Management

-   [ ] **Step 7.1**: Implement React Query integration

    -   [ ] Add query keys: `["announcements"]`, `["announcement", id]`
    -   [ ] Implement proper cache invalidation
    -   [ ] Add optimistic updates for better UX
    -   [ ] Handle loading and error states

-   [ ] **Step 7.2**: Add audit trail logging
    -   [ ] Log announcement creation
    -   [ ] Log announcement updates
    -   [ ] Log announcement deletions
    -   [ ] Include user and timestamp information

### Phase 8: Testing and Validation

-   [ ] **Step 8.1**: Test admin functionality

    -   [ ] Test creating public announcements
    -   [ ] Test creating agency-specific announcements
    -   [ ] Test editing and deleting announcements
    -   [ ] Test search and filter functionality

-   [ ] **Step 8.2**: Test host/organizer functionality

    -   [ ] Test creating announcements for their agency
    -   [ ] Test editing and deleting their announcements
    -   [ ] Verify they can't access other agencies' announcements
    -   [ ] Test public announcement visibility

-   [ ] **Step 8.3**: Test organizer functionality

    -   [ ] Test creating announcements for their agency (as coordinators)
    -   [ ] Test editing and deleting their announcements
    -   [ ] Verify they can't access other agencies' announcements
    -   [ ] Test public announcement visibility

-   [ ] **Step 8.4**: Test role-based access control
    -   [ ] Verify admin can see all announcements
    -   [ ] Verify agency users only see their announcements and public ones
    -   [ ] Verify organizers only see their agency's announcements and public ones
    -   [ ] Test unauthorized access prevention
    -   [ ] Verify proper error messages for unauthorized actions

### Phase 9: Integration and Polish

-   [ ] **Step 9.1**: Add navigation integration

    -   [ ] Update navigation menu to include announcements
    -   [ ] Add breadcrumb navigation
    -   [ ] Ensure proper routing between pages

-   [ ] **Step 9.2**: Add final polish

    -   [ ] Add loading skeletons
    -   [ ] Implement empty state components
    -   [ ] Add tooltips and help text
    -   [ ] Optimize performance

-   [ ] **Step 9.3**: Documentation and cleanup
    -   [ ] Add JSDoc comments to functions
    -   [ ] Update README with announcements feature
    -   [ ] Clean up any unused code
    -   [ ] Final code review

## Technical Specifications

### Database Schema (Already exists)

```javascript
{
  id: INTEGER (Primary Key, Auto Increment)
  user_id: UUID (Foreign Key to Users)
  agency_id: INTEGER (Foreign Key to Agencies, nullable for admin)
  title: STRING (Required, max 255 chars)
  body: TEXT (Required)
  is_public: BOOLEAN (Default: false)
  file_url: TEXT (Optional)
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

### Query Keys

-   `["announcements"]` - List of announcements
-   `["announcement", id]` - Single announcement
-   `["admin-announcements"]` - Admin-specific announcements list

### File Structure

```

```
