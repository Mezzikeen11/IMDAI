export function initMenu() {
  const dropdowns = document.querySelectorAll(".has-dropdown");

  dropdowns.forEach(item => {
    item.addEventListener("mouseenter", () => {
      item.classList.add("active");
    });

    item.addEventListener("mouseleave", () => {
      item.classList.remove("active");
    });
  });
}