import { remtysCategorias } from "../data/remtys-categorias-data.js";
import { remtysItems } from "../data/remtys-items-data.js";

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getActiveCategory() {
  const categoriaId = sessionStorage.getItem("remtysCategoriaActiva");
  return remtysCategorias.find((categoria) => categoria.id === categoriaId) || null;
}

function getItemsByCategory(categoriaId) {
  return remtysItems.filter((item) => item.categoria === categoriaId);
}

function getTypeLabel(tipo) {
  return String(tipo || "") === "servicio" ? "Servicio" : "Trámite";
}

function getItemSummary(item) {
  const resumen = item.resumenCategoria || {};

  return {
    modalidad: resumen.modalidad || item.politicasLineamientos?.realizacionPorVia || "No disponible",
    costo: resumen.costo || item.politicasLineamientos?.montoTotal || "No disponible",
    tiempoRespuesta: resumen.tiempoRespuesta || item.politicasLineamientos?.tiempoResolucion || "No disponible",
    dependencia: resumen.dependencia || item.sujetoObligado?.unidadAdministrativa || item.sujetoObligado?.dependenciaResponsable || "No disponible"
  };
}

function createMetaItem(label, value) {
  return `
    <li>
      <span class="remtys-item-meta-label">${escapeHtml(label)}:</span>
      <span class="remtys-item-meta-value">${escapeHtml(value)}</span>
    </li>
  `;
}

function createItemCard(item) {
  const typeLabel = getTypeLabel(item.tipo);
  const typeClass = item.tipo === "servicio" ? "tipo-servicio" : "tipo-tramite";
  const summary = getItemSummary(item);

  return `
    <article class="remtys-item-card">
      <div class="remtys-item-content">
        <div class="remtys-item-top">
          <span class="remtys-item-type ${typeClass}">${typeLabel}</span>
        </div>

        <h2>${escapeHtml(item.nombre)}</h2>
        <p>${escapeHtml(item.descripcion || "Sin descripción disponible.")}</p>

        <ul class="remtys-item-meta">
          ${createMetaItem("Modalidad", summary.modalidad)}
          ${createMetaItem("Costo", summary.costo)}
          ${createMetaItem("Tiempo", summary.tiempoRespuesta)}
          ${createMetaItem("Dependencia", summary.dependencia)}
        </ul>
      </div>

      <div class="remtys-item-actions">
        <button
          type="button"
          class="remtys-item-btn"
          data-item-id="${escapeHtml(item.id)}"
        >
          Ver detalle
        </button>
      </div>
    </article>
  `;
}

function renderEmptyState(message) {
  const list = document.getElementById("remtysCategoriaList");
  if (!list) return;

  list.innerHTML = `
    <div class="remtys-categoria-empty">
      ${escapeHtml(message)}
    </div>
  `;
}

function renderList(items) {
  const list = document.getElementById("remtysCategoriaList");
  if (!list) return;

  if (!items.length) {
    renderEmptyState("No se encontraron trámites o servicios para esta categoría.");
    return;
  }

  list.innerHTML = items.map(createItemCard).join("");
}

function updateResults(count, searchValue = "") {
  const results = document.getElementById("remtysCategoriaResults");
  if (!results) return;

  if (!searchValue.trim()) {
    results.textContent = `Mostrando ${count} registro${count === 1 ? "" : "s"}`;
    return;
  }

  results.textContent = `Se encontraron ${count} resultado(s) para "${searchValue}"`;
}

function updateBreadcrumb(categoria) {
  const breadcrumb = document.getElementById("remtysCategoriaBreadcrumb");
  if (!breadcrumb) return;
  breadcrumb.textContent = categoria?.nombre || "Categoría";
}

function bindItemButtons(items) {
  const buttons = document.querySelectorAll(".remtys-item-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.itemId;
      const item = items.find((entry) => entry.id === itemId);

      if (!item) return;

      sessionStorage.setItem("remtysItemActivo", item.id);
      sessionStorage.setItem("remtysCategoriaActiva", item.categoria);

      navigateTo("components/sections/mejora/sections-catalogo/remtys-detalle.html");
    });
  });
}

function filterItems(items, searchValue) {
  const query = searchValue.trim().toLowerCase();

  if (!query) return items;

  return items.filter((item) => {
    const summary = getItemSummary(item);

    const searchableText = [
      item.nombre,
      item.descripcion,
      item.tipo,
      summary.modalidad,
      summary.costo,
      summary.tiempoRespuesta,
      summary.dependencia
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });
}

function initRemtysCategoriaPage() {
  const categoria = getActiveCategory();
  const title = document.getElementById("remtysCategoriaTitulo");
  const description = document.getElementById("remtysCategoriaDescripcion");
  const searchInput = document.getElementById("remtysCategoriaSearch");

  if (!title || !description || !searchInput) return;

  if (!categoria) {
    title.textContent = "Categoría no disponible";
    description.textContent = "No se encontró una categoría activa. Regresa al listado principal para continuar.";
    updateResults(0);
    updateBreadcrumb(null);
    renderEmptyState("No fue posible cargar la categoría seleccionada.");
    return;
  }

  title.textContent = categoria.nombre;
  description.textContent = categoria.descripcion;
  updateBreadcrumb(categoria);

  const baseItems = getItemsByCategory(categoria.id);

  renderList(baseItems);
  updateResults(baseItems.length);
  bindItemButtons(baseItems);

  searchInput.addEventListener("input", function () {
    const filtered = filterItems(baseItems, this.value);

    renderList(filtered);
    updateResults(filtered.length, this.value);
    bindItemButtons(filtered);
  });
}

initRemtysCategoriaPage();