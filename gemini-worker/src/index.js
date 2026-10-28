/* Proxy privado de Gemini para Games. Nunca publiques las claves en GitHub. */
const ORIGIN="https://barccelo.github.io";
const MODE={
clave:"Palabras secretas (password) para adivinar con pistas de una sola palabra. Evita frases largas.",
charadas:"Películas o programas, personas/personajes y lugares reconocibles para representar con mímica, sin sonidos.",
alphabetics:"Diez palabras de iniciales consecutivas en orden alfabético, cada una con pista de una sola palabra.",
cancion:"Palabras conocidas frecuentes en canciones en español. No incluyas letras protegidas ni títulos.",
prohibida:"Palabras cotidianas para una dinámica de palabra prohibida.",
antifaz:"Palabras concretas para describir con un máximo de ocho palabras en diez segundos.",
dobles:"Categorías para mencionar parejas y tríos de cosas relacionadas.",
papelito:"Palabras, lugares, personajes y conceptos aptos para descripción, palabra única y mímica.",
stop:"Categorías temáticas originales para jugar STOP, no respuestas.",
rosco:"Palabras que comiencen por iniciales distintas, en orden alfabético, con una definición breve precisa.",
letras:"Pares de letras españolas para encontrar una palabra que empiece y termine con ellas; en word escribe el par A-Z y en clue un ejemplo válido.",
numeros:"Pares de números enteros entre 1 y 99; en word escribe A+B y en clue su suma correcta."
};
const headers=(origin)=>({"Access-Control-Allow-Origin":origin===ORIGIN?ORIGIN:"null","Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type,X-Games-Access","Vary":"Origin","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Content-Type":"application/json; charset=utf-8"});
const reply=(body,status,origin)=>new Response(JSON.stringify(body),{status,headers:headers(origin)});
export default {async fetch(request,env){
 const origin=request.headers.get("Origin")||"";
 if(request.method==="OPTIONS")return origin===ORIGIN?new Response(null,{status:204,headers:headers(origin)}):new Response(null,{status:403});
 if(request.method!=="POST")return reply({error:"Método no permitido"},405,origin);
 if(origin!==ORIGIN)return reply({error:"Origen no permitido"},403,origin);
 if(!env.GEMINI_API_KEY||!env.GAME_HOST_TOKEN)return reply({error:"Servicio no configurado"},503,origin);
 const token=request.headers.get("X-Games-Access")||"";
 if(!token||token.length>256||token!==env.GAME_HOST_TOKEN)return reply({error:"Código de anfitrión incorrecto"},401,origin);
 if(Number(request.headers.get("Content-Length")||0)>5000)return reply({error:"Solicitud demasiado grande"},413,origin);
 let input;try{input=await request.json()}catch{return reply({error:"JSON inválido"},400,origin)}
 const mode=String(input?.mode||"");if(!Object.hasOwn(MODE,mode))return reply({error:"Juego no válido"},400,origin);
 const count=mode==="alphabetics"?10:mode==="rosco"?26:Math.max(1,Math.min(15,Number.parseInt(input.count,10)||1));
 const category=String(input.category||"").slice(0,60);
 const level=["fácil","medio","difícil"].includes(input.level)?input.level:"medio";
 const excluded=Array.isArray(input.exclude)?input.exclude.filter(s=>typeof s==="string").slice(-30).map(s=>s.slice(0,70)):[];
 const prompt="Eres un generador de contenido para juegos familiares en español. Devuelve exclusivamente JSON siguiendo el esquema. "+MODE[mode]+" Genera "+count+" elementos únicos. Dificultad: "+level+". Categoría solicitada: "+category+". Evitar: "+excluded.join(", ")+". Cada objeto debe tener word (estímulo o respuesta), category y clue (pista o cadena vacía). Evita material ofensivo o no apropiado. No incluyas explicaciones. No repitas palabras. Para rosco, usa una inicial diferente por palabra y una definición verificable.";
 const schema={type:"OBJECT",properties:{items:{type:"ARRAY",items:{type:"OBJECT",properties:{word:{type:"STRING"},category:{type:"STRING"},clue:{type:"STRING"}},required:["word","category","clue"]}}},required:["items"]};
 const model=env.GEMINI_MODEL||"gemini-3.8-flash";
 let upstream;
 try{upstream=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(model)+":generateContent",{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":env.GEMINI_API_KEY},body:JSON.stringify({contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{responseMimeType:"application/json",responseSchema:schema,temperature:0.85,maxOutputTokens:6000}}),signal:AbortSignal.timeout(25000)});}
 catch{return reply({error:"No se pudo conectar con Gemini"},502,origin)}
 if(!upstream.ok)return reply({error:upstream.status===429?"Límite de solicitudes de Gemini":"Gemini devolvió error HTTP "+upstream.status},502,origin);
 try{
  const data=await upstream.json();
  const raw=(data.candidates?.[0]?.content?.parts||[]).map(p=>p.text||"").join("");
  const output=JSON.parse(raw).items;
  if(!Array.isArray(output))throw Error("Array expected");
  const items=[],seen=new Set();
  for(const item of output){
   const word=String(item?.word||"").trim().slice(0,110);
   const category=String(item?.category||"").trim().slice(0,80);
   const clue=String(item?.clue||"").trim().slice(0,250);
   const key=word.toLocaleLowerCase("es");
   if(word&&!seen.has(key)){seen.add(key);items.push({word,category,clue})}
   if(items.length>=count)break;
  }
  if(!items.length)throw Error("Empty");
  return reply({items,provider:"gemini"},200,origin);
 }catch{return reply({error:"Gemini no devolvió datos válidos"},502,origin)}
}};