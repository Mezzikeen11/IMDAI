# IMDAI

Proyecto web estático (HTML/CSS/JavaScript) organizado por componentes HTML reutilizables y módulos JavaScript.

## Estructura del proyecto

- `index.html`  
  Página principal / punto de entrada.

- `components/`  
  Componentes HTML reutilizables:
  - `components/layout/`  
    Layout general del sitio:
    - `header.html`
    - `nav.html`
    - `footer.html`
  - `components/sections/`  
    Secciones del sitio organizadas por carpeta:
    - `armonizacion/`
    - `contacto/`
    - `home/`
    - `mejora/`
    - `nosotros/`
    - `ventanilla/`

- `js/`  
  Lógica del sitio:
  - `js/main.js`  
    Script principal (arranque / inicialización).
  - `js/core/`  
    Núcleo de funcionalidades:
    - `router.js` (enrutamiento/navegación entre vistas o secciones)
    - `loader.js` (carga dinámica de componentes/secciones)
  - `js/components/`  
    Módulos JS por componente/feature:
    - `dropdown.js`
    - `estructura.js`
    - `manuales-organizacion.js`
    - `manuales-procedimientos.js`
    - `menu.js`
    - `protocolos.js`
    - `remtys.js`
    - `remure.js`
    - `transparencia.js`
    - `ventanilla.js`

- `css/`  
  Estilos del sitio.

- `assets/`  
  Recursos estáticos:
  - `assets/icons/`
  - `assets/img/`

- `.hintrc`  
  Configuración de linting/validación (WebHint).

## Requisitos

Solo necesitas un navegador moderno.  
Para desarrollo local es recomendable usar un servidor estático (para evitar problemas con rutas/carga dinámica en algunos navegadores).

## Cómo ejecutar en local

### Opción A: con un servidor estático (recomendado)
1. Abre una terminal en la carpeta del proyecto.
2. Levanta un servidor estático (elige una opción):
   - Python:
     - `python -m http.server 8080`
   - Node (si tienes instalado):
     - `npx serve .`
3. Abre en el navegador:
   - `http://localhost:8080`

### Opción B: abriendo el archivo directamente
- Puedes abrir `index.html` haciendo doble click, pero algunas cargas dinámicas podrían no funcionar igual que con servidor.

## Cómo funciona (visión general)

- El sitio se organiza en **layout** (header/nav/footer) y **secciones** (home, nosotros, etc.) que están en `components/`.
- El núcleo en `js/core/` contiene:
  - Un **loader** para cargar fragmentos HTML.
  - Un **router** para gestionar la navegación/estado y mostrar secciones.
- `js/main.js` inicializa el sitio y engancha los componentes necesarios.

## Convenciones del proyecto

- Agregar una nueva sección:
  1. Crear carpeta en `components/sections/<nueva-seccion>/`
  2. Crear/actualizar el HTML correspondiente.
  3. Registrar la ruta o comportamiento en `js/core/router.js` (si aplica).
  4. Si hay lógica específica, crear módulo en `js/components/`.

## Despliegue

El repositorio indica que **GitHub Pages está habilitado** (a nivel de repo). Puedes publicar el sitio configurando Pages para servir desde la rama `main` (root) o `/docs` (si lo usas en el futuro).

## Créditos / Autores

- Autor(es): _Mezzikeen11_

## Licencia

