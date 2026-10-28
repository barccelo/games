(() => {
"use strict";
const $=id=>document.getElementById(id);
const choices={
clave:["La clave es","Palabras secretas para pistas de una sola palabra."],
charadas:["Charadas Pro Max","Películas, personas, personajes y lugares para representar mediante mímica."],
alphabetics:["Alphabetics","Diez palabras en orden alfabético para las dos fases de 30 segundos."],
letras:["Letras cruzadas","Obtén pares de letras para competir por una palabra válida."],
numeros:["Números cruzados","Obtén sumas de dos números para resolver mentalmente."],
cancion:["Adivina la canción","Palabras para cantar una canción que las contenga."],
prohibida:["Palabra prohibida","Palabras para intentar hacerlas pronunciar sin que el jugador lo sepa."],
antifaz:["Antifaz","Palabras para adivinar con pistas breves."],
dobles:["Dobles y triples","Categorías para formar parejas y tríos de elementos."],
papelito:["Papelito","Palabras para las tres rondas: descripción, palabra única y mímica."],
stop:["Stop rodado","Categorías originales para jugar STOP."],
rosco:["Pasapalabras · ideas de rosco","Genera palabras y definiciones para preparar un rosco; no modifica la aplicación original."]
};
const groups={
clave:["BRÚJULA","VENTANA","JARDÍN","GALAXIA","ESCALERA","MISTERIO","RÍO","BIBLIOTECA","TORMENTA","FARO","CASTILLO","COCINA","LINTERNA","MONTAÑA","PARAGUAS","MUSEO","TESORO","BOTELLA","CANDADO","LABERINTO"],
charadas:["Titanic|Películas o series","Harry Potter|Películas o series","El Rey León|Películas o series","Spider-Man|Películas o series","Cenicienta|Personas o personajes","Sherlock Holmes|Personas o personajes","Albert Einstein|Personas o personajes","Cleopatra|Personas o personajes","París|Lugares","Aeropuerto|Lugares","Playa|Lugares","Museo|Lugares","Torre Eiffel|Lugares"],
alphabetics:["ÁRBOL|Planta","BARCO|Nave","CASA|Hogar","DADO|Azar","ELEFANTE|Animal","FARO|Luz","GATO|Felino","HELADO|Frío","IGLESIA|Templo","JARDÍN|Flores"],
cancion:["AMOR","CORAZÓN","NOCHE","VIDA","FUEGO","BAILE","MAR","LUNA","CIELO","LLUVIA","CAMINO","LUZ","SUEÑO","BESO"],
prohibida:["SÍ","NO","HOLA","AGUA","COMIDA","GRACIAS","NOCHE","HOY","MAÑANA","BIEN","AMOR"],
antifaz:["ELEFANTE","BICICLETA","AEROPUERTO","PIRÁMIDE","MARIPOSA","RELOJ","PLANETA","CASTILLO"],
dobles:["Personajes","Objetos del hogar","Alimentos","Animales","Países","Deportes","Profesiones","Parejas famosas"],
papelito:["PINGÜINO","PIRATA","ASCENSOR","MICROSCOPIO","ASTRONAUTA","VOLCÁN","DRAGÓN","ARCOÍRIS","BRÚJULA","BAILARÍN"],
stop:["Frutas","Animales","Países","Objetos","Profesiones","Películas","Comidas","Ciudades","Deportes","Nombres"],
rosco:["ÁRBOL|Planta de tronco leñoso","BARCO|Medio de transporte que navega","CASA|Edificio destinado a vivienda","DADO|Cubo usado en juegos de azar","ELEFANTE|Mamífero terrestre de gran tamaño","FARO|Torre que emite luz de señalización","GATO|Felino doméstico","HELADO|Postre frío y dulce","IGLESIA|Templo cristiano","JARDÍN|Espacio cultivado con plantas","KOALA|Marsupial australiano","LUNA|Satélite natural de la Tierra","MONTAÑA|Gran elevación natural del terreno","NUBE|Masa visible de gotas de agua","ÑANDÚ|Ave sudamericana grande que no vuela","OCÉANO|Gran extensión de agua salada","PUENTE|Construcción para cruzar un obstáculo","QUESO|Alimento elaborado con leche","RÍO|Corriente natural de agua","SOL|Estrella central del sistema solar","TREN|Transporte ferroviario","UVA|Fruto de la vid","VIENTO|Aire en movimiento","WIFI|Tecnología de red inalámbrica","XILÓFONO|Instrumento de percusión con láminas","YATE|Embarcación recreativa","ZAPATO|Calzado que cubre el pie"]
};
const mode=(()=>{const raw=new URLSearchParams(location.search).get("juego")||document.body.dataset.game||"clave";return Object.hasOwn(choices,raw)?raw:"clave"})();
if($("generatorTitle")){$("generatorTitle").textContent=choices[mode][0];$("generatorInfo").textContent=choices[mode][1];document.title=choices[mode][0]+" · Games";}
let items=[],position=0,visible=false,source="Sin generar";
const random=n=>{const x=new Uint32Array(1);if(globalThis.crypto?.getRandomValues){crypto.getRandomValues(x);return x[0]%n;}return Math.floor(Math.random()*n);};
const shuffled=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){const k=random(i+1);[b[k],b[i]]=[b[i],b[k]];}return b;};
const status=t=>{if($("aiStatus"))$("aiStatus").textContent=t};
const store=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
const read=k=>{try{return localStorage.getItem(k)||""}catch{return ""}};
const tokenWrite=v=>{try{sessionStorage.setItem("games-ai-access",v)}catch{}};
const tokenRead=()=>{try{return sessionStorage.getItem("games-ai-access")||""}catch{return ""}};
function local(count,category){
 if(mode==="numeros")return Array.from({length:count},()=>{const a=random(98)+1,b=random(98)+1;return {word:a+" + "+b,category:"Suma",clue:String(a+b)};});
 if(mode==="letras"){
  const examples=["CASA","LIBRO","RELOJ","MESA","TREN","CARACOL","ÁRBOL","NUBE","LIMÓN","HELADO","GATO","ESCUELA","PAPEL","FLOR","PLATO","LÁPIZ","SOL","OVEJA","TIGRE","BICICLETA","ZAPATO","JARDÍN"];
  return Array.from({length:count},()=>{
   const example=examples[random(examples.length)];
   return {word:example[0]+" — "+example.at(-1),category:"Letras",clue:""};
  });
 }
 let bank=groups[mode]||groups.clave;
 let sample=mode==="alphabetics"||mode==="rosco"?bank.slice(0,count):shuffled(bank).slice(0,count);
 if(category&&mode==="charadas"){
  const filtered=bank.filter(x=>x.toLocaleLowerCase("es").includes(category.toLocaleLowerCase("es")));
  if(filtered.length)sample=shuffled(filtered).slice(0,count);
 }
 return sample.map(x=>{const parts=x.split("|");return {word:parts[0],category:mode==="charadas"?(parts[1]||"General"):category||choices[mode][0],clue:mode==="rosco"?(parts[1]||""):mode==="alphabetics"?(parts[1]||""):""};});
}
function paint(){
 if(!$("aiWord"))return;
 const item=items[position];
 $("aiSource").textContent=source;
 $("aiProgress").textContent=items.length?"("+(position+1)+" de "+items.length+")":"";
 $("aiWord").textContent=item?(visible?item.word:"••••"):"?";
 $("aiMeta").textContent=item?(visible?([item.category,item.clue].filter(Boolean).join(" · ")||"Palabra de la ronda"):"Contenido oculto. Revela cuando el jugador correcto mire la pantalla."):"Genera un conjunto para comenzar.";
 $("aiToggle").disabled=!item;$("aiNext").disabled=!item;
 $("aiToggle").textContent=visible?"Ocultar respuesta":"Mostrar respuesta";
 $("aiNext").textContent=position===items.length-1?"Volver al inicio":"Siguiente palabra";
 const list=$("aiList");list.replaceChildren();
 if(!items.length){const li=document.createElement("li");li.textContent="El contenido aparecerá aquí.";list.append(li);return;}
 const info=document.createElement("li");info.textContent="Respuestas futuras ocultas para no revelar la ronda.";list.append(info);
 for(let i=0;i<position;i++){const li=document.createElement("li");li.textContent=items[i].word;list.append(li);}
}
function setup(){
 if(!$("aiLocal"))return;
 const defaultCount=mode==="clave"?1:mode==="charadas"?5:mode==="alphabetics"?10:mode==="rosco"?27:mode==="numeros"||mode==="letras"?2:10;
 $("aiCount").value=defaultCount;
 if(mode==="charadas")$("aiCategory").placeholder="Películas o series / Personas / Lugares";
 if(mode==="letras"||mode==="numeros")$("aiLocal").textContent="Generar al azar";
 if(mode==="rosco"||mode==="alphabetics"){$("aiCount").value=defaultCount;$("aiCount").disabled=true;}
 $("aiEndpoint").value=read("games-ai-worker");
 $("aiToken").value=tokenRead();
 $("aiSave").onclick=()=>{
  const endpoint=$("aiEndpoint").value.trim().replace(/\/+$/,"");
  if(endpoint&&!/^https:\/\/[a-z0-9.-]+(?::\d+)?(?:\/[^\s]*)?$/i.test(endpoint)){status("Usa una dirección https válida del Worker.");return;}
  store("games-ai-worker",endpoint);
  tokenWrite($("aiToken").value);
  status(endpoint?"Dirección del servicio guardada. Ya puedes generar con Gemini.":"Dirección borrada. Se mantiene el modo local.");
 };
 $("aiLocal").onclick=()=>{
  const count=Math.max(1,Math.min(27,parseInt($("aiCount").value,10)||1));
  items=local(count,$("aiCategory").value.trim());position=0;visible=false;source="Sin IA";
  status("Contenido generado localmente. No se ha llamado a Gemini.");paint();
 };
 $("aiGenerate").onclick=async()=>{
  const endpoint=($("aiEndpoint").value.trim()||read("games-ai-worker")).replace(/\/+$/,"");
  const token=$("aiToken").value||tokenRead();
  if(!endpoint||!token){$("aiConfig").open=true;status("Configura la URL del Worker y el código privado del anfitrión.");return;}
  if(!/^https:\/\/[a-z0-9.-]+(?::\d+)?(?:\/[^\s]*)?$/i.test(endpoint)){status("La dirección del Worker debe utilizar HTTPS.");return;}
  const count=Math.max(1,Math.min(27,parseInt($("aiCount").value,10)||1));
  $("aiGenerate").disabled=true;status("Solicitando contenido a Gemini…");
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),30000);
  try{
   const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json","X-Games-Access":token},body:JSON.stringify({mode,count,category:$("aiCategory").value.trim(),level:$("aiLevel").value,exclude:items.map(i=>i.word).slice(-20)}),signal:controller.signal});
   const body=await response.json();
   if(!response.ok)throw Error(body.error||"Error al llamar al servicio");
   if(!Array.isArray(body.items)||!body.items.length)throw Error("La IA no devolvió palabras");
   items=body.items.filter(x=>x&&typeof x.word==="string"&&x.word.trim()).map(x=>({word:x.word.slice(0,110),category:String(x.category||"").slice(0,80),clue:String(x.clue||"").slice(0,250)}));
   if(!items.length)throw Error("Contenido vacío");
   position=0;visible=false;source="Gemini";
   store("games-ai-worker",endpoint);tokenWrite(token);
   status(items.length+" elementos generados por Gemini. Revísalos antes de jugar.");paint();
  }catch(e){status("No se pudo generar con Gemini: "+(e.name==="AbortError"?"Tiempo de espera agotado":e.message)+". Puedes usar el modo sin IA.");}
  finally{clearTimeout(timeout);$("aiGenerate").disabled=false;}
 };
 $("aiToggle").onclick=()=>{if(!items.length)return;visible=!visible;paint();};
 $("aiNext").onclick=()=>{if(!items.length)return;position=(position+1)%items.length;visible=false;paint();};
 $("aiCopy").onclick=async()=>{
  if(!items.length){status("Genera primero una lista.");return;}
  const text=items.map((x,i)=>(i+1)+". "+x.word+(x.clue?" — "+x.clue:"")).join("\n");
  try{await navigator.clipboard.writeText(text);status("Lista copiada al portapapeles.");}catch{status("No se pudo copiar automáticamente en este navegador.");}
 };
 paint();
}
setup();
})();