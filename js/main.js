const menuBtn = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

if (menuBtn && menu) {
  const setExpanded = (isOpen) => {
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menu.classList.toggle("is-open", isOpen);
    if (isOpen) menu.removeAttribute("hidden");
    else menu.setAttribute("hidden", "");
  };

  // Initialize
  if (!menu.hasAttribute("hidden")) menu.setAttribute("hidden", "");
  if (!menuBtn.hasAttribute("aria-expanded")) menuBtn.setAttribute("aria-expanded", "false");

  menuBtn.addEventListener("click", () => {
    const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
    setExpanded(!isOpen);
  });
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// VDM contact widget (single image with two functional buttons)
(() => {
  if (document.querySelector(".vdm-widget")) return;

  const wrap = document.createElement("div");
  wrap.className = "vdm-widget";

  wrap.innerHTML = `
    <img
      class="vdm-widget__img"
      src="assets/vdm-contact-widget.png"
      alt="Chat with VDM AI contact options"
      loading="lazy"
      decoding="async"
    />
    <a class="vdm-widget__hit vdm-widget__hit--chat" href="#" aria-label="Open live chat"></a>
    <a class="vdm-widget__hit vdm-widget__hit--wa" href="https://wa.me/13465466197" target="_blank" rel="noopener" aria-label="Chat on WhatsApp: +1 346 546 6197"></a>
  `;

  const chatHit = wrap.querySelector(".vdm-widget__hit--chat");
  if (chatHit) {
    chatHit.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.Tawk_API && typeof window.Tawk_API.maximize === "function") {
        window.Tawk_API.maximize();
        return;
      }
      window.location.href = "contact.html";
    });
  }

  document.body.appendChild(wrap);
})();

// Hide the default Tawk launcher (prevents overlap)
(() => {
  const tryHide = () => {
    if (window.Tawk_API && typeof window.Tawk_API.hideWidget === "function") {
      window.Tawk_API.hideWidget();
      return true;
    }
    return false;
  };

  if (tryHide()) return;

  let attempts = 0;
  const id = window.setInterval(() => {
    attempts += 1;
    if (tryHide() || attempts > 40) window.clearInterval(id);
  }, 250);
})();

// Footer credit (site-wide)
(() => {
  const el = document.querySelector(".footer__bottom");
  if (!el) return;
  if (el.querySelector("[data-vdm-credit]")) return;

  const credit = document.createElement("span");
  credit.className = "muted";
  credit.setAttribute("data-vdm-credit", "1");
  credit.style.marginLeft = "12px";
  credit.textContent = "Chat and AI powered by VDM";

  el.appendChild(credit);
})();

/** Course cards shown on the homepage (links to full syllabi pages). */
const featured = [
  {
    title: "Cloud Computing",
    level: "10-week program",
    href: "cloud-computing.html",
    blurb:
      "Networking, IAM, compute, storage, observability, and a deployable capstone.",
    tags: ["Cloud", "Labs", "Capstone"],
  },
  {
    title: "DevOps Engineering",
    level: "10-week program",
    href: "devops-engineering.html",
    blurb:
      "CI/CD, containers, IaC, observability, secure pipelines, and reliable releases.",
    tags: ["DevOps", "CI/CD", "IaC"],
  },
  {
    title: "AI for Engineers",
    level: "10-week program",
    href: "ai-for-engineers.html",
    blurb:
      "ML foundations, applied AI workflows, responsible AI, and a production-minded capstone.",
    tags: ["AI", "Applied", "Capstone"],
  },
];

const featuredGrid = document.getElementById("featuredCourses");
if (featuredGrid) {
  featuredGrid.innerHTML = featured
    .map(
      (c) => `
      <article class="card">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:baseline;">
          <h3 style="margin:0;">${c.title}</h3>
          <span style="color:var(--gold);font-weight:700;font-size:14px;">${c.level}</span>
        </div>
        <p style="margin-top:10px;">${c.blurb}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
          ${c.tags.map((t) => `<span class="badge">${t}</span>`).join("")}
        </div>
        <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn btn--ghost" href="${c.href}">View syllabus</a>
          <a class="btn btn--primary" href="contact.html">Enroll Now</a>
        </div>
      </article>
    `
    )
    .join("");
}

// Alumni carousel (homepage banner)
const alumniCard = document.querySelector("[data-alumni-carousel]");
const alumniImg = document.querySelector("[data-alumni-img]");
const alumniCaption = document.querySelector("[data-alumni-caption]");

if (alumniCard && alumniImg && alumniCaption) {
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const slides = [
    { src: "assets/alumni/alumni-1.jpg", caption: "Alumni spotlight" },
    { src: "assets/alumni/alumni-2.jpg", caption: "Career progress • real outcomes" },
    { src: "assets/alumni/alumni-3.jpg", caption: "Portfolio-ready projects" },
    { src: "assets/alumni/student-1.jpg", caption: "Student success story" },
  ];

  let idx = 0;
  let timer = null;
  let holding = false;

  const show = (nextIdx, { animate } = { animate: true }) => {
    idx = (nextIdx + slides.length) % slides.length;
    const s = slides[idx];

    if (animate && !prefersReducedMotion) alumniCard.classList.add("is-flipping");

    // Swap near the middle of the flip so it looks like a real "turn"
    window.setTimeout(() => {
      alumniImg.src = s.src;
      alumniCaption.textContent = s.caption;
    }, animate && !prefersReducedMotion ? 240 : 0);

    if (animate && !prefersReducedMotion) {
      window.setTimeout(() => alumniCard.classList.remove("is-flipping"), 560);
    }
  };

  const next = () => show(idx + 1);

  const start = () => {
    stop();
    if (prefersReducedMotion) return;
    timer = window.setInterval(() => {
      if (!holding) next();
    }, 3000);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  // Click advances to next slide
  alumniCard.addEventListener("click", () => next());

  // Press + hold pauses until release (mouse/touch/pen)
  const holdOn = () => {
    holding = true;
  };
  const holdOff = () => {
    holding = false;
  };

  alumniCard.addEventListener("pointerdown", holdOn);
  alumniCard.addEventListener("pointerup", holdOff);
  alumniCard.addEventListener("pointercancel", holdOff);
  alumniCard.addEventListener("pointerleave", holdOff);

  // Start autoplay
  show(0, { animate: false });
  start();
}
