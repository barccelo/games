(() => {
  const $ = id => document.getElementById(id);
  let word = "";
  let shown=new Set([0]);
  let autoCompleted=false;
  let resumeOnUndo=false;
  let blocked = 0;
  let elapsed = 0;
  let started = 0;
  let timer = null;
  let finished = false;
  let peeking = false;
  let peekTimeout = null;
  const previewDuration = 2500;

  function syncEye() {
    const eye=$("contactEye");
    eye.setAttribute("aria-pressed",String(peeking));
    eye.setAttribute("aria-label",peeking?"Ocultar palabra":"Ver palabra brevemente");
    eye.title=peeking?"Ocultar palabra":"Mostrar palabra brevemente";
  }
  function clearPeek() {
    if(peekTimeout!==null)clearTimeout(peekTimeout);
    peekTimeout=null;
    peeking=false;
    syncEye();
  }


  const format = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  };
  const seconds = () => Math.floor((elapsed + (timer ? Date.now()-started : 0))/1000);
  const updateClock = () => { $("contactClock").textContent=format(seconds()); };
  const pause = () => {
    if (timer) {
      elapsed += Date.now()-started;
      clearInterval(timer);
      timer = null;
    }
    updateClock();
  };
  const resume = () => {
    if (timer || finished || !word) return;
    started = Date.now();
    timer = setInterval(updateClock,250);
  };
  function draw() {
    const letters=$("contactLetters");
    letters.replaceChildren();
    const chars=[...word];
    const pending=chars.findIndex((_,i)=>!shown.has(i));
    for(const [i,char] of chars.entries()){
      const isShown=shown.has(i);
      const isNext=i===pending&&!finished;
      const canHide=isShown&&i>0&&(!finished||autoCompleted);
      const box=document.createElement(canHide||isNext?"button":"span");
      box.textContent=isShown||peeking?char:"·";
      if(canHide||isNext){
        box.type="button";
        box.className=isShown?"letter-revealed":"letter-next";
        box.title=isShown?"Ocultar esta letra":"Revelar siguiente letra";
        box.setAttribute("aria-label",isShown?"Ocultar letra "+(i+1):"Revelar letra "+(i+1));
        box.addEventListener("click",()=>toggleLetter(i));
      }else{
        box.setAttribute("aria-label",isShown?char:"Letra oculta");
      }
      if(peeking&&!isShown)box.classList.add("letter-peek");
      letters.append(box);
    }
    $("contactProgress").textContent=finished&&autoCompleted?"¡Partida completada!":shown.size+" de "+chars.length+" letras";
    $("contactProgress").classList.toggle("contact-complete",finished&&autoCompleted);
    $("contactBlocked").textContent=blocked;
    $("contactReveal").disabled=finished || shown.size>=[...word].length;
    $("contactBlock").disabled=finished;
    $("contactWon").disabled=finished;
    const paused=!timer;
    $("contactClockToggle").disabled=finished;
    $("contactClockToggle").setAttribute("aria-label",paused?"Reanudar reloj":"Pausar reloj");
    $("contactClockToggle").setAttribute("aria-pressed",String(paused));
    $("contactClockHint").textContent=paused?"En pausa · toca para reanudar":"Toca para pausar";
    $("contactClockReset").disabled=finished;
    $("contactUndoBlock").disabled=finished||blocked===0;
    updateClock();
  }

  $("secretEye").addEventListener("click",()=>{
    const input=$("secret");
    const showing=input.type==="text";
    input.type=showing?"password":"text";
    $("secretEye").setAttribute("aria-pressed",String(!showing));
    $("secretEye").setAttribute("aria-label",showing?"Mostrar palabra mientras se escribe":"Ocultar palabra mientras se escribe");
    input.focus();
  });
  $("contactForm").addEventListener("submit",event=>{
    event.preventDefault();
    const value=$("secret").value.trim().normalize("NFC").toLocaleUpperCase("es");
    if(!/^[A-ZÁÉÍÓÚÜÑ]{2,35}$/u.test(value)){
      $("secretHelp").textContent="Introduce una sola palabra de 2 a 35 letras.";
      return;
    }
    pause();
    clearPeek();
    word=value;
    shown=new Set([0]);
    autoCompleted=false;
    resumeOnUndo=false;
    blocked=0;
    elapsed=0;
    finished=false;
    $("secret").value="";
    $("secret").type="password";
    $("secretEye").setAttribute("aria-pressed","false");
    $("contactStatus").textContent="Revela una letra por cada contacto válido. Toca alrededor de la palabra para sumar un bloqueo.";
    $("contactSummary").hidden=true;
    $("contactSetup").hidden=true;
    $("contactPlay").hidden=false;
    $("contactSettings").open=false;
    resume();
    draw();
  });
  $("contactEye").addEventListener("click",()=>{
    if(finished||!word)return;
    if(peeking){
      clearPeek();
      draw();
      return;
    }
    peeking=true;
    syncEye();
    draw();
    peekTimeout=setTimeout(()=>{
      clearPeek();
      draw();
    },previewDuration);
  });
  function updateCompletion() {
    if(shown.size===[...word].length){
      resumeOnUndo=Boolean(timer);
      pause();
      finished=true;
      autoCompleted=true;
      clearPeek();
      $("contactResult").textContent="Duración: "+format(seconds())+" · Contactos bloqueados: "+blocked+". Palabra: "+word+".";
      $("contactSummary").hidden=false;
      $("contactStatus").textContent="¡Partida completada! Toca una letra para corregir una revelación accidental.";
    }else{
      $("contactStatus").textContent="Contacto válido. Se reveló una letra.";
    }
    draw();
  }
  function toggleLetter(index) {
    const isShown=shown.has(index);
    if(index===0||(!isShown&&finished)||finished&&!autoCompleted)return;
    clearPeek();
    if(isShown){
      shown.delete(index);
      if(autoCompleted){
        finished=false;
        autoCompleted=false;
        $("contactSummary").hidden=true;
        if(resumeOnUndo)resume();
        resumeOnUndo=false;
      }
      $("contactStatus").textContent="Letra ocultada. La partida continúa.";
      draw();
      return;
    }
    const next=[...word].findIndex((_,i)=>!shown.has(i));
    if(index!==next)return;
    shown.add(index);
    updateCompletion();
  }
  function revealNext() {
    if(finished)return;
    const next=[...word].findIndex((_,i)=>!shown.has(i));
    if(next!==-1)toggleLetter(next);
  }
  $("contactReveal").addEventListener("click",revealNext);
  function addBlocked() {
    if(finished||!word)return;
    blocked++;
    $("contactStatus").textContent="Contacto bloqueado registrado.";
    draw();
  }
  $("contactBlock").addEventListener("click",addBlocked);
  const touchZone=$("contactTouchZone");
  touchZone.addEventListener("click",event=>{
    if(event.target.closest("#contactLetters"))return;
    addBlocked();
  });
  touchZone.addEventListener("keydown",event=>{
    if(event.target!==touchZone||!["Enter"," "].includes(event.key))return;
    event.preventDefault();
    addBlocked();
  });
  $("contactUndoBlock").addEventListener("click",()=>{
    if(finished||!blocked)return;
    blocked--;
    $("contactStatus").textContent="Se deshizo el último bloqueo.";
    draw();
  });
  $("contactClockToggle").addEventListener("click",()=>{
    if(finished||!word)return;
    if(timer)pause();else resume();
    draw();
  });
  $("contactClockReset").addEventListener("click",()=>{
    if(finished||!word)return;
    if(!confirm("¿Reiniciar el reloj a 00:00? Las letras y los bloqueos no cambiarán."))return;
    const wasRunning=Boolean(timer);
    pause();
    elapsed=0;
    started=0;
    if(wasRunning)resume();
    $("contactStatus").textContent="Reloj reiniciado. La partida continúa.";
    draw();
  });
  $("contactWon").addEventListener("click",()=>{
    if(finished)return;
    pause();
    clearPeek();
    finished=true;
    autoCompleted=false;
    shown=new Set([...word].map((_,i)=>i));
    exitFull();
    $("contactResult").textContent="Duración: "+format(seconds())+" · Contactos bloqueados: "+blocked+". Palabra: "+word+".";
    $("contactSummary").hidden=false;
    $("contactStatus").textContent="Partida terminada.";
    draw();
  });
  const stage=$("contactStage");
  const fullButton=$("contactFullscreen");
  const isFull=()=>Boolean(document.fullscreenElement)||document.body.classList.contains("contact-presenting");
  const updateFull=()=>{
    const label=isFull()?"Salir de pantalla completa":"Entrar en pantalla completa";
    fullButton.setAttribute("aria-label",label);
    fullButton.title=label;
  };
  const exitFull=()=>{
    document.body.classList.remove("contact-presenting");
    if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
    try{screen.orientation?.unlock?.()}catch{}
    updateFull();
  };
  fullButton.addEventListener("click",async()=>{
    if(isFull()){exitFull();return;}
    document.body.classList.add("contact-presenting");
    updateFull();
    try{await stage.requestFullscreen?.({navigationUI:"hide"});}catch{}
    try{await screen.orientation?.lock?.("landscape");}catch{}
  });
  document.addEventListener("fullscreenchange",()=>{
    if(!document.fullscreenElement)document.body.classList.remove("contact-presenting");
    updateFull();
  });
  $("contactReset").addEventListener("click",()=>{exitFull();
    pause();
    clearPeek();
    word="";
    shown=new Set([0]);
    elapsed=0;
    finished=false;
    autoCompleted=false;
    resumeOnUndo=false;
    $("contactPlay").hidden=true;
    $("contactSetup").hidden=false;
    $("secretHelp").textContent="De 2 a 35 letras, sin espacios.";
    $("secret").focus();
  });
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden&&peeking){clearPeek();draw();}
    else if(!document.hidden)updateClock();
  });
})();
