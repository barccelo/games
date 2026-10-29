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
{id:"basta",name:"Basta",icon:"🎯",type:"external",desc:"Rueda de letras, categorías, temporizador y marcador.",url:"https://barccelo.github.io/basta/",rules:["Configura jugadores, categorías y tiempo.","Gira la rueda para elegir una letra.","Completa las categorías y registra los resultados."]}
];
const $ = id => document.getElementById(id);
const iconPaths = {"contacto":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\"/><path d=\"m6 16 3-8 3 8M7 13h4M16 16V8m0 4h4\"/>","cadena":"<path d=\"M10 13a5 5 0 0 0 7 .5l3-3a5 5 0 0 0-7-7l-1.8 1.8M14 11a5 5 0 0 0-7-.5l-3 3a5 5 0 0 0 7 7l1.8-1.8\"/>","charadas":"<path d=\"M4 4c4-2 9-2 13 0v11c-3 4-9 6-13 2Z\"/><path d=\"M7 9h.01M14 9h.01M7 13c2 2 5 2 7 0\"/>","clave":"<circle cx=\"8\" cy=\"15\" r=\"4\"/><path d=\"m11 12 9-9 2 2-3 3 2 2-3 3-2-2-3 3\"/>","conecta":"<path d=\"M8 3H3v6a2 2 0 0 1 0 4v8h7v-3a2 2 0 0 1 4 0v3h7v-7h-3a2 2 0 0 1 0-4h3V3h-7v3a2 2 0 0 1-4 0V3Z\"/>","ia":"<rect x=\"4\" y=\"7\" width=\"16\" height=\"13\" rx=\"3\"/><path d=\"M12 3v4M8 3h8M8 13h.01M16 13h.01M9 17h6\"/>","stop":"<path d=\"m4 20 4.5-1 11-11-3.5-3.5-11 11L4 20ZM14 6l3.5 3.5\"/><path d=\"M4 4h7\"/>","dark":"<path d=\"M9 18h6m-5 3h4M9 15a6 6 0 1 1 6 0c-1 .9-1 1.5-1 3h-4c0-1.5 0-2.1-1-3Z\"/>","mentiroso":"<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M7 8h10M7 12h4M7 16h8\"/>","papelito":"<path d=\"M6 3h10l4 4v14H6V3Z\"/><path d=\"M16 3v5h4M9 12h8M9 16h6\"/>","letras":"<path d=\"M4 19 9 5l5 14M6 14h6M17 9h3M18.5 7.5v3\"/>","numeros":"<path d=\"M8 3 5 21M17 3l-3 18M3 9h18M2 15h18\"/>","alphabetics":"<path d=\"M4 18 9 6l5 12M6 14h6M16 7h5l-5 11h5\"/>","pasapalabras":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 3v5M21 12h-5M12 21v-5M3 12h5\"/>","cancion":"<path d=\"M9 18V5l12-2v13M9 9l12-2\"/><ellipse cx=\"6\" cy=\"18\" rx=\"3\" ry=\"2\"/><ellipse cx=\"18\" cy=\"16\" rx=\"3\" ry=\"2\"/>","prohibida":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m5.6 5.6 12.8 12.8\"/>","antifaz":"<path d=\"M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6Z\"/><circle cx=\"12\" cy=\"12\" r=\"2.5\"/><path d=\"m4 20 16-16\"/>","dobles":"<circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 21v-3a6 6 0 0 1 12 0v3M16 6a3 3 0 0 1 0 6M17 15a5 5 0 0 1 4 5\"/>","buzzer":"<path d=\"m13 2-9 12h7l-1 8 10-12h-7l0-8Z\"/>","stuno":"<rect x=\"4\" y=\"3\" width=\"13\" height=\"17\" rx=\"2\"/><path d=\"M8 7h5M8 11h5M20 7v13H8\"/>","basta":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/>"};
const icon = id => '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+(iconPaths[id]||iconPaths.basta)+'</svg>';

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
  $("modalSymbol").innerHTML=icon(game.id);
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
  card.querySelector(".symbol").innerHTML=icon(game.id);
  const button=document.createElement("button");
  button.className="favorite";
  button.dataset.fav=game.id;
  button.type="button";
  card.querySelector(".game-top").append(button);
  const route=({contacto:"contacto",charadas:"charadas",clave:"clave",stop:"stop",papelito:"papelito",letras:"letras",numeros:"numeros",alphabetics:"alphabetics",cancion:"cancion",prohibida:"prohibida",antifaz:"antifaz",dobles:"dobles"})[game.id];
  card.dataset.url=game.url||(route?"./juegos/"+route+".html":"");
  card.setAttribute("role",game.url||route?"link":"button");
  card.setAttribute("tabindex","0");
  card.setAttribute("aria-label",(game.url||route?"Abrir ":"Ver reglas de ")+game.name);
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
  if(event.target.closest("a,button,input,select,textarea,summary"))return;
  const card=event.target.closest("#games .game");
  if(card){
    if(card.dataset.url){window.location.assign(card.dataset.url);}
    else openRules(games[cards.indexOf(card)].id);
    return;
  }
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
document.querySelectorAll("#games .game").forEach(card=>card.addEventListener("keydown",event=>{
  if((event.key==="Enter"||event.key===" ")&&event.target===card){
    event.preventDefault();
    if(card.dataset.url)window.location.assign(card.dataset.url);
    else openRules(games[cards.indexOf(card)].id);
  }
}));
$("search").addEventListener("input",refresh);
$("close").addEventListener("click",()=>$("dialog").close());
$("dialog").addEventListener("click",event=>{if(event.target===$("dialog"))$("dialog").close()});
refresh();
