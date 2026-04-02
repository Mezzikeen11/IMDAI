export async function fetchHTML(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`No se pudo cargar el archivo: ${path}`);
  }

  return await response.text();
}

export async function loadHTML(path, targetSelector) {
  const html = await fetchHTML(path);
  const target = document.querySelector(targetSelector);

  if (!target) {
    throw new Error(`No se encontró el contenedor: ${targetSelector}`);
  }

  target.innerHTML = html;
}