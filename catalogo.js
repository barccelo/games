const games=[
{id:"contacto",name:"Contacto",icon:"🔤",type:"assist",desc:"Revela una palabra secreta letra a letra mediante pistas y contactos.",rules:["Un Guardián piensa una palabra y anuncia su primera letra.","Los demás dan pistas de palabras que comiencen con las letras reveladas.","Si alguien reconoce una pista, dice «¡Contacto!»; ambos cuentan hasta tres e intentan decir la misma palabra.","El Guardián puede bloquear el contacto si dice antes la palabra de la pista.","Un contacto válido revela la letra siguiente. Quien adivina la palabra completa pasa a ser Guardián."]},
{id:"cadena",name:"Cadena silábica",icon:"🔗",type:"guide",desc:"Encadena palabras comenzando con la última sílaba de la anterior.",rules:["Un jugador dice una palabra.","El siguiente responde con otra que empiece por la última sílaba de la anterior.","No se permiten repeticiones, nombres propios ni palabras inventadas."]},
{id:"charadas",name:"Charadas Pro Max",icon:"🎭",type:"assist",desc:"Mímica en equipos para descubrir películas, personas y lugares.",rules:["Divídanse en equipos y preparen pistas escritas en papeles.","Usen categorías de películas o series, personas o personajes y lugares.","Cada turno dura 60 segundos; únicamente se permiten movimientos corporales, sin hablar ni emitir sonidos.","Pueden indicar número de palabras, sílabas y usar las señas acordadas."]},
{id:"clave",name:"La clave es",icon:"🗝️",type:"assist",desc:"Adivina la palabra con pistas de una sola palabra y gana puntos.",rules:["Formen parejas: una persona da pistas y la otra adivina.","El anfitrión enseña la palabra a quienes dan las pistas.","Cada pista debe ser una sola palabra, sin gestos ni partes de la palabra secreta.","Si se falla, el turno pasa al equipo rival; la ronda inicia con 6 puntos y pierde uno por pista o turno adicional.","Opcional: «Disparar a la Luna» permite intentar 8 puntos con la primera pista."]},
{id:"conecta",name:"Conecta 8",icon:"🧩",type:"external",desc:"Une ocho palabras en una cadena de asociaciones lógicas.",url:"https://conectaocho.mbckp-at.workers.dev",rules:["Relaciona cada palabra con la siguiente para completar una secuencia de ocho términos.","Las conexiones deben seguir un orden lógico."]},
{id:"ia",name:"Lo dice la IA",icon:"🤖",type:"guide",desc:"Logra que la inteligencia artificial diga tu palabra secreta.",rules:["Se asigna una palabra secreta a un participante.","El participante conversa con una IA e intenta conseguir que ella pronuncie la palabra exacta.","No puede decir directamente la palabra secreta."]},
{id:"stop",name:"Stop rodado",icon:"✍️",type:"guide",desc:"Responde categorías con palabras de una misma letra contra reloj.",rules:["Elijan categorías temáticas y una letra.","Completen las categorías con palabras que empiecen por esa letra antes de que termine el tiempo."],note:"Esta variante está descrita de forma breve en el documento; se conserva separada de STOP/Basta hasta confirmar sus reglas."},
{id:"dark",name:"Dark stories",icon:"🕯️",type:"guide",desc:"Resuelve historias misteriosas con preguntas de sí o no.",rules:["Un narrador conoce la historia y su solución.","Los demás formulan preguntas que puedan contestarse con «sí» o «no».","Reconstruyan juntos lo sucedido."]},
{id:"mentiroso",name:"Mentiroso",icon:"🃏",type:"guide",desc:"Engaña y descubre las afirmaciones falsas de los demás.",rules:["Los jugadores hacen declaraciones estratégicas sobre cartas, cantidades o hechos.","Los rivales intentan detectar el engaño."],note:"El documento no fija una variante concreta ni una puntuación. Reglas por completar."},
{id:"papelito",name:"Papelito",icon:"📜",type:"assist",desc:"El mismo conjunto de palabras, tres rondas y reglas diferentes.",rules:["Mínimo cuatro participantes en dos o más equipos. Cada persona escribe de 3 a 5 papelitos.","Ronda 1: descripción libre, sin pronunciar la palabra ni sus partes.","Ronda 2: una sola palabra como pista; es posible pasar.","Ronda 3: únicamente mímica, sin hablar ni emitir sonidos.","Cada turno dura un minuto o el tiempo acordado. Se reutilizan los mismos papelitos y se suman los aciertos de las tres rondas."]},
{id:"letras",name:"Letras cruzadas",icon:"🔠",type:"assist",desc:"Encuentra rápidamente una palabra que empiece y termine con las letras elegidas.",rules:["Dos jugadores dicen simultáneamente una letra.","Gana el punto el primero que dice una palabra que empiece por la primera y termine por la segunda."]},
{id:"numeros",name:"Números cruzados",icon:"🔢",type:"assist",desc:"Sé el primero en calcular la suma de los números anunciados.",rules:["Dos jugadores dicen simultáneamente un número.","Gana el punto el primero en decir la suma correcta."]},
{id:"alphabetics",name:"Alphabetics",icon:"🔡",type:"assist",desc:"Diez palabras en orden alfabético, dos fases de treinta segundos.",rules:["El concursante da pistas de una sola palabra para diez respuestas ordenadas alfabéticamente.","Hay 60 segundos divididos en dos fases de 30.","Tras 30 segundos se pausa y cambia la persona que adivina.","Solo quien da pistas puede pasar. Una pista inválida obliga a sustituir la palabra por otra de la misma letra."]},
{id:"pasapalabras",name:"Pasapalabras",icon:"⭕",type:"external",desc:"Resuelve el rosco de definiciones antes de agotar el tiempo.",rules:["Responde a las definiciones relacionadas con cada letra del abecedario.","Consigue el mayor número de aciertos posible dentro del límite de tiempo."],url:"https://pasapalabras.mbckp-at.workers.dev"},
{id:"cancion",name:"Adivina la canción",icon:"🎵",type:"assist",desc:"Canta antes que nadie una canción que contenga la palabra propuesta.",rules:["Se anuncia una palabra al azar.","El primer jugador que cante una canción que contenga esa palabra gana un punto."]},
{id:"prohibida",name:"Palabra prohibida",icon:"🚫",type:"assist",desc:"Haz que el jugador vendado diga la palabra que no debe pronunciar.",rules:["Una persona vendada sostiene una tarjeta con una palabra visible para los demás.","El resto formula preguntas fluidas para conseguir que la pronuncie.","El límite de tiempo es de uno a dos minutos."]},
{id:"antifaz",name:"Antifaz",icon:"🙈",type:"assist",desc:"Adivina una palabra o imagen gracias a una pista muy breve.",rules:["Una persona con los ojos vendados debe adivinar una palabra o imagen.","Su compañero puede dar una pista de máximo 10 segundos o hasta 8 palabras."]},
{id:"dobles",name:"Dobles y triples",icon:"✌️",type:"assist",desc:"Nombra parejas o tríos relacionados antes que el otro equipo.",rules:["Formen equipos y escojan una categoría y un límite de tiempo.","Los jugadores muestran uno o dos dedos tras contar hasta tres.","Si la suma es par, se juega Dobles; si es impar, Triples.","Gana el equipo con más asociaciones válidas dentro del tiempo."]},
{id:"buzzer",name:"Buzzer",icon:"⚡",type:"external",desc:"Pulsadores táctiles para disputar el turno en juegos y concursos.",url:"https://barccelo.github.io/buzzerforgames/",rules:["Elige el modo individual, dos jugadores o multijugador.","Pulsa tu zona de la pantalla para registrar quién llegó primero.","Utiliza pantalla completa, sonido y reinicio cuando corresponda."]},
{id:"stuno",name:"Stuno",icon:"🎴",type:"external",desc:"Juego de palabras y cartas, con modalidades por turnos y simultáneas.",rules:["Juego multijugador de 2 a 8 personas.","Permite partidas por turnos o simultáneas, en línea o en vivo, con cartas especiales y votaciones."],url:"https://stuno.mbckp-at.workers.dev"},
{id:"basta",name:"Basta",icon:"🎯",type:"external",desc:"Rueda de letras, categorías, temporizador y marcador.",url:"https://basta-rueda.barcco.chatgpt.site",rules:["Configura jugadores, categorías y tiempo.","Gira la rueda para elegir una letra.","Completa las categorías y registra los resultados."]}
];
const $ = id => document.getElementById(id);
const cards = [...document.querySelectorAll("#games .game")];
const saved = (() => {
  try { return new Set(JSON.parse(localStorage.getItem("games-favs") || "[]")); }
  catch { return new Set(); }
})();
let filter = "all";

