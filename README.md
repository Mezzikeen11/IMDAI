# IMDAI

Portal web institucional del **Instituto Municipal de Desarrollo Administrativo e Innovación (IMDAI)** desarrollado con **HTML, CSS y JavaScript modular**, bajo un enfoque de **carga dinámica de componentes y secciones** en el cliente.

## Estado actual del proyecto

Este proyecto se encuentra en una fase enfocada en:

- rediseño visual y consolidación del front-end
- organización modular de vistas, estilos y scripts
- definición de bases técnicas y documentales para futuras integraciones
- preparación estructural para una posterior implementación de backend por parte del equipo institucional autorizado

### Alcance de esta fase

En esta etapa **no se integra backend real ni conexiones a base de datos**, ya que el acceso a infraestructura institucional no forma parte del alcance del equipo actual.

El objetivo es dejar:

- interfaz funcional y visualmente consistente
- navegación estructurada
- componentes reutilizables
- secciones listas para integración futura
- bases técnicas claras para documentación, conexión y mantenimiento posterior

## Arquitectura general

El proyecto funciona como una **SPA ligera (Single Page Application ligera)** sin framework.

El flujo general es:

1. `index.html` actúa como punto de entrada.
2. `js/main.js` carga el layout base (`header`, `nav`, `footer`).
3. `js/core/router.js` controla la navegación interna.
4. Cada vista se inserta dinámicamente dentro de `#app`.
5. El router carga el CSS y JS específicos de cada sección cuando corresponde.
6. Algunos módulos consumen datasets locales definidos en `js/data/`.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript ES Modules
- Fetch API
- Session Storage
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
│       ├── contacto/
│       ├── home/
│       ├── mejora/
│       │   ├── sections-catalogo/
│       │   ├── sections-documentacion/
│       │   └── sections-sistema/
│       ├── nosotros/
│       └── ventanilla/
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── utilities.css
│   ├── components/
│   └── sections/
└── js/
    ├── main.js
    ├── core/
    │   ├── loader.js
    │   └── router.js
    ├── components/
    └── data/