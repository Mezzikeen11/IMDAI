export function initVentanillaPresencialAccordion() {
  const accordions = document.querySelectorAll("#presencial .ventanilla-accordion");

  if (!accordions.length) return;

  accordions.forEach((accordion) => {
    accordion.addEventListener("toggle", () => {
      if (!accordion.open) return;

      accordions.forEach((item) => {
        if (item !== accordion) {
          item.open = false;
        }
      });
    });
  });
}