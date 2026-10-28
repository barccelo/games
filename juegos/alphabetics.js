(() => {
  const $ = id => document.getElementById(id);
  const letters = [..."ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"];
  const bank = {
    A:["ÁRBOL","AVIÓN","ABRAZO"], B:["BARCO","BICICLETA","BIBLIOTECA"],
    C:["CASA","CONEJO","CAMINO"], D:["DADO","DELFÍN","DIAMANTE"],
    E:["ELEFANTE","ESPEJO","ESTRELLA"], F:["FARO","FIESTA","FLOR"],
    G:["GATO","GUITARRA","GLOBO"], H:["HELADO","HOSPITAL","HORMIGA"],
    I:["IGLESIA","ISLA","IMÁN"], J:["JARDÍN","JIRAFA","JABÓN"],
    K:["KOALA","KARATE","KIWI"], L:["LUNA","LIBRO","LIMÓN"],
    M:["MESA","MONTAÑA","MARIPOSA"], N:["NUBE","NARANJA","NIDO"],
    Ñ:["ÑANDÚ","ÑOQUI","ÑAME"], O:["OCÉANO","OSO","OVEJA"],
    P:["PERRO","PUENTE","PARAGUAS"], Q:["QUESO","QUÍMICA","QUINCE"],
    R:["RÍO","RELOJ","RATÓN"], S:["SOL","SOMBRERO","SERPIENTE"],
    T:["TREN","TORTUGA","TELÉFONO"], U:["UVA","UNIVERSO","UNICORNIO"],
    V:["VIENTO","VENTANA","VOLCÁN"], W:["WIFI","WEB","WESTERN"],
    X:["XILÓFONO","XENÓN","XILOGRAFÍA"], Y:["YATE","YOGUR","YEMA"],
    Z:["ZAPATO","ZORRO","ZANAHORIA"]
  };
  let start=0, items=[], index=0, correct=0, phase=1, time=30, lastScrolled=-1;
  let timer=null, deadline=0, finished=false;
  const first = word => {
    const ch=word.trim().charAt(0).toLocaleUpperCase("es");
    return ch==="Ñ"?"Ñ":ch.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  };
  const clock = n => "00:"+String(Math.max(0,n)).padStart(2,"0");
  const current = () => items[index];
  const status = str => { $("abStatus").textContent=str; };
  function chooseStart() {
    const selection=$("abStartMode").value;
    return selection==="A"?0:Math.floor(Math.random()*letters.length);
  }
  function local(startAt) {
    return Array.from({length:10},(_,i)=>{
      const letter=letters[(startAt+i)%letters.length];
      const options=bank[letter];
      return {letter,word:options[Math.floor(Math.random()*options.length)],status:"pending"};
    });
  }
  function stop() {
    if(timer){ time=Math.max(0,Math.ceil((deadline-Date.now())/1000));clearInterval(timer);timer=null; }
  }
  function editGrid() {
    const editor=$("abEditor");editor.replaceChildren();
    items.forEach((item,i)=>{
      const label=document.createElement("label");
      label.className="ab-edit-item";
      const letter=document.createElement("span");letter.textContent=item.letter;
      const input=document.createElement("input");input.value=item.word;input.dataset.slot=i;
      input.maxLength=70;input.autocomplete="off";input.setAttribute("aria-label","Palabra con "+item.letter);
      label.append(letter,input);editor.append(label);
    });
  }
  function draw() {
    const track=$("abTrack");track.replaceChildren();
    items.forEach((item,i)=>{
      const btn=document.createElement("button");
      btn.type="button";btn.className="ab-cell "+item.status+(i===index?" active":"");
      btn.textContent=item.letter;btn.setAttribute("aria-label",item.letter+": "+(item.status==="correct"?"acertada":item.status==="passed"?"pasada":"pendiente"));
      btn.setAttribute("aria-current",i===index?"true":"false");
      btn.addEventListener("click",()=>{
        if(!finished&&items[i].status!=="correct"){index=i;draw();}
      });
      track.append(btn);
    });
    $("abWord").textContent=finished?"Partida terminada":current()?.word||"";
    $("abTime").textContent=clock(time);
    $("abCount").textContent=correct+" de 10 aciertos";
    $("abPhase").textContent=finished?"Partida finalizada":phase===1?"Primera mitad · 30 segundos":"Segunda mitad · 30 segundos";
    const playable=!finished&&Boolean(current());
    $("abHit").disabled=!playable;
    $("abPass").disabled=!playable;
    $("abReplace").disabled=!playable;
    $("abStart").disabled=Boolean(timer)||!playable||time===0;
    $("abPause").disabled=!timer;
    if(lastScrolled!==index){
      const wrapper=track.parentElement,cell=track.children[index];
      if(cell)wrapper.scrollLeft=Math.max(0,cell.offsetLeft-wrapper.clientWidth/2+cell.clientWidth/2);
      lastScrolled=index;
    }
  }
  function next() {
    if(items.every(item=>item.status==="correct")){stop();finished=true;status("¡Diez palabras acertadas!");draw();return;}
    for(let offset=1;offset<=items.length;offset++){
      const pos=(index+offset)%items.length;
      if(items[pos].status!=="correct"){index=pos;break;}
    }
    draw();
  }
  function tick(){
    time=Math.max(0,Math.ceil((deadline-Date.now())/1000));
    if(!time){
      stop();
      if(phase===1){phase=2;time=30;$("abStart").textContent="Iniciar segunda mitad";status("Cambia de adivinador para los últimos 30 segundos.");}
      else {finished=true;status("Tiempo agotado: "+correct+" de 10 aciertos.");}
    }
    draw();
  }
  function setRound(startAt,words){
    stop();start=startAt;
    items=words.map(item=>({...item,status:"pending"}));
    index=0;correct=0;phase=1;time=30;finished=false;lastScrolled=-1;
    $("abStart").textContent="Iniciar 30 segundos";
    editGrid();draw();
    status("Recorrido listo: "+items[0].letter+" a "+items[9].letter+".");
  }
  $("abStart").addEventListener("click",()=>{
    if(timer||finished||!time)return;
    deadline=Date.now()+time*1000;timer=setInterval(tick,180);draw();
  });
  $("abPause").addEventListener("click",()=>{stop();draw();status("Reloj pausado.");});
  $("abHit").addEventListener("click",()=>{
    if(finished)return;
    current().status="correct";correct++;next();
  });
  $("abPass").addEventListener("click",()=>{
    if(finished)return;
    current().status="passed";next();
  });
  $("abReplace").addEventListener("click",()=>{
    const item=current();if(!item||finished)return;
    const alternative=bank[item.letter].find(w=>w!==item.word);
    if(alternative){item.word=alternative;editGrid();draw();status("Palabra sustituida por otra con "+item.letter+".");}
    else {
      $("abOptions").open=true;
      status("Escribe una nueva palabra con "+item.letter+" en la preparación.");
    }
  });
  $("abLocal").addEventListener("click",()=>(()=>{const initial=chooseStart();setRound(initial,local(initial));})());
  $("abSave").addEventListener("click",()=>{
    const values=[...$("abEditor").querySelectorAll("input")].map(input=>input.value.trim().toLocaleUpperCase("es"));
    for(let i=0;i<10;i++){
      if(!values[i]||first(values[i])!==items[i].letter){
        status("La palabra "+(i+1)+" debe empezar por "+items[i].letter+".");
        $("abEditor").querySelectorAll("input")[i].focus();return;
      }
    }
    setRound(start,items.map((item,i)=>({...item,word:values[i]})));
    $("abOptions").open=false;
    status("Tus diez palabras se guardaron para esta partida.");
  });
  $("abGenerate").addEventListener("click",async()=>{
    const btn=$("abGenerate");btn.disabled=true;
    const begin=chooseStart(),base=local(begin);
    status("Generando palabras…");
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),25000);
    try {
      const response=await fetch("https://games-gemini.mbckp-at.workers.dev",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({mode:"alphabetics",count:10,level:$("abLevel").value,
          category:"Diez palabras consecutivas empezando por "+base[0].letter+"; orden: "+base.map(x=>x.letter).join(", ") }),signal:controller.signal});
      const data=await response.json();
      if(response.ok&&Array.isArray(data.items)){
        for(const item of base){
          const match=data.items.find(x=>x&&typeof x.word==="string"&&first(x.word)===item.letter);
          if(match)item.word=match.word.trim().toLocaleUpperCase("es");
        }
      }
    }catch{}finally{clearTimeout(timeout);btn.disabled=false;}
    setRound(begin,base);
    status("Palabras preparadas. Puedes editarlas antes de jugar.");
  });
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&timer)tick();});
  const initial=chooseStart();
  setRound(initial,local(initial));
})();
