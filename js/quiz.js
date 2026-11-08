/* ============================================================
   quiz.js · selección de la respuesta correcta entre opciones:
   valencia, clase o atomicidad. Racha y récord personal.
   ============================================================ */
'use strict';
(function(){
  function App(){
    const [modo,setModo]=useState('v');
    const [q,setQ]=useState(()=>generarPregunta(pick(ITEMS),'v'));
    const [idx,setIdx]=useState(0);
    const [aciertos,setAciertos]=useState(0);
    const [racha,setRacha]=useState(0);
    const [instant,setInstant]=useState(false);
    const recKey='vv_rec_'+modo;
    const [record,setRecord]=useState(()=>LS.get(recKey,0));

    function nueva(){ setQ(generarPregunta(pick(ITEMS),modo)); }
    function cambiarModo(m){
      setModo(m); setQ(generarPregunta(pick(ITEMS),m));
      setIdx(0); setAciertos(0); setRacha(0);
      setRecord(LS.get('vv_rec_'+m,0));
    }
    function resultado(ok){
      setIdx(x=>x+1);
      if(ok){
        setAciertos(a=>a+1);
        const nr=racha+1;
        setRacha(nr);
        if(nr>record){ setRecord(nr); LS.set(recKey,nr); }
      } else setRacha(0);
    }
    function siguiente(){ nueva(); }

    return h('div',{className:'learnbox fadeup'},
      /* selector de modo */
      h('div',{className:'fchips',style:{marginBottom:'14px'}},
        QTYPES.map(t=>h('button',{key:t.k,className:'fchip'+(modo===t.k?' on':''),onClick:()=>cambiarModo(t.k)},t.t.replace(' del elemento',''))),
        h('button',{className:'fchip'+(instant?' on':''),onClick:()=>setInstant(x=>!x),title:'Avanza a la pregunta siguiente sin pulsar Siguiente'},'Autoavance')),
      /* barra de sesión */
      Barra({
        pct:idx?Math.round(aciertos/idx*100):0,
        left:h('span',null,`Pregunta ${idx+1} · ${aciertos} de ${idx} correctas`),
        right:h(Streak,{n:racha,rec:record})
      }),
      Pregunta({
        q,indice:idx,total:idx+1,instant,
        onResult:(ok)=>resultado(ok),
        onNext:()=>siguiente()
      }),
      h('div',{className:'qtip',style:{color:'var(--mut)',fontSize:'.78rem',marginTop:'4px'}},
        modo==='v'?'Recuerde que las valencias se escriben con su signo: los metales presentan únicamente valencias positivas; los no metales, negativas o positivas.'
        : modo==='c'?'La clase de cada elemento se corresponde con el color de su ficha en la tabla.'
        : 'Solo diez elementos de la tabla forman moléculas: H₂, O₂, N₂, F₂, Cl₂, Br₂, I₂ y Sb₂ (diatómicas), además de P₄ y As₄ (tetraatómicas).'));
  }
  montar('app-quiz',App);
})();
