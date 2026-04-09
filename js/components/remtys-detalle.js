import { remtysItems } from "../data/remtys-items-data.js";
import { remtysCategorias } from "../data/remtys-categorias-data.js";

const SUBJECT_LABELS = {
  dependenciaResponsable: "Dependencia responsable",
  unidadAdministrativa: "Unidad administrativa",
  direccion: "Dirección",
  googleMaps: "Google Maps",
  telefono: "Teléfono",
  extension: "Extensión",
  plataformasDigitales: "Plataformas digitales"
};

const POLICY_LABELS = {
  objetivo: "Objetivo",
  realizacionPorVia: "Realización por vía",
  cargaTributaria: "Carga tributaria",
  montoTotal: "Monto total",
  desgloseCargaTributaria: "Desglose de carga tributaria",
  tiempoResolucion: "Tiempo de resolución",
  resolucionObtenida: "Resolución obtenida",
  horarioAtencion: "Horario de atención",
  tramiteVinculado: "Trámite vinculado"
};

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getActiveItem() {
  const itemId = sessionStorage.getItem("remtysItemActivo");
  return remtysItems.find((item) => item.id === itemId) || null;
}

function getCategoryById(categoriaId) {
  return remtysCategorias.find((categoria) => categoria.id === categoriaId) || null;
}

function formatValue(value) {
  const raw = String(value ?? "Pendiente").trim();

  if (/^https?:\/\//i.test(raw)) {
    return `<a href="${escapeHtml(raw)}" target="_blank" rel="noopener noreferrer">Abrir enlace</a>`;
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    return `<a href="mailto:${escapeHtml(raw)}">${escapeHtml(raw)}</a>`;
  }

  return escapeHtml(raw || "Pendiente");
}

function renderList(targetId, dataObject, labels = {}) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const entries = Object.entries(dataObject || {});

  if (!entries.length) {
    target.innerHTML = `<li>Sin información disponible.</li>`;
    return;
  }

  target.innerHTML = entries
    .map(([key, value]) => {
      const label = labels[key]
        || key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());

      return `<li><span class="remtys-detail-label">${escapeHtml(label)}:</span> ${formatValue(value)}</li>`;
    })
    .join("");
}

function renderRequisitos(requisitos) {
  const target = document.getElementById("remtysRequisitosContent");
  if (!target) return;

  if (!Array.isArray(requisitos) || !requisitos.length) {
    target.innerHTML = `<p class="remtys-empty-detail">Sin requisitos disponibles.</p>`;
    return;
  }

  target.innerHTML = requisitos.map((req, index) => `
    <div class="remtys-requisito-card">
      <h3>Requisito ${index + 1}</h3>
      <ul class="remtys-detail-list">
        <li><span class="remtys-detail-label">Requisito:</span> ${escapeHtml(req.requisito || "Pendiente")}</li>
        <li><span class="remtys-detail-label">Tipo:</span> ${escapeHtml(req.tipo || "Pendiente")}</li>
        <li><span class="remtys-detail-label">Cantidad:</span> ${escapeHtml(req.cantidad || "Pendiente")}</li>
      </ul>
    </div>
  `).join("");
}

function renderEmptyDetail() {
  const titulo = document.getElementById("remtysDetalleTitulo");
  const descripcion = document.getElementById("remtysDetalleDescripcion");
  const subjectList = document.getElementById("remtysSujetoObligadoList");
  const politicasList = document.getElementById("remtysPoliticasList");
  const requisitos = document.getElementById("remtysRequisitosContent");
  const breadcrumbActual = document.getElementById("remtysDetalleBreadcrumbActual");

  if (titulo) titulo.textContent = "Detalle no disponible";
  if (descripcion) descripcion.textContent = "No se encontró un trámite activo. Regresa a la categoría para seleccionar uno.";
  if (breadcrumbActual) breadcrumbActual.textContent = "Detalle";
  if (subjectList) subjectList.innerHTML = `<li>Sin información disponible.</li>`;
  if (politicasList) politicasList.innerHTML = `<li>Sin información disponible.</li>`;
  if (requisitos) requisitos.innerHTML = `<p class="remtys-empty-detail">Sin requisitos disponibles.</p>`;
}

function bindTabs() {
  const tabs = document.querySelectorAll(".remtys-tab");
  const panels = document.querySelectorAll(".remtys-tab-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((btn) => btn.classList.remove("is-active"));
      panels.forEach((panel) => panel.classList.remove("is-active"));

      tab.classList.add("is-active");
      document.getElementById(`tab-${target}`)?.classList.add("is-active");
    });
  });
}

function goToCategory(item) {
  if (item?.categoria) {
    sessionStorage.setItem("remtysCategoriaActiva", item.categoria);
  }

  navigateTo("components/sections/mejora/sections-catalogo/remtys-categoria.html");
}

function bindBackButton(item) {
  const backBtn = document.getElementById("remtysBackToCategoria");
  if (!backBtn) return;

  backBtn.addEventListener("click", () => {
    goToCategory(item);
  });
}

function bindBreadcrumbCategory(item, categoria) {
  const breadcrumbBtn = document.getElementById("remtysDetalleBreadcrumbCategoria");
  const breadcrumbActual = document.getElementById("remtysDetalleBreadcrumbActual");

  if (breadcrumbBtn) {
    breadcrumbBtn.textContent = categoria?.nombre || "Categoría";
    breadcrumbBtn.addEventListener("click", () => {
      goToCategory(item);
    });
  }

  if (breadcrumbActual) {
    breadcrumbActual.textContent = item?.nombre || "Detalle";
  }
}

function initRemtysDetallePage() {
  const item = getActiveItem();
  const categoria = getCategoryById(item?.categoria);

  bindTabs();
  bindBackButton(item);
  bindBreadcrumbCategory(item, categoria);

  if (!item) {
    renderEmptyDetail();
    return;
  }

  const titulo = document.getElementById("remtysDetalleTitulo");
  const descripcion = document.getElementById("remtysDetalleDescripcion");

  if (titulo) titulo.textContent = item.nombre;
  if (descripcion) descripcion.textContent = item.descripcion || "Consulta la información detallada del registro seleccionado.";

  renderList("remtysSujetoObligadoList", item.sujetoObligado, SUBJECT_LABELS);
  renderList("remtysPoliticasList", item.politicasLineamientos, POLICY_LABELS);
  renderRequisitos(item.requisitos);
}

initRemtysDetallePage();