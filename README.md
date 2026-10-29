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

## Pantallas de apoyo

- **Contacto:** el Guardián escribe una palabra y puede mostrarla mientras la introduce. Durante la partida se controlan las letras reveladas, el tiempo y los contactos bloqueados.
- **Charadas Pro Max:** tres categorías, 401 entradas categorizadas, entrada de palabras propias, mímica durante un máximo de 60 segundos y marcador de dos equipos.
- **Papelito:** los participantes preparan los papelitos antes de jugar; el mismo conjunto se utiliza en las tres rondas (descripción libre, una palabra y mímica), con turnos de un minuto y puntuación acumulada.
- **Alphabetics:** 644 palabras incluidas, selección con historial para reducir repeticiones y diez casillas horizontales, inicio aleatorio o desde A, dos fases de 30 segundos, pasar, sustituir y editar las diez palabras.
- **Palabra prohibida:** modo de pantalla completa que deja la palabra y el tiempo visibles; tocar durante la presentación inicia o pausa el reloj.
- **Adivina la canción:** palabras comunes incluidas, marcador y selección manual.
- **Letras y Números cruzados:** pares aleatorios o introducidos manualmente.
- **Preparar rosco:** editor por letra de las palabras y definiciones.

El contenido manual se prepara dentro de cada juego. Los generadores remotos son opcionales y tienen alternativas locales.

## Pendiente

- Charadas: marcador configurable con más equipos o participantes individuales, tomando como referencia un contador por persona/equipo con botones grandes para sumar y restar.
- Revisión visual y pruebas de interacción en móviles reales.

Las tarjetas del catálogo se abren al tocarlas. Las pantallas de juego ofrecen un acceso de configuración para el contenido y las opciones aplicables; Contacto dispone de un modo de presentación horizontal a pantalla completa.
