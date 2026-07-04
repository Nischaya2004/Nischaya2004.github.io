const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });

revealElements.forEach((el) => observer.observe(el));

const tabButtons = document.querySelectorAll(".tab-button");
const projects = document.querySelectorAll(".project-item");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    projects.forEach((project) => {
      const categories = project.dataset.category || "";
      const shouldShow = filter === "all" || categories.includes(filter);

      project.classList.toggle("hide", !shouldShow);

      if (shouldShow) {
        project.classList.remove("show-pop");
        void project.offsetWidth;
        project.classList.add("show-pop");
      }
    });
  });
});

const glow = document.querySelector(".cursor-glow");
if (glow && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.style.opacity = "1";
  });

  window.addEventListener("pointerleave", () => {
    glow.style.opacity = "0";
  });
}

const rail = document.querySelector(".scroll-rail");
const ball = document.querySelector(".scroll-ball");
const buddy = document.querySelector(".buddy");

let dragging = false;
let targetY = 40;
let buddyY = 40;

function getMaxScroll() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

function getRailHeight() {
  if (!rail) return 1;
  return Math.max(1, rail.getBoundingClientRect().height);
}

function updateBallFromScroll() {
  if (!rail || !ball || dragging) return;
  const railHeight = getRailHeight();
  const progress = window.scrollY / getMaxScroll();
  targetY = progress * railHeight;
  ball.style.top = `${targetY}px`;
}

function scrollFromClientY(clientY) {
  if (!rail || !ball) return;
  const rect = rail.getBoundingClientRect();
  const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
  const progress = y / rect.height;
  window.scrollTo({ top: progress * getMaxScroll(), behavior: "auto" });
  targetY = y;
  ball.style.top = `${targetY}px`;
}

function animateBuddy() {
  if (buddy) {
    buddyY += (targetY - buddyY) * 0.09;
    const playfulOffset = Math.sin(Date.now() / 160) * 5;
    buddy.style.top = `${buddyY + playfulOffset}px`;

    const distance = Math.abs(targetY - buddyY);
    buddy.classList.toggle("chasing", distance > 10);
  }
  requestAnimationFrame(animateBuddy);
}

if (rail && ball && buddy) {
  updateBallFromScroll();
  animateBuddy();

  window.addEventListener("scroll", updateBallFromScroll, { passive: true });
  window.addEventListener("resize", updateBallFromScroll);

  ball.addEventListener("pointerdown", (event) => {
    dragging = true;
    ball.classList.add("dragging");
    ball.setPointerCapture(event.pointerId);
    scrollFromClientY(event.clientY);
  });

  ball.addEventListener("pointermove", (event) => {
    if (dragging) scrollFromClientY(event.clientY);
  });

  ball.addEventListener("pointerup", () => {
    dragging = false;
    ball.classList.remove("dragging");
  });

  rail.addEventListener("pointerdown", (event) => {
    if (event.target === ball) return;
    scrollFromClientY(event.clientY);
  });
}
