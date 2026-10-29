(() => {
  const svg = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg>';
  document.querySelectorAll(".back").forEach(back => {
    back.textContent = "";
    back.insertAdjacentHTML("afterbegin",svg);
    back.append(document.createTextNode("Games"));
  });
  document.querySelectorAll("[data-settings-target]").forEach(button => {
    const panel = document.getElementById(button.dataset.settingsTarget);
    if (!panel) return;
    const sync = () => button.setAttribute("aria-expanded",String(panel.open || !panel.hidden && panel.tagName!=="DETAILS"));
    button.addEventListener("click",() => {
      if(panel.tagName==="DETAILS"){
        panel.open = !panel.open;
        if(panel.open) panel.scrollIntoView({behavior:"smooth",block:"start"});
      } else if(panel.hidden){
        document.getElementById("paEdit")?.click();
      } else {
        panel.scrollIntoView({behavior:"smooth",block:"start"});
      }
      sync();
    });
    panel.addEventListener("toggle",sync);
    sync();
  });
  const reload = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7M3 3v5h5"/></svg>';
  document.querySelectorAll('[data-icon="rotate-ccw"]').forEach(el=>el.innerHTML=reload);
})();
