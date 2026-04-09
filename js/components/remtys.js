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

function getCategoriasWithTotals() {
  return remtysCategorias.map((categoria) => ({
    ...categoria,
    total: remtysItems.filter((item) => item.categoria === categoria.id).length
  }));
}

function createCard(categoria) {
  return `
    <article class="remtys-card" data-name="${escapeHtml(categoria.nombre)}">
      <div class="remtys-card-top">
        <span class="remtys-badge">Trámites y servicios</span>
        <span class="remtys-count">${categoria.total} registro${categoria.total === 1 ? "" : "s"}</span>
      </div>

      <h2>${escapeHtml(categoria.nombre)}</h2>
      <p>${escapeHtml(categoria.descripcion)}</p>

      <button
        type="button"
        class="remtys-btn"
        data-category-id="${escapeHtml(categoria.id)}"
        data-category-name="${escapeHtml(categoria.nombre)}"
      >
        Consultar categoría
      </button>
    </article>
  `;
}

function renderGrid(categorias) {
  const grid = document.getElementById("remtysGrid");
  if (!grid) return;

  if (!categorias.length) {
    grid.innerHTML = `
      <div class="remtys-empty">
        No se encontraron categorías con ese criterio de búsqueda.
      </div>
    `;
    return;
  }

  grid.innerHTML = categorias.map(createCard).join("");
}

function updateResultsText(count, searchValue = "") {
  const results = document.getElementById("remtysResults");
  if (!results) return;

  if (!searchValue.trim()) {
    results.textContent = `Mostrando ${count} categoría${count === 1 ? "" : "s"}`;
    return;
  }

  results.textContent = `Se encontraron ${count} resultado(s) para "${searchValue}"`;
}

function updateHelperText(text) {
  const helperText = document.getElementById("remtysHelperText");
  if (!helperText) return;
  helperText.textContent = text;
}

function filterCategorias(categorias, searchValue) {
  const query = searchValue.toLowerCase().trim();

  if (!query) return categorias;

  return categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(query)
  );
}

function bindCategoryButtons(categorias) {
  const buttons = document.querySelectorAll(".remtys-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = button.dataset.categoryId;
      const categoria = categorias.find((item) => item.id === categoryId);
      const categoryName = button.dataset.categoryName || "la categoría seleccionada";

      if (!categoryId || !categoria) return;

      sessionStorage.setItem("remtysCategoriaActiva", categoryId);
      sessionStorage.removeItem("remtysItemActivo");

      updateHelperText(`Abriendo la categoría "${categoryName}".`);
      navigateTo("components/sections/mejora/sections-catalogo/remtys-categoria.html");
    });
  });
}

function initRemtysPage() {
  const searchInput = document.getElementById("remtysSearch");
  if (!searchInput) return;

  const categorias = getCategoriasWithTotals();

  renderGrid(categorias);
  updateResultsText(categorias.length);
  bindCategoryButtons(categorias);

  searchInput.addEventListener("input", function () {
    const filtered = filterCategorias(categorias, this.value);

    renderGrid(filtered);
    updateResultsText(filtered.length, this.value);
    bindCategoryButtons(categorias);

    if (!this.value.trim()) {
      updateHelperText("Selecciona una categoría para consultar sus trámites y servicios.");
    }
  });
}

initRemtysPage();