(() => {
  const kind = document.body.dataset.duel;
  const first = document.getElementById("first");
  const second = document.getElementById("second");
  const examples = ["CASA","LIBRO","RELOJ","MESA","TREN","CARACOL","ÁRBOL","NUBE","LIMÓN","HELADO","GATO","ESCUELA","PAPEL","FLOR","PLATO","LÁPIZ","SOL","OVEJA","TIGRE","BICICLETA","ZAPATO","JARDÍN"];
  const pick = n => Math.floor(Math.random() * n);
  let previous = "";
  function next() {
    let a,b,key;
    do {
      if(kind === "letras"){
        const word = examples[pick(examples.length)];
        a=word[0];b=word[word.length-1];
      } else {
        a=pick(99)+1;b=pick(99)+1;
      }
      key=a+":"+b;
    } while(key===previous);
    previous=key;
    first.textContent=a;second.textContent=b;
    const sum=document.getElementById("sum");
    if(sum)sum.textContent="";
  }
  document.getElementById("newPair").addEventListener("click",next);
  document.getElementById("showSum")?.addEventListener("click",()=>{
    document.getElementById("sum").textContent=Number(first.textContent)+Number(second.textContent);
  });
  next();
})();
