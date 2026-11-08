/* ============================================================
   examen.js · examen de práctica automático: se configuran los
   tipos y la cantidad de preguntas y se obtiene la nota con el
   detalle para repasar.
   ============================================================ */
'use strict';
(function(){
  const TIPOS=[
    {k:'v',t:'Valencias'},
    {k:'c',t:'Clases'},
    {k:'a',t:'Atomicidades'},
  ];

  function App(){
    const [fase,setFase]=useState('setup');
    const [tipos,setTipos]=useState({v:true,c:false,a:false});
    const [n,setN]=useState(10);
    const [instant,setInstant]=useState(true);
    const [qs,setQs]=useState([]);
    const [i,setI]=useState(0);
    const [log,setLog]=useState([]);
    const [score,setScore]=useState(0);

    function comenzar(){
      const activos=TIPOS.filter(t=>tipos[t.k]).map(t=>t.k);
      const pool=shuffle(ITEMS.slice());
      const lista=[];
      for(let x=0;x<n;x++){
        lista.push(generarPregunta(pool[x%pool.length],activos[x%activos.length]));
      }
      setQs(lista); setI(0); setLog([]); setScore(0); setFase('quiz');
    }
    function toggleTipo(k){
      setTipos(t=>{
        const nt={...t,[k]:!t[k]};
        if(!Object.values(nt).some(Boolean)) nt[k]=true; // al menos un tipo activo
        return nt;
      });
    }
    function onResult(ok,picked){
      const q=qs[i];
      setLog(l=>[...l,{q,given:picked,ok}]);
      if(ok) setScore(s=>s+1);
    }
    function next(){
      if(i>=qs.length-1){ setFase('res'); return; }
      setI(x=>x+1);
    }

    /* ---------- pantalla 1: configuración ---------- */
    if(fase==='setup'){
      return h('div',{className:'learnbox fadeup'},
        h('div',{className:'qcard'},
          h('div',{className:'q-kind'},'Configuración del examen'),
          h('div',{className:'set-row'},
            h('label',null,'Tipos de pregunta (seleccione al menos uno)'),
            h('div',{className:'seg'},
              TIPOS.map(t=>h('button',{key:t.k,className:'segbtn'+(tipos[t.k]?' on':''),onClick:()=>toggleTipo(t.k)},t.t)))),
          h('div',{className:'set-row'},
            h('label',null,'Cantidad de preguntas'),
            h('div',{className:'seg'},
              [5,10,15,20].map(x=>h('button',{key:x,className:'segbtn'+(n===x?' on':''),onClick:()=>setN(x)},x)))),
          h('div',{className:'set-row'},
            h('label',null,'Corrección'),
            h('div',{className:'seg'},
              h('button',{className:'tgl'+(instant?' on':''),onClick:()=>setInstant(x=>!x)},
                h('span',{className:'sw'}),instant?'Corrección inmediata':'Corrección al finalizar'))),
          h('div',{className:'btnrow start',style:{marginTop:'8px'}},
            h('button',{className:'dbtn primary',onClick:comenzar},'Iniciar examen →'))));
    }

    /* ---------- pantalla 2: preguntas ---------- */
    if(fase==='quiz'){
      const q=qs[i];
      return h('div',{className:'learnbox fadeup'},
        Barra({
          pct:Math.round(i/qs.length*100),
          left:`Pregunta ${i+1} de ${qs.length}`,
          right:`Correctas: ${score}`
        }),
        h(Pregunta,{q,indice:i,total:qs.length,instant,onResult,onNext:next}));
    }

    /* ---------- pantalla 3: resultados ---------- */
    const pct=Math.round(score/qs.length*100);
    const ko=log.filter(l=>!l.ok);
    const cara=pct>=90?'Desempeño sobresaliente':pct>=70?'Desempeño muy bueno':pct>=50?'Desempeño regular':'Conviene repasar la tabla';
    return h('div',{className:'learnbox fadeup'},
      h('div',{className:'qcard'},
        h('div',{className:'res-top'},
          h(Anillo,{pct}),
          h('div',{className:'res-info'},
            h('h3',null,cara),
            h('p',null,`${score} de ${qs.length} respuestas correctas; ${ko.length} para repasar.`),
            h('div',{className:'btnrow',style:{justifyContent:'flex-start',marginTop:'12px'}},
              h('button',{className:'dbtn primary',onClick:comenzar},'Repetir examen'),
              h('button',{className:'dbtn',onClick:()=>setFase('setup')},'Modificar configuración'),
              h('a',{className:'dbtn',href:'explorar.html'},'Repasar la tabla')))),
        ko.length?h('div',{style:{marginTop:'22px'}},
          h('div',{className:'q-kind'},'Para repasar'),
          ko.map((l,j)=>h('div',{key:j,className:'rev ko'},
            h('span',{className:'mk'},'✘'),
            h('div',{className:'body'},
              h('b',null,`${l.q.it.disp}, ${l.q.it.n}: ${l.q.q}`),
              h('div',{className:'ans'},'Respuesta elegida: ',h('b',{className:'bad'},l.given),'; respuesta correcta: ',h('b',{className:'good'},l.q.correct)),
              h('div',{className:'ans',dangerouslySetInnerHTML:{__html:l.q.extra}})))))
        : h('div',{className:'review-list',style:{marginTop:'18px'}},h('span',{className:'cat nometal'},'Sin errores'))));
  }
  montar('app-examen',App);
})();
