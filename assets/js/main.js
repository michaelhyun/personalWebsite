/* =================================================================
   MICHAEL HYUN · BlueDoor Realty — interaction + motion layer
   Vanilla JS. Lenis smooth scroll (progressive, CDN-loaded) +
   IntersectionObserver reveals, sticky nav, parallax, accordion,
   mobile menu, count-up, and Follow Up Boss-ready contact form.
   ================================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------  YEAR  ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ----------  BACKGROUND VIDEO AUTOPLAY SAFEGUARD  ----------
     Some browsers defer/pause muted autoplay; nudge them and retry
     on first user interaction so the hero/band footage keeps playing. */
  (function () {
    var vids = Array.prototype.slice.call(document.querySelectorAll("video[autoplay]"));
    if (!vids.length) return;
    function play() {
      vids.forEach(function (v) {
        if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      });
    }
    vids.forEach(function (v) { v.addEventListener("canplay", play, { once: true }); });
    play();
    ["pointerdown", "touchstart", "scroll", "visibilitychange"].forEach(function (ev) {
      window.addEventListener(ev, play, { passive: true });
    });
  })();

  /* ----------  SMOOTH SCROLL (Lenis)  ---------- */
  var lenis = null;
  function initLenis() {
    if (reduceMotion || typeof window.Lenis === "undefined") return;
    lenis = new window.Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // anchor links route through Lenis
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
        closeMenu();
      });
    });

    initSectionSnap();
  }

  /* ----------  MAGNETIC SECTION SNAP (premium "settle into place")  ----------
     When the user stops scrolling near a section edge, gently ease into
     alignment so each section feels deliberate — instead of blowing past it.
     Precise-pointer (desktop) only; touch momentum is left natural.        */
  function initSectionSnap() {
    if (!lenis || reduceMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    var snapEls = Array.prototype.slice.call(document.querySelectorAll("main > section"));
    if (!snapEls.length) return;

    var snapTimer = null, lastVel = 0, snapping = false;

    lenis.on("scroll", function (e) {
      lastVel = (e && typeof e.velocity === "number") ? e.velocity : 0;
      if (snapping) return;
      clearTimeout(snapTimer);
      snapTimer = setTimeout(settle, 120);
    });

    function settle() {
      if (snapping || Math.abs(lastVel) > 0.06) return;           // still gliding — wait
      var y = window.scrollY || window.pageYOffset;
      var vh = window.innerHeight;
      var maxY = document.documentElement.scrollHeight - vh;
      if (y < 4 || y > maxY - 4) return;                          // don't fight top/bottom

      var bestTop = null, bestDist = Infinity;
      for (var i = 0; i < snapEls.length; i++) {
        var top = snapEls[i].getBoundingClientRect().top + y;
        var d = Math.abs(top - y);
        if (d < bestDist) { bestDist = d; bestTop = top; }
      }

      // Only snap when reasonably close to a section edge (≈ quarter viewport),
      // so reading in the middle of a tall section is never interrupted.
      var threshold = vh * 0.26;
      if (bestTop !== null && bestDist > 6 && bestDist < threshold) {
        snapping = true;
        lenis.scrollTo(Math.round(bestTop), {
          duration: 0.85,
          easing: function (t) { return 1 - Math.pow(1 - t, 3); },
          onComplete: function () { snapping = false; }
        });
      }
    }
  }

  if (document.readyState === "complete") initLenis();
  else window.addEventListener("load", initLenis);

  /* ----------  PARALLAX (header scrolls away with the page)  ---------- */
  function onScroll() {
    // parallax: 0 offset when the element's top is at the viewport top, so a
    // top-anchored hero video fully covers the top edge at scroll 0.
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.dataset.parallax) || 0.18;
      var rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      var offset = -rect.top * speed;
      el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
    });
  }
  var parallaxEls = reduceMotion ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------  REVEAL ON SCROLL  ---------- */
  var revealTargets = document.querySelectorAll("[data-reveal], .reveal-mask, [data-reveal-group]");

  function revealEl(el) {
    if (el.classList.contains("is-visible")) return;
    if (el.hasAttribute("data-reveal-group")) {
      el.querySelectorAll("[data-reveal]").forEach(function (k, i) {
        k.style.setProperty("--i", i); k.classList.add("is-visible");
      });
    }
    el.classList.add("is-visible");
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revealEl(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });

    // Guaranteed above-the-fold pass — the observer's first callback can fire
    // before late layout (hero flex-end, fonts, video) settles, leaving visible
    // elements stuck hidden. Re-check what's already on screen after load.
    function revealAboveFold() {
      revealTargets.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) { revealEl(el); io.unobserve(el); }
      });
    }
    window.addEventListener("load", function () {
      revealAboveFold();
      // one more after fonts/video settle
      setTimeout(revealAboveFold, 400);
    });
    if (document.readyState === "complete") setTimeout(revealAboveFold, 50);
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----------  COUNT-UP STATS  ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.dataset.count);
        var decimals = (el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0);
        if (reduceMotion) { el.textContent = target.toFixed(decimals); cio.unobserve(el); return; }
        var dur = 1500, start = null;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toFixed(decimals);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ----------  ACCORDION  ---------- */
  document.querySelectorAll(".acc-head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.closest(".acc-item");
      var isOpen = item.classList.contains("open");
      // optional: single-open behavior within an accordion
      var acc = item.closest(".accordion");
      if (acc && acc.dataset.single !== "false") {
        acc.querySelectorAll(".acc-item.open").forEach(function (o) {
          if (o !== item) { o.classList.remove("open"); o.querySelector(".acc-head").setAttribute("aria-expanded", "false"); }
        });
      }
      item.classList.toggle("open", !isOpen);
      head.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ----------  MOBILE MENU  ---------- */
  var toggle = document.querySelector(".menu-toggle");
  function closeMenu() { document.body.classList.remove("menu-open"); if (toggle) toggle.setAttribute("aria-expanded", "false"); }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".mobile-panel a").forEach(function (a, i) {
      a.style.setProperty("--i", i);
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ----------  HOME / GENERIC SEARCH → route to listings  ---------- */
  document.querySelectorAll("[data-search-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = form.querySelector("input").value.trim();
      // Placeholder: wire to your IDX/Compass search. For now, open Compass search.
      var base = "https://www.compass.com/homes-for-sale/";
      window.open(base + (q ? "?q=" + encodeURIComponent(q) : ""), "_blank", "noopener");
    });
  });

  /* ----------  CONTACT FORM → Follow Up Boss  ----------
     HOW TO CONNECT (2 minutes, no server needed):
     1. Create a free endpoint at https://web3forms.com (or use Formspree).
     2. In your Web3Forms dashboard set the "Send a copy to" / forwarding
        address to your Follow Up Boss lead-parsing email
        (FUB → Admin → Lead Sources → "Add inbound email").
     3. Paste your Web3Forms access key into FUB_FORM_ENDPOINT_KEY below.
     FUB auto-creates a contact + assigns the lead source from each email.
  ------------------------------------------------------------------ */
  var FUB_FORM_ENDPOINT_KEY = "03501446-9da3-437f-844a-a8c5fcbd3289"; // <-- replace
  var FUB_ENDPOINT = "https://api.web3forms.com/submit";

  document.querySelectorAll("[data-contact-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var submit = form.querySelector("button[type=submit]");

    var okMsg = form.dataset.successMessage || "Thank you — your message is on its way. I’ll be in touch within one business day.";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // simple validation
      var firstInvalid = null;
      form.querySelectorAll("[required]").forEach(function (f) {
        var err = f.parentElement.querySelector(".field-error");
        var bad = !f.value.trim() || (f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        if (err) err.textContent = bad ? (f.dataset.error || "Please complete this field.") : "";
        if (bad && !firstInvalid) firstInvalid = f;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      if (status) { status.textContent = ""; status.className = "form-status"; }
      if (submit) { submit.disabled = true; submit.dataset.label = submit.textContent; submit.textContent = "Sending…"; }

      var data = new FormData(form);
      // Routes through /api/subscribe -> Follow Up Boss. Every lead is tagged
      // "Newsletter"; the form's data-tags adds extras (e.g. "Buyer" / "Seller").
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name") || "",
          email: data.get("email") || "",
          phone: data.get("phone") || "",
          message: data.get("message") || "",
          interest: data.get("interest") || "",
          sms_consent: form.querySelector("[name=sms_consent]") && form.querySelector("[name=sms_consent]").checked ? "yes" : "no",
          tags: form.dataset.tags || ""
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            form.reset();
            if (status) { status.textContent = okMsg; status.className = "form-status ok"; }
            form.dispatchEvent(new CustomEvent("form:success", { bubbles: true }));
          } else { throw new Error(); }
        })
        .catch(function () {
          if (status) { status.textContent = "Something went wrong. Please email michael.hyun@compass.com directly."; status.className = "form-status err"; }
        })
        .finally(function () {
          if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label; }
        });
    });
  });

  /* ----------  NEWSLETTER FORM → /api/subscribe (Follow Up Boss, tagged "Newsletter")  ---------- */
  document.querySelectorAll("[data-newsletter-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var submit = form.querySelector("button[type=submit]");
    var okMsg = form.dataset.successMessage || "You’re on the list — thank you for subscribing!";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var emailEl = form.querySelector("input[type=email], input[name=email]");
      var err = emailEl && emailEl.parentElement.querySelector(".field-error");
      var bad = !emailEl || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailEl.value.trim());
      if (err) err.textContent = bad ? "Please enter a valid email." : "";
      if (bad) { if (emailEl) emailEl.focus(); return; }

      if (status) { status.textContent = ""; status.className = "form-status"; }
      if (submit) { submit.disabled = true; submit.dataset.label = submit.textContent; submit.textContent = "Subscribing…"; }

      var data = new FormData(form);
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          name: data.get("name") || "",
          message: data.get("message") || "",
          phone: data.get("phone") || "",
          interest: data.get("interest") || "",
          sms_consent: form.querySelector("[name=sms_consent]") && form.querySelector("[name=sms_consent]").checked ? "yes" : "no"
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            form.reset();
            if (status) { status.textContent = okMsg; status.className = "form-status ok"; }
          } else { throw new Error(); }
        })
        .catch(function () {
          if (status) { status.textContent = "Something went wrong. Please email michael.hyun@compass.com directly."; status.className = "form-status err"; }
        })
        .finally(function () {
          if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label; }
        });
    });
  });

  /* ----------  NEWSLETTER POPUP  ----------
     Appears a few seconds after the visit, asking for a newsletter sign-up.
     Submits into Follow Up Boss (same Web3Forms key). Remembered in
     localStorage so it shows at most once per visitor (until they clear it). */
  (function () {
    if (document.body.getAttribute("data-page") === "newsletter") return;
    var STORAGE_KEY = "mh_newsletter_v1";
    var SHOW_EVERY = 7 * 24 * 60 * 60 * 1000; // re-ask at most once a week
    try {
      var last = parseInt(localStorage.getItem(STORAGE_KEY), 10);
      if (last && (Date.now() - last) < SHOW_EVERY) return;
    } catch (e) {}

    var modal = document.createElement("div");
    modal.className = "nl-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "nl-title");
    modal.hidden = true;
    modal.innerHTML =
      '<div class="nl-scrim" data-nl-close></div>' +
      '<div class="nl-card">' +
        '<button class="nl-close" type="button" aria-label="Close" data-nl-close>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '<p class="eyebrow">The Newsletter</p>' +
        '<h2 id="nl-title">Bay Area market intel, <em>in your inbox.</em></h2>' +
        '<p class="nl-sub">Monthly market updates plus the occasional handwritten note when a move actually matters for Bay Area buyers and sellers. No spam — unsubscribe anytime.</p>' +
        '<form class="nl-form" novalidate>' +
          '<input type="email" name="email" required autocomplete="email" inputmode="email" placeholder="you@email.com" aria-label="Email address" />' +
          '<button class="btn" type="submit">Subscribe <span class="arrow">→</span></button>' +
        '</form>' +
        '<div class="nl-status" role="status" aria-live="polite"></div>' +
        '<a class="nl-dismiss" role="button" tabindex="0" data-nl-close>No thanks, maybe later</a>' +
      '</div>';
    document.body.appendChild(modal);

    var form = modal.querySelector(".nl-form");
    var statusEl = modal.querySelector(".nl-status");
    var emailInput = modal.querySelector("input[name=email]");
    var lastFocus = null;

    function remember() { try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch (e) {} }
    function openModal() {
      if (document.body.classList.contains("menu-open")) { window.setTimeout(openModal, 4000); return; }
      lastFocus = document.activeElement;
      modal.hidden = false;
      requestAnimationFrame(function () { modal.classList.add("open"); });
      window.setTimeout(function () { try { emailInput.focus(); } catch (e) {} }, 450);
      document.addEventListener("keydown", onKey);
    }
    function closeModal(persist) {
      if (persist !== false) remember();
      modal.classList.remove("open");
      document.removeEventListener("keydown", onKey);
      window.setTimeout(function () { modal.hidden = true; }, 520);
      try { if (lastFocus && lastFocus.focus) lastFocus.focus(); } catch (e) {}
    }
    function onKey(e) { if (e.key === "Escape") closeModal(); }

    modal.querySelectorAll("[data-nl-close]").forEach(function (el) {
      el.addEventListener("click", function () { closeModal(); });
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); closeModal(); } });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = emailInput.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        statusEl.textContent = "Please enter a valid email."; statusEl.className = "nl-status err"; emailInput.focus(); return;
      }
      var btn = form.querySelector("button[type=submit]");
      var lbl = btn.textContent;
      btn.disabled = true; btn.textContent = "Subscribing…";
      statusEl.textContent = ""; statusEl.className = "nl-status";

      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, message: "(via popup)" })
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            statusEl.textContent = "You’re on the list — watch your inbox. Thank you!";
            statusEl.className = "nl-status ok";
            remember(); window.setTimeout(function () { closeModal(false); }, 2600);
          } else { throw new Error(); }
        })
        .catch(function () {
          statusEl.textContent = "Something went wrong. Please try again.";
          statusEl.className = "nl-status err";
        })
        .finally(function () { btn.disabled = false; btn.textContent = lbl; });
    });

    window.setTimeout(openModal, 4500);
  })();

})();
