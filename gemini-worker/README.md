# Proxy privado para Gemini

Este Worker permite que Games, publicado en GitHub Pages, genere contenido con Gemini sin publicar la clave de Google en el frontend.

## Configuración

1. Publica este proyecto como Worker en Cloudflare (nombre sugerido: games-gemini).
2. En Settings → Variables and Secrets, guarda dos **secretos**: GEMINI_API_KEY (una clave nueva, no la compartida en el chat) y GAME_HOST_TOKEN (una contraseña aleatoria distinta para el anfitrión). Nunca los incluyas en GitHub.
3. Copia la URL del Worker desplegado y pégala en la configuración IA de Games. El anfitrión introduce su código privado en la interfaz al iniciar la sesión.
4. Si quieres cambiar el modelo, crea la variable GEMINI_MODEL, por defecto gemini-3.8-flash.
5. Activa límites y alertas de consumo; el código de anfitrión y el filtro de origen no sustituyen controles de tasa y presupuesto.

Se permite POST solo desde https://barccelo.github.io con el encabezado X-Games-Access. CORS por sí solo NO protege contra clientes no navegador. Sin los dos secretos configurados el proxy no llama a Gemini.

## Endpoint

POST / con JSON como {"mode":"charadas","category":"Lugares","level":"medio","count":5,"exclude":[]}.

Respuesta: {"items":[{"word":"...","category":"...","clue":"..."}],"provider":"gemini"}.

Modos: clave, charadas, alphabetics, cancion, prohibida, antifaz, dobles, papelito, stop, rosco, letras, numeros.

## Clave ya expuesta

Revoca/rota la clave compartida en la conversación antes de configurar el nuevo secreto. Nunca copies esa clave al código del sitio.
