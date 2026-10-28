(() => {
  const $=id=>document.getElementById(id);
  const examples=["Astronauta","Pingüino","Pirata","Ascensor","Microscopio","Volcán","Dragón",
    "Arcoíris","Brújula","Bailarín","Mimo","Rey","Paraguas","Bicicleta","Superhéroe",
    "Mariposa","Helicóptero","Magia","Cocodrilo","Futbolista","Biblioteca","Robots",
    "Cámara","Tortuga","Piano","Castillo","Caracol","Detective","Guante","Cohete",
    "Guitarra","Héroe","Sombrero","Científico","Estrella","Panadero","Delfín","Montaña",
    "Espantapájaros","Película"];
  const labels=["Descripción libre","Una sola palabra","Mímica"];
  const hints=["Describe libremente sin decir la palabra ni ninguna parte de ella.",
    "Da exactamente una palabra como pista. Puedes pasar.",
    "Solo mímica, sin sonidos ni palabras."];
  let deck=[],inBowl=[],round=0,team=0,scores=[0,0],time=60,timer=null,deadline=0,finished=false;
  const secs=()=>Math.max(15,Math.min(300,Number($("paDuration").value)||60));
  const format=n=>String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");
  const parse=text=>[...new Set(text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean))];
  const shuffle=a=>{const items=[...a];for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}return items;};
  $("paManual").value=(()=>{try{return localStorage.getItem("games-papelito-manual")||""}catch{return""}})();
  const updateManual=()=>{
    const n=parse($("paManual").value).length;
    $("paManualCount").textContent=n?n+" papelitos propios escritos.":"Escribe todas las palabras o frases que quieras utilizar.";
  };
  $("paManual").addEventListener("input",updateManual);
  updateManual();
  function draw(){
    $("paRound").textContent=finished?"Partida finalizada":"Ronda "+(round+1)+" · "+labels[round];
    $("paRemaining").textContent=inBowl.length+" de "+deck.length+" papelitos restantes";
    $("paPhase").textContent="Ronda "+(round+1)+" de 3";
    $("paTeam").textContent=team?"Equipo B":"Equipo A";
    $("paWord").textContent=finished?"Partida terminada":inBowl[0]||"Sin papelitos";
    $("paTime").textContent=format(time);
    for(let i=0;i<2;i++){
      $("paScore"+i).textContent=scores[i];
      $("paBox"+i).classList.toggle("active",i===team);
    }
    const active=!finished&&time>0&&inBowl.length>0;
    $("paHit").disabled=!active;
    $("paPass").hidden=round!==1||finished;
    $("paPass").disabled=!active||inBowl.length<2;
    $("paStart").disabled=!active||Boolean(timer);
    $("paPause").disabled=!timer;
    $("paNext").disabled=finished;
  }
  function pause(){
    if(timer){time=Math.max(0,Math.ceil((deadline-Date.now())/1000));clearInterval(timer);timer=null;}
    draw();
  }
  function tick(){
    time=Math.max(0,Math.ceil((deadline-Date.now())/1000));
    if(!time){pause();$("paStatus").textContent="Tiempo agotado. Es turno del otro equipo.";}
    else draw();
  }
  function begin(list){
    const chosen=parse(list.join("\n"));
    if(chosen.length<4){$("paSetupStatus").textContent="Necesitas al menos cuatro papelitos diferentes.";return;}
    pause();
    deck=chosen;inBowl=shuffle(deck);round=0;team=0;scores=[0,0];
    time=secs();finished=false;
    $("paSetup").hidden=true;$("paGame").hidden=false;$("paEnd").hidden=true;
    $("paStatus").textContent=hints[0];draw();
  }
  $("paOwn").addEventListener("click",()=>{
    const words=parse($("paManual").value);
    if(words.length<4){$("paSetupStatus").textContent="Escribe al menos cuatro papelitos, uno por línea.";return;}
    try{localStorage.setItem("games-papelito-manual",words.join("\n"));}catch{}
    begin(words);
  });
  $("paLocal").addEventListener("click",()=>begin(shuffle(examples).slice(0,Math.max(4,Math.min(examples.length,Number($("paCount").value)||20)))));
  $("paGenerate").addEventListener("click",async()=>{
    const button=$("paGenerate");button.disabled=true;$("paSetupStatus").textContent="Preparando papelitos…";
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),25000);
    const amount=Math.max(4,Math.min(40,Number($("paCount").value)||20));
    let words=[];
    try {
      const response=await fetch("https://games-gemini.mbckp-at.workers.dev",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({mode:"papelito",count:Math.min(15,amount),level:"medio"}),signal:controller.signal});
      const data=await response.json();
      if(response.ok&&Array.isArray(data.items))words=data.items.map(x=>x.word).filter(Boolean);
    }catch{}finally{clearTimeout(timeout);button.disabled=false;}
    words=parse([...words,...shuffle(examples)].join("\n")).slice(0,amount);
    begin(words);
    if(!words.length)$("paSetupStatus").textContent="No se pudieron preparar papelitos.";
  });
  $("paHit").addEventListener("click",()=>{
    if(finished||!inBowl.length||time===0)return;
    scores[team]++;inBowl.shift();
    if(!inBowl.length){
      pause();
      if(round===2){
        finished=true;
        const winner=scores[0]===scores[1]?"Empate":scores[0]>scores[1]?"Gana el Equipo A":"Gana el Equipo B";
        $("paStatus").textContent="¡Terminó la tercera ronda!";
        $("paEnd").textContent=winner+" · Resultado final: "+scores[0]+" a "+scores[1]+".";
        $("paEnd").hidden=false;
      } else {
        round++;inBowl=shuffle(deck);team=1-team;time=secs();
        $("paStatus").textContent="Se repusieron los mismos "+deck.length+" papelitos. "+hints[round];
      }
    }
    draw();
  });
  $("paPass").addEventListener("click",()=>{
    if(round!==1||inBowl.length<2)return;
    inBowl.push(inBowl.shift());draw();
  });
  $("paStart").addEventListener("click",()=>{
    if(timer||finished||!time)return;
    deadline=Date.now()+time*1000;timer=setInterval(tick,180);draw();
  });
  $("paPause").addEventListener("click",pause);
  $("paNext").addEventListener("click",()=>{
    if(finished)return;
    pause();team=1-team;time=secs();$("paStatus").textContent=hints[round];draw();
  });
  $("paEdit").addEventListener("click",()=>{
    if(!confirm("¿Volver a preparar los papelitos y reiniciar el marcador?"))return;
    pause();$("paManual").value=deck.join("\n");updateManual();
    $("paGame").hidden=true;$("paSetup").hidden=false;$("paManual").focus();
  });
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&timer)tick();});
})();
