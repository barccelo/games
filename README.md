# Games

Catálogo de juegos y dinámicas. Sitio estático publicado en GitHub Pages: https://barccelo.github.io/games/

## Juegos

Las aplicaciones ya publicadas se abren en sus respectivas direcciones. Las herramientas de apoyo se encuentran en `juegos/`.

- Contacto: revelación de letras.
- Charadas Pro Max: cronómetro, equipos y palabras.
- La clave es: puntuación y palabra secreta.
- Letras cruzadas y Números cruzados: pares aleatorios en pantalla.
- Alphabetics: diez palabras, dos fases de 30 segundos y sustituciones.\n- Papelito: tres rondas con el mismo conjunto de palabras.\n- Adivina la canción, Palabra prohibida, Antifaz, Dobles y triples y Stop rodado: pantallas y controles adaptados a cada dinámica.

El preparador de roscos tiene una pantalla de consulta por letra, independiente del juego Pasapalabras.\n\nEl catálogo reúne los 18 juegos del documento oficial y Buzzer, Stuno y Basta.

## Desarrollo

No hay dependencias ni compilación. Los archivos HTML, CSS y JavaScript se publican desde `main`, carpeta raíz. GitHub Pages debe servir `index.html`.

## Generación de contenido

Las pantallas consumen `games-gemini` en Cloudflare. Si no hay conexión, usan listas incluidas. La clave de Google solo existe como secreto de Cloudflare; no se incorpora al sitio ni al repositorio.

El Worker está en `gemini-worker/`. Consulta su README para despliegue, límites de uso y configuración.