function refresh() {
  const query = $("search").value.trim().toLocaleLowerCase("es");
  let count = 0;

  cards.forEach((card,i) => {
    const game = games[i];
    const matches = !query || (game.name + " " + game.desc).toLocaleLowerCase("es").includes(query);
    const category = filter === "all" || filter === game.type;
    const favorite = filter === "favorites" && saved.has(game.id);
    card.hidden = !matches || !(category || favorite);
    if (!card.hidden) count++;

    const button = card.querySelector("[data-fav]");
    button.textContent = saved.has(game.id) ? "★" : "☆";
    button.classList.toggle("saved",saved.has(game.id));
    button.setAttribute("aria-pressed",String(saved.has(game.id)));
    button.setAttribute("aria-label",(saved.has(game.id) ? "Quitar de" : "Añadir a") + " favoritos: " + game.name);
  });

  $("resultCount").textContent = count + " resultados";
  $("totalCount").textContent = games.length;
  $("empty").classList.toggle("hidden",count>0);
}

function openRules(id) {
  const game = games.find(item => item.id === id);
  if (!game) return;

  $("modalTitle").textContent=game.name;
  $("modalDesc").textContent=game.desc;
  $("modalSymbol").textContent=game.icon;
  $("modalNote").textContent=game.note || "";
  const rules=$("rules");
  rules.replaceChildren();
  game.rules.forEach(rule => {
    const li=document.createElement("li");
    li.textContent=rule;
    rules.append(li);
  });

  const actions=$("actions");
  actions.replaceChildren();
  if (game.url) {
    const link=document.createElement("a");
    link.href=game.url;
    link.className="primary";
    link.textContent="Abrir juego ↗";
    link.target="_blank";
    link.rel="noopener noreferrer";
    actions.append(link);
  }
  const close=document.createElement("button");
  close.className="secondary";
  close.textContent="Cerrar";
  close.addEventListener("click",()=>$("dialog").close());
  actions.append(close);
  $("dialog").showModal();
}

cards.forEach((card,i) => {
  const game=games[i];
  if (!game) return;
  const button=document.createElement("button");
  button.className="favorite";
  button.dataset.fav=game.id;
  button.type="button";
  card.querySelector(".game-top").append(button);
});
document.addEventListener("click",event=>{
  const star=event.target.closest("[data-fav]");
  if (star) {
    const id=star.dataset.fav;
    saved.has(id) ? saved.delete(id) : saved.add(id);
    try { localStorage.setItem("games-favs",JSON.stringify([...saved])); } catch {}
    refresh();
    return;
  }
  const rules=event.target.closest("[data-open]");
  if (rules) return openRules(rules.dataset.open);
  const chip=event.target.closest("[data-filter]");
  if (chip) {
    filter=chip.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(button=>{
      button.classList.toggle("active",button===chip);
      button.setAttribute("aria-pressed",String(button===chip));
    });
    refresh();
  }
});
$("search").addEventListener("input",refresh);
$("close").addEventListener("click",()=>$("dialog").close());
$("dialog").addEventListener("click",event=>{if(event.target===$("dialog"))$("dialog").close()});
refresh();
