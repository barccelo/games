(() => {
  const $ = id => document.getElementById(id);
  const mode = document.body.dataset.game || new URLSearchParams(location.search).get("juego") || "clave";
  const api = "https://games-gemini.mbckp-at.workers.dev";
  const titles = {
    clave:["La clave es","Palabras secretas para adivinar con una pista."],
    charadas:["Charadas Pro Max","Películas, personajes y lugares para representar."],
    alphabetics:["Alphabetics","Diez palabras con iniciales consecutivas."],
    cancion:["Adivina la canción","Palabras para encontrar una canción."],
    prohibida:["Palabra prohibida","Haz que el jugador diga la palabra sin querer."],
    antifaz:["Antifaz","Conceptos para adivinar con una pista breve."],
    dobles:["Dobles y triples","Categorías para encontrar parejas o tríos."],
    papelito:["Papelito","Palabras para las tres rondas."],
    stop:["Stop rodado","Categorías para completar contra reloj."],
    rosco:["Pasapalabras","Palabras y definiciones para preparar un rosco."]
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
  if (!titles[mode] || !$("aiGenerate")) return;
  if ($("generatorTitle")) {
    $("generatorTitle").textContent = titles[mode][0];
    $("generatorInfo").textContent = titles[mode][1];
    document.title = titles[mode][0] + " · Games";
  }

  const shuffle = values => {
    const list = [...values];
    for (let i=list.length-1; i>0; i--) {
      const j=Math.floor(Math.random()*(i+1));
      [list[i],list[j]]=[list[j],list[i]];
    }
    return list;
  };
  const count = () => {
    if (mode==="clave") return 1;
    if (mode==="alphabetics") return 10;
    if (mode==="rosco") return 27;
    return Math.max(1,Math.min(15,Number($("aiCount")?.value)||5));
  };
  const category = () => $("aiCategory")?.value.trim() || "";
  const difficulty = () => $("aiLevel")?.value || "medio";
  const notice = message => $("aiStatus").textContent=message;
  let items=[],index=0,shown=false,sourceLabel="";

  function local() {
    let bank=groups[mode] || groups.clave;
    if (mode==="charadas" && category()) {
      const subset=bank.filter(entry=>entry.split("|")[1]?.toLocaleLowerCase("es")===category().toLocaleLowerCase("es"));
      if(subset.length)bank=subset;
    }
    const selection=["rosco","alphabetics"].includes(mode)?bank.slice(0,count()):shuffle(bank).slice(0,count());
    return selection.map(entry=>{
      const [word,extra=""]=entry.split("|");
      return {
        word,
        category:mode==="charadas"?extra:(category()||titles[mode][0]),
        clue:["alphabetics","rosco"].includes(mode)?extra:""
      };
    });
  }

  function draw() {
    const item=items[index], hasItem=Boolean(item);
    $("aiWord").textContent=hasItem?(shown?item.word:"••••"):"?";
    $("aiMeta").textContent=!hasItem?"Genera una palabra para comenzar.":shown?[item.category,item.clue].filter(Boolean).join(" · "):"Respuesta oculta";
    $("aiProgress").textContent=items.length?`(${index+1} de ${items.length})`:"";
    $("aiSource").textContent=sourceLabel||"Sin palabras";
    $("aiToggle").disabled=!hasItem;
    $("aiNext").disabled=!hasItem;
    $("aiToggle").textContent=shown?"Ocultar palabra":"Mostrar palabra";
    $("aiNext").textContent=index===items.length-1?"Volver al inicio":"Siguiente palabra";
    const list=$("aiList");
    list.replaceChildren();
    if (!hasItem) {
      const li=document.createElement("li");li.textContent="Sin palabras todavía.";list.append(li);
    } else {
      for(let i=0;i<index;i++) {
        const li=document.createElement("li");li.textContent=items[i].word;list.append(li);
      }
      if(index===0){const li=document.createElement("li");li.textContent="Las palabras aparecerán al avanzar.";list.append(li);}
    }
  }

  function use(list,label) {
    items=list.filter(item=>item && typeof item.word==="string" && item.word.trim()).map(item=>({
      word:item.word.trim(),category:String(item.category||""),clue:String(item.clue||"")
    }));
    index=0;shown=false;sourceLabel=label;draw();
  }

  $("aiLocal").addEventListener("click",()=>{
    use(local(),"Palabras incluidas");
    notice("Nueva selección preparada.");
  });
  $("aiGenerate").addEventListener("click",async()=>{
    const button=$("aiGenerate");
    button.disabled=true;
    notice("Preparando palabras…");
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),30000);
    try {
      const response=await fetch(api,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({mode,count:count(),category:category(),level:difficulty(),exclude:items.map(item=>item.word).slice(-20)}),
        signal:controller.signal
      });
      const data=await response.json();
      if (!response.ok) throw new Error(data.error||"No se pudo generar el contenido");
      if (!Array.isArray(data.items) || !data.items.length) throw new Error("Sin resultados");
      use(data.items,"Nueva selección");
      notice("Contenido preparado.");
    } catch {
      use(local(),"Palabras incluidas");
      notice("Se utilizó la colección incluida. Puedes volver a generar.");
    } finally {
      clearTimeout(timer);
      button.disabled=false;
    }
  });
  $("aiToggle").addEventListener("click",()=>{shown=!shown;draw();});
  $("aiNext").addEventListener("click",()=>{index=(index+1)%items.length;shown=false;draw();});
  $("aiCopy").addEventListener("click",async()=>{
    if (!items.length) return notice("No hay palabras para copiar.");
    const text=items.map((item,i)=>`${i+1}. ${item.word}${item.clue?" — "+item.clue:""}`).join("\n");
    try { await navigator.clipboard.writeText(text);notice("Lista copiada."); }
    catch {notice("No se pudo copiar la lista.");}
  });
  if ($("aiCount")) $("aiCount").value=mode==="charadas"?5:10;
  if (["rosco","alphabetics"].includes(mode) && $("aiCount")) $("aiCount").disabled=true;
  draw();
})();
