document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".topbar__toggle");
  const links = document.querySelector(".topbar__links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("is-open");
    });
  }

  document.querySelectorAll(".bento__cell").forEach((cell) => {
    cell.addEventListener("mousemove", (e) => {
      const rect = cell.getBoundingClientRect();
      cell.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      cell.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });

  const ring = document.querySelector(".cursor-ring");
  if (ring) {
    document.addEventListener("mousemove", (e) => {
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll("a, button, .bento__cell").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  const cells = document.querySelectorAll(".bento__cell");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cells.forEach((cell) => observer.observe(cell));
  } else {
    cells.forEach((cell) => cell.classList.add("is-visible"));
  }
});
