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
    $("contactPause").disabled=finished;
    $("contactPause").textContent=timer?"Pausar reloj":"Reanudar reloj";
    updateClock();
  }

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
    $("contactSecret").textContent=word;
    $("contactSecret").hidden=true;
    $("contactEye").setAttribute("aria-pressed","false");
    $("contactEye").setAttribute("aria-label","Mostrar palabra secreta");
    $("contactEyeLabel").textContent="Ver palabra";
    $("contactStatus").textContent="Revela una letra por cada contacto válido.";
    $("contactSummary").hidden=true;
    $("contactSetup").hidden=true;
    $("contactPlay").hidden=false;
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
  $("contactBlock").addEventListener("click",()=>{
    if(finished)return;
    blocked++;
    $("contactStatus").textContent="Contacto bloqueado registrado.";
    draw();
  });
  $("contactPause").addEventListener("click",()=>{
    if(timer)pause();else resume();
    draw();
  });
  $("contactWon").addEventListener("click",()=>{
    if(finished)return;
    pause();
    finished=true;
    revealed=[...word].length;
    $("contactSecret").hidden=true;
    $("contactEyeLabel").textContent="Ver palabra";
    $("contactEye").setAttribute("aria-pressed","false");
    $("contactResult").textContent="Duración: "+format(seconds())+" · Contactos bloqueados: "+blocked+". Palabra: "+word+".";
    $("contactSummary").hidden=false;
    $("contactStatus").textContent="Partida terminada.";
    draw();
  });
  $("contactReset").addEventListener("click",()=>{
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
