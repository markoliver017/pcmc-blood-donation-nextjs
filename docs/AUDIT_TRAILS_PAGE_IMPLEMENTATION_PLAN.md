# 📋 Audit Trails Page Implementation Plan

## 🎯 **Project Overview**

Implementation of a robust, searchable, and filterable Audit Trails page for PCMC Admins at `/portal/admin/audit-trails`, providing visibility into user/system actions for security and debugging.

---

## 🗂️ **Data Model Reference**

-   **Model:** `AuditTrailModel` (see `lib/models/AuditTrailModel.js`)
-   **Fields:**
    -   `id`, `user_id`, `controller`, `action`, `is_error`, `details`, `ip_address`, `user_agent`, `stack_trace`, `createdAt`, `updatedAt`
    -   Association: `AuditTrail.belongsTo(models.User, { foreignKey: "user_id" })`

---

## 🛠️ **Backend/Server Actions**

### **Step 1: Create Server Actions** ✅ **COMPLETED**

-   [x] `fetchAuditTrails({ page, pageSize, filters, search })` – Paginated, filterable, searchable logs
-   [x] `fetchAuditTrailById(id)` – Fetch single log for detail modal
-   [x] `deleteAuditTrail(id)` – For super-admins only

### **Step 2: API/Action Implementation** ✅ **COMPLETED**

-   [x] Use Sequelize queries with `where` for filters/search
-   [x] Join with `User` model for user info
-   [x] Return paginated results: `{ data: [logs], total, page, pageSize }`
-   [x] Zod validation schemas implemented
-   [x] Error handling and response formatting
-   [x] User email filtering support

---

## 🖥️ **Frontend Page Structure**

### **Step 3: Page Layout** ✅ **COMPLETED**

-   [x] Header: Title, quick filters (date, error, user, controller, action), search bar
-   [x] Table/List: Paginated, sortable, responsive
-   [x] Columns: Date/Time, User, Controller, Action, Error, Details (truncated), IP, User Agent, [View Details]
-   [x] Details Modal/Drawer: Full log details, stack trace, timestamps

### **Step 4: Components** ✅ **COMPLETED**

-   [x] Basic table implementation in main page
-   [x] `AuditTrailTable.jsx` – Main table with pagination, sorting, row click for details
-   [x] `AuditTrailFilters.jsx` – Filter/search controls
-   [x] `AuditTrailDetailModal.jsx` – Shows full details, stack trace, etc.
-   [x] `AuditTrailPagination.jsx` – Custom pagination for server-side pagination
-   [ ] (Optional) `AuditTrailRow.jsx` – For row rendering
-   [ ] (Optional) Export Button – Export filtered logs as CSV

---

## 💡 **UI/UX Features**

-   [x] Search: Free-text search (details, stack trace, user)
-   [x] Filters: Date range, user, controller, action, error status
-   [x] Pagination: Page size selector, next/prev, total count
-   [ ] Sorting: By date, user, controller, action, error
-   [x] Error Highlighting: Color rows with `is_error: true`
-   [x] Responsive: Mobile-friendly, horizontal scroll for table
-   [ ] Accessibility: Keyboard navigation, ARIA labels
-   [x] Details Modal: Show all fields, formatted JSON for stack trace/details if needed

---

## 🪜 **Step-by-Step Implementation**

### **Phase 1: Backend** ✅ **COMPLETED**

-   [x] Create `app/action/auditTrailAction.js` with server actions
-   [x] Add Zod schemas for query validation

### **Phase 2: Frontend Components** ✅ **COMPLETED**

-   [x] Create `app/(pages)/portal/(role_based)/admin/audit-trails/page.jsx` (main page)
-   [x] Create `components/admin/audit-trails/AuditTrailTable.jsx`
-   [x] Create `components/admin/audit-trails/AuditTrailFilters.jsx`
-   [x] Create `components/admin/audit-trails/AuditTrailDetailModal.jsx`
-   [x] Create `components/admin/audit-trails/AuditTrailPagination.jsx`

### **Phase 3: Integration & UX** ✅ **COMPLETED**

-   [x] Integrate server actions with React Query
-   [x] Implement basic table with error highlighting
-   [x] Add filters/search and connect to backend
-   [x] Implement details modal/drawer
-   [x] Add loading, empty, and error states
-   [x] Test with real data and edge cases

### **Phase 4: Polish** 🔄 **IN PROGRESS**

-   [ ] Add accessibility improvements
-   [ ] Add CSV export (optional)
-   [ ] Final UI polish and documentation

---

## 📊 **Current Implementation Status**

### ✅ **Completed Features:**

-   Basic page structure with Card layout
-   Table with all required columns
-   Error highlighting for failed actions
-   User information display (name + email)
-   Truncated details and user agent display
-   React Query integration
-   Basic loading states
-   **Advanced filters component** with expandable interface
-   **Search functionality** across details, stack trace, and user information
-   **Custom pagination** with page size selector and navigation
-   **Details modal** with full audit trail information
-   **Copy to clipboard** functionality for important fields
-   **Responsive design** for mobile and desktop
-   **Loading states** and error handling throughout

### 🔄 **Next Priority Items:**

1. **Column sorting** - Add sorting functionality to table columns
2. **Accessibility improvements** - ARIA labels, keyboard navigation
3. **CSV export** - Export filtered results to CSV
4. **Performance optimization** - Debounce search, optimize queries
5. **Advanced features** - Bulk operations, real-time updates

---

## 📊 **Example Table Columns**

| Date/Time           | User      | Controller | Action  | Error | Details (truncated) | IP Address  | User Agent (truncated) | [View] |
| ------------------- | --------- | ---------- | ------- | ----- | ------------------- | ----------- | ---------------------- | ------ |
| 2024-05-01 12:34:56 | admin@... | login      | SUCCESS | ❌    | ...                 | 192.168.1.1 | Chrome/120...          | 🔍     |

---

## 🔒 **Security & Permissions**

-   [x] Only Admins (or higher) can access this page
-   [x] Only Super Admins can delete logs (if implemented)
-   [ ] Sensitive data (stack traces, IPs) should be protected

---

## 🚀 **Stretch Goals**

-   [ ] Export to CSV/Excel
-   [ ] Bulk delete (with confirmation)
-   [ ] Live updates (WebSocket or polling)
-   [ ] Audit trail for audit trail actions (meta!)

---

**Version:** 1.2.0  
**Created:** January 2025  
**Status:** Phase 4 - Polish & Optimization  
**Last Updated:** January 2025
