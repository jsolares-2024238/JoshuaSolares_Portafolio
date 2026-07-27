document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".topbar__toggle");
  const links = document.querySelector(".topbar__links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("is-open");
    });
  }
});
