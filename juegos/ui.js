(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const get = (key, fallback) => {
    try {
      const value=sessionStorage.getItem("games-v2-"+key);
      return value===null?fallback:JSON.parse(value);
    } catch { return fallback; }
  };
  const set = (key,value) => {
    try { sessionStorage.setItem("games-v2-"+key,JSON.stringify(value)); } catch {}
  };
  const announce = (id,text) => { $(id).textContent=text; };
  const name = (input,fallback) => $(input).value.trim()||fallback;
  if(document.body.dataset.game === "clave") {
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