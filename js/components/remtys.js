import { remtysCategorias } from "../data/remtys-categorias-data.js";

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createCard(categoria) {
  return `
    <article class="remtys-card" data-name="${escapeHtml(categoria.nombre)}">
      <div class="remtys-card-top">
        <span class="remtys-badge">Trámites y servicios</span>
        <span class="remtys-count">${categoria.total} registros</span>
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
    results.textContent = `Mostrando ${count} categorías`;
    return;
  }

  results.textContent = `Se encontraron ${count} resultado(s) para "${searchValue}"`;
}

function updateHelperText(text) {
  const helperText = document.getElementById("remtysHelperText");
  if (!helperText) return;
  helperText.textContent = text;
}

function filterCategorias(searchValue) {
  const query = searchValue.toLowerCase().trim();

  if (!query) return remtysCategorias;

  return remtysCategorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(query)
  );
}

function bindCategoryButtons() {
  const buttons = document.querySelectorAll(".remtys-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const categoryName = button.dataset.categoryName || "la categoría seleccionada";

      updateHelperText(
        `La vista de "${categoryName}" se integrará en el siguiente paso. Después conectaremos esta categoría con su listado de trámites y servicios.`
      );
    });
  });
}

function initRemtysPage() {
  const searchInput = document.getElementById("remtysSearch");
  if (!searchInput) return;

  renderGrid(remtysCategorias);
  updateResultsText(remtysCategorias.length);
  bindCategoryButtons();

  searchInput.addEventListener("input", function () {
    const filtered = filterCategorias(this.value);

    renderGrid(filtered);
    updateResultsText(filtered.length, this.value);
    bindCategoryButtons();

    if (!this.value.trim()) {
      updateHelperText("Selecciona una categoría para consultar sus trámites y servicios.");
    }
  });
}

initRemtysPage();