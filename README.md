# Games

Catálogo de juegos y dinámicas. Sitio estático publicado en GitHub Pages: https://barccelo.github.io/games/

## Juegos

Las aplicaciones ya publicadas se abren en sus respectivas direcciones. Las herramientas de apoyo se encuentran en `juegos/`.

- Contacto: revelación de letras.
- Charadas Pro Max: cronómetro, equipos y palabras.
- La clave es: puntuación y palabra secreta.
- Letras cruzadas y Números cruzados: pares aleatorios en pantalla.
- Otros juegos: generador de palabras o categorías y reglas.

El catálogo reúne los 18 juegos del documento oficial y Buzzer, Stuno y Basta.

## Desarrollo

No hay dependencias ni compilación. Los archivos HTML, CSS y JavaScript se publican desde `main`, carpeta raíz. GitHub Pages debe servir `index.html`.

## Generación de contenido

Las pantallas consumen `games-gemini` en Cloudflare. Si no hay conexión, usan listas incluidas. La clave de Google solo existe como secreto de Cloudflare; no se incorpora al sitio ni al repositorio.

El Worker está en `gemini-worker/`. Consulta su README para despliegue, límites de uso y configuración.
