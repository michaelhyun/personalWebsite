# Daily Operating Guide — Lead Lifecycle in GHL

How a lead is born, every path it can take, and exactly what's manual (🖐) vs automated (⚙ —
once the 3 glue workflows are built). Scope: lead creation → Buyer-Signed / Seller-Signed.

---

## Part 1 — How a lead enters the system

A **lead is born the moment you create a Lead Pipeline opportunity** for a contact. Tags never
make someone a lead; the opportunity card does. Four entry doors:

### Door 1: Website form (contact / valuation / newsletter)
| Step | Who |
|---|---|
| Contact record created, tagged `src:website` | ⚙ (form settings) |
| Opportunity created in **New Lead** stage | ⚙ |
| You get a notification + "first touch" task | ⚙ |
*Until forms are repointed from FUB: you create the contact + opportunity by hand. 🖐*

### Door 2: Open house sign-in
| Step | Who |
|---|---|
| Sign-in form creates contact, tags `src:open-house` | ⚙ (once OH funnel built) |
| Opportunity created in **New Lead** | ⚙ |
| 24-hour feedback text, day-3 email | ⚙ (task-mode until A2P approves) |
*You already met them at the event — if you had a real conversation there, skip ahead: move
them to **In Conversation** and set Lead Temp the same evening. 🖐*

