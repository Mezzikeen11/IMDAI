# IMDAI

Portal web institucional del **Instituto Municipal de Desarrollo Administrativo e Innovación (IMDAI)** desarrollado con **HTML, CSS y JavaScript modular**, bajo un enfoque de **carga dinámica de componentes y secciones** en el cliente.

## Estado actual del proyecto

Este proyecto se encuentra en una fase enfocada en:

- rediseño visual y consolidación del front-end
- organización modular de vistas, estilos y scripts
- integración de módulos documentales y de consulta con soporte para estructuras de datos escalables
- definición de bases técnicas y documentales para futuras integraciones
- preparación estructural para una posterior implementación de backend por parte del equipo institucional autorizado

## Alcance de esta fase

En esta etapa **no se integra backend real ni conexiones a base de datos**, ya que el acceso a infraestructura institucional no forma parte del alcance del equipo actual.

El objetivo es dejar:

- interfaz funcional y visualmente consistente
- navegación estructurada
- componentes reutilizables
- secciones listas para integración futura
- bases técnicas claras para documentación, conexión y mantenimiento posterior
- mecanismos temporales de persistencia local para validación funcional de módulos internos

## Arquitectura general

El proyecto funciona como una **SPA ligera** sin framework.

El flujo general es:

1. `index.html` actúa como punto de entrada.
2. `js/main.js` carga el layout base (`header`, `nav`, `footer`).
3. `js/core/router.js` controla la navegación interna.
4. Cada vista se inserta dinámicamente dentro de `#app`.
5. El router carga el CSS y JS específicos de cada sección cuando corresponde.
6. Algunos módulos consumen datasets locales definidos en `js/data/`.
7. Algunos flujos internos utilizan `localStorage` como mecanismo temporal de persistencia para pruebas funcionales y validación de interfaz.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript ES Modules
- Fetch API
- Local Storage
- WebHint (`.hintrc`) para validación técnica

## Estructura del proyecto

```text
IMDAI/
├── index.html
├── README.md
├── .hintrc
├── assets/
│   ├── icons/
│   └── img/
├── components/
│   ├── layout/
│   │   ├── header.html
│   │   ├── nav.html
│   │   └── footer.html
│   └── sections/
│       ├── armonizacion/
│       │   ├── armonizacion.html
│       │   ├── bienes.html
│       │   ├── cuenta.html
│       │   ├── indicadores.html
│       │   └── manual.html
│       ├── contacto/
│       │   └── contacto.html
│       ├── desarrollo/
│       │   ├── estructuras.html
│       │   ├── lineamientos.html
│       │   ├── manuales-organizacion.html
│       │   ├── manuales-procedimientos.html
│       │   └── protocolos.html
│       ├── home/
│       │   ├── hero.html
│       │   ├── noticias.html
│       │   └── servicios.html
│       ├── mejora/
│       │   ├── catalogo.html
│       │   ├── que-es.html
│       │   ├── sistema.html
│       │   ├── sections-catalogo/
│       │   │   ├── remure.html
│       │   │   ├── remure-captura.html
│       │   │   └── ...
│       │   ├── sections-sistema/
│       │   └── ...
│       ├── nosotros/
│       │   ├── antecedentes.html
│       │   ├── directorio.html
│       │   ├── galeria.html
│       │   ├── mision.html
│       │   └── organigrama.html
│       └── ventanilla/
│           └── ventanilla.html
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── utilities.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── forms.css
│   │   └── tables.css
│   └── sections/
│       ├── armonizacion.css
│       ├── contacto.css
│       ├── desarrollo/
│       ├── home.css
│       ├── mejora.css
│       ├── nosotros.css
│       ├── sections-catalogo/
│       │   ├── remure.css
│       │   ├── remure-captura.css
│       │   └── ...
│       ├── sections-sistema/
│       ├── sistema.css
│       └── ventanilla.css
└── js/
    ├── main.js
    ├── core/
    │   ├── loader.js
    │   └── router.js
    ├── components/
    │   ├── dropdown.js
    │   ├── estructura.js
    │   ├── manuales-organizacion.js
    │   ├── manuales-procedimientos.js
    │   ├── protocolos.js
    │   ├── remtys-categoria.js
    │   ├── remtys-detalle.js
    │   ├── remtys.js
    │   ├── remure.js
    │   ├── remure-captura.js
    │   └── ventanilla.js
    ├── data/
    │   ├── estructura-data.js
    │   ├── manuales-organizacion-data.js
    │   ├── manuales-procedimientos-data.js
    │   ├── protocolos-data.js
    │   ├── remtys-categorias-data.js
    │   ├── remtys-items-data.js
    │   ├── remure-config.js
    │   ├── remure-storage.js
    │   └── remure-data.js
    └── utils/
        └── remure-format.js