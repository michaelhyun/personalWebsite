# BlueDoor Realty — GHL Snapshot Requirements
**"30-Day Lead Gen Sprint" Snapshot · Michael Hyun · Compass / BlueDoor Realty LLC**

Based on Elea Karras's *30-Day Lead Generation Sprint* guide, adapted to Michael's three
chosen sources: **Instagram, Sphere & Database, Open Houses**.

Sub-account: `BlueDoor Realty LLC` (location `QS6MVOlOOLSEkNZekwYk`)

---

## 1. Goals & Strategy

| Item | Decision |
|---|---|
| 30-day lead goal | **8 new leads/month (2/week)** |
| Lead definition | Anyone who raises their hand about buying/selling/moving — any timeline |
| Source 1: Instagram | Daily posting via Social Planner · 20 DMs/wk to existing followers · 15 story replies + 15 min engagement daily |
| Source 2: Sphere & Database | All 5 activities: 20 check-in texts/mo · 2 database emails/mo · 10 handwritten cards/mo · 20 IG follows of real-life contacts · 2 in-person meetings/mo |
| Source 3: Open Houses | **3–4/month (weekly)**, focus automation: digital sign-in + 24-hour follow-up |
| CRM of record | **GHL replaces Follow Up Boss.** Website forms repointed from Web3Forms→FUB to GHL |
| Personal-touch automation | **Fully automated sends** (phased — see §8 SMS constraint) |
| New-lead first touch | **Notify only** — push notification + task; Michael makes every first contact personally |
| Scheduling | **Calendly stays** — embed Calendly links in templates; no GHL calendars in v1 |

## 2. Current State (already in the sub-account)

- **Pipelines (keep, snapshot builds on them):**
  - *Lead Pipeline*: New Lead → Attempting Contact → In Conversation → Appointment Set → Consult Completed → Nurture/Long Term → Buyer-Signed → Seller-Signed
  - *Buyer Pipeline*: Pre-Approval & Search Setup → … → Closed-Won
  - *Seller Pipeline*: Listing Prep → … → Closed-Won
- **Custom fields:** `Lead Temp` (Hot 1-3mo / Warm 3-6mo / Cold 6+mo), `Area` (10 South Bay & Tri-Valley cities), `Call Summaries`
- **Email templates:** 7 (mostly Meetup-related; reusable patterns only)
- **Contacts:** phone contacts imported — **untagged/uncategorized** (see §3 data hygiene)
- **Website:** michaelhyunn.com static site, forms currently → Web3Forms → FUB email
- **SMS:** A2P 10DLC campaign **pending/rejected — fixes in progress** (campaign 30896)
- No socials connected in GHL yet; no snapshot installed.

## 3. Phase 0 — Data Hygiene (prerequisite, not optional)

The imported phone contacts must be segmented before any automation runs.

1. **Tag taxonomy** (create as part of snapshot):
   - Relationship: `sphere`, `past-client`, `lead-buyer`, `lead-seller`, `vendor`, `agent`, `personal-only`, `do-not-market`
   - Source: `src:website`, `src:open-house`, `src:ig-dm`, `src:ig-keyword`, `src:referral`, `src:sphere-outreach`, `src:phone-import`
   - Sprint status: `sprint:checkin-queue`, `sprint:card-queue`, `sprint:meeting-queue`, `checkin-sent-YYYY-MM`
2. **Segmentation workflow:** bulk-tag all phone imports `src:phone-import` + `needs-review`; build a Smart List "Untriaged Contacts"; daily task to triage ~20/day until done.
3. **Consent gate:** automated SMS only ever goes to contacts marked SMS-consented (existing consent custom field/checkbox work from the website applies). Phone imports are *not* SMS-consented by default — check-in texts to them run as **manual tasks** until consent is captured.
4. FUB sunset: export FUB history (notes/deals) for reference; stop new lead flow into FUB once GHL forms are live.

## 4. Snapshot Components — Build List

### 4.1 Custom fields & values (add)
- Contact: `Contact Type` (if not using tags), `SMS Consent` (exists via forms — verify), `Last Personal Touch Date`, `Open House Attended` (multi), `Feedback Notes`
- Opportunity: none new in v1
- Custom values: Calendly links (buyer consult, seller consult, coffee), IG handle, brokerage disclaimer/signature block, open-house merge fields (address, date, time, listing agent)

### 4.2 Forms & funnels
- **Open House Sign-In funnel** (mobile-first, QR-code friendly), one reusable template cloned per event:
  - Fields: name, phone, email, "working with an agent?", timeframe, SMS consent checkbox (A2P-compliant language already drafted for the website — reuse)
  - On submit: tag `src:open-house` + `oh:{event-slug}`, create Lead Pipeline opportunity (New Lead), notify Michael
- **Website lead forms** (contact, valuation, newsletter): repoint from Web3Forms to GHL forms or inbound webhooks; preserve existing A2P-compliant consent checkboxes (marketing vs non-marketing separation already built on the site)
- **IG keyword funnel** (optional v1.1): "Comment/DM KEYWORD for details" → GHL IG DM automation → capture contact

### 4.3 Workflows
**New lead (all sources)**
1. *New Lead Intake* — on form submit/DM capture: tag by source, create opportunity in Lead Pipeline → New Lead, **push notification + task "Personal first touch"** (no auto outreach), SLA escalation task at 4h if untouched.
2. *Lead Goal Tracker* — increments monthly lead count; weekly summary vs. 8/month goal (email or dashboard).

