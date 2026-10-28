(() => {
  const $ = id => document.getElementById(id);
  const api = "https://games-gemini.mbckp-at.workers.dev";
  const bank = {
    "Películas o series":["Titanic","Spider-Man","Harry Potter","El Rey León","La casa de papel","Buscando a Nemo","Frozen","Toy Story","Los Simpson","Mi pobre angelito","Shrek","Star Wars","El juego del calamar","Barbie","Avatar"],
    "Personas o personajes":["Sherlock Holmes","Cleopatra","Albert Einstein","Cenicienta","Batman","La sirenita","Pinocho","Superman","Frida Kahlo","Napoleón","Robin Hood","Drácula","Charlie Chaplin","Wonder Woman","El Zorro"],
    "Lugares":["Aeropuerto","Playa","Biblioteca","Museo","Torre Eiffel","Estadio","Supermercado","Hospital","Montaña","Parque de diversiones","Estación de tren","Restaurante","Desierto","Castillo","Zoológico"]
  };
  const defaultState = {names:["Equipo A","Equipo B"],scores:[0,0],turn:0,round:1};
  let state=defaultState;
  try {
    const saved=JSON.parse(sessionStorage.getItem("games-charadas")||"null");
    if(saved&&Array.isArray(saved.scores)&&saved.scores.length===2)state={...defaultState,...saved};
  } catch {}
  let words=[],position=0,correct=0,passed=0;
  let duration=60,remaining=60,timer=null,endsAt=0;
  const int = (v,fallback,min,max) => Number.isFinite(Number(v))?Math.min(max,Math.max(min,Math.floor(Number(v)))):fallback;
  const chosenCount=()=>int($("chCount").value,10,1,15);
  const clock=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
  const notice=text=>{$("chStatus").textContent=text;};
  const save=()=>{try{sessionStorage.setItem("games-charadas",JSON.stringify(state));}catch{}};
  const shuffle=values=>{const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const fromBank=category=>{
    const entries=category&&bank[category]?bank[category]:Object.values(bank).flat();
    return shuffle(entries);
  };
  function render() {
    $("chWord").textContent=words[position] || (words.length?"Fin de las palabras":"Prepara las palabras");
    $("chProgress").textContent=words.length&&position<words.length?"Palabra "+(position+1)+" de "+words.length:words.length+" palabras terminadas";
    $("chClock").textContent=clock(remaining);
    $("chTurn").textContent=state.names[state.turn];
    $("chRound").textContent="Turno "+state.round;
    for(let i=0;i<2;i++){
      $("chName"+i).textContent=state.names[i];
      $("chScore"+i).textContent=state.scores[i];
      $("chBox"+i).classList.toggle("active",state.turn===i);
    }
    const playable=remaining>0&&position<words.length;
    $("chHit").disabled=!playable;
    $("chPass").disabled=!playable;
    $("chStart").disabled=Boolean(timer)||remaining===0||!words.length||position>=words.length;
    $("chPause").disabled=!timer;
  }
  function pause() {
    if(timer) {
      remaining=Math.max(0,Math.ceil((endsAt-Date.now())/1000));
      clearInterval(timer);
      timer=null;
    }
    render();
  }
  function tick() {
    remaining=Math.max(0,Math.ceil((endsAt-Date.now())/1000));
    if(!remaining){pause();notice("Tiempo agotado. Cambia de equipo para continuar.");}
    else render();
  }
  function nextWord() {
    position++;
    if(position===words.length) {
      pause();
      notice("Terminaste las "+words.length+" palabras. Prepara otra tanda.");
      $("chSettings").open=true;
    }
    render();
  }
  function load(list) {
    const seen=new Set();
    words=[];
    for(const item of list){
      const word=typeof item==="string"?item:String(item?.word||"").trim();
      const key=word.toLocaleLowerCase("es");
      if(word&&!seen.has(key)){seen.add(key);words.push(word);}
    }
    position=0;correct=0;passed=0;
    pause();
    remaining=duration;
    render();
    notice(words.length+" palabras preparadas. El reloj está listo.");
  }
  $("chStart").addEventListener("click",()=>{
    if(timer||remaining<=0||!words[position])return;
    endsAt=Date.now()+remaining*1000;
    timer=setInterval(tick,200);
    notice("Turno en curso.");
    render();
  });
  $("chPause").addEventListener("click",()=>{pause();notice("Tiempo pausado.");});
  $("chHit").addEventListener("click",()=>{
    state.scores[state.turn]++;
    correct++;
    save();
    nextWord();
  });
  $("chPass").addEventListener("click",()=>{passed++;nextWord();});
  $("chNext").addEventListener("click",()=>{
    pause();
    state.turn=1-state.turn;
    state.round++;
    duration=int($("chDuration").value,60,10,600);
    remaining=duration;
    if(position>=words.length)load(fromBank($("chCategory").value).slice(0,chosenCount()));
    save();
    notice("Turno de "+state.names[state.turn]+". Pulsa Iniciar tiempo.");
    render();
  });
  document.querySelectorAll("[data-chscore]").forEach(button=>{
    button.addEventListener("click",()=>{
      const [team,delta]=button.dataset.chscore.split(":").map(Number);
      state.scores[team]=Math.max(0,state.scores[team]+delta);
      save();render();
    });
  });
  ["chA","chB"].forEach((field,i)=>{
    $(field).value=state.names[i];
    $(field).addEventListener("input",()=>{state.names[i]=$(field).value.trim()||"Equipo "+(i?"B":"A");save();render();});
  });
  $("chDuration").addEventListener("change",()=>{
    duration=int($("chDuration").value,60,10,600);
    $("chDuration").value=duration;
    if(!timer)remaining=duration;
    render();
  });
  $("chReset").addEventListener("click",()=>{
    if(!confirm("¿Reiniciar las puntuaciones y los turnos?"))return;
    pause();
    state.scores=[0,0];state.turn=0;state.round=1;
    remaining=duration;correct=0;passed=0;
    save();render();notice("Partida reiniciada.");
  });
  $("chLocal").addEventListener("click",()=>{
    load(fromBank($("chCategory").value).slice(0,chosenCount()));
    $("chSettings").open=false;
  });
  $("chGenerate").addEventListener("click",async()=>{
    const button=$("chGenerate");
    button.disabled=true;
    notice("Preparando palabras…");
    const requestCount=chosenCount();
    const category=$("chCategory").value;
    const fallback=fromBank(category);
    const ctrl=new AbortController();
    const timeout=setTimeout(()=>ctrl.abort(),25000);
    try{
      const response=await fetch(api,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({mode:"charadas",count:requestCount,category,level:$("chLevel").value,
          exclude:words.slice(-15)}),signal:ctrl.signal});
      const data=await response.json();
      if(!response.ok||!Array.isArray(data.items))throw Error("No se pudo generar");
      const generated=[];
      const seen=new Set();
      for(const item of [...data.items,...fallback]){
        const word=String(typeof item==="string"?item:item?.word||"").trim();
        const key=word.toLocaleLowerCase("es");
        if(word&&!seen.has(key)){seen.add(key);generated.push(word);}
        if(generated.length>=requestCount)break;
      }
      load(generated);
    }catch{
      load(fallback.slice(0,requestCount));
      notice("Se usaron palabras incluidas. Puedes seguir jugando.");
    }finally{
      clearTimeout(timeout);button.disabled=false;$("chSettings").open=false;
    }
  });
  duration=int($("chDuration").value,60,10,600);
  remaining=duration;
  load(fromBank("").slice(0,10));
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)tickIfRunning();});
  function tickIfRunning(){if(timer)tick();}
})();
