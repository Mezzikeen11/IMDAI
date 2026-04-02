import { protocolosData } from "../data/protocolos-data.js";

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createProtocolCard(item) {
  return `
    <article class="protocolo-card">
      <div class="protocolo-card-body">
        <h2>${escapeHtml(item.titulo)}</h2>
        <p>${escapeHtml(item.descripcion)}</p>
      </div>

      <div class="protocolo-card-actions">
        <a
          href="${escapeHtml(item.verLink || "#")}"
          class="protocolo-btn protocolo-btn-secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver
        </a>

        <a
          href="${escapeHtml(item.descargarLink || "#")}"
          class="protocolo-btn protocolo-btn-primary"
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          Descargar
        </a>
      </div>
    </article>
  `;
}

function renderProtocolos() {
  const grid = document.getElementById("protocolosGrid");
  if (!grid) return;

  if (!Array.isArray(protocolosData) || !protocolosData.length) {
    grid.innerHTML = `
      <div class="protocolo-empty">
        No hay documentos disponibles por el momento.
      </div>
    `;
    return;
  }

  grid.innerHTML = protocolosData.map(createProtocolCard).join("");
}

renderProtocolos();