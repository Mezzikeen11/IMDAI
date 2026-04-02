const remureData = {

  consulta: `
    <h2>Consulta Pública</h2>
    <p>Espacio donde se publican proyectos regulatorios.</p>
  `,

  agenda: `
    <h2>Agenda Regulatoria</h2>
    <p>Planeación de regulaciones futuras.</p>
  `,

  air: `
    <h2>Análisis de Impacto Regulatorio</h2>
    <p>Evaluación de impacto.</p>
  `,

  programa: `
    <h2>Programa Anual</h2>
    <p>Listado de acciones del año.</p>
  `
  ,
    catalogo: `
    <h2>Catálogo Municipal de Regulaciones, Trámites y Servicios</h2>
    <p>Listado de acciones del año.</p>
  `

};

window.mostrarSeccion = function (seccion) {
  const contenedor = document.querySelector("#remure-content");
  contenedor.innerHTML = remureData[seccion];
};