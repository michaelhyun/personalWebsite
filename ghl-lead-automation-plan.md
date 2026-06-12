# GHL Lead Automation Plan (v1 — build this first)

Scope: new-lead automations, Lead Pipeline, custom fields, tags, email/SMS template
inventory (cadence only, no content), per-source client journeys, and Lead Temp smart lists.

---

## 1. Custom Fields

**Keep (already exist):**
| Field | Type | Use |
|---|---|---|
| Lead Temp | Single option: Hot (1-3mo) / Warm (3-6mo) / Cold (6+mo) | Drives which nurture track runs + smart lists |
| Area | Multi option (10 cities) | Segmentation for market emails |
| Call Summaries | Large text | Call notes |

**Add (4 new):**
| Field | Type | Use |
|---|---|---|
| Intent | Single option: Buyer / Seller / Both / Unknown | Routing + messaging context |
| SMS Consent | Single option: Yes / No / Unknown | Gate for ALL automated SMS (default Unknown on imports) |
| Last Touch Date | Date | Updated by workflow on any inbound/outbound message or completed call task — powers the follow-up smart lists |
| Lead Source Detail | Text | Free-form context (e.g., which open house, which IG post) |

## 2. Tags

Keep it to three groups. Tags answer "where from / what are they / what's running":

**Source (one per contact, set at intake):**
`src:instagram` · `src:open-house` · `src:website` · `src:sphere` · `src:referral` · `src:phone-import`

**Type:** `buyer` · `seller` · `sphere` · `past-client` · `vendor` · `agent`

**Automation control:** `nurture-active` · `nurture-paused` · `do-not-market` · `needs-review` (phone imports start here)

## 3. Lead Pipeline (no changes — automations hang off existing stages)

New Lead → Attempting Contact → In Conversation → Appointment Set → Consult Completed → Nurture/Long Term → Buyer-Signed / Seller-Signed

Stage rules the automations enforce:
- **New Lead:** contact just came in, you haven't reached them
- **Attempting Contact:** you tried, no response → outreach sequence runs here
- **In Conversation:** they replied → all automated sequences STOP; you set Lead Temp + Intent
- **Nurture/Long Term:** went quiet or long timeline → temp-based nurture runs here
- **Buyer/Seller-Signed:** exits Lead Pipeline → moved to Buyer/Seller Pipeline (manual for v1)

## 4. Workflows to Build (8 total)

### W1 — New Lead Intake (one workflow, source-branched)
Trigger: form submit / IG DM capture / manual add with a `src:` tag
1. Set source tag + Lead Source Detail, create Lead Pipeline opportunity → **New Lead**
2. Push notification + task **"Personal first touch"** (no automated outreach — your rule)
3. If task not completed in 4 hours → second notification
4. When you log the touch: reached them → you move to In Conversation; no answer → move to Attempting Contact (W2 fires)

### W2 — Attempting Contact Sequence
Trigger: stage = Attempting Contact. Goal: get any reply. **14 days: 4 SMS + 3 emails + 2 call tasks**
- Day 1 SMS · Day 2 email · Day 4 SMS · Day 5 call task · Day 7 email · Day 9 SMS · Day 11 call task · Day 14 SMS + email ("last attempt")
- Any reply → stop, move to In Conversation, notify you
- No reply after day 14 → move to Nurture/Long Term, set Lead Temp = Cold

### W3 — Lead Temp Router
Trigger: Lead Temp field set or changed → removes contact from any other nurture, enrolls in the matching track (W4/W5/W6), applies `nurture-active`

### W4 — Hot Nurture (1-3 month timeline)
**Per month: 2 SMS + 2 emails + 2 call tasks** (a touch every ~5-7 days, alternating channel)
- Runs while stage = In Conversation or Nurture and Temp = Hot
- Reply or appointment booked → pause sequence, notify

### W5 — Warm Nurture (3-6 months)
**Per month: 1 SMS + 2 emails + 1 call task** (touch every ~10 days)

### W6 — Cold Nurture (6+ months)
**Per month: 1 email; per quarter: 1 SMS + 1 call task**
- Quarterly SMS is a "still thinking about a move?" re-engagement — a reply re-routes temp