**Open house engine (per event)**
3. *OH Event Setup* — triggered by adding an event record (custom object or tag): clones sign-in funnel values, generates QR, schedules the sequence below.
4. *OH 24-Hour Follow-Up* — attendee tagged at sign-in → next-day automated text: feedback ask script (guide's exact template) → if reply & no agent → task to send similar properties; non-responders get day-3 email fallback.
5. *OH Nurture Handoff* — attendees not ready now → Nurture/Long Term stage + monthly database email list.

**Sphere engine (fully automated, consent-gated)**
6. *Sphere Check-In Rotator* — pulls 5 contacts/wk from `sprint:checkin-queue` (least-recent `Last Personal Touch Date`), sends the guide's check-in text (seasonal merge), marks sent, replies land in Conversations with notification. Falls back to "send manually" task for non-consented contacts.
7. *Monthly Database Emails* — Email #1 "Real estate update" (1st half of month), Email #2 "Life update" (2nd half). Templates pre-built; monthly task to personalize before scheduled send.
8. *Handwritten Cards* — monthly recurring task on the 1st: smart-list of 10 suggested recipients (no card sent in 6+ months), card script attached.
9. *IG Follow Sprint* — monthly task: follow 20 real-life contacts; checklist + optional DM script.
10. *In-Person Meetings* — monthly task: pick 2 from `sprint:meeting-queue`; automated scheduling text (guide script) with Calendly coffee link; meeting-outcome note prompt afterward.

**Instagram engine**
11. *IG DM Sprint* — weekday recurring task "Send 4 follower DMs" with templates 1A/1B attached; replies via GHL IG integration land in Conversations; interested → New Lead Intake.
12. *Daily Engagement Task* — recurring task: 15 story replies + 15 min engagement (openers included).
13. *Social Planner* — IG connected; 30-day rotating content calendar scheduled in GHL (daily posts). Content pillars TBD (§9). Reels/stories may still need native posting — calendar includes prompt tasks for those.

### 4.4 Email/SMS template library
- Sphere check-in text · DB Email #1 (market update) · DB Email #2 (life update) · card script (task body)
- OH: attendee feedback text, day-3 email, "similar properties" follow-up
- IG: DM 1A (unknown follower), 1B (known follower), 3 story-reply openers, optional reconnect DM
- Meeting scheduler text (with Calendly link) · New-lead manual first-touch talking points (task body, not auto-sent)
- All SMS templates carry compliant opt-out language where required.

### 4.5 Dashboard & reporting
- Widgets: new leads this month vs. goal (8), leads by source tag, OH attendees per event, sphere touches completed this week, task completion rate, pipeline stage distribution.
- Weekly "CEO Monday" digest automation: summary email of last week's numbers + this week's queued activities (mirrors the guide's Monday planning ritual).

## 5. What the snapshot deliberately does NOT do
- No automated first touch on brand-new leads (Michael calls/texts personally).
- No GHL calendars (Calendly links embedded instead).
- No Past Clients / Vendor Partner sources in v1 (guide sources not selected — leave room in tag taxonomy for later).
- No AI bot / chat qualification in v1.
- Database email blast invites, lead invite texts, and door-knock circle calls for open houses: **not in v1** (only sign-in + 24h follow-up was selected). Templates can ship dormant for later activation.

## 6. Migration tasks (one-time, alongside snapshot install)
1. Repoint website forms (contact, valuation, newsletter) to GHL; remove Web3Forms key + FUB pixel after cutover.
2. FUB export/import of any leads not in GHL; archive FUB.
3. Connect Instagram (and Facebook page if needed for IG API) to GHL Social Planner + DM channel.
4. Verify email sending domain (michaelhyunn.com subdomain, e.g. `mail.michaelhyunn.com`) for deliverability before database emails go out.

## 7. Rollout phases
- **Phase 0 (week 1):** data hygiene + tag taxonomy + domain/IG connections.
- **Phase 1 (weeks 1-2):** snapshot install — pipelines, fields, tasks engine, email workflows, OH funnel, dashboard. SMS workflows ship **disabled** or in task-only mode.
- **Phase 2 (on A2P approval):** flip sphere check-ins and OH follow-ups from task-mode to automated SMS sends (consent-gated).
- **Phase 3 (v1.1):** IG keyword auto-DM funnel, dormant OH templates (DB invites, lead invite texts), past-client source.

## 8. Constraints & risks
- **A2P pending/rejected** — all automated SMS blocked until approved. Every SMS workflow needs a manual-task fallback toggle. (Site consent-language fixes for campaign 30896 already underway.)
- **Phone-import consent** — imported contacts have no SMS opt-in; automated texting them risks carrier/TCPA issues. Task-mode for them permanently unless consent captured.
- **GHL IG limits** — Social Planner can post feed content/reels but story posting is limited; story sequence stays native with task prompts.
- **"Fully automated" vs. authenticity** — guide's philosophy is personal connection; automated sphere texts use heavy personalization merge + randomized send windows, and replies always route to Michael immediately.

## 9. Open questions (for the build kickoff)
1. IG content pillars & ratio for the daily calendar (listings / market / lifestyle / personal / local)? Who produces the creative — Canva templates in the snapshot?
2. Approx. sphere size after triage? (Determines whether 20 texts/mo cycles the list in months or years.)
3. Keep the Meetup email templates/flows in this sub-account or archive them out of the snapshot's way?
4. GHL phone number: keep current number through A2P, or provision fresh?
5. Newsletter list: fold into Database Email #1, or remains a separate track?
6. Open house events: track as simple tags vs. a custom object with address/date fields (cleaner reporting, more setup)?
