import { dependencias } from '../data/estructura-data.js';

const tableBody = document.getElementById('estructura-table-body');
const searchInput = document.getElementById('search');
const resultsText = document.getElementById('estructura-results');

function updateResults(count, total, searchValue = '') {
  if (!resultsText) return;

  if (!searchValue.trim()) {
    resultsText.textContent = `Mostrando ${total} dependencias`;
    return;
  }

  resultsText.textContent = `Se encontraron ${count} resultado(s) para "${searchValue}"`;
}

function renderTable(data, searchValue = '') {
  tableBody.innerHTML = '';

  if (!data.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="estructura-empty">
          No se encontraron dependencias con ese criterio de búsqueda.
        </td>
      </tr>
    `;
    updateResults(0, dependencias.length, searchValue);
    return;
  }

  data.forEach(dep => {
    const row = document.createElement('tr');
    row.classList.add('estructura-row');

    row.innerHTML = `
      <td data-label="Dependencia">${dep.nombre}</td>
      <td data-label="Fecha de actualización">${dep.fechaActualizacion}</td>
      <td data-label="Fecha de validación">${dep.fechaValidacion}</td>
      <td data-label="Descarga">
        <a href="${dep.pdfLink}" class="btn-download">Descargar PDF</a>
      </td>
    `;

    tableBody.appendChild(row);
  });

  updateResults(data.length, dependencias.length, searchValue);
}

searchInput.addEventListener('input', function () {
  const searchValue = this.value.toLowerCase().trim();

  const filteredData = dependencias.filter(dep =>
    dep.nombre.toLowerCase().includes(searchValue) ||
    dep.fechaActualizacion.toLowerCase().includes(searchValue) ||
    dep.fechaValidacion.toLowerCase().includes(searchValue)
  );

  renderTable(filteredData, this.value);
});

renderTable(dependencias);