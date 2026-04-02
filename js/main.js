import { loadHTML } from "./core/loader.js";
import { navigateTo } from "./core/router.js";
import { initDropdowns } from "./components/dropdown.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadHTML("components/layout/header.html", "#header");
    await loadHTML("components/layout/nav.html", "#nav-container");
    await loadHTML("components/layout/footer.html", "#footer");

    initDropdowns();
    await navigateTo("index");
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);

    const app = document.getElementById("app");
    if (app) {
      app.innerHTML = `
        <section class="error-message">
          <h2>Error al iniciar el portal</h2>
          <p>Revisa las rutas de tus componentes.</p>
        </section>
      `;
    }
  }
});