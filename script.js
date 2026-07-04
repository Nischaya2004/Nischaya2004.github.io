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
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
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

const mascot = document.querySelector(".mascot");
let scrollTimer;

if (mascot) {
  window.addEventListener("scroll", () => {
    mascot.classList.add("scrolling");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      mascot.classList.remove("scrolling");
    }, 180);
  }, { passive: true });

  mascot.addEventListener("click", () => {
    const animals = ["🦊", "🐼", "🐧", "🐱", "🐸"];
    const animal = mascot.querySelector(".mascot-animal");
    const currentIndex = animals.indexOf(animal.textContent);
    animal.textContent = animals[(currentIndex + 1) % animals.length];

    const bubble = mascot.querySelector(".mascot-bubble");
    bubble.textContent = "Keep going";
    setTimeout(() => {
      bubble.textContent = "Scroll with me";
    }, 1200);
  });
}
