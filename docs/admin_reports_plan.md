# Admin Reports – Implementation Plan

## 0. Coding Standards & Conventions

1. **Path Aliases** – Always import internal components and utilities using the path aliases configured in `jsconfig.json`. Example:
    ```javascript
    import { Label } from "@components/ui/label";
    import { generate_pdf } from "@lib/generate.utils";
    ```
2. **shadcn/ui Components** – Prefer shadcn/ui primitives (`@components/ui/*`) for all new UI code to keep styling consistent.
3. **Select Item Values** – NEVER use an empty string (`""`) as the `value` on a `<SelectItem />`. Reserve an explicit token such as `"ALL"` to represent “no filter” so that clearing the selection (empty string) behaves correctly and avoids the runtime warning:
    > A `<Select.Item />` must have a value prop that is not an empty string.

## 1. Objective

Provide the Admin role with a self-service reporting hub that answers key operational questions and allows exporting each report as a paginated, printable PDF.

## 2. Recommended Reports & Data Sources

| #   | Report                               | Purpose                                                                                        | Primary Sequelize Models                                                                       |
| --- | ------------------------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | **Donation Summary** (by date range) | Track total units collected and average volume per donation.                                   | `BloodDonationCollection`, `BloodType`, `BloodDonationEvent`, `Donor`                          |
| 2   | **Blood Type Inventory**             | Show on-hand units per blood type and days of coverage.                                        | `BloodDonationCollection`, `BloodRequest`                                                      |
| 3   | **Event Performance**                | Compare registered vs. screened vs. collected donors per event.                                | `BloodDonationEvent`, `DonorAppointmentInfo`, `PhysicalExamination`, `BloodDonationCollection` |
| 4   | **Active Donor List**                | List donors who donated within a selectable period, inc. contact details & last donation date. | `Donor`, `BloodDonationHistory`                                                                |
| 5   | **Deferral / Screening Outcomes**    | Analyse positive answers that led to donor deferral.                                           | `ScreeningDetail`, `ScreeningQuestion`, `PhysicalExamination`                                  |
| 6   | **Agency Contribution**              | Rank partner agencies by units collected & attendance rate.                                    | `Agency`, `BloodDonationEvent`, `BloodDonationCollection`                                      |
| 7   | **Audit Trail**                      | Export system activities filtered by user / module / date.                                     | `AuditTrail`, `User`, `Role`                                                                   |
| 8   | **Contact Form Submissions**         | Monitor incoming inquiries and response status.                                                | `ContactForm`, `User` (admin responder)                                                        |

> Add future enhancements such as **Predictive Demand vs Supply** once ML module becomes available.

## 3. PDF Generation Stack

The project already includes a Puppeteer-based helper (`lib/generate.utils.js`) and an API route (`/api/generate-pdf`) that accepts raw HTML and returns a PDF buffer. All report exports should therefore:

1. Render the report React page to **static HTML** on the server (e.g., via `renderToString` or Next.js `renderToHTML`).
2. Call `POST /api/generate-pdf` with `{ html }` to generate the PDF using `generate_pdf(html)`.
3. Stream or download the resulting PDF to the Admin.

> Because this utility centralises all Puppeteer configuration, **do not** introduce additional PDF libraries for v1. If heavy batch generation becomes necessary, we can later evaluate `pdfmake` or another lightweight alternative.

```bash
# No extra install needed – Puppeteer is already included in the project
```

## 4. High-Level Architecture

```mermaid
graph TD
A[Admin UI /reports] -->|Fetch JSON| B[/api/reports/:type]
A -->|Export PDF| C[/api/reports/:type/pdf]
C --> D[Render report HTML]
D --> E[POST /api/generate-pdf]
E --> F[(PDF Buffer)]
F --> G[Stream to client]
B --> H[Sequelize aggregations]
```

## 5. API / Server Actions

