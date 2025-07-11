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

### **Step 1: Create Server Actions**

-   [ ] `fetchAuditTrails({ page, pageSize, filters, search })` – Paginated, filterable, searchable logs
-   [ ] `fetchAuditTrailById(id)` – Fetch single log for detail modal
-   [ ] (Optional) `deleteAuditTrail(id)` – For super-admins only

### **Step 2: API/Action Implementation**

-   [ ] Use Sequelize queries with `where` for filters/search
-   [ ] Join with `User` model for user info
-   [ ] Return paginated results: `{ data: [logs], total, page, pageSize }`

---

## 🖥️ **Frontend Page Structure**

### **Step 3: Page Layout**

-   [ ] Header: Title, quick filters (date, error, user, controller, action), search bar
-   [ ] Table/List: Paginated, sortable, responsive
-   [ ] Columns: Date/Time, User, Controller, Action, Error, Details (truncated), IP, User Agent, [View Details]
-   [ ] Details Modal/Drawer: Full log details, stack trace, timestamps

### **Step 4: Components**

-   [ ] `AuditTrailTable.jsx` – Main table with pagination, sorting, row click for details
-   [ ] `AuditTrailFilters.jsx` – Filter/search controls
-   [ ] `AuditTrailDetailModal.jsx` – Shows full details, stack trace, etc.
-   [ ] (Optional) `AuditTrailRow.jsx` – For row rendering
-   [ ] (Optional) Export Button – Export filtered logs as CSV

---

## 💡 **UI/UX Features**

-   [ ] Search: Free-text search (details, stack trace, user)
-   [ ] Filters: Date range, user, controller, action, error status
-   [ ] Pagination: Page size selector, next/prev, total count
-   [ ] Sorting: By date, user, controller, action, error
-   [ ] Error Highlighting: Color rows with `is_error: true`
-   [ ] Responsive: Mobile-friendly, horizontal scroll for table
-   [ ] Accessibility: Keyboard navigation, ARIA labels
-   [ ] Details Modal: Show all fields, formatted JSON for stack trace/details if needed

---

## 🪜 **Step-by-Step Implementation**

### **Phase 1: Backend**

-   [ ] Create `app/action/auditTrailAction.js` with server actions
-   [ ] Add Zod schemas for query validation (optional)

### **Phase 2: Frontend Components**

-   [ ] Create `app/(pages)/portal/(role_based)/admin/audit-trails/page.jsx` (main page)
-   [ ] Create `components/admin/audit-trails/AuditTrailTable.jsx`
-   [ ] Create `components/admin/audit-trails/AuditTrailFilters.jsx`
-   [ ] Create `components/admin/audit-trails/AuditTrailDetailModal.jsx`

### **Phase 3: Integration & UX**

-   [ ] Integrate server actions with React Query
-   [ ] Implement table with sorting, pagination, error highlighting
-   [ ] Add filters/search and connect to backend
-   [ ] Implement details modal/drawer
-   [ ] Add loading, empty, and error states
-   [ ] Test with real data and edge cases

### **Phase 4: Polish**

-   [ ] Add accessibility improvements
-   [ ] Add CSV export (optional)
-   [ ] Final UI polish and documentation

---

## 📊 **Example Table Columns**

| Date/Time           | User      | Controller | Action  | Error | Details (truncated) | IP Address  | User Agent (truncated) | [View] |
| ------------------- | --------- | ---------- | ------- | ----- | ------------------- | ----------- | ---------------------- | ------ |
| 2024-05-01 12:34:56 | admin@... | login      | SUCCESS | ❌    | ...                 | 192.168.1.1 | Chrome/120...          | 🔍     |

---

## 🔒 **Security & Permissions**

-   [ ] Only Admins (or higher) can access this page
-   [ ] Only Super Admins can delete logs (if implemented)
-   [ ] Sensitive data (stack traces, IPs) should be protected

---

## 🚀 **Stretch Goals**

-   [ ] Export to CSV/Excel
-   [ ] Bulk delete (with confirmation)
-   [ ] Live updates (WebSocket or polling)
-   [ ] Audit trail for audit trail actions (meta!)

---

**Version:** 1.0.0  
**Created:** January 2025  
**Status:** Planning
