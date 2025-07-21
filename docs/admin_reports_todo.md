# Admin Reports – Implementation TODO

> Tick each box **after** verifying the step works before moving on.

> **Code standards reminder:** use @components / @lib aliases (see `jsconfig.json`) and never assign an empty string to `<SelectItem value>`.

> **Sequelize Query Standards Checklist (apply to every API):**
>
> -   [ ] Use qualified columns in `col()` / `fn()` e.g. `col("BloodDonationCollection.id")`
> -   [ ] Set `attributes: []` on all joins unless columns are needed
> -   [ ] Use correct DB column names (`blood_type`, `no_of_units`, etc.)
> -   [ ] Use `$alias.column$` syntax in `where`
> -   [ ] Include `raw: true` and qualify columns in `group`/`order`

## Phase 1 – Foundation

-   [x] Scaffold page route `app/(pages)/portal/(role_based)/admin/reports/page.jsx` with sidebar link
-   [x] Add tabbed interface (Donation, Inventory, Events, Donors, Agencies, Audit, Contact)
-   [x] Implement `ReportContext` + filter bar (date range, agency, blood type) **using `"ALL"` as “no filter” SelectItem value**
-   [x] Manual UI smoke-test in browser (no errors)

## Phase 2 – Data APIs

-   [x] Create `/api/reports/donation-summary` (JSON) - **Fixed model associations**
-   [x] Create `/api/reports/inventory` (JSON) - **Fixed model associations**
-   [x] Unit-test Sequelize aggregations (total volume, on-hand units) - **Fixed field names**
-   [x] Verify endpoints via Postman/Insomnia - **Test after association fixes**

## Phase 3 – PDF Service Integration

-   [x] Build generic `reportToHtml(type, params)` helper using `renderToString`
-   [x] Create `/api/reports/:type/pdf` route that:
    -   [x] Calls `reportToHtml`
    -   [x] POSTs HTML to `/api/generate-pdf`
    -   [x] Streams PDF back
-   [x] Add `Export PDF` button in UI and confirm download works

## Phase 4 – Additional Reports

-   [ ] Event Performance API + UI table & chart
-   [ ] Active Donor List API + UI
-   [ ] Agency Contribution API + UI
-   [ ] Validate each report data

## Phase 5 – Audit & Contact Reports

-   [ ] Audit Trail export API + UI (filters: user, module, date)
-   [ ] Contact Form submissions report API + UI

## Phase 6 – QA & Polish

-   [ ] Cross-browser check (Chrome, Edge, mobile)
-   [ ] Print/PDF layout tweak (margins, header/footer)
-   [ ] Security review – ensure admin-only access & param sanitisation
-   [ ] Update documentation (`docs/admin_reports_plan.md`)

---

**Start date:** 21 Jul 2025

Use this list as your single source of truth while developing. Once all boxes are checked, the Admin Reports feature is ready for UAT.