| Endpoint / Action        | Method | Description                                                                                                                                  |
| ------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/reports/:type`     | GET    | Returns JSON for the given report, accepts query params (startDate, endDate, agencyId, etc.).                                                |
| `/api/reports/:type/pdf` | GET    | Renders the same report component to HTML, uses `fetch('/api/generate-pdf', { method: 'POST', body: { html } })`, then streams the PDF back. |
| `/api/generate-pdf`      | POST   | Existing endpoint that converts supplied HTML to PDF via `generate_pdf` utility.                                                             |

## 6. Database Queries (Sequelize Examples)

-   Donation Summary: `BloodDonationCollection.findAll({ attributes: [[fn('sum', col('volume')), 'totalVolume']], include:[BloodType], where:{ collectedAt:{ [Op.between]: [from, to] } } })`
-   Event Performance: Use `include` and `group` to combine Event, AppointmentInfo, Collection counts.

(See `docs/query_snippets.sql` for drafts.)

## 7. Sequelize Query Standards

To prevent runtime errors and ambiguous SQL column references, adhere to the following conventions for **all** report APIs:

1. **Explicit Column Qualifiers**  
   Always specify the full table alias in `Sequelize.col()` / `Sequelize.fn()` calls, e.g. `col("BloodDonationCollection.id")` instead of `col("id")`.

2. **Association Includes**  
   When joining related models, set `attributes: []` on the association object to avoid pulling unnecessary columns and to eliminate name collisions.

    ```js
    include: [
        {
            model: Donor,
            as: "donor",
            attributes: [],
        },
    ];
    ```

3. **Correct Column Names**  
   Respect the actual DB column names defined in each model:  
   • `BloodType` uses column `blood_type` (NOT `type`).  
   • `BloodRequest` uses `no_of_units` for requested units.  
   • `BloodDonationEvent` uses `agency_id` and `date`.

4. **Safe Where Conditions**  
   For filters on associated tables, reference them using the `$tableAlias.column$` syntax, e.g.

    ```js
    where: {
      "$event.date$": { [Op.between]: [start, end] }
    }
    ```

5. **Empty Attribute Arrays in Summary Queries**  
   When only aggregated data is required, always clear default attributes:

    ```js
    attributes: [],
    raw: true
    ```

6. **Group By with Qualified Columns**  
   Mirror the explicit column style in `group`/`order` clauses:  
   `group: [fn("DATE_FORMAT", col("event.date"), "%Y-%m")]`.

> Add any new query patterns to this list to keep standards up-to-date.

## 8. Front-End UI

1. New sidebar item `Reports` visible to role **Admin** only.
2. Tabbed interface (Donation, Inventory, Events, etc.).
3. Filter bar: date range picker, agency selector, blood type chips.
4. Display tables & charts (use `@tanstack/react-table` + `chart.js`).
5. `Export PDF` button per tab calls `/api/reports/:type/pdf`.

## 9. Security & Permissions

-   All endpoints behind NextAuth `requireRole('ADMIN')` middleware.
-   Sanitize query params, cap date range (e.g., ≤ 1 year) to prevent heavy queries.

## 10. Phased Development Timeline

| Phase                      | Duration        | Deliverables                                                                          |
| -------------------------- | --------------- | ------------------------------------------------------------------------------------- |
| 1. Foundation              | 2 days          | Create `/portal/admin/reports` route, skeleton tabs, and `ReportContext` for filters. |
| 2. Data APIs               | 3 days          | Build Sequelize queries & JSON endpoints for Donation Summary & Inventory.            |
| 3. PDF Service             | 2 days          | Implement puppeteer wrapper & first PDF template.                                     |
| 4. Additional Reports      | 4 days          | Event Performance, Active Donors, Agency Contribution.                                |
| 5. Audit & Contact Reports | 2 days          | Remaining reports + security review.                                                  |
| 6. QA & Polish             | 2 days          | Cross-browser test, print layout tweaks, docs update.                                 |
| **Total**                  | **15 dev days** | v1 ready for UAT                                                                      |

## 11. Acceptance Criteria

-   All listed reports render correctly with accurate data.
-   Exported PDFs match on-screen view and open in Acrobat without layout issues.
-   API endpoints reject non-admin users.
-   Unit tests cover critical aggregations.

## 12. Future Work

-   Scheduled email of PDF reports.
-   Caching layer (Redis) for expensive aggregations.
-   GraphQL reporting API.

---

_Prepared: 21 Jul 2025_
