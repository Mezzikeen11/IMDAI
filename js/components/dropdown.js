export function closeAllDropdowns() {
  document.querySelectorAll(".has-dropdown").forEach((item) => {
    item.classList.remove("open");
  });
}

export function closeMobileMenu() {
  const navContainer = document.getElementById("nav-container");
  const toggleButton = document.querySelector(".menu-toggle");

  if (navContainer) {
    navContainer.classList.remove("open");
  }

  if (toggleButton) {
    toggleButton.classList.remove("active");
    toggleButton.setAttribute("aria-expanded", "false");
  }
}

export function initDropdowns() {
  const triggers = document.querySelectorAll(".has-dropdown > span");
  const toggleButton = document.querySelector(".menu-toggle");
  const navContainer = document.getElementById("nav-container");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();

      const parent = trigger.parentElement;
      const isOpen = parent.classList.contains("open");

      closeAllDropdowns();

      if (!isOpen) {
        parent.classList.add("open");
      }
    });
  });

  if (toggleButton && navContainer) {
    toggleButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = navContainer.classList.contains("open");

      if (isOpen) {
        closeMobileMenu();
      } else {
        navContainer.classList.add("open");
        toggleButton.classList.add("active");
        toggleButton.setAttribute("aria-expanded", "true");
      }
    });
  }

  document.addEventListener("click", (event) => {
    const clickedInsideDropdown = event.target.closest(".has-dropdown");
    const clickedToggle = event.target.closest(".menu-toggle");
    const clickedInsideNav = event.target.closest("#nav-container");

    if (!clickedInsideDropdown) {
      closeAllDropdowns();
    }

    if (!clickedToggle && !clickedInsideNav && window.innerWidth <= 768) {
      closeMobileMenu();
    }
  });

  document.querySelectorAll(".dropdown li").forEach((item) => {
    item.addEventListener("click", () => {
      closeAllDropdowns();

      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  document.querySelectorAll(".menu > li:not(.has-dropdown)").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
      closeAllDropdowns();
    }
  });
}

window.closeAllDropdowns = closeAllDropdowns;
window.closeMobileMenu = closeMobileMenu;