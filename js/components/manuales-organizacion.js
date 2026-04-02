import { manualesOrganizacion } from "../data/manuales-organizacion-data.js";

function formatDate(date) {
  if (!date || date === "0000-00-00") return "--/--/----";
  return date;
}

function updateResults(resultsText, count, total, searchValue = "") {
  if (!resultsText) return;

  if (!searchValue.trim()) {
    resultsText.textContent = `Mostrando ${total} manuales`;
    return;
  }

  resultsText.textContent = `Se encontraron ${count} resultado(s) para "${searchValue}"`;
}

function createRow(item) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td data-label="Legislación">${item.nombre}</td>
    <td data-label="Última reforma">${formatDate(item.ultimaReforma)}</td>
    <td data-label="Fecha actualización">${formatDate(item.fechaActualizacion)}</td>
    <td data-label="Fecha validación">${formatDate(item.fechaValidacion)}</td>
    <td data-label="Descargar">
      <a
        href="${item.pdfLink || "#"}"
        class="btn-download"
        target="_blank"
        rel="noopener noreferrer"
      >
        Descargar PDF
      </a>
    </td>
  `;

  return row;
}

function renderTable(tableBody, resultsText, data, searchValue = "") {
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (!data.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="estructura-empty">
          No se encontraron manuales con ese criterio de búsqueda.
        </td>
      </tr>
    `;

    updateResults(resultsText, 0, manualesOrganizacion.length, searchValue);
    return;
  }

  const fragment = document.createDocumentFragment();

  data.forEach((item) => {
    fragment.appendChild(createRow(item));
  });

  tableBody.appendChild(fragment);
  updateResults(resultsText, data.length, manualesOrganizacion.length, searchValue);
}

function filterManuales(searchValue) {
  const query = searchValue.toLowerCase().trim();

  return manualesOrganizacion.filter((item) =>
    item.nombre.toLowerCase().includes(query)
  );
}

function initManualesOrganizacion() {
  const tableBody = document.getElementById("manuales-organizacion-table-body");
  const searchInput = document.getElementById("search-manuales-organizacion");
  const resultsText = document.getElementById("manuales-organizacion-results");

  if (!tableBody || !searchInput || !resultsText) {
    return;
  }

  renderTable(tableBody, resultsText, manualesOrganizacion);

  searchInput.addEventListener("input", function () {
    const filteredData = filterManuales(this.value);
    renderTable(tableBody, resultsText, filteredData, this.value);
  });
}

initManualesOrganizacion();