### W7 — Open House Attendee Journey
Trigger: OH sign-in form submit
1. Tag `src:open-house` + event detail, intake via W1 (notify + task)
2. **+24h: 1 automated SMS** (feedback ask) · **+3 days: 1 email** if no reply
3. Reply → In Conversation → you set Temp → W3 routes them
4. No reply after day 7 → Nurture, Temp = Cold

### W8 — Last Touch Tracker (housekeeping)
Trigger: any inbound/outbound SMS, email, or completed call task → stamps Last Touch Date. Powers every smart list below.

**A2P note:** until campaign approval, every SMS step in W2/W4-W7 runs as a *task* ("send this text from your phone") via a single on/off toggle per workflow. Flip to automated sends when approved. Automated SMS only fires when SMS Consent = Yes.

## 5. Template Inventory (counts + cadence only — you write the content)

**Emails — 9 templates:**
| Slot | Qty | Used by | Cadence |
|---|---|---|---|
| Attempting-contact emails | 3 | W2 | Day 2, 7, 14 of sequence |
| Hot nurture rotation | 2 | W4 | 2/month, alternating |
| Warm nurture rotation | 2 | W5 | 2/month |
| Cold monthly touch | 1 | W6 | 1/month (shell you refresh with market content) |
| OH day-3 follow-up | 1 | W7 | Once per attendee |

**SMS — 9 templates:**
| Slot | Qty | Used by | Cadence |
|---|---|---|---|
| Attempting-contact texts | 4 | W2 | Day 1, 4, 9, 14 |
| Hot nurture | 2 | W4 | 2/month |
| Warm nurture | 1 | W5 | 1/month |
| Cold re-engagement | 1 | W6 | 1/quarter |
| OH 24-hour feedback ask | 1 | W7 | Once per attendee |

Total to write: **18 short pieces.** Nurture sends repeat monthly, so rotations of 1-2 templates per track are enough to start; add variety later.

## 6. Client Journeys by Source (what's automated where)

**Instagram** (`src:instagram`)
DM conversation → you add them to GHL (or keyword automation later) → W1 notify + first-touch task → you talk, set Temp + Intent → W3 → Hot/Warm/Cold nurture. If they ghost mid-convo → Attempting Contact (W2).
*Automated: intake, routing, nurture. Manual: the DMs themselves, temp-setting.*

**Open House** (`src:open-house`)
QR sign-in → W1 + W7 → 24h SMS + day-3 email → reply = In Conversation → Temp set → nurture.
*Automated: capture, both follow-ups, routing. Manual: conversation at the event, temp-setting.*

**Website** (`src:website`)
Form (contact/valuation/newsletter) → W1 → first-touch task → reached = In Conversation; not reached = W2 sequence → Temp set → nurture.
*Automated: everything except the first touch.*

**Sphere** (`src:sphere`)
Sphere contacts live OUTSIDE the Lead Pipeline until they raise a hand. The moment one mentions buying/selling → you add the `buyer`/`seller` tag + create the opportunity → W1 treats them like any lead → Temp → nurture.
*Sphere-wide touch campaigns are a later phase — out of scope for v1.*

## 7. Smart Lists (6)

| Smart list | Filter | Purpose |
|---|---|---|
| 🔥 Hot — follow up due | Temp = Hot AND Last Touch Date > 7 days ago | Daily working list |
| 🌤 Warm — follow up due | Temp = Warm AND Last Touch > 14 days | Weekly working list |
| ❄️ Cold — check in due | Temp = Cold AND Last Touch > 45 days | Monthly sweep |
| 🚨 New & untouched | Stage = New Lead AND Last Touch is empty | Should always be empty by end of day |
| ❓ No temp set | Has Lead Pipeline opportunity AND Lead Temp empty | Leads that slipped through without routing |
| 📵 No SMS consent | `nurture-active` AND SMS Consent ≠ Yes | Who's getting task-mode texts instead of automated |

## 8. Build Order
1. Custom fields + tags (15 min)
2. W8 Last Touch Tracker + the 6 smart lists
3. W1 Intake + W2 Attempting Contact
4. W3 Router + W4/W5/W6 nurture shells (email steps live, SMS steps in task mode)
5. OH sign-in form + W7
6. You write the 18 templates → drop into the waiting workflow steps
