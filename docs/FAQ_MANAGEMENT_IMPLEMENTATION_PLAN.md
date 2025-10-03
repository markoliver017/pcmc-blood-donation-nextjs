# FAQ Management Module - Implementation Plan

## Overview
This plan outlines the complete implementation of a FAQ (Frequently Asked Questions) management system with full CRUD operations for the PCMC Blood Donation Portal admin module.

---

## Implementation Status

- [x] **Step 1**: Create the Sequelize Model (`lib/models/FaqModel.js`) ✅
- [x] **Step 2**: Register the Model (`lib/models/index.js`) ✅
- [x] **Step 3**: Create Zod Validation Schema (`lib/zod/faqSchema.js`) ✅
- [x] **Step 4**: Implement Server Actions (`app/action/faqAction.js`) ✅
- [x] **Step 5**: Create UI Components (`components/admin/faq/`) ✅
- [x] **Step 6**: Create Admin Page Route (`app/(pages)/portal/(role_based)/admin/faq/page.jsx`) ✅
- [x] **Step 7**: Update Public FAQ Display (`components/pages/DonationProcess/FAQSection.jsx`) ✅

**Status**: ✅ **COMPLETED** - All implementation steps finished successfully!

---

## Database Schema

### Table: `faqs`

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER (PK, Auto-increment) | Primary key |
| `question` | STRING(500) | FAQ question text |
| `answer` | TEXT | FAQ answer text |
| `category` | ENUM | Category type |
| `keywords` | JSON | Array of keywords for search |
| `display_order` | INTEGER | Order for display (default: 0) |
| `is_active` | BOOLEAN | Active status (default: true) |
| `created_by` | UUID (FK) | User who created the FAQ |
| `updated_by` | UUID (FK) | User who last updated the FAQ |
| `createdAt` | TIMESTAMP | Creation timestamp |
| `updatedAt` | TIMESTAMP | Last update timestamp |

### Categories
- `general` - General information
- `donation_process` - Blood donation process questions
- `eligibility` - Donor eligibility requirements
- `health_safety` - Health and safety concerns
- `appointments` - Scheduling and appointments
- `account` - User account management
- `blood_types` - Blood type information
- `after_donation` - Post-donation care

---

## Step 4: Server Actions

**File**: `app/action/faqAction.js`

### Functions to Implement:

1. **`fetchFaqs(filters)`**
   - Get all FAQs with optional filtering
   - Supports filtering by: category, is_active, search term
   - Returns FAQs ordered by display_order and createdAt
   - Includes creator/updater user information
   - Public access for active FAQs, admin access for all

2. **`fetchFaqById(id)`**
   - Get single FAQ by ID
   - Returns FAQ with associations (creator, updater)
   - Admin-only access

3. **`storeFaq(formData)`**
   - Create new FAQ
   - Validates with `createFaqSchema`
   - Sets `created_by` from session user
   - Uses transaction for data integrity
   - Logs audit trail
   - Admin-only access

4. **`updateFaq(formData)`**
   - Update existing FAQ
   - Validates with `updateFaqSchema`
   - Sets `updated_by` from session user
   - Uses transaction
   - Logs audit trail
   - Admin-only access

5. **`deleteFaq(id)`**
   - Soft delete FAQ (sets is_active = false)
   - Admin-only operation
   - Uses transaction
   - Logs audit trail

6. **`reorderFaqs(faqOrders)`**
   - Bulk update display_order
   - Accepts array of {id, display_order}
   - Uses transaction for atomic update
   - Admin-only access

---

## Step 5: UI Components

**Directory**: `components/admin/faq/`

### 5.1 CreateFaqForm.jsx
- Client component with React Hook Form
- Fields:
  - `question` (Input)
  - `answer` (Tiptap rich text editor)
  - `category` (Select dropdown)
  - `keywords` (CreatableSelect for tags)
  - `display_order` (Number input)
  - `is_active` (Switch/Checkbox)
- Form validation with Zod
- Success/error notifications
- Loading state during submission

### 5.2 UpdateFaqForm.jsx
- Similar to CreateFaqForm
- Pre-populates data from selected FAQ
- Fetches FAQ data by ID using `fetchFaqById`
- Updates `updated_by` field automatically

