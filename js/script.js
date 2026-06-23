/* =========================================================================
   ABRAJ SOLUTIONS — Core Engine
   =========================================================================
   Founder: Sai Teja Gandepalli
   Primary Email: saitejagandepalli8@gmail.com
   ========================================================================= */

const CONFIG = {
  // Configured with placeholders, change custom parameters as needed
  whatsappNumber: "8500352030", // Keep previous WhatsApp routing number or update
  whatsappDefaultMessage: "Hi, I am interested in scheduling a consultation with ABRAJ Solutions about my Insurance requirements.",

  // Principal Advisory Mail Address
  email: "saitejagandepalli8@gmail.com",
  emailSubject: "Inquiry - ABRAJ Solutions Protection Consultation",
  emailBody: "Hi Sai Teja,\n\nI visited the ABRAJ Solutions portal and want to review our protection options:\n\n- Scope of Requirement (Health/Life): \n- Sum Insured targets: \n- Best time to contact me: \n",

  // -----------------------------------------------------------------------
  // EMAIL — EmailJS integration configuration
  // -----------------------------------------------------------------------
  formMode: "emailjs",

  emailjs: {
    publicKey: "9yEUlCDQc19rrReYy",
    serviceId: "service_eiy6zkk",
    templateId: "template_8zhyuxf" // Maps to {{name}}, {{email}}, {{title}}, {{message}} in image_c8d020.png
  },

  // Proxy Meta endpoint
  whatsappApi: {
    enabled: false,
    notifyEndpoint: "http://localhost:5000/api/whatsapp-notify"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initActiveNavOnScroll();
  initScrollReveal();
  initCountUp();
  initDirectContactLinks();
  initContactForm();
  initCareerForm();
  initBackToTop();
  initToastClose();
  
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

/* ---------------------------------------------------------------------
   Header background change on scroll threshold
--------------------------------------------------------------------- */
function initHeader() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const toggle = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

/* ---------------------------------------------------------------------
   Mobile Navigation Menu handler
--------------------------------------------------------------------- */
function initMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (!navToggle || !mainNav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll(".main-nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------------------
   Active menu highlighting based on scrolling position
--------------------------------------------------------------------- */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll("[data-nav]");

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active-link", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------------------
   Scroll reveal animations
--------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".expertise-card, .project-card, .timeline-item, .contact-action, .contact-form-wrap, .section-head, .article-card, .founder-card, .founder-mission"
  );
  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------
   Ease-out-cubic responsive metric counter animation
--------------------------------------------------------------------- */
function initCountUp() {
  const stats = document.querySelectorAll("[data-count-to]");
  if (!stats.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.countTo);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease-out-cubic
      const value = (target % 1 === 0) 
        ? Math.round(target * eased) 
        : (target * eased).toFixed(1);
      el.textContent = `${prefix}${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  stats.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------
   Formatting dynamic Mailto and WhatsApp links
--------------------------------------------------------------------- */
function buildWhatsappUrl(message) {
  const text = encodeURIComponent(message || CONFIG.whatsappDefaultMessage);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}

function buildMailtoUrl(subject, body) {
  const params = new URLSearchParams({
    subject: subject || CONFIG.emailSubject,
    body: body || CONFIG.emailBody
  });
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${CONFIG.email}?${query}`;
}

function initDirectContactLinks() {
  const whatsappBtn = document.getElementById("whatsappBtn");
  const emailBtn = document.getElementById("emailBtn");
  const emailDisplay = document.getElementById("emailDisplay");

  if (whatsappBtn) whatsappBtn.setAttribute("href", buildWhatsappUrl());
  if (emailBtn) emailBtn.setAttribute("href", buildMailtoUrl());
  if (emailDisplay) emailDisplay.textContent = CONFIG.email;
}

/* ---------------------------------------------------------------------
   Interactive Consultation Form Validation and Execution
--------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formWhatsappLink = document.getElementById("formWhatsappLink");
  if (!form || !submitBtn) return;

  const fields = {
    fullName: { el: document.getElementById("fullName"), errorEl: document.getElementById("fullNameError") },
    mobileNumber: { el: document.getElementById("mobileNumber"), errorEl: document.getElementById("mobileNumberError") },
    emailAddress: { el: document.getElementById("emailAddress"), errorEl: document.getElementById("emailAddressError") },
    city: { el: document.getElementById("city"), errorEl: document.getElementById("cityError") },
    message: { el: document.getElementById("message"), errorEl: document.getElementById("messageError") }
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(key, message) {
    const fieldObj = fields[key];
    if (!fieldObj || !fieldObj.el || !fieldObj.errorEl) return;
    fieldObj.errorEl.textContent = message;
    fieldObj.el.closest(".form-field").classList.toggle("has-error", Boolean(message));
  }

  function validate() {
    let isValid = true;

    const name = fields.fullName.el.value.trim();
    if (!name) {
      setError("fullName", "Please enter your name.");
      isValid = false;
    } else {
      setError("fullName", "");
    }

    const mobile = fields.mobileNumber.el.value.trim();
    if (!mobile) {
      setError("mobileNumber", "Please provide your mobile contact number.");
      isValid = false;
    } else if (mobile.length < 10) {
      setError("mobileNumber", "Please enter a valid mobile number.");
      isValid = false;
    } else {
      setError("mobileNumber", "");
    }

    const email = fields.emailAddress.el.value.trim();
    if (!email) {
      setError("emailAddress", "Please write your email address.");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setError("emailAddress", "Please enter a valid email structure.");
      isValid = false;
    } else {
      setError("emailAddress", "");
    }

    const city = fields.city.el.value.trim();
    if (!city) {
      setError("city", "Please tell us your city.");
      isValid = false;
    } else {
      setError("city", "");
    }

    return isValid;
  }

  // Clear live validations on typing
  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener("input", () => {
      const parent = fields[key].el.closest(".form-field");
      if (parent && parent.classList.contains("has-error")) {
        setError(key, "");
      }
    });
  });

  function syncWhatsappHandoff() {
    const name = fields.fullName.el.value.trim();
    const city = fields.city.el.value.trim();
    const message = fields.message.el.value.trim();

    const composedText = [
      name ? `Hi, I am ${name} from ${city || 'AP/Telangana'}.` : "Hi ABRAJ Solutions,",
      message || "I would like to schedule a free Health & Life Insurance policy consultation."
    ].filter(Boolean).join(" ");

    formWhatsappLink.setAttribute("href", buildWhatsappUrl(composedText));
  }

  form.addEventListener("input", syncWhatsappHandoff);
  if (formWhatsappLink) {
    formWhatsappLink.setAttribute("href", buildWhatsappUrl());
    formWhatsappLink.setAttribute("target", "_blank");
    formWhatsappLink.setAttribute("rel", "noopener");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validate()) {
      showToast({
        type: "error",
        title: "Check fields",
        message: "Verify the highlighted red boxes before submitting."
      });
      return;
    }

    const payload = {
      fullName: fields.fullName.el.value.trim(),
      email: fields.emailAddress.el.value.trim(),
      // Creating unified subject for EmailJS template
      subject: `Insurance Query — from ${fields.city.el.value.trim()} (Mobile: ${fields.mobileNumber.el.value.trim()})`,
      message: fields.message.el.value.trim() || "Requested general Health & Life insurance review."
    };

    setSubmitting(true);
    const emailResult = await submitContactForm(payload);
    setSubmitting(false);

    if (emailResult.ok) {
      showToast({
        type: "success",
        title: "Request Received",
        message: "Thank you. Sai Teja will review your profile and connect with you soon."
      });
      form.reset();
      syncWhatsappHandoff();
    } else {
      showToast({
        type: "error",
        title: "Submission failed",
        message: "We faced an issue sending this request. Please tap 'Instant Chat on WhatsApp'!"
      });
    }
  });

  function setSubmitting(isSubmitting) {
    submitBtn.classList.toggle("is-loading", isSubmitting);
    submitBtn.disabled = isSubmitting;
  }
}

/* ---------------------------------------------------------------------
   Interactive Career Application Form Validation
--------------------------------------------------------------------- */
function initCareerForm() {
  const form = document.getElementById("careerForm");
  const submitBtn = document.getElementById("careerSubmitBtn");
  if (!form || !submitBtn) return;

  const fields = {
    careerName: { el: document.getElementById("careerName"), errorEl: document.getElementById("careerNameError") },
    careerMobile: { el: document.getElementById("careerMobile"), errorEl: document.getElementById("careerMobileError") },
    careerEmail: { el: document.getElementById("careerEmail"), errorEl: document.getElementById("careerEmailError") },
    careerCity: { el: document.getElementById("careerCity"), errorEl: document.getElementById("careerCityError") }
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(key, message) {
    const fieldObj = fields[key];
    if (!fieldObj || !fieldObj.el || !fieldObj.errorEl) return;
    fieldObj.errorEl.textContent = message;
    fieldObj.el.closest(".form-field").classList.toggle("has-error", Boolean(message));
  }

  function validate() {
    let isValid = true;

    if (!fields.careerName.el.value.trim()) {
      setError("careerName", "Please enter your name.");
      isValid = false;
    } else { setError("careerName", ""); }

    const mobile = fields.careerMobile.el.value.trim();
    if (!mobile || mobile.length < 10) {
      setError("careerMobile", "Please enter a valid mobile number.");
      isValid = false;
    } else { setError("careerMobile", ""); }

    const email = fields.careerEmail.el.value.trim();
    if (!email || !emailPattern.test(email)) {
      setError("careerEmail", "Please provide a valid email.");
      isValid = false;
    } else { setError("careerEmail", ""); }

    if (!fields.careerCity.el.value.trim()) {
      setError("careerCity", "Please specify your location city.");
      isValid = false;
    } else { setError("careerCity", ""); }

    return isValid;
  }

  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener("input", () => {
      const parent = fields[key].el.closest(".form-field");
      if (parent && parent.classList.contains("has-error")) {
        setError(key, "");
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      fullName: fields.careerName.el.value.trim(),
      email: fields.careerEmail.el.value.trim(),
      subject: `Career Application — Advisor Program (${fields.careerCity.el.value.trim()})`,
      message: `Applicant details:\n- Mobile: ${fields.careerMobile.el.value.trim()}\n- City: ${fields.careerCity.el.value.trim()}\n- Wants to join as advisor.`
    };

    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    const result = await submitContactForm(payload);

    submitBtn.classList.remove("is-loading");
    submitBtn.disabled = false;

    if (result.ok) {
      showToast({
        type: "success",
        title: "Application Received",
        message: "Excellent! Your profile is saved. We will connect shortly."
      });
      form.reset();
    } else {
      showToast({
        type: "error",
        title: "Submission failed",
        message: "Problem submitting application. Email us directly at saitejagandepalli8@gmail.com"
      });
    }
  });
}

/* ---------------------------------------------------------------------
   Email Transmission Wrapper
--------------------------------------------------------------------- */
async function submitContactForm(payload) {
  const isEmailJSConfigured = CONFIG.emailjs.templateId && !CONFIG.emailjs.templateId.includes("YOUR_");
  const actualMode = isEmailJSConfigured ? CONFIG.formMode : "demo";

  switch (actualMode) {
    case "emailjs": {
      if (typeof emailjs === "undefined") {
        return { ok: false };
      }
      emailjs.init(CONFIG.emailjs.publicKey);
      try {
        // Formatted cleanly to match EmailJS requirements (from image_c8d020.png)
        const res = await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
          name: payload.fullName,
          email: payload.email,
          title: payload.subject,
          message: payload.message
        });
        return { ok: true, details: res };
      } catch (e) {
        console.error(e);
        return { ok: false };
      }
    }

    case "demo":
    default: {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ok: true, simulated: true };
    }
  }
}

/* ---------------------------------------------------------------------
   Dynamic Toast Notification HUD
--------------------------------------------------------------------- */
let toastTimeoutId = null;

function showToast({ type = "success", title, message }) {
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toastIcon");
  const titleEl = document.getElementById("toastTitle");
  const messageEl = document.getElementById("toastMessage");

  if (!toast || !icon || !titleEl || !messageEl) return;

  titleEl.textContent = title;
  messageEl.textContent = message;

  const successIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4caf7d" stroke-width="1.5"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#4caf7d" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const errorIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#e5635b" stroke-width="1.5"/><path d="M12 8v5M12 16h.01" stroke="#e5635b" stroke-width="1.6" stroke-linecap="round"/></svg>`;

  icon.innerHTML = type === "success" ? successIcon : errorIcon;
  toast.classList.toggle("is-error", type === "error");
  toast.classList.add("is-visible");

  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => hideToast(), 5500);
}

function hideToast() {
  const toast = document.getElementById("toast");
  if (toast) toast.classList.remove("is-visible");
}

function initToastClose() {
  const closeBtn = document.getElementById("toastClose");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      clearTimeout(toastTimeoutId);
      hideToast();
    });
  }
}

/* ---------------------------------------------------------------------
   Back-to-top Scrolling Button
--------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  const toggle = () => btn.classList.toggle("is-visible", window.scrollY > 600);
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
