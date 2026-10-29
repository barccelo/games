(() => {
  const $ = id => document.getElementById(id);
  let word = "";
  let revealed = 1;
  let blocked = 0;
  let elapsed = 0;
  let started = 0;
  let timer = null;
  let finished = false;

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
    for (const [i,char] of [...word].entries()) {
      const box=document.createElement("span");
      box.textContent=i<revealed?char:"·";
      box.setAttribute("aria-label",i<revealed?char:"Letra oculta");
      letters.append(box);
    }
    $("contactProgress").textContent=revealed+" de "+[...word].length+" letras";
    $("contactBlocked").textContent=blocked;
    $("contactReveal").disabled=finished || revealed>=[...word].length;
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
    word=value;
    revealed=1;
    blocked=0;
    elapsed=0;
    finished=false;
    $("secret").value="";
    $("secret").type="password";
    $("secretEye").setAttribute("aria-pressed","false");
    $("contactSecret").textContent=word;
    $("contactSecret").hidden=true;
    $("contactEye").setAttribute("aria-pressed","false");
    $("contactEye").setAttribute("aria-label","Mostrar palabra secreta");
    $("contactEyeLabel").textContent="Ver palabra";
    $("contactStatus").textContent="Revela una letra por cada contacto válido. Toca alrededor de la palabra para sumar un bloqueo.";
    $("contactSummary").hidden=true;
    $("contactSetup").hidden=true;
    $("contactPlay").hidden=false;
    $("contactSettings").open=false;
    resume();
    draw();
  });
  $("contactEye").addEventListener("click",()=>{
    const element=$("contactSecret");
    element.hidden=!element.hidden;
    const visible=!element.hidden;
    $("contactEye").setAttribute("aria-pressed",String(visible));
    $("contactEye").setAttribute("aria-label",visible?"Ocultar palabra secreta":"Mostrar palabra secreta");
    $("contactEyeLabel").textContent=visible?"Ocultar palabra":"Ver palabra";
  });
  $("contactReveal").addEventListener("click",()=>{
    if(finished)return;
    revealed=Math.min(revealed+1,[...word].length);
    $("contactStatus").textContent="Contacto válido. Se reveló una letra.";
    draw();
  });
  function addBlocked() {
    if(finished||!word)return;
    blocked++;
    $("contactStatus").textContent="Contacto bloqueado registrado.";
    draw();
  }
  $("contactBlock").addEventListener("click",addBlocked);
  const touchZone=$("contactTouchZone");
  touchZone.addEventListener("click",event=>{
    if(event.target.closest("#contactLetters, #contactSecret"))return;
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
    finished=true;
    exitFull();
    revealed=[...word].length;
    $("contactSecret").hidden=true;
    $("contactEyeLabel").textContent="Ver palabra";
    $("contactEye").setAttribute("aria-pressed","false");
    $("contactResult").textContent="Duración: "+format(seconds())+" · Contactos bloqueados: "+blocked+". Palabra: "+word+".";
    $("contactSummary").hidden=false;
    $("contactStatus").textContent="Partida terminada.";
    draw();
  });
  const stage=$("contactStage");
  const fullButton=$("contactFullscreen");
  const fullText=$("contactFullscreenLabel");
  const isFull=()=>Boolean(document.fullscreenElement)||document.body.classList.contains("contact-presenting");
  const updateFull=()=>{
    fullText.textContent=isFull()?"Salir de pantalla completa":"Pantalla completa";
    fullButton.setAttribute("aria-label",fullText.textContent);
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
    word="";
    elapsed=0;
    finished=false;
    $("contactPlay").hidden=true;
    $("contactSetup").hidden=false;
    $("secretHelp").textContent="De 2 a 35 letras, sin espacios.";
    $("secret").focus();
  });
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)updateClock();});
})();
