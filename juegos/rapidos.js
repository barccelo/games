(() => {
  const $=id=>document.getElementById(id);
  const mode=document.body.dataset.quick;
  const hasTimer=mode!=="cancion";
  let pool=GameWords.local(mode,mode==="stop"?5:mode==="cancion"?100:12);
  let index=0, hits=0, scores=[0,0], previousLetter="",time=mode==="antifaz"?10:60,timer=null,deadline=0;
  const length=()=>mode==="antifaz"?10:mode==="prohibida"?Number($("quickDuration").value):60;
  const format=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
  const notice=s=>{if($("quickStatus"))$("quickStatus").textContent=s;};
  function letter(){
    const alphabet="ABCDEFGHIJKLMNÑOPRSTUV";
    let value;
    do{value=alphabet[Math.floor(Math.random()*alphabet.length)];}while(value===previousLetter);
    previousLetter=value;
    $("stopLetter").textContent=value;
  }
  function render(){
    if(mode==="stop"){
      const list=$("stopCategories");list.replaceChildren();
      for(const item of pool){
        const li=document.createElement("li");li.textContent=item.word;list.append(li);
      }
    }else{
      $("quickWord").textContent=pool[index]?.word||"Prepara la partida";
    }
    if($("quickClock"))$("quickClock").textContent=format(time);
    if($("quickHits"))$("quickHits").textContent=hits;
    if($("quickA")){$("quickA").textContent=scores[0];$("quickB").textContent=scores[1];}
    if($("quickStart"))$("quickStart").disabled=Boolean(timer)||!time;
    if($("quickPause"))$("quickPause").disabled=!timer;
  }
  function pause(){
    if(timer){time=Math.max(0,Math.ceil((deadline-Date.now())/1000));clearInterval(timer);timer=null;}
    render();
  }
  function tick(){
    time=Math.max(0,Math.ceil((deadline-Date.now())/1000));
    if(!time){pause();notice("Tiempo agotado.");}
    else render();
  }
  function next(){
    pause();
    const manual=$("quickManual");
  const manualStatus=$("quickManualStatus");
  const key="games-custom-"+mode;
  try{manual.value=localStorage.getItem(key)||""}catch{}
  $("quickApply").addEventListener("click",()=>{
    const values=[...new Set(manual.value.split(/\r?\n/).map(v=>v.trim()).filter(Boolean))];
    if(!values.length){manualStatus.textContent="Escribe al menos una "+(mode==="stop"||mode==="dobles"?"categoría.":"palabra.");return;}
    try{localStorage.setItem(key,values.join("\n"))}catch{}
    pause();pool=values.map(word=>({word,category:"",clue:""}));index=0;time=length();
    if(mode==="stop")letter();
    render();manualStatus.textContent="Se utilizarán tus "+values.length+" "+(mode==="stop"||mode==="dobles"?"categorías.":"palabras.");
  });
  if(mode==="prohibida"){
    const stage=$("quickStage");
    const close=()=>{
      document.body.classList.remove("presenting");
      if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
    };
    $("quickFull").addEventListener("click",()=>{
      document.body.classList.add("presenting");
      stage.requestFullscreen?.().catch(()=>{});
    });
    $("quickExit").addEventListener("click",event=>{event.stopPropagation();close();});
    stage.addEventListener("click",event=>{
      if(!document.body.classList.contains("presenting")||event.target.closest("#quickExit"))return;
      if(timer)pause();else if(time){deadline=Date.now()+time*1000;timer=setInterval(tick,180);render();}
    });
    document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement)document.body.classList.remove("presenting");});
  }
  if(mode==="stop")letter();
    else{
      index++;
      if(index>=pool.length){
        pool=GameWords.mix(pool);
        index=0;
      }
    }
    time=length();
    render();
  }
  $("quickNext").addEventListener("click",next);
  if(hasTimer){
    $("quickStart").addEventListener("click",()=>{
      if(timer||!time)return;
      deadline=Date.now()+time*1000;
      timer=setInterval(tick,180);
      render();
    });
    $("quickPause").addEventListener("click",pause);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden&&timer)tick();});
  }
  $("quickHit")?.addEventListener("click",()=>{hits++;next();});
  $("quickDuration")?.addEventListener("change",()=>{pause();time=length();render();});
  document.querySelectorAll("[data-quickscore]").forEach(button=>{
    button.addEventListener("click",()=>{
      scores[Number(button.dataset.quickscore)]++;
      render();
    });
  });
  $("chooseTwo")?.addEventListener("click",()=>{$("doubleMode").textContent="Dobles";});
  $("chooseThree")?.addEventListener("click",()=>{$("doubleMode").textContent="Triples";});
  $("quickGenerate").addEventListener("click",async()=>{
    const button=$("quickGenerate");
    button.disabled=true;notice("Preparando la siguiente ronda…");
    const answer=mode==="cancion"?{items:GameWords.local("cancion",100),offline:true}:await GameWords.prepare(mode,mode==="stop"?5:12);
    pause();
    pool=answer.items;
    index=0;time=length();
    render();
    notice(answer.offline?"Se usaron las palabras incluidas.":"Nueva ronda preparada.");
    button.disabled=false;
  });
  if(mode==="stop")letter();
  render();
})();
