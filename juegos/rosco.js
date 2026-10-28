(() => {
  const $=id=>document.getElementById(id);
  const alphabet=[..."ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"];
  const defaults=[{"word":"ÁRBOL","clue":"Planta de tronco leñoso"},{"word":"BARCO","clue":"Medio de transporte que navega"},{"word":"CASA","clue":"Edificio destinado a vivienda"},{"word":"DADO","clue":"Cubo usado en juegos de azar"},{"word":"ELEFANTE","clue":"Mamífero terrestre de gran tamaño"},{"word":"FARO","clue":"Torre que emite luz de señalización"},{"word":"GATO","clue":"Felino doméstico"},{"word":"HELADO","clue":"Postre frío y dulce"},{"word":"IGLESIA","clue":"Templo cristiano"},{"word":"JARDÍN","clue":"Espacio cultivado con plantas"},{"word":"KOALA","clue":"Marsupial australiano"},{"word":"LUNA","clue":"Satélite natural de la Tierra"},{"word":"MONTAÑA","clue":"Gran elevación natural del terreno"},{"word":"NUBE","clue":"Masa visible de gotas de agua"},{"word":"ÑANDÚ","clue":"Ave sudamericana grande que no vuela"},{"word":"OCÉANO","clue":"Gran extensión de agua salada"},{"word":"PUENTE","clue":"Construcción para cruzar un obstáculo"},{"word":"QUESO","clue":"Alimento elaborado con leche"},{"word":"RÍO","clue":"Corriente natural de agua"},{"word":"SOL","clue":"Estrella central del sistema solar"},{"word":"TREN","clue":"Transporte ferroviario"},{"word":"UVA","clue":"Fruto de la vid"},{"word":"VIENTO","clue":"Aire en movimiento"},{"word":"WIFI","clue":"Tecnología de red inalámbrica"},{"word":"XILÓFONO","clue":"Instrumento de percusión con láminas"},{"word":"YATE","clue":"Embarcación recreativa"},{"word":"ZAPATO","clue":"Calzado que cubre el pie"}];
  let entries=defaults.map(item=>({...item})),index=0,shown=false;
  const initial=word=>{
    const first=word.trim().charAt(0).toLocaleUpperCase("es");
    return first==="Ñ"?"Ñ":first.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  };
  function draw(){
    const item=entries[index];
    $("roIndex").textContent="Letra "+alphabet[index]+" · "+(index+1)+" de 27";
    $("roClue").textContent=item.clue;
    $("roCustomWord").value=item.word;
    $("roCustomClue").value=item.clue;
    $("roAnswer").textContent=shown?item.word:"Respuesta oculta";
    $("roReveal").textContent=shown?"Ocultar respuesta":"Mostrar respuesta";
    document.querySelectorAll("[data-letter]").forEach(button=>{
      button.classList.toggle("is-current",Number(button.dataset.letter)===index);
      button.setAttribute("aria-current",Number(button.dataset.letter)===index?"true":"false");
    });
  }
  document.querySelectorAll("[data-letter]").forEach(button=>button.addEventListener("click",()=>{
    index=Number(button.dataset.letter);shown=false;draw();
  }));
  $("roReveal").addEventListener("click",()=>{shown=!shown;draw();});
  $("roNext").addEventListener("click",()=>{index=(index+1)%27;shown=false;draw();});
  $("roGenerate").addEventListener("click",async()=>{
    const button=$("roGenerate");button.disabled=true;
    $("roStatus").textContent="Preparando definiciones…";
    const result=await GameWords.prepare("rosco",27);
    const values=new Map(defaults.map(item=>[initial(item.word),item]));
    for(const item of result.items){
      if(typeof item.word!=="string" || !item.clue)continue;
      const letter=initial(item.word);
      if(alphabet.includes(letter))values.set(letter,{word:item.word,clue:item.clue});
    }
    entries=alphabet.map(letter=>values.get(letter));
    index=0;shown=false;draw();
    $("roStatus").textContent=result.offline?"Se mantienen las definiciones incluidas.":"Rosco preparado. Revisa las definiciones antes de jugar.";
    button.disabled=false;
  });
  $("roSaveCustom").addEventListener("click",()=>{
    const word=$("roCustomWord").value.trim().toLocaleUpperCase("es");
    const clue=$("roCustomClue").value.trim();
    if(!word||!clue||initial(word)!==alphabet[index]){
      $("roStatus").textContent="Escribe una palabra que empiece por "+alphabet[index]+" y una definición.";return;
    }
    entries[index]={word,clue};
    shown=false;draw();
    document.querySelector(".ro-edit").open=false;
    $("roStatus").textContent="Palabra y definición guardadas.";
  });
  $("roCopy").addEventListener("click",async()=>{
    const text=entries.map((item,i)=>alphabet[i]+": "+item.word+" — "+item.clue).join("\n");
    try{await navigator.clipboard.writeText(text);$("roStatus").textContent="Rosco copiado.";}
    catch{$("roStatus").textContent="No fue posible copiar el rosco.";}
  });
  draw();
})();
