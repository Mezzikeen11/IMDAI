import { dependencias } from "../data/estructura-data.js";

function updateResults(resultsText, count, total, searchValue = "") {
  if (!resultsText) return;

  if (!searchValue.trim()) {
    resultsText.textContent = `Mostrando ${total} dependencias`;
    return;
  }

  resultsText.textContent = `Se encontraron ${count} resultado(s) para "${searchValue}"`;
}

function createRow(dep) {
  const row = document.createElement("tr");
  row.classList.add("estructura-row");

  row.innerHTML = `
    <td data-label="Dependencia">${dep.nombre}</td>
    <td data-label="Fecha de actualización">${dep.fechaActualizacion}</td>
    <td data-label="Fecha de validación">${dep.fechaValidacion}</td>
    <td data-label="Descarga">
      <a
        href="${dep.pdfLink}"
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
        <td colspan="4" class="estructura-empty">
          No se encontraron dependencias con ese criterio de búsqueda.
        </td>
      </tr>
    `;

    updateResults(resultsText, 0, dependencias.length, searchValue);
    return;
  }

  const fragment = document.createDocumentFragment();

  data.forEach((dep) => {
    fragment.appendChild(createRow(dep));
  });

  tableBody.appendChild(fragment);
  updateResults(resultsText, data.length, dependencias.length, searchValue);
}

function filterDependencias(searchValue) {
  const query = searchValue.toLowerCase().trim();

  return dependencias.filter((dep) =>
    dep.nombre.toLowerCase().includes(query) ||
    dep.fechaActualizacion.toLowerCase().includes(query) ||
    dep.fechaValidacion.toLowerCase().includes(query)
  );
}

function initEstructura() {
  const tableBody = document.getElementById("estructura-table-body");
  const searchInput = document.getElementById("search");
  const resultsText = document.getElementById("estructura-results");

  if (!tableBody || !searchInput || !resultsText) {
    return;
  }

  renderTable(tableBody, resultsText, dependencias);

  searchInput.addEventListener("input", function () {
    const filteredData = filterDependencias(this.value);
    renderTable(tableBody, resultsText, filteredData, this.value);
  });
}

initEstructura();