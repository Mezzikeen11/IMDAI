import { fetchHTML } from "./loader.js";
import { initVentanillaPresencialAccordion } from "../components/ventanilla.js";

/* ===================== */
/* HOME                  */
/* ===================== */

const HOME_SECTIONS = [
  "components/sections/home/hero.html",
  "components/sections/home/servicios.html",
  "components/sections/home/noticias.html"
];

const HOME_CSS = [
  "css/sections/home.css"
];

/* ===================== */
/* CONFIGURACIÓN RUTAS   */
/* ===================== */

const ROUTE_CONFIG = [
  /* ---------- NOSOTROS ---------- */
  {
    match: (route) => route.includes("components/sections/nosotros/"),
    css: ["css/sections/nosotros.css"],
    js: []
  },

  /* ---------- MEJORA: PÁGINAS CONTENEDORAS ---------- */
  {
    match: (route) => route.includes("components/sections/mejora/que-es.html"),
    css: ["css/sections/mejora.css"],
    js: []
  },
  {
    match: (route) => route.includes("components/sections/mejora/catalogo.html"),
    css: ["css/sections/mejora.css"],
    js: []
  },
  {
    match: (route) => route.includes("components/sections/mejora/sistema.html"),
    css: ["css/sections/sistema.css"],
    js: []
  },

  /* ---------- MEJORA: SECTIONS-CATALOGO ---------- */
  {
    match: (route) => route.includes("components/sections/desarrollo/estructuras.html"),
    css: ["css/sections/desarrollo/estructuras.css"],
    js: ["js/components/estructura.js"]
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-catalogo/protesta-ciudadana.html"),
    css: ["css/sections/sections-catalogo/protesta-ciudadana.css"],
    js: []
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-catalogo/remtys.html"),
    css: ["css/sections/sections-catalogo/remtys.css"],
    js: ["js/components/remtys.js"]
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-catalogo/remure.html"),
    css: ["css/sections/sections-catalogo/remure.css"],
    js: ["js/components/remure.js"]
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-catalogo/remuvid.html"),
    css: ["css/sections/sections-catalogo/remuvid.css"],
    js: []
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-catalogo/remtys-categoria.html"),
    css: ["css/sections/sections-catalogo/remtys-categoria.css"],
    js: ["js/components/remtys-categoria.js"]
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-catalogo/remtys-detalle.html"),
    css: ["css/sections/sections-catalogo/remtys-detalle.css"],
    js: ["js/components/remtys-detalle.js"]
  },

    /* ---------- DESARROLLO ADMINISTRATIVO E INNOVACIÓN ---------- */
  {
    match: (route) => route.includes("components/sections/desarrollo/lineamientos.html"),
    css: ["css/sections/desarrollo/lineamientos.css"],
    js: []
  },
  {
    match: (route) => route.includes("components/sections/desarrollo/manuales-organizacion.html"),
    css: ["css/sections/desarrollo/manuales-organizacion.css"],
    js: ["js/components/manuales-organizacion.js"]
  },
  {
    match: (route) => route.includes("components/sections/desarrollo/manuales-procedimientos.html"),
    css: ["css/sections/desarrollo/manuales-procedimientos.css"],
    js: ["js/components/manuales-procedimientos.js"]
  },
  {
    match: (route) => route.includes("components/sections/desarrollo/protocolos.html"),
    css: ["css/sections/desarrollo/protocolos.css"],
    js: ["js/components/protocolos.js"]
  },

  /* ---------- MEJORA: SECTIONS-SISTEMA ---------- */
  {
    match: (route) => route.includes("components/sections/mejora/sections-sistema/agenda.html"),
    css: ["css/sections/sections-sistema/agenda.css"],
    js: []
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-sistema/air.html"),
    css: ["css/sections/sections-sistema/air.css"],
    js: []
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-sistema/catalogo.html"),
    css: ["css/sections/sections-sistema/catalogo.css"],
    js: []
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-sistema/consulta-publica.html"),
    css: ["css/sections/sections-sistema/consulta-publica.css"],
    js: []
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-sistema/programa-anual.html"),
    css: ["css/sections/sections-sistema/programa-anual.css"],
    js: []
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-sistema/lineamientos-operativos.html"),
    css: ["css/sections/sections-sistema/lineamientos-operativos.css"],
    js: []
  },
  {
    match: (route) => route.includes("components/sections/mejora/sections-sistema/programas-especificos.html"),
    css: ["css/sections/sections-sistema/programas-especificos.css"],
    js: []
  },

  /* ---------- VENTANILLA ---------- */
  {
    match: (route) => route.includes("components/sections/ventanilla/ventanilla.html"),
    css: ["css/sections/ventanilla.css"],
    js: ["js/components/ventanilla.js"]
  },

  /* ---------- ARMONIZACIÓN ---------- */
  {
    match: (route) => route.includes("components/sections/armonizacion/"),
    css: ["css/sections/armonizacion.css"],
    js: []
  },

  /* ---------- CONTACTO ---------- */
  {
    match: (route) => route.includes("components/sections/contacto/contacto.html"),
    css: ["css/sections/contacto.css"],
    js: []
  }
];

