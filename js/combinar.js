/* ============================================================
   combinar.js · juego contrarreloj: asociar cada elemento con
   su valencia en el menor tiempo posible.
   ============================================================ */
'use strict';
(function(){
  /* elementos con valencias únicas entre sí, para pares sin ambigüedad */
  const POOL=['Li','Be','Al','Cu','Au','Fe','Pb','Mn','F','O','Cl','S','B','C'];
  function paresPantalla(){ return window.matchMedia('(min-width:721px)').matches?10:8 }
  function fmtT(s){ return s<60?s.toFixed(1).replace('.',',')+' s':Math.floor(s/60)+'m '+(s%60).toFixed(1).replace('.',',')+'s' }

  function App(){
    const [fase,setFase]=useState('intro');
    const [tiles,setTiles]=useState([]);
    const [pairs,setPairs]=useState([]);
    const [sel,setSel]=useState([]);
    const [lock,setLock]=useState(false);
    const [found,setFound]=useState(0);
    const [t0,setT0]=useState(0);
    const [elapsed,setElapsed]=useState(0);
    const [n,setN]=useState(()=>paresPantalla());
    const timerRef=useRef(null);
    const bestKey='vv_best_'+paresPantalla();
    const [best,setBest]=useState(()=>LS.get(bestKey,null));
    const [isRec,setIsRec]=useState(false);

    useEffect(()=>()=>clearInterval(timerRef.current),[]);

    function jugar(){
      const nP=paresPantalla();
      const elegidos=sample(POOL.map(s=>BYSYM[s]),nP);
      const mezcla=shuffle(elegidos.flatMap(it=>[{it,face:'el'},{it,face:'val'}]));
      setPairs(elegidos); setTiles(mezcla);
      setSel([]); setFound(0); setLock(false); setElapsed(0); setIsRec(false);
      setN(nP); setT0(0);
      clearInterval(timerRef.current);
      setFase('juego');
    }
    function tap(idx){
      if(lock||fase!=='juego') return;
      const t=tiles[idx];
      if(!t||t.done||sel.includes(idx)) return;
      if(!t0){
        const start=Date.now();
        setT0(start);
        clearInterval(timerRef.current);
        timerRef.current=setInterval(()=>{
          setElapsed((Date.now()-start)/1000);
        },150);
      }
      const sel2=[...sel,idx];
      setSel(sel2);
      if(sel2.length<2) return;
      const [a,b]=sel2;
      if(tiles[a].it===tiles[b].it && tiles[a].face!==tiles[b].face){
        tiles[a].done=true; tiles[b].done=true;
        const nf=found+1;
        setFound(nf); setSel([]);
        if(nf>=n){ terminar(); }
      } else {
        setLock(true);
        setTimeout(()=>{ setSel([]); setLock(false); },430);
      }
    }
    function terminar(){
      clearInterval(timerRef.current);
      const seg=(Date.now()-t0)/1000;
      const prev=LS.get(bestKey,null);
      const rec=prev===null||seg<prev;
      if(rec) LS.set(bestKey,seg);
      setIsRec(rec); setBest(LS.get(bestKey,null));
      setElapsed(seg);
      setFase('fin');
    }
    function salir(){ clearInterval(timerRef.current); setFase('intro'); setBest(LS.get(bestKey,null)); }

    if(fase==='intro'){
      return h('div',{className:'learnbox fadeup'},
        h('div',{className:'qcard matchintro'},
          h('div',{className:'big'},'★'),
          h('h3',null,'Asociación entre elemento y valencia'),
          h('p',null,'El objetivo es emparejar cada elemento con su valencia en el menor tiempo posible. El cronómetro se inicia con el primer toque; los errores no suman tiempo, pero obligan a reanudar la búsqueda.'),
          best!=null?h('div',{style:{marginTop:'14px'}},
            h('div',{className:'q-kind',style:{justifyContent:'center'}},`Mejor tiempo registrado (${n} pares)`),
            h('div',{className:'bestime'},fmtT(best)))
            :h('p',{style:{marginTop:'10px'}},`Aún no hay registro para ${n} pares.`),
          h('div',{className:'btnrow'},h('button',{className:'dbtn primary',onClick:jugar},`Iniciar (${n} pares)`))));
    }
    if(fase==='fin'){
      return h('div',{className:'learnbox fadeup'},
        h('div',{className:'qcard matchend'},
          h('div',{className:'big'},'★'),
          h('h3',null,'Tablero completado'),
          h('div',{className:'bestime'},fmtT(elapsed)),
          isRec?h('div',{className:'newrec'},`Nuevo registro para ${n} pares`)
               :h('p',{style:{marginTop:'8px'}},'Su mejor tiempo registrado sigue siendo ',h('b',{className:'mono'},fmtT(best))),
          h('div',{className:'btnrow'},
            h('button',{className:'dbtn primary',onClick:jugar},'Repetir'),
            h('button',{className:'dbtn',onClick:salir},'Volver'))));
    }
    /* fase de juego */
    return h('div',{className:'learnbox fadeup'},
      h('div',{className:'mtop'},
        h('span',{className:'mtime'},fmtT(t0?elapsed:0)),
        h('span',{className:'mfound'},`Pares: ${found}/${n} · mejor: ${best!=null?fmtT(best):'sin registro'}`)),
      h('div',{className:'board'},
        tiles.map((t,idx)=>h('button',{
          key:idx,
          className:'tile'+(t.done?' ok':(sel.includes(idx)?' sel':''))+(sel.length===2&&!t.done&&!sel.includes(idx)?' dim':''),
          onClick:()=>tap(idx)
        }, t.face==='el'
          ? [h('span',{className:'t-sym',key:'s'},t.it.disp),h('span',{className:'t-name',key:'n'},t.it.n)]
          : [h('span',{className:'t-val',key:'v'},t.it.v),h('span',{className:'t-lab',key:'l'},'valencias')]))),
      h('div',{className:'btnrow'},h('button',{className:'dbtn',onClick:salir},'Reiniciar')));
  }
  montar('app-combinar',App);
})();
