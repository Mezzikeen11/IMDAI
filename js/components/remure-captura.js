import { remureConfig } from "../data/remure-config.js";
import { dataManager } from "../data/remure-storage.js";
import {
  normalizeText,
  formatDependenciaLabel,
  formatRegulacionLabel
} from "../utils/remure-format.js";

(function () {
  const state = {
    dependencia: "",
    query: "",
    selectedRegulacion: "",
    currentData: {},
    currentOrder: []
  };

  function escapeHtml(text) {
    return String(text ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
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

  function getElements() {
    return {
      dependenciaSelect: document.getElementById("remureCapturaDependencia"),
      searchInput: document.getElementById("remureCapturaSearch"),
      list: document.getElementById("remureCapturaList"),
      listCount: document.getElementById("remureCapturaListCount"),
      form: document.getElementById("remureCapturaForm"),
      selectedName: document.getElementById("remureCapturaSelectedName"),
      nombre: document.getElementById("remureCapturaNombre"),
      documentoUrl: document.getElementById("remureCapturaDocumentoUrl"),
      homoclave: document.getElementById("remureCapturaHomoclave"),
      fecha: document.getElementById("remureCapturaFecha"),
      status: document.getElementById("remureCapturaStatus"),
      moveUp: document.getElementById("remureMoveUp"),
      moveDown: document.getElementById("remureMoveDown"),
      reset: document.getElementById("remureCapturaReset")
    };
  }

  function getVisibleOrder() {
    if (!state.query.trim()) return state.currentOrder;

    const q = normalizeText(state.query);

    return state.currentOrder.filter((item) =>
      normalizeText(item).includes(q)
    );
  }

  function getCurrentRegData() {
    const regulaciones = state.currentData.regulaciones || {};
    return regulaciones[state.selectedRegulacion] || {};
  }

  function updateActionState() {
    const { moveUp, moveDown, reset } = getElements();
    const index = state.currentOrder.indexOf(state.selectedRegulacion);
    const hasSelection = index !== -1;

    if (moveUp) {
      moveUp.disabled = !hasSelection || index === 0;
    }

    if (moveDown) {
      moveDown.disabled = !hasSelection || index === state.currentOrder.length - 1;
    }

    if (reset) {
      reset.disabled = !hasSelection;
    }
  }

  function renderList() {
    const { list, listCount } = getElements();
    if (!list) return;

    const visible = getVisibleOrder();

    if (listCount) {
      listCount.textContent = `${visible.length} elemento${visible.length === 1 ? "" : "s"}`;
    }

    if (!visible.length) {
      list.innerHTML = `
        <div class="remure-captura-empty">
          No se encontraron regulaciones con esa búsqueda.
        </div>
      `;
      updateActionState();
      return;
    }

    list.innerHTML = visible
      .map((item) => {
        const active = item === state.selectedRegulacion;
        return `
          <article class="remure-captura-item ${active ? "is-active" : ""}">
            <button
              type="button"
              class="remure-captura-item-button"
              data-regulacion="${escapeHtml(item)}"
            >
              ${escapeHtml(formatRegulacionLabel(item))}
            </button>
          </article>
        `;
      })
      .join("");

    list.querySelectorAll("[data-regulacion]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedRegulacion = button.dataset.regulacion;
        renderList();
        renderForm();
      });
    });

    updateActionState();
  }

  function renderForm() {
    const {
      selectedName,
      nombre,
      documentoUrl,
      homoclave,
      fecha,
      status
    } = getElements();

    if (!state.selectedRegulacion) {
      if (selectedName) selectedName.textContent = "Selecciona una regulación";
      if (nombre) nombre.value = "";
      if (documentoUrl) documentoUrl.value = "";
      if (homoclave) homoclave.value = "";
      if (fecha) fecha.value = "";
      if (status) status.textContent = "";
      updateActionState();
      return;
    }

    const current = getCurrentRegData();

    if (selectedName) {
      selectedName.textContent = formatRegulacionLabel(state.selectedRegulacion);
    }

    if (nombre) nombre.value = formatRegulacionLabel(state.selectedRegulacion);
    if (documentoUrl) documentoUrl.value = current.documentoUrl || "";
    if (homoclave) homoclave.value = current.homoclave || "";
    if (fecha) fecha.value = current.fecha || "";
    if (status) status.textContent = "";

    updateActionState();
  }

  async function loadDependencia(dep) {
    state.dependencia = dep;
    state.currentData = await dataManager.cargarDatos(dep);

    if (!state.currentData || typeof state.currentData !== "object") {
      state.currentData = {};
    }

    if (!state.currentData.regulaciones || typeof state.currentData.regulaciones !== "object") {
      state.currentData.regulaciones = {};
    }

    state.currentOrder = buildOrder(
      remureConfig[dep] || [],
      state.currentData.regulaciones,
      state.currentData.ordenRegulaciones
    );

    if (!state.currentOrder.includes(state.selectedRegulacion)) {
      state.selectedRegulacion = state.currentOrder[0] || "";
    }

    renderList();
    renderForm();
  }

  async function saveCurrent() {
    const { documentoUrl, homoclave, fecha, status } = getElements();

    if (!state.dependencia || !state.selectedRegulacion) return;

    const rawUrl = documentoUrl?.value.trim() || "";

    if (rawUrl && !/^https?:\/\//i.test(rawUrl)) {
      if (status) {
        status.textContent = "La URL del documento debe iniciar con http:// o https://";
      }
      return;
    }

    if (!state.currentData.regulaciones) {
      state.currentData.regulaciones = {};
    }

    state.currentData.regulaciones[state.selectedRegulacion] = {
      documentoUrl: rawUrl,
      homoclave: homoclave?.value.trim() || "",
      fecha: fecha?.value.trim() || ""
    };

    state.currentData.ordenRegulaciones = state.currentOrder;

    const ok = await dataManager.guardarDatos(state.dependencia, state.currentData);

    if (status) {
      status.textContent = ok
        ? `Se guardaron los cambios de "${formatRegulacionLabel(state.selectedRegulacion)}".`
        : "No fue posible guardar los cambios.";
    }
  }

  async function persistOrder(message) {
    const { status } = getElements();

    state.currentData.ordenRegulaciones = state.currentOrder;

    const ok = await dataManager.guardarDatos(state.dependencia, state.currentData);

    if (status) {
      status.textContent = ok ? message : "No fue posible guardar el nuevo orden.";
    }

    renderList();
    renderForm();
  }

  async function moveSelected(direction) {
    const index = state.currentOrder.indexOf(state.selectedRegulacion);
    if (index === -1) return;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= state.currentOrder.length) return;

    const temp = state.currentOrder[index];
    state.currentOrder[index] = state.currentOrder[newIndex];
    state.currentOrder[newIndex] = temp;

    await persistOrder(
      `Se actualizó el orden de "${formatRegulacionLabel(state.selectedRegulacion)}".`
    );
  }

  function renderDependencias() {
    const { dependenciaSelect } = getElements();
    if (!dependenciaSelect) return;

    const sortedKeys = Object.keys(remureConfig || {}).sort((a, b) =>
      formatDependenciaLabel(a).localeCompare(formatDependenciaLabel(b), "es")
    );

    dependenciaSelect.innerHTML = sortedKeys
      .map((key) => `
        <option value="${escapeHtml(key)}">
          ${escapeHtml(formatDependenciaLabel(key))}
        </option>
      `)
      .join("");

    const first = sortedKeys[0] || "";
    dependenciaSelect.value = first;
    state.dependencia = first;
  }

  function bindEvents() {
    const {
      dependenciaSelect,
      searchInput,
      form,
      moveUp,
      moveDown,
      reset,
      documentoUrl,
      homoclave,
      fecha,
      status
    } = getElements();

    dependenciaSelect?.addEventListener("change", async (event) => {
      state.query = "";
      state.selectedRegulacion = "";
      if (searchInput) searchInput.value = "";
      if (status) status.textContent = "";
      await loadDependencia(event.target.value);
    });

    searchInput?.addEventListener("input", () => {
      state.query = searchInput.value || "";
      const visible = getVisibleOrder();

      if (!visible.includes(state.selectedRegulacion)) {
        state.selectedRegulacion = visible[0] || "";
      }

      renderList();
      renderForm();
    });

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      await saveCurrent();
    });

    moveUp?.addEventListener("click", async () => {
      await moveSelected(-1);
    });

    moveDown?.addEventListener("click", async () => {
      await moveSelected(1);
    });

    reset?.addEventListener("click", () => {
      const current = getCurrentRegData();

      if (documentoUrl) documentoUrl.value = current.documentoUrl || "";
      if (homoclave) homoclave.value = current.homoclave || "";
      if (fecha) fecha.value = current.fecha || "";
      if (status) status.textContent = "";
    });
  }

  async function initRemureCapturaPage() {
    const root = document.getElementById("remureCapturaForm");
    if (!root) return;

    renderDependencias();
    bindEvents();

    const { dependenciaSelect } = getElements();
    if (dependenciaSelect?.value) {
      await loadDependencia(dependenciaSelect.value);
    }
  }

  window.initRemureCapturaPage = initRemureCapturaPage;

  if (document.getElementById("remureCapturaForm")) {
    initRemureCapturaPage();
  }
})();