### Door 3: Instagram (DM conversation)
| Step | Who |
|---|---|
| You're DMing someone and they hint at a move | 🖐 |
| You create the contact (if new), tag `src:instagram` + `buyer`/`seller` | 🖐 |
| You create the opportunity — straight into **In Conversation** (you're already talking) | 🖐 |
| You set Lead Temp from what they told you | 🖐 |
*IG leads usually skip New Lead and Attempting Contact entirely.*

### Door 4: Sphere promotion (the 178)
| Step | Who |
|---|---|
| A sphere contact raises a hand (reply to check-in, coffee chat, referral) | 🖐 |
| Add `buyer` or `seller` tag (keep `sphere` — that's their origin) | 🖐 |
| Create opportunity → **In Conversation** | 🖐 |
| Set Lead Temp | 🖐 |

**Rule of thumb: strangers enter at New Lead; people you're already talking to enter at
In Conversation with a Lead Temp set on day one.**

---

## Part 2 — The stages, and what moves a lead between them

```
New Lead → Attempting Contact → In Conversation → Appointment Set
  → Consult Completed → Buyer-Signed / Seller-Signed
                ↘ Nurture / Long Term (the holding pattern at any point)
```

### Stage: New Lead
**Meaning:** lead exists, zero touches from you.
**Your job:** call/text them TODAY. They appear in 🚨 *Leads Not Contacted* (≤7 days old)
or 🕳 *Old Leads, No Call Attempts* (>7 days — shame list, should be empty).
**Exit — always manual 🖐:**
- Reached them → move to **In Conversation**
- Tried, no answer → move to **Attempting Contact** (leave a voicemail/text first)

### Stage: Attempting Contact
**Meaning:** you've tried at least once; they haven't responded.
**What fires:** ⚙ Workflow B stamps `First Attempt Date` when the lead enters this stage.
**Your job:** daily follow-up for 10 days — they sit in 📞 *Leads Not Reached*. Complete the
task / log the call each attempt (that stamps Last Touch Date ⚙).
**Exit:**
- They respond → 🖐 move to **In Conversation**
- Day 10, still silent → ⚙ Workflow B adds `never-reached`, moves them to **Nurture/Long
  Term**. They reappear monthly in 🌑 *Old Leads Not Reached*. Nothing for you to do.

### Stage: In Conversation  ← the most important stage
**Meaning:** two-way dialogue happening. **This stage has a mandatory exit toll: you may not
leave a lead here without setting Lead Temp.** The 🧯 *Safety Net* list catches violations.
**Your job during the conversation, in order:**
1. Qualify: buying or selling? where? timeline?
2. 🖐 Set **Intent** tag (`buyer`/`seller`) and **Lead Temp**:
   - 1-3 months → Hot · 3-6 months → Warm · 6+ months → Cold
3. Push for the consult appointment
**Exit:**
- Books a consult → 🖐 move to **Appointment Set**
- Real timeline but not ready to meet → 🖐 move to **Nurture/Long Term** (temp keeps them
  surfacing in Hot/Warm/Cold lists)
- Goes silent mid-conversation → 🖐 move back to **Attempting Contact** (re-enters the
  10-day daily cycle)

### Stage: Appointment Set
**Meaning:** consult is on the calendar (Calendly).
**Your job:** show up prepared; confirm the day before (🖐 for now; a reminder workflow is an
easy later add ⚙).
**Exit:**
- Consult happens → 🖐 move to **Consult Completed**
- No-show/cancel → 🖐 back to **In Conversation**, rebook

### Stage: Consult Completed
**Meaning:** you've met; they haven't signed.
**Your job:** send follow-up/agreement same day; chase the signature. Re-check Lead Temp —
consults often change the timeline.
**Exit:**
- Signs buyer rep agreement → 🖐 **Buyer-Signed** → ⚙ Workflow C adds `client-active` →
  you create their card in the **Buyer Pipeline** (end of this guide's scope)
- Signs listing agreement → 🖐 **Seller-Signed** → same, **Seller Pipeline**
- Not ready → 🖐 **Nurture/Long Term** with updated temp

### Stage: Nurture / Long Term  ← the holding pattern
**Meaning:** real lead, wrong timing. Two kinds of residents:
- **Talked-to leads with a temp** → surface in 🔥 Hot (7d) / 🌤 Warm (14d) / ❄️ Cold (60d)
  lists when due
- **`never-reached` leads** → surface monthly in 🌑 *Old Leads Not Reached*
**Your job:** work the temp lists when names appear; every touch pushes them back underwater
until next cycle.
**Exit:** any reply that heats up → 🖐 move to **In Conversation**, update temp. Hot lead
ready to meet → straight to **Appointment Set**.

---

## Part 3 — Tag playbook (who adds what, when)

| Tag | Added when | By |
|---|---|---|
| `src:*` (website/open-house/instagram/sphere/referral) | At entry, once, never changes | ⚙ forms / 🖐 you |
| `buyer` / `seller` | The moment intent is known | 🖐 |
| `sphere`, `vendor`, `agent`, `past-client` | Relationship identity — already done for your 259 | 🖐 |
| `never-reached` | Day 10 of Attempting Contact with zero response | ⚙ B |
| — removed | When they finally reply | ⚙ A |
| `client-active` | On Buyer-Signed / Seller-Signed | ⚙ C |
| `do-not-market` | Anyone who should never get outreach | 🖐 |

**Fields you set by hand:** Lead Temp (at every qualifying conversation — THE habit), Area.
**Fields the machine sets:** Last Touch Date (⚙ A: on replies, logged calls, completed tasks,
appointments), First Attempt Date (⚙ B).

---

## Part 4 — Your daily routine (~30-60 min of list work)

1. **🚨 Leads Not Contacted** — call every name. Goal: empty by noon. No answer → move
   to Attempting Contact.
2. **📞 Leads Not Reached** — daily attempt for each name (day 1-10). Log the call.
3. **🕳 Old Leads No Call Attempts + 🧯 Safety Net** — should both be EMPTY. A name here
   means a process miss; fix it on the spot.
4. **🔥 Hot Weekly** — whoever surfaces is due their weekly touch.
5. **🌤 Warm / ❄️ Cold / 🌑 Old-Not-Reached** — work them as they surface (bi-weekly /
   bi-monthly / monthly).
6. As you go: **complete the task or log the call on every touch** — that's what stamps Last
   Touch Date and makes names sink off the lists.

### The 3 manual habits everything depends on
1. **Move the stage the moment reality changes** (answered? in conversation. ghosted? attempting
   contact.) The lists are stage-driven — a stale stage = a lost lead.
2. **Never leave In Conversation without a Lead Temp.**
3. **Log every touch** (complete task / log call). Untracked touches = leads nagging you early
   or, worse, sinking silently.

---

## Part 5 — The five paths a lead can take (worked examples)

**A. The responsive website lead:** form → New Lead ⚙ → you call same day 🖐 → answers →
In Conversation 🖐 → buying in 2 months → temp=Hot, tag `buyer` 🖐 → books consult →
Appointment Set 🖐 → consult → Consult Completed 🖐 → signs → Buyer-Signed 🖐 →
`client-active` ⚙.

**B. The ghost:** form → New Lead ⚙ → no answer day 1 🖐 → Attempting Contact 🖐 → 10 daily
attempts 🖐 → silence → day 10: `never-reached` + Nurture ⚙ → surfaces monthly 🌑 → month 4
they reply "actually, yes" → tag removed ⚙, you move to In Conversation 🖐, set temp 🖐.

**C. The long-timeline lead:** IG DM 🖐 → In Conversation + temp=Cold (12 months out) 🖐 →
Nurture 🖐 → surfaces in ❄️ every 60 days → 8 months later: "we're getting serious" →
temp=Hot 🖐 → surfaces weekly → consult → signed.

**D. The open-house buyer:** signs in ⚙ → you chat at the event 🖐 → that evening: In
Conversation + temp=Warm 🖐 → 24h feedback text ⚙ → replies positive → consult push 🖐 →
Appointment Set → ... → Buyer-Signed.

**E. The sphere promotion:** check-in text goes out ⚙(/🖐 task-mode) → "funny timing, we've
been thinking of selling" → tag `seller`, opportunity at In Conversation, temp set 🖐 →
normal flow from there. `sphere` tag stays forever.

---

## Current build status
- ✅ Pipelines, Lead Temp, Area, your 259 triaged contacts
- ⬜ Glue workflows A (Last Touch), B (Day-10 sweep + First Attempt), C (client-active) — designed, not built
- ⬜ Smart lists (filters specced in `ghl-smart-lists.md`)
- ⬜ Custom fields: Last Touch Date, First Attempt Date
- ⬜ Website form repointing, OH sign-in funnel, nurture sequences

Until the glue is built: everything works, just 100% manually — stages and lists by hand.
