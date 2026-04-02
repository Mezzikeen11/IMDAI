import { remureData } from "../data/remure-data.js";

(function () {
  function escapeHtml(text) {
    return String(text ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeText(text) {
    return String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function formatValue(value, fallbackText) {
    if (!value || value === "0000-00-00" || value === "0000-00-00 00:00:00") {
      return fallbackText;
    }
    return value;
  }

  function getTotalItems(data) {
    return data.reduce((total, section) => total + (section.items?.length || 0), 0);
  }

  function sortItemsAlphabetically(items) {
    return [...(items || [])].sort((a, b) =>
      normalizeText(a.nombre).localeCompare(normalizeText(b.nombre), "es")
    );
  }

  function sortFilteredData(data) {
    return data.map(section => ({
      ...section,
      items: sortItemsAlphabetically(section.items || [])
    }));
  }

  function buildRows(items) {
    if (!items.length) {
      return `
        <div class="remure-empty">
          No hay documentos cargados en esta categoría por el momento.
        </div>
      `;
    }

    return `
      <div class="remure-table-wrap">
        <div class="remure-table-note">Desliza horizontalmente si necesitas ver todas las columnas.</div>

        <table class="remure-table">
          <thead>
            <tr>
              <th>Legislación</th>
              <th>Última Reforma</th>
              <th>Fecha Actualización</th>
              <th>Fecha Validación</th>
              <th>Descargar</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td data-label="Legislación">${escapeHtml(item.nombre)}</td>
                <td data-label="Última Reforma">${escapeHtml(formatValue(item.ultimaReforma, "Sin reforma registrada"))}</td>
                <td data-label="Fecha Actualización">${escapeHtml(formatValue(item.actualizacion, "Sin fecha registrada"))}</td>
                <td data-label="Fecha Validación">${escapeHtml(formatValue(item.validacion, "Sin validación registrada"))}</td>
                <td data-label="Descargar">
                  ${item.archivo
                    ? `<a class="remure-doc-link" href="${escapeHtml(item.archivo)}" target="_blank" rel="noopener noreferrer">Abrir</a>`
                    : `<span class="remure-doc-pending">Pendiente</span>`
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
    const toggles = document.querySelectorAll("[data-section-toggle]");

    toggles.forEach((toggle) => {
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
        document.querySelectorAll("[data-section-toggle]").forEach(toggle => {
          setSectionOpenState(toggle, true);
        });
      };
    }

    if (collapseBtn) {
      collapseBtn.onclick = () => {
        document.querySelectorAll("[data-section-toggle]").forEach(toggle => {
          setSectionOpenState(toggle, false);
        });
      };
    }
  }

  function renderSections(data, options = {}) {
    const content = document.getElementById("remureContent");
    if (!content) return;

    if (!data.length) {
      content.innerHTML = `
        <div class="remure-empty">
          No se encontraron resultados para la búsqueda actual.
        </div>
      `;
      return;
    }

    const {
      expandAll = false,
      activeId = "all"
    } = options;

    content.innerHTML = data.map((section, index) => {
      const shouldOpen = expandAll || activeId === section.id || (activeId === "all" && index === 0);

      return `
        <section class="remure-section" id="${escapeHtml(section.id)}">
          <button
            type="button"
            class="remure-section-toggle ${shouldOpen ? "is-open" : ""}"
            data-section-toggle
            aria-expanded="${shouldOpen ? "true" : "false"}"
          >
            <div class="remure-section-heading">
              <h2>${escapeHtml(section.title)}</h2>
              <p>${escapeHtml(section.description || "")}</p>
            </div>

            <div class="remure-section-meta">
              <span class="remure-section-count">${section.items?.length || 0} documentos</span>
              <span class="remure-section-icon">${shouldOpen ? "−" : "+"}</span>
            </div>
          </button>

          <div class="remure-section-body ${shouldOpen ? "is-open" : ""}">
            ${buildRows(section.items || [])}
          </div>
        </section>
      `;
    }).join("");

    bindSectionToggles();
    bindBulkActions();
  }

  function scrollActiveChipIntoView() {
    const activeChip = document.querySelector(".remure-chip.is-active");
    if (!activeChip) return;

    activeChip.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  }

  function renderChips(data, activeId, onClick) {
    const chips = document.getElementById("remureChips");
    if (!chips) return;

    chips.innerHTML = `
      <button type="button" class="remure-chip ${activeId === "all" ? "is-active" : ""}" data-id="all">
        Todas
      </button>
      ${data.map(section => `
        <button
          type="button"
          class="remure-chip ${activeId === section.id ? "is-active" : ""}"
          data-id="${escapeHtml(section.id)}"
        >
          ${escapeHtml(section.title)}
        </button>
      `).join("")}
    `;

    chips.querySelectorAll(".remure-chip").forEach(button => {
      button.addEventListener("click", () => onClick(button.dataset.id));
    });

    requestAnimationFrame(scrollActiveChipIntoView);
  }

  function filterData(data, searchTerm, activeId) {
    const q = normalizeText(searchTerm);

    let filtered = data;

    if (activeId !== "all") {
      filtered = filtered.filter(section => section.id === activeId);
    }

    if (!q) return filtered;

    return filtered
      .map(section => ({
        ...section,
        items: (section.items || []).filter(item =>
          normalizeText(item.nombre || "").includes(q)
        )
      }))
      .filter(section => section.items.length > 0);
  }

  function updateResultsCount(data) {
    const counter = document.getElementById("remureResultsCount");
    if (!counter) return;

    const total = getTotalItems(data);
    counter.textContent = `${total} resultado${total === 1 ? "" : "s"}`;
  }

  function initRemurePage() {
    const baseData = Array.isArray(remureData) ? remureData : [];
    const searchInput = document.getElementById("remureSearch");
    const chips = document.getElementById("remureChips");
    const content = document.getElementById("remureContent");
    const clearBtn = document.getElementById("remureClearSearch");

    if (!chips || !content) return;

    let activeId = "all";
    let searchTerm = "";

    function update() {
      const filtered = filterData(baseData, searchTerm, activeId);
      const sorted = sortFilteredData(filtered);
      const hasSearch = !!searchTerm.trim();

      renderChips(baseData, activeId, (nextId) => {
        activeId = nextId;
        update();
      });

      renderSections(sorted, {
        expandAll: hasSearch,
        activeId
      });

      updateResultsCount(sorted);

      if (clearBtn) {
        clearBtn.disabled = !searchTerm.trim() && activeId === "all";
      }
    }

    if (searchInput) {
      searchInput.value = "";
      searchInput.addEventListener("input", (event) => {
        searchTerm = event.target.value || "";
        update();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        searchTerm = "";
        activeId = "all";

        if (searchInput) {
          searchInput.value = "";
        }

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