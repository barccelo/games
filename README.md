# Games

Catálogo web de juegos y dinámicas grupales. Primera versión: una web estática, sin dependencias ni proceso de compilación.

## Contenido

- 18 juegos del documento «Resumen Oficial de Juegos y Dinámicas».
- Buzzer, Stuno y Basta como proyectos adicionales (21 entradas en total).
- Búsqueda, filtros por modalidad, favoritos guardados en el navegador y fichas con reglas.
- Apertura externa de las aplicaciones en sus URLs originales; ninguna se incrusta ni se modifica.

## Enlaces confirmados

- Buzzer: https://barccelo.github.io/buzzerforgames/
- Conecta 8: https://conectaocho.mbckp-at.workers.dev
- Basta: https://basta-rueda.barcco.chatgpt.site

Pasapalabras y Stuno existen como proyectos GitHub, pero sus URLs públicas de juego requieren confirmación. El catálogo muestra sus fichas y acceso a sus repositorios sin inventar destinos.

## Publicación

El sitio principal es `index.html`. Puede hospedarse en GitHub Pages, Cloudflare Pages o cualquier servidor estático. Para GitHub Pages: en Settings → Pages, elegir `Deploy from a branch`, `main` y `/ (root)`. Esta configuración se realiza en GitHub y no se da por activada automáticamente al subir el archivo.

## Siguientes fases

1. Herramientas compartidas para cronómetro, equipos y puntuación.
2. Módulos para Contacto, Charadas Pro Max y La clave es.
3. Papelito, Alphabetics y el resto de juegos asistidos.
4. Confirmación de los enlaces públicos restantes.

## Fuente

Las reglas se resumen del documento suministrado «Resumen Oficial de Juegos y Dinámicas»; los detalles que no aparecen en el documento se dejan pendientes de definición.


## Generación de contenido con Gemini

Se añadieron generadores de palabras, pistas o categorías para **La clave es, Charadas Pro Max, Letras cruzadas, Números cruzados, Alphabetics, Adivina la canción, Palabra prohibida, Antifaz, Dobles y triples, Papelito, STOP** y un asistente para preparar un rosco de Pasapalabras.

- Charadas y La clave es integran el generador dentro de su interfaz de puntuación o cronómetro.
- Para los otros juegos hay una página común: \`juegos/generador.html?juego=alphabetics\` (sustituir el modo).
- Todas las interfaces cuentan con un banco local o generación aleatoria para jugar sin servicios externos.
- La generación real mediante IA **requiere desplegar el proxy privado** \`gemini-worker/\`; no está operativa solo por publicar GitHub Pages.
- Para activar Gemini, configura \`GEMINI_API_KEY\` y \`GAME_HOST_TOKEN\` como secretos del Worker en Cloudflare. Sigue \`gemini-worker/README.md\`. No copies ninguna clave privada en el catálogo, HTML o JavaScript público.
- La URL HTTPS del Worker se almacena en el navegador del anfitrión; el código de acceso se conserva únicamente durante la sesión de la pestaña.

El generador de rosco no modifica la app independiente de Pasapalabras: por ahora proporciona una lista que el anfitrión puede copiar para preparar el juego.
