// Vercel serverless function: website form -> Follow Up Boss (with tags)
//
// Every submission is tagged "Newsletter". Forms can pass extra tags via `tags`
// (comma-separated) — e.g. the Buy form sends "Buyer", the Sell form "Seller".
//
// Setup (one-time): in Vercel -> Project -> Settings -> Environment Variables, add
//   FUB_API_KEY = <your Follow Up Boss API key>   (FUB -> Admin -> API)
// then redeploy. Until the key is set, leads are still captured via the Web3Forms
// fallback (without tags), so nothing is ever lost.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const WEB3FORMS_KEY = "03501446-9da3-437f-844a-a8c5fcbd3289"; // public client key (fallback only)

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

  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ success: false, message: "Please enter a valid email." });
    return;
  }

  // Tags: always "Newsletter", plus any extras the form passes (e.g. Buyer/Seller). Dedup, case-insensitive.
  var tags = ["Newsletter"];
  String(body.tags || "").split(",").forEach(function (t) {
    t = t.trim();
    if (t && tags.map(function (x) { return x.toLowerCase(); }).indexOf(t.toLowerCase()) === -1) tags.push(t);
  });

  // Split full name into first/last for FUB.
  var firstName = name, lastName = undefined;
  if (name.indexOf(" ") > -1) { var p = name.split(/\s+/); firstName = p.shift(); lastName = p.join(" "); }

  var person = { emails: [{ value: email }], tags: tags, source: "michaelhyunn.com" };
  if (firstName) person.firstName = firstName;
  if (lastName) person.lastName = lastName;
  if (phone) person.phones = [{ value: phone }];

  var key = process.env.FUB_API_KEY;

  // Primary path: Follow Up Boss API (sets the tags).
  if (key) {
    try {
      var auth = Buffer.from(key + ":").toString("base64");
      var fubRes = await fetch("https://api.followupboss.com/v1/events", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Basic " + auth },
        body: JSON.stringify({
          source: "michaelhyunn.com",
          system: "michaelhyunn.com",
          type: "General Inquiry",
          message: (interest ? interest + (message ? " — " : "") : "") + message,
          person: person
        })
      });
      if (fubRes.ok) { res.status(200).json({ success: true }); return; }
      // else fall through so the lead is still captured
    } catch (e) { /* fall through to fallback */ }
  }

  // Fallback: Web3Forms email (captures the lead even if FUB isn't configured yet; tags noted in subject).
  try {
    var w3 = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        name: name,
        email: email,
        phone: phone,
        message: message,
        interest: interest,
        tags: tags.join(", "),
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
