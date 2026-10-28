(() => {
  const $=id=>document.getElementById(id);
  let words=GameWords.local("clave",10).map(item=>item.word);
  let position=0,shown=true;
  function render(){
    $("clWord").textContent=shown?words[position]:"••••••";
    $("clToggleWord").textContent=shown?"Ocultar palabra":"Mostrar palabra";
    $("clToggleWord").setAttribute("aria-pressed",String(shown));
  }
  function next(){
    position++;
    if(position>=words.length){words=GameWords.local("clave",10).map(item=>item.word);position=0;}
    shown=true;render();
  }
  $("clToggleWord").addEventListener("click",()=>{shown=!shown;render();});
  $("clLocalWord").addEventListener("click",()=>{
    words=GameWords.local("clave",10).map(item=>item.word);
    position=0;shown=true;render();
    $("clWordStatus").textContent="Claves incluidas preparadas.";
  });
  $("clGenerateWord").addEventListener("click",async()=>{
    const button=$("clGenerateWord");button.disabled=true;
    $("clWordStatus").textContent="Preparando claves…";
    const result=await GameWords.prepare("clave",10);
    words=result.items.map(item=>item.word);
    position=0;shown=true;render();
    $("clWordStatus").textContent=result.offline?"Se usaron claves incluidas.":"Nuevas claves preparadas.";
    button.disabled=false;
  });
  $("clUseManual").addEventListener("click",()=>{
    const custom=$("clManualWord").value.trim().toLocaleUpperCase("es");
    if(!custom){$("clWordStatus").textContent="Escribe una clave antes de aplicarla.";return;}
    words=[custom,...words.filter(w=>w!==custom)];position=0;shown=true;
    render();
    $("clWordStatus").textContent="Clave personalizada preparada.";
    document.querySelector(".clave-manual").open=false;
  });
  ["clHit","clNew"].forEach(id=>$(id).addEventListener("click",next));
  render();
})();
