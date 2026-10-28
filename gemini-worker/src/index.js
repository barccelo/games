const ORIGIN = "https://barccelo.github.io";
const MODES = new Set(["clave","charadas","alphabetics","cancion","prohibida","antifaz","dobles","papelito","stop","rosco","letras","numeros"]);
const SCHEMA = {
  type:"OBJECT",
  properties:{items:{type:"ARRAY",items:{
    type:"OBJECT",
    properties:{word:{type:"STRING"},category:{type:"STRING"},clue:{type:"STRING"}},
    required:["word","category","clue"]
  }}},
  required:["items"]
};

function send(data,status=200,origin="") {
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      "Content-Type":"application/json; charset=utf-8",
      "Cache-Control":"no-store",
      "Access-Control-Allow-Origin":origin===ORIGIN?ORIGIN:"null",
      "Access-Control-Allow-Headers":"Content-Type",
      "Access-Control-Allow-Methods":"POST, OPTIONS",
      "Vary":"Origin"
    }
  });
}

export default {
  async fetch(request,env) {
    const origin=request.headers.get("Origin")||"";
    if(request.method==="GET")
      return send({service:"games-gemini",status:"online",ready:Boolean(env.GEMINI_API_KEY && env.LIMITER)});
    if(request.method==="OPTIONS")
      return new Response(null,{status:origin===ORIGIN?204:403,headers:{
        "Access-Control-Allow-Origin":origin===ORIGIN?ORIGIN:"null",
        "Access-Control-Allow-Headers":"Content-Type",
        "Access-Control-Allow-Methods":"POST, OPTIONS",
        "Vary":"Origin"
      }});
    if(request.method!=="POST" || origin!==ORIGIN)
      return send({error:"Solicitud no permitida"},403,origin);
    if(!env.GEMINI_API_KEY || !env.LIMITER)
      return send({error:"Servicio no disponible"},503,origin);
    if(Number(request.headers.get("Content-Length")||0)>4096)
      return send({error:"Solicitud demasiado grande"},413,origin);

    let limited;
    try {
      limited=await env.LIMITER.limit({key:request.headers.get("CF-Connecting-IP")||"unknown"});
    } catch {
      return send({error:"No se pudo comprobar el límite de uso"},503,origin);
    }
    if(!limited.success) return send({error:"Se alcanzó el límite de solicitudes. Intenta de nuevo en un minuto."},429,origin);

    let input;
    try { input=await request.json(); }
    catch { return send({error:"Solicitud inválida"},400,origin); }
    if(!input || !MODES.has(input.mode))
      return send({error:"Juego no admitido"},400,origin);

    const count=input.mode==="rosco"?27:input.mode==="alphabetics"?10:Math.min(15,Math.max(1,Number(input.count)||1));
    const level=["fácil","medio","difícil"].includes(input.level)?input.level:"medio";
    const category=String(input.category||"").slice(0,60);
    const exclude=Array.isArray(input.exclude)?input.exclude.slice(-20).map(x=>String(x).slice(0,60)).join(", "):"";
    const hints={
      clave:"Palabras secretas que puedan adivinarse con pistas de una sola palabra",
      charadas:"Películas, series, personajes o lugares que se representen fácilmente con mímica",
      alphabetics:"Diez palabras de iniciales consecutivas en orden alfabético",
      rosco:"Una palabra por cada letra del alfabeto español, incluida la Ñ, con definición precisa",
      letras:"Pares de letras inicial y final que permitan formar palabras comunes",
      numeros:"Dos números para una suma mental, con la solución en clue",
      cancion:"Palabras frecuentes en canciones sin reproducir letras protegidas",
      prohibida:"Palabras cotidianas para intentar hacerlas pronunciar",
      antifaz:"Conceptos para adivinar con pistas breves",
      dobles:"Categorías para mencionar conjuntos de dos o tres elementos",
      papelito:"Conceptos aptos para descripción, pista de una palabra y mímica",
      stop:"Categorías originales para completar palabras con una inicial"
    };
    const prompt=`Genera ${count} elementos para un juego familiar en español. Juego: ${input.mode}. ${hints[input.mode]}. Categoría: ${category||"variada"}. Dificultad: ${level}. Evita repeticiones: ${exclude||"ninguna"}. Responde solo con items en el esquema JSON indicado. Cada item lleva word, category y clue (vacía si no aplica). No incluyas material ofensivo.`;
    let response;
    try {
      response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-goog-api-key":env.GEMINI_API_KEY},
        body:JSON.stringify({
          contents:[{parts:[{text:prompt}]}],
          generationConfig:{responseMimeType:"application/json",responseSchema:SCHEMA,thinkingConfig:{thinkingLevel:"minimal"},maxOutputTokens:8192}
        }),
        signal:AbortSignal.timeout(25000)
      });
    } catch {
      return send({error:"No se pudo contactar al generador"},502,origin);
    }
    if(!response.ok) return send({error:"El generador no está disponible ("+response.status+")"},502,origin);

    let data;
    try { data=await response.json(); }
    catch { return send({error:"Respuesta del generador inválida"},502,origin); }
    const candidate=data.candidates?.[0];
    const text=(candidate?.content?.parts||[]).map(part=>part.text||"").join("").trim();
    if(!text) return send({error:"El generador no devolvió contenido"},502,origin);
    let values;
    try { values=JSON.parse(text).items; }
    catch { return send({error:"El contenido llegó incompleto"},502,origin); }
    if(!Array.isArray(values)) return send({error:"Formato de respuesta no válido"},502,origin);

    const seen=new Set();
    const items=[];
    for(const value of values){
      const word=String(value.word||"").trim().slice(0,110);
      const key=word.toLocaleLowerCase("es");
      if(!word||seen.has(key))continue;
      seen.add(key);
      items.push({word,category:String(value.category||"").slice(0,80),clue:String(value.clue||"").slice(0,250)});
      if(items.length>=count)break;
    }
    if(!items.length) return send({error:"El generador no devolvió palabras válidas"},502,origin);
    return send({items},200,origin);
  }
};
