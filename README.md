# Valencias y Atomicidades

Sitio web de estudio interactivo de la **Tabla de Valencias** para Física y Química. Reúne la consulta de los datos (valencias, clase, serie, atomicidad y nomenclatura de cada elemento), el repaso con fichas, cuestionarios de selección, exámenes automáticos y un juego de asociación contrarreloj, todo en una página estática sin instalación ni registro.

🌐 **Sitio en línea:** <https://ferreirasanabriasamuel-code.github.io> (publicado con GitHub Pages)

## Contenido didáctico

Los datos proceden de la Tabla de Valencias de la asignatura y se concentran en [`js/datos.js`](js/datos.js):

- **48 fichas de estudio**: 45 elementos + 3 radicales.
- **29 metales** (incluidos los anfóteros Cr y Mn) y **16 no metales**.
- **10 atomicidades moleculares** (H₂, N₂, O₂, F₂, Cl₂, S₈, P₄, As₄, Sb₂ y otros casos del listado).
- Para cada elemento: clase (metal, no metal, anfótero o radical), valencias, grupo/serie, atomicidad y nomenclatura tradicional con ejemplos.
- Los **casos especiales Sb, B, P y As** tienen un apartado propio en la página Explorar.

## Secciones del sitio

| Sección | Qué ofrece |
| --- | --- |
| **Inicio** | Portada con la descripción del proyecto y accesos directos a cada actividad. |
| **Explorar** | Tabla de valencias completa organizada por clases, con buscador por nombre, símbolo o valencia, filtros por clase y ficha detallada de cada elemento. |
| **Tabla** | Tabla periódica tradicional (siete periodos, grupos en notación A/B); cada celda muestra número atómico, nombre y valencias. Solo se sitúan los elementos de la Tabla de Valencias. |
| **Fichas** | Mazo de fichas: el elemento al frente y, al girarla, valencias y datos en el reverso. Permite marcar favoritas y mezclar. |
| **Quiz** | Preguntas de selección entre opciones: valencia, clase o atomicidad, con racha y récord personal guardado. |
| **Examen** | Examen de práctica automático: se eligen tipos y cantidad de preguntas y se obtiene la nota con el detalle para repasar. |
| **Combinar** | Juego contrarreloj: asociar cada elemento con su valencia en el menor tiempo posible. |

## Tecnología

- **HTML, CSS y JavaScript puros**, sin framework de build: el sitio se sirve tal cual, sin paso de compilación.
- **React** empaquetado localmente (`react/react.production.min.js`) para las páginas interactivas (Fichas, Quiz, Examen y Combinar); no se descarga nada de CDNs.
- **Fuentes locales** (Inter y Space Grotesk) en `fonts/`, para que el sitio funcione incluso sin conexión.
- **Fondo animado WebGL** ("ColorBends", portado del componente de react-bits a WebGL puro) que se muestra **solo en computadoras**: en móviles y tabletas no se crea el lienzo, porque pintar cada fotograma saturaba la GPU y trababa el deslizamiento.
- **Tema claro/oscuro** con detección de la preferencia del sistema, botón de cambio y persistencia en `localStorage`.
- Diseño responsive con menú de pestañas desplazable y modales tipo *bottom sheet* en pantallas pequeñas.

## Estructura del proyecto

```
valencias-app/
├── index.html            # Inicio
├── explorar.html         # Explorar (tabla de valencias + buscador)
├── tabla.html            # Tabla periódica
├── fichas.html           # Fichas de repaso
├── quiz.html             # Quiz de selección
├── examen.html           # Examen de práctica
├── combinar.html         # Juego de asociación
├── css/
│   ├── base.css          # Tokens, temas y estilos compartidos
│   ├── actividades.css   # Páginas de actividades (explorar, fichas, quiz…)
│   └── tabla.css         # Tabla periódica
├── js/
│   ├── datos.js          # Tabla de Valencias (fuente de todos los datos)
│   ├── fondo.js          # Fondo animado WebGL (solo escritorio)
│   ├── ui.js             # Tema, ventana del autor y marca de pestaña
│   ├── explorar.js       # Lógica de Explorar
│   ├── tabla.js          # Lógica de la tabla periódica
│   ├── fichas.js         # Mazo de fichas (React)
│   ├── quiz.js           # Quiz (React)
│   ├── examen.js         # Examen (React)
│   └── combinar.js       # Juego contrarreloj (React)
├── react/                # React y React DOM (producción, locales)
└── fonts/                # Inter y Space Grotesk (woff2) + fonts.css
```

## Cómo verlo en local

Es un sitio estático: basta con abrir `index.html` en el navegador, o servirlo con cualquier servidor local:

```bash
python3 -m http.server 8000
# y abrir http://localhost:8000
```

## Publicación en GitHub Pages

1. Sube el contenido de la carpeta a tu repositorio (`git add`, `git commit`, `git push`).
2. En **Settings → Pages**, elige la rama `main` y la carpeta `/ (root)` como fuente.
3. Cada *push* a `main` publica la versión nueva automáticamente.

## Autoría

**Samuel Ferreira Sanabria** · Licenciatura en Educación de la Física y la Química, tercer curso, turno tarde.

Material de estudio basado en la Tabla de Valencias.
