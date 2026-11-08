/* ============================================================
   tabla.js · tabla periódica tradicional: siete periodos y
   grupos en números romanos (notación A/B). Cada celda muestra
   el número atómico, el nombre y las valencias del elemento.
   Solo se sitúan los elementos de la Tabla de Valencias; las
   demás celdas quedan en blanco.
   ============================================================ */
'use strict';
(function(){
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* mapa inverso: posición → elemento */
  const EN_POS={};
  Object.keys(PT).forEach(s=>{const [p,g]=PT[s]; EN_POS[p+'-'+g]=s});

  let html='';
  /* encabezado: esquina + grupos en números romanos */
  html+='<div class="pt-corner">Grupos,<br>periodos ↓</div>';
  PT_GRUPOS.forEach(g=>{ html+=`<div class="pt-head">${esc(g)}</div>`; });

  /* filas de los siete periodos */
  for(let p=1;p<=7;p++){
    html+=`<div class="pt-per" style="grid-column:1;grid-row:${p+1}">${p}</div>`;
    for(let g=1;g<=18;g++){
      const col=g+1, row=p+1;
      const s=EN_POS[p+'-'+g];
      if(s){
        const it=BYSYM[s];
        html+=`<button class="pt-tile k-${KC[it.kind]}" data-s="${esc(s)}" style="grid-column:${col};grid-row:${row}" aria-label="${esc(it.n)}">
          <span class="pt-num">${NUM_ATOMICO[s]}</span>
          <span class="pt-sym">${esc(it.s)}</span>
          <span class="pt-name">${esc(it.n)}</span>
          <span class="pt-val">${esc(it.v)}</span>
        </button>`;
      } else if(p>=6&&g===3){
        html+=`<div class="pt-fcell" style="grid-column:${col};grid-row:${row}">${p===6?'57-71':'89-103'}</div>`;
      } else {
        html+=`<div class="pt-cell" style="grid-column:${col};grid-row:${row}"></div>`;
      }
    }
  }
  /* bloques de transición interna (sin datos en la tabla de valencias) */
  html+='<div class="pt-frow" style="grid-row:9">Lantánidos: elementos 57 a 71 (no incluidos en la tabla de valencias)</div>';
  html+='<div class="pt-frow" style="grid-row:10">Actínidos: elementos 89 a 103 (no incluidos en la tabla de valencias)</div>';

  document.getElementById('ptGrid').innerHTML=html;

  /* ficha modal (misma plantilla que explorar) */
  function openSheet(sym){
    const it=BYSYM[sym]; if(!it) return;
    const atTxt=it.kind==='radical'?'No aplica (es un grupo)':(it.at>1?`${it.at}, molécula ${it.s}<sub>${it.at}</sub>`:'1 (no molecular)');
    const per=PT[sym]?PT[sym][0]:null, gru=PT[sym]?PT[sym][1]:null;
    const posTxt=per?`Periodo ${per}, grupo ${gru} (${PT_GRUPOS[gru-1]})`:'';
    const rows=[
      `<div class="info-row"><span class="k">Valencias</span><span class="v big mono">${esc(it.v)}</span></div>`,
      `<div class="info-row"><span class="k">Clase</span><span class="v">${KIND_LABEL[it.kind]}</span></div>`,
      `<div class="info-row"><span class="k">Posición</span><span class="v">${esc(posTxt)}</span></div>`,
      `<div class="info-row"><span class="k">Grupo / serie</span><span class="v">${esc(it.serie)}</span></div>`,
      `<div class="info-row"><span class="k">Atomicidad</span><span class="v">${atTxt}</span></div>`,
    ];
    if(it.nom) rows.push(`<div class="info-row"><span class="k">Nomenclatura</span><span class="v">${esc(it.nom)}${it.ej?`<small>${esc(it.ej)}</small>`:''}</span></div>`);
    document.getElementById('sheet').innerHTML=`
      <div class="sh-head">
        <div class="sh-sym s-${KC[it.kind]}">${esc(it.disp)}</div>
        <div class="sh-title"><h3>${esc(it.n)}</h3><div class="kinds">${KIND_LABEL[it.kind]}, número atómico ${NUM_ATOMICO[sym]}</div></div>
        <button class="modal-close" id="shClose" aria-label="Cerrar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>
      <div>${rows.join('')}</div>
      ${it.nota?`<div class="sh-note">${it.nota}</div>`:''}`;
    document.getElementById('overlay').classList.add('on');
    document.getElementById('shClose').addEventListener('click',closeSheet);
  }
  function closeSheet(){ document.getElementById('overlay').classList.remove('on'); }

  document.getElementById('ptGrid').addEventListener('click',e=>{
    const t=e.target.closest('.pt-tile'); if(t) openSheet(t.dataset.s);
  });
  document.getElementById('overlay').addEventListener('click',e=>{if(e.target.id==='overlay')closeSheet()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
})();
