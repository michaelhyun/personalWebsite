// Vercel serverless function: website form -> GoHighLevel (LeadConnector) inbound webhook.
//
// Every submission is tagged "Newsletter"; forms can add extra tags via `tags`
// (the Buy form sends "Buyer", the Sell form "Seller"). Build a GHL workflow with an
// "Inbound Webhook" trigger that maps: email, first_name, last_name, phone, message,
// interest, tags (comma-separated) -> Create/Update Contact + Add Tags.
//
// The webhook URL is kept here (server-side) so it never appears in the public page
// source. If GHL is briefly unreachable, the lead is still emailed via the fallback.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const GHL_WEBHOOK = "https://services.leadconnectorhq.com/hooks/QS6MVOlOOLSEkNZekwYk/webhook-trigger/76b5ee1e-3fdb-4117-bcef-cb1c4714f5d0";
const WEB3FORMS_KEY = "03501446-9da3-437f-844a-a8c5fcbd3289"; // email fallback only

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  var body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  var email = String(body.email || "").trim();
  var name = String(body.name || "").trim();
  var phone = String(body.phone || "").trim();
  var message = String(body.message || body.area || "").trim();
  var interest = String(body.interest || "").trim();
  var smsConsent = String(body.sms_consent || "").trim().toLowerCase() === "yes" ? "yes" : "no";
  var smsMarketing = String(body.sms_marketing || "").trim().toLowerCase() === "yes" ? "yes" : "no";

  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ success: false, message: "Please enter a valid email." });
    return;
  }

  // Tags: always "Newsletter", plus any extras the form passes (Buyer/Seller). Dedup.
  var tags = ["Newsletter"];
  String(body.tags || "").split(",").forEach(function (t) {
    t = t.trim();
    if (t && tags.map(function (x) { return x.toLowerCase(); }).indexOf(t.toLowerCase()) === -1) tags.push(t);
  });
  // Record explicit, separate SMS opt-ins so GHL only texts contacts who consented
  // to that message type (A2P compliance: distinct marketing vs non-marketing consent).
  if (smsConsent === "yes") tags.push("SMS-Consent-CustomerCare");
  if (smsMarketing === "yes") tags.push("SMS-Consent-Marketing");

  // Split full name into first/last for GHL.
  var firstName = name, lastName = "";
  if (name.indexOf(" ") > -1) { var p = name.split(/\s+/); firstName = p.shift(); lastName = p.join(" "); }

  var payload = {
    first_name: firstName,
    last_name: lastName,
    full_name: name,
    name: name,
    email: email,
    phone: phone,
    message: message,
    interest: interest,
    sms_consent: smsConsent,
    sms_marketing: smsMarketing,
    tags: tags.join(", "),
    source: "michaelhyunn.com" + (interest ? " — " + interest : "")
  };

  // Primary path: GoHighLevel inbound webhook.
  try {
    var ghl = await fetch(GHL_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (ghl.ok) { res.status(200).json({ success: true }); return; }
    // else fall through so the lead is still captured
  } catch (e) { /* fall through to fallback */ }

  // Fallback: email notification (so no lead is lost if the webhook is briefly down).
  try {
    var w3 = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        name: name, email: email, phone: phone, message: message,
        interest: interest, tags: tags.join(", "),
        subject: (interest || "New inquiry") + " [" + tags.join(", ") + "] — michaelhyunn.com",
        from_name: "michaelhyunn.com"
      })
    });
    var j = await w3.json();
    var ok = w3.ok && j && j.success;
    res.status(ok ? 200 : 502).json({ success: !!ok });
  } catch (e) {
    res.status(502).json({ success: false, message: "Could not submit right now." });
  }
};
