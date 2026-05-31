// Vercel serverless function: newsletter signup -> Follow Up Boss (tagged "Newsletter")
//
// Setup (one-time): in Vercel -> Project -> Settings -> Environment Variables, add
//   FUB_API_KEY = <your Follow Up Boss API key>   (FUB -> Admin -> API)
// Then redeploy. Until the key is set, signups still get captured via the Web3Forms
// fallback below (just without the tag), so no leads are ever lost.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const WEB3FORMS_KEY = "03501446-9da3-437f-844a-a8c5fcbd3289"; // public client key (fallback only)

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  // Parse body (Vercel parses JSON automatically; handle string just in case)
  var body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  var email = String(body.email || "").trim();
  var name = String(body.name || "").trim();
  var area = String(body.message || body.area || "").trim();

  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ success: false, message: "Please enter a valid email." });
    return;
  }

  var key = process.env.FUB_API_KEY;

  // Primary path: Follow Up Boss API with a "Newsletter" tag.
  if (key) {
    try {
      var auth = Buffer.from(key + ":").toString("base64");
      var fubRes = await fetch("https://api.followupboss.com/v1/events", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Basic " + auth },
        body: JSON.stringify({
          source: "michaelhyunn.com",
          system: "michaelhyunn.com",
          type: "Registration",
          message: area ? ("Newsletter signup — watching: " + area) : "Newsletter signup",
          person: {
            firstName: name || undefined,
            emails: [{ value: email }],
            tags: ["Newsletter"],
            source: "Website Newsletter"
          }
        })
      });
      if (fubRes.ok) { res.status(200).json({ success: true }); return; }
      // else fall through to fallback so the lead is still captured
    } catch (e) { /* fall through to fallback */ }
  }

  // Fallback: Web3Forms email (captures the signup even if FUB isn't configured yet).
  try {
    var w3 = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        email: email,
        name: name,
        message: area,
        interest: "Newsletter signup",
        subject: "Newsletter signup — michaelhyunn.com",
        from_name: "michaelhyunn.com"
      })
    });
    var j = await w3.json();
    var ok = w3.ok && j && j.success;
    res.status(ok ? 200 : 502).json({ success: !!ok });
  } catch (e) {
    res.status(502).json({ success: false, message: "Could not subscribe right now." });
  }
};
