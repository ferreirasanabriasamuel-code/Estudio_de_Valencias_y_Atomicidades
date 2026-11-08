/* ============================================================
   componentes.js · plantillas React compartidas por las
   actividades (fichas, quiz, examen, combinar)
   Sin JSX ni Babel: createElement directo, carga liviana.
   ============================================================ */
'use strict';
const {createElement:h,useState,useEffect,useRef,useMemo} = React;

/* ---------- piezas pequeñas ---------- */
function CatChip({kind}){
  return h('span',{className:'cat '+KC[kind]},KIND_LABEL[kind]);
}
function Dot({kind}){ return h('span',{className:'dot '+DOTK[kind]}) }

function InfoRow({k,v,small,big}){
  return h('div',{className:'info-row'},
    h('span',{className:'k'},k),
    h('span',{className:'v'+(big?' big':'')},v, small?h('small',null,small):null));
}

function Barra({pct,left,right}){
  return h('div',null,
    h('div',{className:'pbar'},h('div',{className:'fill',style:{width:pct+'%'}})),
    h('div',{className:'plabel'},
      h('span',null,left||''),h('span',null,right||'')));
}

function Streak({n,rec}){
  return h('span',{className:'streak',title:'Racha de respuestas correctas'},
    'Racha: ',n,' ', rec!=null?h('span',{style:{color:'var(--mut)',fontWeight:600,fontSize:'.72rem'}},`(récord ${rec})`):null);
}

/* ---------- tarjeta de pregunta (quiz / examen) ---------- */
function Pregunta({q,indice,total,instant,onResult,onNext}){
  const [picked,setPicked]=useState(null);
  const ok=picked===q.correct;
  /* nueva pregunta → resetear la elección (la instancia persiste) */
  useEffect(()=>{ setPicked(null); },[q]);
  useEffect(()=>{
    if(picked!==null && instant){
      const t=setTimeout(()=>onNext(ok),950);
      return ()=>clearTimeout(t);
    }
  },[picked]);
  return h('div',{className:'qcard fadeup'},
    h('div',{className:'q-kind'},
      h('span',null,'Pregunta · '+QTYPES.find(t=>t.k===q.k).t),
      h('span',{className:'qn'},`${indice+1}/${total}`)),
    h('div',{className:'q-prompt'},
      h('div',null,
        h('div',{className:'qp-sym'},q.it.disp),
        h('div',{className:'qp-name'},q.it.n)),
      h(CatChip,{kind:q.it.kind})),
    h('div',{className:'q-text'},q.q),
    h('div',{className:'opts',id:'qOpts'},
      q.opts.map(o=>h('button',{
        key:o,
        'data-o':o,
        className:'opt'+(picked===null?'':(o===q.correct?' good':(o===picked?' bad':' dim'))),
        disabled:picked!==null,
        onClick:()=>{ if(picked!==null) return; setPicked(o); onResult(o===q.correct,o); }
      },o))),
    picked!==null && h('div',{className:'fb '+(ok?'good':'bad')},
      ok? h('span',null,'✔ ',h('b',null,'Correcto.'))
        : h('span',null,'✘ ',h('b',null,'La respuesta correcta es:'), ' ',q.correct),
      h('span',{className:'why',dangerouslySetInnerHTML:{__html:q.extra}}),
      !instant && h('div',{style:{marginTop:'12px'}},
        h('button',{className:'dbtn primary',onClick:()=>onNext(ok)},'Siguiente →'))));
}

/* ---------- anillo de resultado ---------- */
function Anillo({pct}){
  const C=2*Math.PI*54;
  return h('div',{className:'ringwrap'},
    h('svg',{width:132,height:132},
      h('defs',null,
        h('linearGradient',{id:'rg',x1:0,y1:0,x2:1,y2:1},
          h('stop',{offset:0,stopColor:'#6d5cff'}),
          h('stop',{offset:1,stopColor:'#22d3ee'}))),
      h('circle',{className:'ringbg',cx:66,cy:66,r:54}),
      h('circle',{className:'ringfg',cx:66,cy:66,r:54,
        strokeDasharray:C, strokeDashoffset:C*(1-pct/100), id:'ringFg'})),
    h('div',{className:'ringpct'},pct+'%'));
}

/* ---------- tarjeta final ---------- */
function EndCard({icon,titulo,texto,children}){
  return h('div',{className:'qcard endcard fadeup'},
    h('div',{className:'big'},icon),
    h('h3',null,titulo),
    h('p',null,texto),
    children);
}

/* ---------- ficha 3D (elemento y valencia) ---------- */
function Ficha({it,flipped,onFlip,onStar,star}){
  const rows=[
    InfoRow({k:'Clase',v:KIND_LABEL[it.kind]}),
    InfoRow({k:'Grupo / serie',v:it.serie}),
    InfoRow({k:'Atomicidad',v:it.kind==='radical'?'No aplica (es un grupo)':(it.at>1?[it.at,', molécula ',h('span',{className:'mono'},it.s),h('sub',null,String(it.at))]:['1 (no molecular)'])}),
  ];
  if(it.nom) rows.push(InfoRow({k:'Nomenclatura',v:it.nom,small:it.ej}));
  return h('div',{className:'stage'},
    h('div',{className:'fcard'+(flipped?' flipped':''),role:'button',tabIndex:0,
      'aria-label':'Ficha: pulse para girar',onClick:onFlip,
      onKeyDown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onFlip()}}},
      /* frente */
      h('div',{className:'face front'},
        h('div',{className:'face-top'},
          h(CatChip,{kind:it.kind}),
          h('button',{className:'starbtn'+(star?' on':''),'aria-label':'Marcar ficha',
            onClick:e=>{e.stopPropagation();onStar()}},
            h(IconoEstrella,{on:star}))),
        h('div',{className:'face-mid'},
          h('div',{className:'sym-big'},it.disp),
          h('div',{className:'name-mid'},it.n)),
        h('div',{className:'hint-mid'},'Pulse la ficha para girarla; deslice para cambiar de ficha')),
      /* dorso */
      h('div',{className:'face back'},
        h('div',{className:'face-top'},h(CatChip,{kind:it.kind})),
        h('div',{className:'face-mid'},
          h('div',{className:'val-big '+KC[it.kind],style:{fontFamily:'var(--mono)'}},it.v),
          h('div',{className:'info-rows'},rows)),
        it.nota?h('div',{className:'sh-note',dangerouslySetInnerHTML:{__html:it.nota}}):null)));
}

function IconoEstrella({on}){
  return h('svg',{width:18,height:18,viewBox:'0 0 24 24',
    fill:on?'currentColor':'none',stroke:'currentColor',strokeWidth:2,strokeLinejoin:'round'},
    h('path',{d:'m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8z'}));
}

/* ---------- montaje ---------- */
function montar(id,App){
  const el=document.getElementById(id);
  if(el) ReactDOM.createRoot(el).render(h(App));
}
