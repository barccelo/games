(() => {
  const $=id=>document.getElementById(id);
  const letters="ABCDEFGHIJ";
  let words=GameWords.alphabetics(GameWords.local("alphabetics",20));
  let index=0,correct=0,phase=1,remaining=30,timer=null,deadline=0,ended=false;
  const format=time=>"00:"+String(Math.max(0,time)).padStart(2,"0");
  function render(){
    const item=words[index];
    $("abLetter").textContent=item?.letter||"✓";
    $("abWord").textContent=item?.word||"Completado";
    $("abTime").textContent=format(remaining);
    $("abCount").textContent=correct+" de 10 acertadas";
    $("abPhase").textContent=ended?"Fin de la partida":phase===1?"Primera mitad · 30 s":"Segunda mitad · 30 s";
    $("abHit").disabled=ended||!item;
    $("abPass").disabled=ended||!item;
    $("abReplace").disabled=ended||!item;
    $("abStart").disabled=Boolean(timer)||ended||!item;
    $("abPause").disabled=!timer;
  }
  function stop(){
    if(timer){
      remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
      clearInterval(timer);timer=null;
    }
    render();
  }
  function tick(){
    remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
    if(remaining===0){
      stop();
      if(phase===1){phase=2;remaining=30;$("abStatus").textContent="Cambia de adivinador e inicia la segunda mitad."; $("abStart").textContent="Iniciar segunda mitad";}
      else {ended=true;$("abStatus").textContent="Tiempo agotado. "+correct+" aciertos de 10.";}
    }
    render();
  }
  function next(){
    if(index<words.length)index++;
    if(index>=words.length){stop();ended=true;$("abStatus").textContent="Se completaron las diez palabras. "+correct+" aciertos.";}
    render();
  }
  $("abStart").addEventListener("click",()=>{
    if(ended||timer)return;
    deadline=Date.now()+remaining*1000;
    timer=setInterval(tick,180);render();
  });
  $("abPause").addEventListener("click",stop);
  $("abHit").addEventListener("click",()=>{correct++;next();});
  $("abPass").addEventListener("click",next);
  $("abReplace").addEventListener("click",()=>{
    const word=words[index];
    if(!word)return;
    const choices=GameWords.local("alphabetics",20).map(x=>x.word)
      .filter(x=>x.normalize("NFD").replace(/[\u0300-\u036f]/g,"")[0]?.toUpperCase()===word.letter&&x!==word.word);
    if(choices.length)word.word=choices[0];
    else $("abStatus").textContent="No hay otra palabra incluida con esa letra.";
    render();
  });
  function fresh(list){
    stop();words=GameWords.alphabetics(list);index=0;correct=0;phase=1;remaining=30;ended=false;
    $("abStart").textContent="Iniciar 30 segundos";$("abStatus").textContent="Diez palabras preparadas.";
    $("abOptions").open=false;render();
  }
  $("abLocal").addEventListener("click",()=>fresh(GameWords.local("alphabetics",20)));
  $("abGenerate").addEventListener("click",async()=>{
    const button=$("abGenerate");button.disabled=true;
    $("abStatus").textContent="Preparando palabras…";
    const answer=await GameWords.prepare("alphabetics",10,{level:$("abLevel").value});
    fresh(answer.items);
    if(answer.offline)$("abStatus").textContent="Se prepararon las palabras incluidas.";
    button.disabled=false;
  });
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&timer)tick();});
  render();
})();
