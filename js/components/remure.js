import { remureConfig } from "../data/remure-config.js";
import { dataManager } from "../data/remure-storage.js";
import {
  normalizeText,
  formatDependenciaLabel,
  formatRegulacionLabel
} from "../utils/remure-format.js"; 

(function () {
  function escapeHtml(text) {
    return String(text ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatValue(value, fallbackText) {
    return value
      ? escapeHtml(value)
      : `<span class="remure-muted">${escapeHtml(fallbackText)}</span>`;
  }

  function buildOrder(configItems, storedItems, storedOrder) {
    const base = Array.isArray(configItems) ? [...configItems] : [];
    const order = Array.isArray(storedOrder) ? storedOrder.filter(Boolean) : [];
    const ordered = [];
    const seen = new Set();

    order.forEach((name) => {
      if (!seen.has(name)) {
        ordered.push(name);
        seen.add(name);
      }
    });

    base.forEach((name) => {
      if (!seen.has(name)) {
        ordered.push(name);
        seen.add(name);
      }
    });

    Object.keys(storedItems || {}).forEach((name) => {
      if (!seen.has(name)) {
        ordered.push(name);
        seen.add(name);
      }
    });

    return ordered;
  }

  function buildRows(items) {
    if (!items.length) {
      return `
        <div class="remure-empty">
          No se encontraron regulaciones para la búsqueda actual.
        </div>
      `;
    }

    return `
      <div class="remure-table-wrap">
        <div class="remure-table-note">
          Desliza horizontalmente si necesitas ver todas las columnas.
        </div>

        <table class="remure-table">
          <thead>
            <tr>
              <th>Nombre de la regulación</th>
              <th>Homoclave</th>
              <th>Fecha de aprobación</th>
              <th>Documento</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item) => `
              <tr>
                <td data-label="Nombre de la regulación">${escapeHtml(formatRegulacionLabel(item.nombre))}</td>
                <td data-label="Homoclave">${formatValue(item.homoclave, "Sin capturar")}</td>
                <td data-label="Fecha de aprobación">${formatValue(item.fecha, "Sin capturar")}</td>
                <td data-label="Documento">
                  ${item.documentoUrl
                    ? `<a class="remure-doc-link" href="${escapeHtml(item.documentoUrl)}" target="_blank" rel="noopener noreferrer">Abrir</a>`
                    : `<span class="remure-doc-pending">Sin enlace</span>`
                  }
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function setSectionOpenState(toggle, shouldOpen) {
    const body = toggle.nextElementSibling;
    const icon = toggle.querySelector(".remure-section-icon");

    toggle.classList.toggle("is-open", shouldOpen);
    toggle.setAttribute("aria-expanded", String(shouldOpen));

    if (body) {
      body.classList.toggle("is-open", shouldOpen);
    }

    if (icon) {
      icon.textContent = shouldOpen ? "−" : "+";
    }
  }

  function bindSectionToggles() {
    document.querySelectorAll("[data-remure-toggle]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const isOpen = toggle.classList.contains("is-open");
        setSectionOpenState(toggle, !isOpen);
      });
    });
  }

  function bindBulkActions() {
    const expandBtn = document.getElementById("remureExpandAll");
    const collapseBtn = document.getElementById("remureCollapseAll");

    if (expandBtn) {
      expandBtn.onclick = () => {
        document.querySelectorAll("[data-remure-toggle]").forEach((toggle) => {
          setSectionOpenState(toggle, true);
        });
      };
    }

    if (collapseBtn) {
      collapseBtn.onclick = () => {
        document.querySelectorAll("[data-remure-toggle]").forEach((toggle) => {
          setSectionOpenState(toggle, false);
        });
      };
    }
  }

  function renderSections(data, expandAll) {
    const content = document.getElementById("remureContent");
    if (!content) return;

    if (!data.length) {
      content.innerHTML = `
        <div class="remure-empty">
          No se encontraron sujetos obligados ni regulaciones para la búsqueda actual.
        </div>
      `;
      return;
    }

    content.innerHTML = data.map((section, index) => {
      const shouldOpen = expandAll || index === 0;

      return `
        <section class="remure-section" id="${escapeHtml(section.id)}">
          <button
            type="button"
            class="remure-section-toggle ${shouldOpen ? "is-open" : ""}"
            data-remure-toggle
            aria-expanded="${shouldOpen ? "true" : "false"}"
          >
            <div class="remure-section-heading">
              <h2>${escapeHtml(section.title)}</h2>
              <p>Listado de regulaciones asociadas al sujeto obligado.</p>
            </div>

            <div class="remure-section-meta">
              <span class="remure-section-count">
                ${section.items.length} regulación${section.items.length === 1 ? "" : "es"}
              </span>
              <span class="remure-section-icon">${shouldOpen ? "−" : "+"}</span>
            </div>
          </button>

          <div class="remure-section-body ${shouldOpen ? "is-open" : ""}">
            ${buildRows(section.items)}
          </div>
        </section>
      `;
    }).join("");

    bindSectionToggles();
    bindBulkActions();
  }

  function updateSummary(filteredData, fullData) {
    const totalDeps = fullData.length;
    const totalRegs = fullData.reduce((sum, section) => sum + section.items.length, 0);

    const depEl = document.getElementById("remureStatDependencias");
    const regEl = document.getElementById("remureStatRegulaciones");
    const resultsEl = document.getElementById("remureResultsCount");

    if (depEl) depEl.textContent = String(totalDeps);
    if (regEl) regEl.textContent = String(totalRegs);

    if (resultsEl) {
      const visibleDeps = filteredData.length;
      const visibleRegs = filteredData.reduce((sum, section) => sum + section.items.length, 0);

      resultsEl.textContent =
        `${visibleDeps} sujeto${visibleDeps === 1 ? "" : "s"} obligado${visibleDeps === 1 ? "" : "s"} · ` +
        `${visibleRegs} regulaci${visibleRegs === 1 ? "ón" : "ones"}`;
    }
  }

  function filterData(data, query) {
    const q = normalizeText(query);
    if (!q) return data;

    return data
      .map((section) => {
        const titleMatch = normalizeText(section.title).includes(q);

        const filteredItems = titleMatch
          ? section.items
          : section.items.filter((item) => normalizeText(item.nombre).includes(q));

        return {
          ...section,
          items: filteredItems
        };
      })
      .filter((section) => section.items.length > 0);
  }

  async function buildDataset() {
    const ids = Object.keys(remureConfig || {});

    const sections = await Promise.all(ids.map(async (id) => {
      const configItems = Array.isArray(remureConfig[id]) ? remureConfig[id] : [];
      const storedData = await dataManager.cargarDatos(id);
      const storedItems = storedData.regulaciones || {};
      const orderedNames = buildOrder(
        configItems,
        storedItems,
        storedData.ordenRegulaciones
      );

      return {
        id,
        title: formatDependenciaLabel(id),
        items: orderedNames.map((name) => ({
          nombre: name,
          homoclave: storedItems[name]?.homoclave || "",
          fecha: storedItems[name]?.fecha || "",
          documentoUrl: storedItems[name]?.documentoUrl || ""
        }))
      };
    }));

    return sections.sort((a, b) => a.title.localeCompare(b.title, "es"));
  }

  async function initRemurePage() {
    const root = document.getElementById("remureContent");
    const searchInput = document.getElementById("remureSearch");
    const clearBtn = document.getElementById("remureClearSearch");

    if (!root) return;

    root.innerHTML = `<div class="remure-empty">Cargando estructura REMURE...</div>`;

    const fullData = await buildDataset();
    let query = "";

    function update() {
      const filtered = filterData(fullData, query);
      renderSections(filtered, !!query.trim());
      updateSummary(filtered, fullData);

      if (clearBtn) {
        clearBtn.disabled = !query.trim();
      }
    }

    if (searchInput) {
      searchInput.value = "";
      searchInput.addEventListener("input", (event) => {
        query = event.target.value || "";
        update();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        query = "";
        if (searchInput) searchInput.value = "";
        update();
      });
    }

    update();
  }

  window.initRemurePage = initRemurePage;

  if (document.getElementById("remureContent")) {
    initRemurePage();
  }
})();