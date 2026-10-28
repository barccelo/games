(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const game = document.body.dataset.game;
  const get = (key, fallback) => {
    try { const data = sessionStorage.getItem("games-v2-"+key); return data===null ? fallback : JSON.parse(data); }
    catch (_) { return fallback; }
  };
  const set = (key, value) => { try { sessionStorage.setItem("games-v2-"+key,JSON.stringify(value)); } catch (_) {} };
  const announce = (id, text) => { if($(id)) $(id).textContent=text; };
  const name = (input,fallback) => ($(input).value.trim() || fallback);

  if(game === "contacto") {
    let secret = "", revealed = 1, timer = null;
    const stopCount = () => { if(timer!==null) clearInterval(timer); timer=null; };
    const redraw = () => {
      const container = $("contactLetters");
      const letters = Array.from(secret);
      container.replaceChildren();
      if(!letters.length) {
        for(let i=0;i<4;i++){const s=document.createElement("span");s.textContent="?";container.append(s);}
      } else {
        letters.forEach((letter,i) => {
          const s = document.createElement("span");
          s.textContent = i<revealed ? letter : "·";
          s.setAttribute("aria-label",i<revealed?letter:"letra oculta");
          container.append(s);
        });
      }
      const active=letters.length>0;
      announce("contactProgress",active ? revealed+" de "+letters.length+" letras" : "Sin palabra preparada");
      for(const id of ["contactCount","contactBlock","contactWon","contactReset"]) $(id).disabled=!active;
      $("contactReveal").disabled=!active||revealed>=letters.length;
    };
    $("contactForm").addEventListener("submit", e => {
      e.preventDefault();
      const value=$("secret").value.trim().normalize("NFC").toLocaleUpperCase("es");
      if(!/^[A-ZÁÉÍÓÚÜÑ]{2,35}$/u.test(value)) {
        announce("secretHelp","Introduce una sola palabra de 2 a 35 letras, sin espacios, números ni símbolos.");
        return;
      }
      stopCount(); secret=value; revealed=1; $("secret").value="";
      announce("secretHelp","Palabra guardada temporalmente. No se muestra completa en la pantalla.");
      announce("contactStatus","Palabra preparada. Los jugadores pueden comenzar a dar pistas.");
      redraw();
    });
    $("contactCount").addEventListener("click", () => {
      stopCount(); let n=3;
      announce("contactStatus","¡Contacto! "+n);
      timer=setInterval(() => {
        n--;
        if(n===0){stopCount();announce("contactStatus","¡Digan la palabra simultáneamente!");}
        else announce("contactStatus","¡Contacto! "+n);
      },1000);
    });
    $("contactReveal").addEventListener("click", () => {
      stopCount(); revealed=Math.min(Array.from(secret).length,revealed+1);
      announce("contactStatus",revealed>=Array.from(secret).length ? "Todas las letras están visibles. La palabra puede adivinarse." : "Contacto válido. Se reveló una letra.");
      redraw();
    });
    $("contactBlock").addEventListener("click", () => {stopCount(); announce("contactStatus","Contacto bloqueado. No se revela ninguna letra.");});
    $("contactWon").addEventListener("click", () => {stopCount();revealed=Array.from(secret).length;redraw();announce("contactStatus","¡Palabra adivinada! El ganador se convierte en Guardián.");});
    $("contactReset").addEventListener("click", () => {stopCount();secret="";revealed=1;redraw();announce("contactStatus","Introduce una nueva palabra para empezar.");$("secret").focus();});
    redraw();
  }

  if(game === "charadas") {
    const initial={scores:[0,0],turn:0,round:1,remaining:60,duration:60,names:["Equipo A","Equipo B"]};
    let st=get("charadas",initial);
    if(!st||!Array.isArray(st.scores)||st.scores.length!==2) st=initial;
    st={...initial,...st,remaining:Number(st.remaining)||60};
    let timer=null, endAt=0;
    const duration=()=>Math.max(10,Math.min(600,Math.floor(Number($("chDuration").value)||60)));
    const persist=()=>set("charadas",st);
    const render=()=> {
      for(let i=0;i<2;i++){
        announce("chName"+i,st.names[i]);
        announce("chScore"+i,st.scores[i]);
        $("chBox"+i).classList.toggle("active",i===st.turn);
      }
      announce("chTurn","Turno de "+st.names[st.turn]);
      announce("chRound","Turno "+st.round);
      announce("chClock",Math.floor(st.remaining/60)+":"+String(st.remaining%60).padStart(2,"0"));
      $("chStart").disabled=timer!==null||st.remaining<=0;
      $("chPause").disabled=timer===null;
    };
    const stop=()=> {
      if(timer!==null){clearInterval(timer);timer=null;}
      persist();render();
    };
    const tick=()=> {
      st.remaining=Math.max(0,Math.ceil((endAt-Date.now())/1000));
      if(st.remaining===0) {stop();announce("chStatus","Tiempo agotado. Registra los aciertos y pasa al siguiente turno.");}
      else render();
    };
    $("chStart").addEventListener("click",()=> {
      if(timer!==null||st.remaining<=0)return;
      endAt=Date.now()+st.remaining*1000;
      timer=setInterval(tick,180);
      announce("chStatus","Cronómetro en marcha.");
      render();
    });
    $("chPause").addEventListener("click",()=> {
      if(timer===null)return;
      st.remaining=Math.max(0,Math.ceil((endAt-Date.now())/1000));
      stop();announce("chStatus","Cronómetro pausado.");
    });
    $("chNext").addEventListener("click",()=> {
      stop();st.turn=1-st.turn;st.round++;st.duration=duration();st.remaining=st.duration;
      persist();render();announce("chStatus","Turno preparado. Pulsa Iniciar.");
    });
    $("chReset").addEventListener("click",()=> {
      if(!confirm("¿Reiniciar todos los aciertos y los turnos?"))return;
      stop();st={...initial,duration:duration(),remaining:duration(),names:st.names.slice()};
      persist();render();announce("chStatus","Nueva partida preparada.");
    });
    $("chDuration").addEventListener("change",()=> {
      $("chDuration").value=String(duration());
      if(timer===null && st.round===1 && st.scores.every(v=>v===0)){
        st.duration=duration();st.remaining=st.duration;persist();render();
      }
    });
    ["chA","chB"].forEach((id,i)=>$(id).addEventListener("input",()=> {
      st.names[i]=name(id,"Equipo "+(i?"B":"A"));persist();render();
    }));
    document.querySelectorAll('[data-score^="ch:"]').forEach(b=>b.addEventListener("click",()=>{
      const [,num,delta]=b.dataset.score.split(":");
      const i=Number(num);
      st.scores[i]=Math.max(0,st.scores[i]+Number(delta));
      persist();render();
    }));
    ["chA","chB"].forEach((id,i)=>{$(id).value=st.names[i]});
    $("chDuration").value=String(st.duration);
    window.addEventListener("pagehide",()=> {
      if(timer!==null) st.remaining=Math.max(0,Math.ceil((endAt-Date.now())/1000));
      persist();
    });
    render();
  }

  if(game === "clave") {
    const initial={scores:[0,0],turn:0,round:1,points:6,moon:false,rivalMoon:false,names:["Equipo A","Equipo B"]};
    let st=get("clave",initial);
    if(!st||!Array.isArray(st.scores)||st.scores.length!==2) st=initial;
    st={...initial,...st};
    const history=[];
    const snap=()=>{history.push(JSON.stringify(st));if(history.length>50)history.shift();};
    const persist=()=>set("clave",st);
    const render=()=> {
      for(let i=0;i<2;i++){
        announce("clName"+i,st.names[i]);announce("clScore"+i,st.scores[i]);
        $("clBox"+i).classList.toggle("active",i===st.turn);
      }
      announce("clTurn","Turno de "+st.names[st.turn]);
      announce("clRound","Ronda "+st.round);
      announce("clPoints",st.moon?8:st.points);
      $("clMoon").checked=st.moon;
      $("clMoon").disabled=st.rivalMoon||st.points!==6;
      $("clUndo").disabled=history.length===0;
    };
    const nextRound=()=> {st.round++;st.points=6;st.moon=false;st.rivalMoon=false;};
    $("clMoon").addEventListener("change",()=> {
      snap();st.moon=$("clMoon").checked;persist();render();
      announce("clStatus",st.moon?"Disparar a la Luna: 8 puntos en juego.":"Puntuación normal reactivada.");
    });
    $("clMiss").addEventListener("click",()=> {
      snap();
      if(st.moon&&!st.rivalMoon) {
        st.rivalMoon=true;st.turn=1-st.turn;
        announce("clStatus","Luna fallida: el otro equipo tiene ahora oportunidad de 8 puntos.");
      } else if(st.rivalMoon) {
        st.moon=false;st.rivalMoon=false;st.turn=1-st.turn;st.points=5;
        announce("clStatus","Ambos intentos de Luna fallaron. Continúa la ronda normal con 5 puntos.");
      } else {
        st.points--;st.turn=1-st.turn;
        if(st.points<=0){nextRound();announce("clStatus","No se acertó la palabra. Comienza otra ronda.");}
        else announce("clStatus","Intento fallido. Quedan "+st.points+" puntos.");
      }
      persist();render();
    });
    $("clHit").addEventListener("click",()=> {
      snap();const points=st.moon?8:st.points;
      st.scores[st.turn]+=points;
      const winner=st.names[st.turn];st.turn=1-st.turn;nextRound();
      persist();render();
      announce("clStatus",winner+" acertó y sumó "+points+" puntos.");
    });
    $("clNew").addEventListener("click",()=> {
      snap();nextRound();persist();render();announce("clStatus","Nueva palabra. Valor restablecido a 6 puntos.");
    });
    $("clUndo").addEventListener("click",()=> {
      if(!history.length)return;
      st=JSON.parse(history.pop());persist();render();announce("clStatus","Última acción deshecha.");
    });
    $("clReset").addEventListener("click",()=> {
      if(!confirm("¿Reiniciar toda la puntuación de La clave es?"))return;
      st={...initial,names:st.names.slice()};history.length=0;
      persist();render();announce("clStatus","Partida reiniciada.");
    });
    document.querySelectorAll('[data-score^="cl:"]').forEach(b=>b.addEventListener("click",()=>{
      const [,num,delta]=b.dataset.score.split(":");
      snap();const i=Number(num);
      st.scores[i]=Math.max(0,st.scores[i]+Number(delta));persist();render();
      announce("clStatus","Puntuación ajustada manualmente.");
    }));
    ["clA","clB"].forEach((id,i)=>{
      $(id).value=st.names[i];
      $(id).addEventListener("input",()=>{st.names[i]=name(id,"Equipo "+(i?"B":"A"));persist();render()});
    });
    render();
  }
})();