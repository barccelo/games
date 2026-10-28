(() => {
  const $=id=>document.getElementById(id);
  const labels=["Descripción libre","Una sola palabra","Mímica"];
  const hints=["Describe libremente sin decir la palabra.","Una sola palabra como pista.","Solo mímica, sin hablar ni emitir sonidos."];
  let deck=GameWords.local("papelito",10).map(x=>x.word);
  let remaining=GameWords.mix(deck),round=0,team=0,scores=[0,0],time=60,timer=null,deadline=0,finished=false;
  const format=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
  function draw(){
    $("paRound").textContent=finished?"Partida terminada":"Ronda "+(round+1)+" · "+labels[round];
    $("paRemaining").textContent=remaining.length+" papelitos";
    $("paPhase").textContent="Ronda "+Math.min(3,round+1)+" de 3";
    $("paTeam").textContent=team?"Equipo B":"Equipo A";
    $("paWord").textContent=finished?"¡Final!":remaining[0]||"Sin papelitos";
    $("paTime").textContent=format(time);
    for(let i=0;i<2;i++){
      $("paScore"+i).textContent=scores[i];
      $("paBox"+i).classList.toggle("active",i===team);
    }
    $("paHit").disabled=finished||!remaining.length||time===0;
    $("paPass").disabled=finished||!remaining.length||time===0;
    $("paStart").disabled=finished||Boolean(timer)||time===0;
    $("paPause").disabled=!timer;
  }
  function pause(){
    if(timer){time=Math.max(0,Math.ceil((deadline-Date.now())/1000));clearInterval(timer);timer=null;}
    draw();
  }
  function tick(){
    time=Math.max(0,Math.ceil((deadline-Date.now())/1000));
    if(!time){pause();$("paStatus").textContent="Tiempo agotado. Cambia de equipo para seguir.";}
    else draw();
  }
  function scored(){
    if(!remaining.length)return;
    scores[team]++;
    remaining.shift();
    if(!remaining.length){
      pause();
      if(round===2){finished=true;$("paStatus").textContent="Final: "+scores[0]+" a "+scores[1]+" puntos.";}
      else {
        round++;remaining=GameWords.mix(deck);team=1-team;time=60;
        $("paStatus").textContent="Ronda "+(round+1)+": "+hints[round];
      }
    }
    draw();
  }
  $("paHit").addEventListener("click",scored);
  $("paPass").addEventListener("click",()=>{
    if(remaining.length>1)remaining.push(remaining.shift());
    $("paStatus").textContent="Papelito pasado al final del montón.";
    draw();
  });
  $("paStart").addEventListener("click",()=>{
    if(timer||finished)return;
    deadline=Date.now()+time*1000;timer=setInterval(tick,180);draw();
  });
  $("paPause").addEventListener("click",pause);
  $("paNext").addEventListener("click",()=>{
    if(finished)return;
    pause();team=1-team;time=60;
    $("paStatus").textContent=hints[round];
    draw();
  });
  function reset(items){
    pause();
    deck=[...new Set(items.map(x=>x.word||x).filter(Boolean))];
    remaining=GameWords.mix(deck);round=0;team=0;scores=[0,0];time=60;finished=false;
    $("paOptions").open=false;
    $("paStatus").textContent=hints[0];
    draw();
  }
  $("paLocal").addEventListener("click",()=>{
    if(scores.some(Boolean)&&!confirm("¿Reiniciar la partida?"))return;
    reset(GameWords.local("papelito",Number($("paCount").value)||10));
  });
  $("paGenerate").addEventListener("click",async()=>{
    if(scores.some(Boolean)&&!confirm("¿Reiniciar la partida?"))return;
    const button=$("paGenerate");button.disabled=true;
    const count=Math.max(4,Math.min(15,Number($("paCount").value)||10));
    const answer=await GameWords.prepare("papelito",count);
    reset(answer.items);
    if(answer.offline)$("paStatus").textContent="Se utilizaron los papelitos incluidos.";
    button.disabled=false;
  });
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&timer)tick();});
  draw();
})();
