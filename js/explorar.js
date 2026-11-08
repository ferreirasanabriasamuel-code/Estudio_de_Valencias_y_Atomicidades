/* ============================================================
   explorar.js · tabla de valencias interactiva, casos especiales
   y atomicidades (página sin React: carga inmediata)
   ============================================================ */
'use strict';
(function(){
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  let filtro='todos';

  function chipHTML(it){
    return `<button class="chip" data-s="${esc(it.s)}"><span class="dot ${DOTK[it.kind]}"></span><span class="sym">${esc(it.disp)}</span><span class="nm">${esc(it.n)}</span></button>`;
  }
  function renderTabla(q){
    q=(q||'').trim().toLowerCase();
    const qv=q.replace(/-/g,'−').replace(/\s+/g,'');
    let html='';
    GROUPS.forEach(g=>{
      if(filtro!=='todos'&&g.kind!==filtro) return;
      let list=g.syms.map(s=>BYSYM[s]);
      if(q){
        list=list.filter(it=>{
          const vv=it.v.toLowerCase().replace(/\s+/g,'');
          return it.n.toLowerCase().includes(q)||it.s.toLowerCase()===q||it.disp.toLowerCase().includes(q)||vv.includes(qv)||KIND_LABEL[it.kind].toLowerCase().includes(q);
        });
        if(!list.length) return;
      }
      html+=`<div class="gcard ${CSSK[g.kind]}"><div class="g-in">
        <div class="g-top"><div class="g-main"><div class="g-cat">${esc(g.cat)}</div><div class="els">${list.map(chipHTML).join('')}</div></div>
        <span class="g-val">${esc(g.v)}</span></div>
        ${g.nom?`<div class="g-nom"><span class="tag">Nomenclatura</span> ${esc(g.nom)}${g.ej?`: <b>${esc(g.ej)}</b>`:''}</div>`:''}
        ${g.nota?`<div class="g-nota">${g.nota}</div>`:''}
      </div></div>`;
    });
    document.getElementById('tabla').innerHTML=html||`<div class="note-card">Sin resultados para la búsqueda indicada. Pruebe con otro nombre, símbolo o valencia.</div>`;
  }
  function renderEspeciales(){
    document.getElementById('specials').innerHTML=SPECIALS.map(sp=>`
      <div class="sp-card ${sp.c}">
        <div class="sp-head"><div class="sp-sym">${esc(sp.sym)}</div>
          <div class="sp-tt"><h3>${esc(sp.tt)}</h3><span>${esc(sp.tag)}</span></div></div>
        <div class="sp-body">${sp.body}</div>
        <div class="sp-facts">${sp.facts.map(f=>`<span class="tag">${esc(f)}</span>`).join('')}</div>
      </div>`).join('');
    document.getElementById('otrosCasos').innerHTML=OTROS.map(sp=>`
      <div class="sp-card ${sp.c}">
        <div class="sp-head"><div class="sp-sym">${esc(sp.sym)}</div>
          <div class="sp-tt"><h3>${esc(sp.tt)}</h3><span>Casos señalados en la tabla</span></div></div>
        <div class="sp-body">${sp.body}</div>
      </div>`).join('');
  }
  function renderAtoms(){
    document.getElementById('atomStrip').innerHTML=ATOMS.map(a=>`<button class="atom" data-s="${a[0]}">${a[0]}<sub>${a[2]}</sub><small>${a[1]}, atomicidad ${a[2]}</small></button>`).join('');
  }
  function openSheet(sym){
    const it=BYSYM[sym]; if(!it) return;
    const atTxt=it.kind==='radical'?'No aplica (es un grupo)':(it.at>1?`${it.at}, molécula ${it.s}<sub>${it.at}</sub>`:'1 (no molecular)');
    const rows=[
      `<div class="info-row"><span class="k">Valencias</span><span class="v big mono">${esc(it.v)}</span></div>`,
      `<div class="info-row"><span class="k">Clase</span><span class="v">${KIND_LABEL[it.kind]}</span></div>`,
      `<div class="info-row"><span class="k">Grupo / serie</span><span class="v">${esc(it.serie)}</span></div>`,
      `<div class="info-row"><span class="k">Atomicidad</span><span class="v">${atTxt}</span></div>`,
    ];
    if(it.nom) rows.push(`<div class="info-row"><span class="k">Nomenclatura</span><span class="v">${esc(it.nom)}${it.ej?`<small>${esc(it.ej)}</small>`:''}</span></div>`);
    document.getElementById('sheet').innerHTML=`
      <div class="sh-head">
        <div class="sh-sym s-${KC[it.kind]}">${esc(it.disp)}</div>
        <div class="sh-title"><h3>${esc(it.n)}</h3><div class="kinds">${KIND_LABEL[it.kind]}, ${esc(it.serie)}</div></div>
        <button class="modal-close" id="shClose" aria-label="Cerrar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>
      <div>${rows.join('')}</div>
      ${it.nota?`<div class="sh-note">${it.nota}</div>`:''}`;
    document.getElementById('overlay').classList.add('on');
    document.getElementById('shClose').addEventListener('click',closeSheet);
  }
  function closeSheet(){ document.getElementById('overlay').classList.remove('on'); }

  document.getElementById('searchIn').addEventListener('input',e=>renderTabla(e.target.value));
  document.getElementById('filterChips').addEventListener('click',e=>{
    const b=e.target.closest('.fchip'); if(!b) return;
    document.querySelectorAll('#filterChips .fchip').forEach(x=>x.classList.toggle('on',x===b));
    filtro=b.dataset.f;
    renderTabla(document.getElementById('searchIn').value);
  });
  document.getElementById('tabla').addEventListener('click',e=>{
    const c=e.target.closest('.chip'); if(c) openSheet(c.dataset.s);
  });
  document.getElementById('atomStrip').addEventListener('click',e=>{
    const a=e.target.closest('.atom'); if(a) openSheet(a.dataset.s);
  });
  document.getElementById('overlay').addEventListener('click',e=>{if(e.target.id==='overlay')closeSheet()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
  /* estadísticas de la página */
  const metales=ITEMS.filter(x=>x.kind==='metal').length+ITEMS.filter(x=>x.kind==='anfi').length;
  const nometales=ITEMS.filter(x=>x.kind==='nometal').length;
  document.getElementById('statEls').textContent=ITEMS.length;
  document.getElementById('statM').textContent=metales;
  document.getElementById('statNm').textContent=nometales;
  document.getElementById('statAt').textContent=ATOMS.length;
  renderTabla(''); renderEspeciales(); renderAtoms();
})();
