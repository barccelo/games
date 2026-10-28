# Games Gemini

Servicio para generar palabras y categorías desde Games.

## Desplegar

```sh
cd gemini-worker
npx wrangler deploy
```

Configura `GEMINI_API_KEY` como secreto del Worker. No incluyas claves en código ni en archivos versionados.

La ruta `POST /` acepta `mode`, `count`, `level`, `category` y `exclude`, y responde con `items` que contienen `word`, `category` y `clue`.

Solo se admiten solicitudes del origen `https://barccelo.github.io`. El Worker aplica una limitación aproximada de 12 solicitudes por minuto por dirección IP, mediante `LIMITER`. CORS no constituye autenticación: monitorea consumo y establece alertas de presupuesto en Google AI Studio y Cloudflare.

`GET /` devuelve el estado del servicio, sin secretos.
