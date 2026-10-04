# Leadyfy OS — Database Schema & Service API Specifications

## 1. Relational Entities (18 Core Models)

| Entity | Primary Key | Key Relations | Business Invariants |
| :--- | :--- | :--- | :--- |
| **`User`** | `id` (UUID) | Employee?, Client?, Tasks[], Notifications[] | Linked to Supabase Auth UID (`supabaseId`) |
| **`Employee`** | `id` (UUID) | User, Clients[], Scripts[], Shoots[], Videos[] | Sub-roles: `SALES`, `SCRIPT_WRITER`, `SHOOT_MANAGER`, `EDITOR` |
| **`Client`** | `id` (UUID) | User?, Orders[], Scripts[], Shoots[], Videos[], Payments[] | Canonical `companyName` field mapped to `company_name` |
| **`Order`** | `id` (UUID) | Client, Scripts[], Shoots[], Videos[], Payments[] | Live counters (`contractedVideoCount`, `deliveredVideoCount`) |
| **`Script`** | `id` (UUID) | Order, Client, Writer?, Creator? | 7-step manual status lifecycle |
| **`Creator`** | `id` (UUID) | Availabilities[], Shoots[], Videos[], Payouts[] | Niches, demographics, rates per video, UPI |
| **`CreatorAvailability`** | `id` (UUID) | Creator, Shoot? | Unique `[creatorId, date, timeSlot]` |
| **`Shoot`** | `id` (UUID) | Client, Order, Creator?, ShootManager? | Pre/Post-Shoot verification checklists |
| **`Video`** | `id` (UUID) | Client, Order, Script, Shoot?, Creator?, Editor? | 9-step linear state enforcement + dynamic urgency |
| **`VideoFeedback`** | `id` (UUID) | Video, AuthorUser | Timestamped markers in video player |
| **`Task`** | `id` (UUID) | Assignee?, Creator | Priority flags: `URGENT`, `HIGH`, `MEDIUM`, `LOW` |
| **`Payment`** | `id` (UUID) | Client, Order | Unpaid delivery locking logic |
| **`Expense`** | `id` (UUID) | LoggedByUser | Feeds Net Profit calculations |
| **`CreatorPayout`** | `id` (UUID) | Creator, Order, Video? | Prevents duplicate compensation |
| **`Notification`** | `id` (UUID) | User | In-app alerts |
| **`SupportTicket`** | `id` (UUID) | Client, CreatedBy | In-portal client query ticketing |
| **`ActivityLog`** | `id` (UUID) | User? | System-wide audit trail |
| **`Asset`** | `id` (UUID) | Client, Order?, Video? | Storage provider abstractions |

---

## 2. Executive Profitability Math
$$\text{Net Profit} = \text{Total Revenue Received} - \text{Agency Expenses} - \text{Creator Payouts}$$

## 3. 9-Step Linear Video Production Pipeline
$$1.\text{Script Approved} \rightarrow 2.\text{Shoot Pending} \rightarrow 3.\text{Raw Footage Received} \rightarrow 4.\text{Video Editing} \rightarrow 5.\text{Internal QA} \rightarrow 6.\text{Client Review} \rightarrow 7.\text{Revision} \rightarrow 8.\text{Final Approved} \rightarrow 9.\text{Delivered}$$