/* ===================== */
/* CONTROL DE ASSETS     */
/* ===================== */

const loadedCss = new Set();

function getAppContainer() {
  return document.getElementById("app");
}

function normalizePath(path) {
  if (!path) return "";
  return path.startsWith("./") ? path.slice(2) : path;
}

function buildFreshPath(path) {
  const cleanPath = normalizePath(path);
  const separator = cleanPath.includes("?") ? "&" : "?";
  return `${cleanPath}${separator}v=${Date.now()}`;
}

function loadCssOnce(cssPath) {
  return new Promise((resolve, reject) => {
    const cleanPath = normalizePath(cssPath);

    if (
      loadedCss.has(cleanPath) ||
      document.querySelector(`link[data-dynamic-css="${cleanPath}"]`)
    ) {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cleanPath;
    link.dataset.dynamicCss = cleanPath;

    link.onload = () => {
      loadedCss.add(cleanPath);
      resolve();
    };

    link.onerror = (error) => {
      console.error(`Error al cargar CSS: ${cleanPath}`, error);
      reject(error);
    };

    document.head.appendChild(link);
  });
}

function removeDynamicScripts() {
  const scripts = document.querySelectorAll("script[data-dynamic-script='true']");
  scripts.forEach((script) => script.remove());
}

function loadJsFresh(jsPath) {
  return new Promise((resolve, reject) => {
    const cleanPath = normalizePath(jsPath);

    const script = document.createElement("script");
    script.src = buildFreshPath(cleanPath);
    script.type = "module";
    script.dataset.dynamicScript = "true";
    script.dataset.source = cleanPath;

    script.onload = () => resolve();
    script.onerror = (error) => {
      console.error(`Error al cargar JS: ${cleanPath}`, error);
      reject(error);
    };

    document.body.appendChild(script);
  });
}

async function loadAssets({ css = [], js = [] } = {}) {
  for (const cssPath of css) {
    await loadCssOnce(cssPath);
  }

  removeDynamicScripts();

  for (const jsPath of js) {
    await loadJsFresh(jsPath);
  }
}

function getRouteAssets(route) {
  const match = ROUTE_CONFIG.find((item) => item.match(route));
  return match || { css: [], js: [] };
}

/* ===================== */
/* CARGA DE SECCIONES    */
/* ===================== */

async function loadHome() {
  const app = getAppContainer();

  if (!app) {
    throw new Error("No existe el contenedor #app");
  }

  await loadAssets({
    css: HOME_CSS,
    js: []
  });

  const fragments = await Promise.all(
    HOME_SECTIONS.map((path) => fetchHTML(path))
  );

  app.innerHTML = fragments.join("\n");
}

async function loadSection(path) {
  const app = getAppContainer();

  if (!app) {
    throw new Error("No existe el contenedor #app");
  }

  const html = await fetchHTML(path);
  app.innerHTML = html;
}

async function loadSectionWithAssets(path) {
  const app = getAppContainer();

  if (!app) {
    throw new Error("No existe el contenedor #app");
  }

  const html = await fetchHTML(path);
  app.innerHTML = html;

  const assets = getRouteAssets(path);
  await loadAssets(assets);
}

/* ===================== */
/* INICIALIZADORES       */
/* ===================== */

function initDynamicSections() {
  if (
    (document.getElementById("remureContent") || document.getElementById("remure-content")) &&
    typeof window.initRemurePage === "function"
  ) {
    window.initRemurePage();
  }

  if (
    document.getElementById("presencialAccordion") &&
    typeof initVentanillaPresencialAccordion === "function"
  ) {
    initVentanillaPresencialAccordion();
  }
}

/* ===================== */
/* NAVEGACIÓN            */
/* ===================== */

export async function navigateTo(route) {
  try {
    if (!route || route === "index") {
      await loadHome();
    } else {
      await loadSectionWithAssets(route);
    }

    initDynamicSections();

    if (typeof window.closeAllDropdowns === "function") {
      window.closeAllDropdowns();
    }

    if (typeof window.closeMobileMenu === "function") {
      window.closeMobileMenu();
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } catch (error) {
    console.error(error);

    const app = getAppContainer();
    if (app) {
      app.innerHTML = `
        <section class="error-message">
          <h2>Error al cargar la sección</h2>
          <p>No fue posible abrir esta página.</p>
        </section>
      `;
    }
  }
}

window.navigateTo = navigateTo;