### 5.3 FaqsList.jsx
- Displays FAQs in a data table (TanStack Table)
- Columns:
  - Question (truncated with tooltip)
  - Category (with badge)
  - Status (Active/Inactive badge)
  - Display Order
  - Actions (View, Edit, Delete)
- Features:
  - Search/filter by category
  - Toggle active/inactive status
  - Sortable columns
  - Pagination
  - Row actions menu
- Responsive design

### 5.4 ViewFaqModal.jsx
- Read-only view of FAQ details
- Shows all fields including:
  - Question and Answer
  - Category
  - Keywords
  - Display Order
  - Status
  - Created by/date
  - Updated by/date
- Action buttons:
  - Edit (opens UpdateFaqForm)
  - Delete (with confirmation)
  - Close

### 5.5 FaqCategoryBadge.jsx
- Reusable badge component for category display
- Color-coded by category type:
  - `general` - Gray
  - `donation_process` - Blue
  - `eligibility` - Green
  - `health_safety` - Red
  - `appointments` - Purple
  - `account` - Yellow
  - `blood_types` - Pink
  - `after_donation` - Teal

---

## Step 6: Admin Page Route

**File**: `app/(pages)/portal/(role_based)/admin/faq/page.jsx`

### Features:
- Statistics cards showing:
  - Total FAQs
  - Active FAQs
  - Inactive FAQs
  - FAQs by category
- Filter controls:
  - Category filter (dropdown)
  - Status filter (All/Active/Inactive)
  - Search input
- Action button: "New FAQ"
- FAQs list component
- Modals for Create, Update, and View operations
- Uses TanStack Query for data fetching and caching

---

## Step 7: Update Public FAQ Display

**File**: `components/pages/DonationProcess/FAQSection.jsx`

### Changes:
1. Replace hardcoded FAQ data with API call
2. Use `fetchFaqs({ is_active: true })` to get active FAQs
3. Use TanStack Query for data fetching
4. Add optional category filtering tabs
5. Maintain existing UI/UX design (accordion style)
6. Add loading skeleton while fetching
7. Handle empty state gracefully

---

## File Structure Summary

```
lib/
├── models/
│   ├── FaqModel.js ✅ (CREATED)
│   └── index.js ✅ (MODIFIED)
└── zod/
    └── faqSchema.js ✅ (CREATED)

app/
├── action/
│   └── faqAction.js ⏳ (TO CREATE)
└── (pages)/
    └── portal/
        └── (role_based)/
            └── admin/
                └── faq/
                    └── page.jsx ⏳ (TO CREATE)

components/
├── admin/
│   └── faq/
│       ├── CreateFaqForm.jsx ⏳ (TO CREATE)
│       ├── UpdateFaqForm.jsx ⏳ (TO CREATE)
│       ├── FaqsList.jsx ⏳ (TO CREATE)
│       ├── ViewFaqModal.jsx ⏳ (TO CREATE)
│       └── FaqCategoryBadge.jsx ⏳ (TO CREATE)
└── pages/
    └── DonationProcess/
        └── FAQSection.jsx ⏳ (TO MODIFY)
```

---

## Additional Features (Optional Enhancements)

1. **FAQ Analytics**: Track view counts and helpful votes
2. **Multi-language Support**: Add translations for FAQs
3. **FAQ Categories Management**: Separate CRUD for categories
4. **Related FAQs**: Link related questions
5. **FAQ Search API**: Public endpoint for FAQ search
6. **Export/Import**: Bulk FAQ management via CSV/JSON
7. **Drag-and-drop Reordering**: Visual reordering interface

---

## Testing Checklist

- [ ] Model associations work correctly
- [ ] All CRUD operations function properly
- [ ] Form validation catches invalid inputs
- [ ] Admin-only access control enforced
- [ ] Audit trails are logged
- [ ] Public FAQ display shows only active FAQs
- [ ] Search and filtering work correctly
- [ ] Reordering updates display_order
- [ ] Keywords are stored and retrieved as JSON
- [ ] Category filtering works on public page
- [ ] Rich text editor saves HTML properly
- [ ] Modals open/close correctly
- [ ] Success/error notifications display

---

## Notes

- Follow global coding rules from `/global_rules` workflow
- Use existing patterns from Announcements module as reference
- Ensure all components use shadcn/ui and Tailwind CSS
- Implement proper error handling and loading states
- Add JSDoc comments for better code documentation
