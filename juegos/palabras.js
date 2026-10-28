(() => {
  const api = "https://games-gemini.mbckp-at.workers.dev";
  const bank = {
    clave:["BRÚJULA","VENTANA","JARDÍN","GALAXIA","ESCALERA","MISTERIO","RÍO","BIBLIOTECA","TORMENTA","FARO","CASTILLO","COCINA","LINTERNA","MONTAÑA","PARAGUAS","MUSEO","TESORO","BOTELLA","CANDADO","LABERINTO"],
    alphabetics:[
      "ÁRBOL","AVIÓN","BARCO","BIBLIOTECA","CASA","CEREZA","DADO","DENTISTA",
      "ELEFANTE","ESPEJO","FARO","FIESTA","GATO","GUITARRA","HELADO","HOSPITAL",
      "IGLESIA","ISLA","JARDÍN","JIRAFA"
    ],
    papelito:[
      "Astronauta","Pingüino","Pirata","Ascensor","Volcán","Dragon","Microscopio",
      "Bailarín","Reloj","Paraguas","Camaleón","Futbolista","Castillo","Dinosaurio",
      "Superhéroe","Cámara","Helicóptero","Robot","Bombero","Tormenta"
    ],
    cancion:["Amor","Vida","Corazón","Noche","Día","Luna","Sol","Cielo","Mar","Agua",
    "Lluvia","Viento","Fuego","Sueño","Beso","Manos","Ojos","Tiempo","Mundo","Casa",
    "Calle","Camino","Baile","Música","Fiesta","Amigo","Amiga","Madre","Padre","Niño",
    "Niña","Lejos","Cerca","Triste","Feliz","Siempre","Nunca","Hoy","Mañana","Ayer",
    "Volver","Querer","Amar","Cantar","Bailar","Caminar","Perdón","Gracias","Hola","Adiós",
    "Nombre","Verdad","Mentira","Luz","Estrella","Flor","Rosa","Primavera","Verano","Invierno",
    "Otoño","Playa","Montaña","Río","Tierra","Azul","Rojo","Blanco","Negro","Verde",
    "Oro","Plata","Alma","Libertad","Esperanza","Tristeza","Alegría","Risa","Llorar","Sonrisa",
    "Destino","Historia","Recuerdo","Memoria","Abrazo","Familia","Hermano","Hermana","Paz","Calor",
    "Frío","Guitarra","Piano","Ventana","Puerta","Habitación","Ciudad","Pueblo","País",
    "Viaje","Avión","Tren","Barco","Distancia","Chocolate","Café","Azúcar","Hielo","Piel",
    "Labios","Reloj","Foto","Carta","Secreto","Silencio","Voz","Dormir","Despertar",
    "Brillar","Mirar","Escuchar","Sentir","Reír","Sonreír","Bailando","Contigo","Conmigo",
    "Juntos","Solo","Bonito","Lindo","Dulce","Boca","Besos","Amigos","Corriendo","Amanece",
    "Llorando","Navegar","Volando","Camisa","Falda","Coraje","Valiente","Nadie","Todo",
    "Nada","Quizás","Quiero","Quisiera","Puedo","Tengo","Estar","Ser","Esperar","Hablar"],
    prohibida:["Sí","No","Hola","Agua","Comida","Gracias","Noche","Hoy","Mañana",
      "Bien","Amor","Siempre","Nunca","Claro","Tal vez","Fácil","Difícil","Dinero"],
    antifaz:["Elefante","Bicicleta","Aeropuerto","Pirámide","Mariposa","Reloj",
      "Planeta","Castillo","Cocodrilo","Tortuga","Semáforo","Televisión","Sombrero"],
    dobles:["Personajes","Objetos del hogar","Alimentos","Animales","Países",
      "Deportes","Profesiones","Películas","Ciudades","Instrumentos","Frutas"],
    stop:["Frutas","Animales","Países","Objetos","Profesiones","Películas","Comidas",
      "Ciudades","Deportes","Nombres","Marcas","Colores","Verbos"]
  };

  const mix = values => {
    const list = [...values];
    for(let i=list.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [list[i],list[j]]=[list[j],list[i]];
    }
    return list;
  };
  const normalize = text => String(text||"").trim();
  const unique = items => {
    const seen=new Set();
    return items.filter(item=>{
      const word=normalize(item.word);
      const key=word.toLocaleLowerCase("es");
      if(!word || seen.has(key)) return false;
      seen.add(key);
      item.word=word;
      return true;
    });
  };
  function local(mode,count) {
    const words=mix(bank[mode]||[]);
    return words.slice(0,count).map(word=>({word,category:"",clue:""}));
  }
  async function prepare(mode,count,options={}) {
    const fallback=local(mode,count);
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),25000);
    try {
      const response=await fetch(api,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({mode,count,category:options.category||"",level:options.level||"medio",exclude:options.exclude||[]}),
        signal:controller.signal
      });
      const data=await response.json();
      if(!response.ok || !Array.isArray(data.items))throw Error("Invalid response");
      const received=unique(data.items.map(item=>({
        word:normalize(item.word),category:normalize(item.category),clue:normalize(item.clue)
      })));
      return {items:unique([...received,...fallback]).slice(0,count),offline:false};
    } catch {
      return {items:fallback,offline:true};
    } finally {
      clearTimeout(timeout);
    }
  }
  function alphabetics(items) {
    const letters="ABCDEFGHIJ";
    const result=[];
    for(const letter of letters) {
      const matches=items.filter(item=>item.word.normalize("NFD").replace(/[\u0300-\u036f]/g,"")[0]?.toUpperCase()===letter);
      const localMatch=(bank.alphabetics||[]).find(word=>word.normalize("NFD").replace(/[\u0300-\u036f]/g,"")[0]===letter);
      const selected=matches[0]?.word||localMatch;
      result.push({word:selected,letter});
    }
    return result;
  }
  window.GameWords={local,prepare,mix,alphabetics};
})();
