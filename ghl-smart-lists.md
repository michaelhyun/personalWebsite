# GHL Smart Lists — Filter Spec

Goal: every contact with a Lead Pipeline opportunity shows up in **exactly one** working list,
and each list only shows people who are **due for a touch** at that list's cadence.
A lead that gets touched today drops off the list and reappears automatically when due.

---

## 0. The plumbing these lists depend on

### Fields
| Field | Type | Set by |
|---|---|---|
| **Last Touch Date** *(new)* | Date | Workflow — auto-stamped (see Glue Workflow A) |
| **First Attempt Date** *(new)* | Date | Workflow — stamped once when lead first moves to *Attempting Contact* |
| **Lead Temp** *(exists)* | Hot / Warm / Cold | **You**, manually, right after the qualifying conversation. This is the single action that routes someone into Hot/Warm/Cold lists |

### Tags
| Tag | Meaning | Applied by |
|---|---|---|
| `never-reached` | 10+ days of attempts, never answered | Workflow B (day-10 sweep) |
| `client-active` | Signed buyer/seller, deal in progress | Workflow C (on Buyer-Signed / Seller-Signed stage) |
| `past-client` | Closed deal | Workflow C (on Closed-Won) |
| `do-not-market` | Excluded from everything | You, manually |

### Glue workflows (3 small ones)
**A — Last Touch Stamper.** Stamps `Last Touch Date = today` on any of:
- Customer Replied (SMS / email / call / IG DM — inbound anything)
- Call Status = completed/answered (inbound or outbound logged call)
- Task Completed (your daily follow-up tasks — see ⚠ below)
- Appointment completed

> ⚠ **The one gap:** a manual outbound text/email that gets **no reply** doesn't fire any GHL
> trigger. Workaround built into your routine: work each list top-down and **complete the
> contact's task / log the call** as you go — that's what stamps the touch. If you text someone
> outside a task, the touch won't count until they reply.

**B — Day-10 Sweep.** Trigger: stage = Attempting Contact. Wait 10 days from First Attempt Date.
If still in Attempting Contact → add tag `never-reached`, move stage to **Nurture / Long Term**.
If they ever reply later → Workflow A's reply trigger also removes `never-reached` and notifies you.

**C — Client Status.** Lead Pipeline stage = Buyer-Signed or Seller-Signed → add `client-active`.
Buyer/Seller Pipeline stage = Closed-Won → remove `client-active`, add `past-client`.

---

## 1. 🚨 Leads Not Contacted — *work daily, first calls of the day*
New leads you haven't touched at all, still fresh (≤ 7 days old).
```
Pipeline Stage   = Lead Pipeline → New Lead
AND Date Added   is within last 7 days
AND Tag          does not include do-not-market
```
*Exit: you make the first touch → you move them to Attempting Contact (no answer) or In Conversation (answered).*

## 2. 📞 Leads Not Reached — *work daily, days 1-10*
Attempted, no answer yet, inside the 10-day daily-follow-up window.
```
Pipeline Stage          = Lead Pipeline → Attempting Contact
AND First Attempt Date  is within last 10 days
AND Tag                 does not include do-not-market
```
*Exit after 10 days with no response → **Workflow B** tags them `never-reached` and moves them to
Nurture/Long Term — they land in list 4 (Old Leads Not Reached) on a monthly cadence. That's the
answer to "where should they go": they become a monthly-touch bucket instead of daily, so they're
never lost but stop eating your daily call block.*

## 3. 🕳 Old Leads, No Call Attempts — *clear this list to zero, it's a shame list*
Leads that slipped through — 7+ days old and you still never called.
```
Pipeline Stage   = Lead Pipeline → New Lead
AND Date Added   is more than 7 days ago
AND Tag          does not include do-not-market
```
*Lists 1 + 3 together = every uncontacted lead, split by fresh vs. forgotten. Nothing can hide.*

## 4. 🌑 Old Leads Not Reached — *monthly touch*
Never answered during the 10-day sprint; now on monthly re-engagement.
```
Tag                  includes never-reached
AND Last Touch Date  is more than 30 days ago   (or is empty)
AND Tag              does not include do-not-market
```
*Exit: they finally reply → `never-reached` removed (Workflow B), you set Lead Temp → they join lists 5/6/7.*

## 5. 🔥 Hot Weekly — *touch every 7 days*
Talked to, buying or listing in 1-3 months.
**How they get in: you set `Lead Temp = Hot (1-3 Months)` after the conversation. That's it — no extra tags needed.**
```
Lead Temp            = Hot (1-3 Months)
AND Last Touch Date  is more than 7 days ago    (or is empty)
AND Tag              does not include client-active, do-not-market
```

## 6. 🌤 Warm Bi-Weekly — *touch every 14 days*
Buying/selling in 3-6 months.
```
Lead Temp            = Warm (3-6 Months)
AND Last Touch Date  is more than 14 days ago   (or is empty)
AND Tag              does not include client-active, do-not-market
```

## 7. ❄️ Cold Bi-Monthly — *touch every 60 days*
Buying/selling 6+ months out.
```
Lead Temp            = Cold (6+ Months)
AND Last Touch Date  is more than 60 days ago   (or is empty)
AND Tag              does not include client-active, never-reached, do-not-market
```
*(Excludes `never-reached` so list 4 owns those — Cold is for people you've actually talked to.)*

## 8. 🏡 Past Clients — *touch every 90 days*
```
Tag                  includes past-client
AND Last Touch Date  is more than 90 days ago   (or is empty)
AND Tag              does not include do-not-market
```

## 9. 📋 Active & Pending Clients — *reference list, no cadence filter*
Everyone with a live deal. No Last-Touch filter — you're talking to these people constantly anyway.
```
Tag includes client-active
```
*(Alternative filter if you prefer pipeline-based: Opportunity in Buyer Pipeline OR Seller
Pipeline with status = Open. The tag version is simpler and survives pipeline edits.)*

## 10. 🧯 Safety Net — *check weekly* (recommended add)
Catches anyone the system can't place — the "no lead lost" guarantee.
```
Has opportunity in Lead Pipeline (status Open)
AND Lead Temp        is empty
AND Pipeline Stage   is NOT New Lead, NOT Attempting Contact
AND Tag              does not include never-reached, client-active, do-not-market
```
*This is the lead you talked to but forgot to set a temp on. Should be empty.*

---

## Lifecycle (every lead is always in exactly one bucket)

```
New lead arrives
   └─ ≤7 days, untouched ........... List 1 (daily)
   └─ >7 days, untouched ........... List 3 (shame list)
First attempt made → Attempting Contact
   └─ days 1-10, no answer ......... List 2 (daily)
   └─ day 10, still no answer ...... auto → never-reached → List 4 (monthly)
They answer → In Conversation → YOU SET LEAD TEMP
   └─ Hot ........................... List 5 (weekly)
   └─ Warm .......................... List 6 (bi-weekly)
   └─ Cold .......................... List 7 (bi-monthly)
   └─ forgot to set temp ............ List 10 (safety net)
They sign → client-active ........... List 9 (no cadence)
Deal closes → past-client ........... List 8 (quarterly)
```

## Your daily routine with these lists
1. **List 1** — call every new lead (goal: empty by noon)
2. **List 2** — daily follow-ups, days 1-10
3. **List 3 & 10** — should be empty; if not, fix immediately
4. **List 5** Mon/Tue · **List 6** as due · **List 4** first Monday of month · **List 7 & 8** as due

Complete the task / log the call as you work each name — that's what stamps Last Touch Date
and makes the lists self-cleaning.
