/* ============================================================
   fichas.js · mazo de fichas: elemento en el frente y, al
   girarla, valencias y datos en el reverso. Animación de
   deslizamiento en ambas direcciones.
   ============================================================ */
'use strict';
(function(){
  const stored=LS.get('vv_stars',[]);
  stored.forEach(s=>{const it=BYSYM[s]; if(it) it.star=true});
  /* marca de tiempo del último barrido: evita que el "click" que el
     navegador dispara al soltar el dedo gire la ficha por accidente */
  let swipedAt=0;

  function App(){
    const [order,setOrder]=useState(()=>ITEMS.slice());
    const [soloMarcadas,setSoloMarcadas]=useState(false);
    const [i,setI]=useState(0);
    const [flipped,setFlipped]=useState(false);
    const [anim,setAnim]=useState(null);   /* out-l | out-r | in-l | in-r */
    const [tick,setTick]=useState(0);      /* re-render al marcar estrellas */

    const deck=soloMarcadas?order.filter(x=>x.star):order;
    const pos=Math.min(i,Math.max(0,deck.length-1));
    const it=deck[pos];
    const nStars=ITEMS.filter(x=>x.star).length;

    function ir(d){
      if(!deck.length||anim) return;
      setAnim(d>0?'out-l':'out-r');
      setTimeout(()=>{
        setFlipped(false);
        setI((pos+d+deck.length)%deck.length);
        setAnim(d>0?'in-r':'in-l');
        setTimeout(()=>setAnim(null),380);
      },260);
    }
    function barajear(){ setOrder(shuffle(order.slice())); setFlipped(false); setI(0); }
    function star(){
      if(!it) return;
      it.star=!it.star;
      LS.set('vv_stars',ITEMS.filter(x=>x.star).map(x=>x.s));
      setTick(t=>t+1);
    }
    /* swipe táctil con bloqueo por eje: una vez el gesto se reconoce
       como horizontal, se cancela el scroll de la página (preventDefault)
       de modo que sólo se deslice la ficha, nunca toda la pantalla */
    useEffect(()=>{
      const el=document.querySelector('.stage'); if(!el) return;
      let tx=0,ty=0,eje=null;
      const ts=e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;eje=null};
      const tm=e=>{
        if(eje===null){
          const dx=e.touches[0].clientX-tx, dy=e.touches[0].clientY-ty;
          if(Math.abs(dx)>8||Math.abs(dy)>8) eje=Math.abs(dx)>Math.abs(dy)?'x':'y';
        }
        if(eje==='x') e.preventDefault();
      };
      const te=e=>{
        const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
        if(eje==='x'&&Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)){
          swipedAt=Date.now();
          ir(dx<0?1:-1);
        }
      };
      el.addEventListener('touchstart',ts,{passive:true});
      el.addEventListener('touchmove',tm,{passive:false});
      el.addEventListener('touchend',te,{passive:true});
      return ()=>{el.removeEventListener('touchstart',ts);el.removeEventListener('touchmove',tm);el.removeEventListener('touchend',te)};
    });
    /* teclado */
    useEffect(()=>{
      const kd=e=>{
        if(e.key==='ArrowLeft')ir(-1);
        if(e.key==='ArrowRight')ir(1);
      };
      document.addEventListener('keydown',kd);
      return ()=>document.removeEventListener('keydown',kd);
    });

    return h('div',{className:'fadeup'},
      h('div',{className:'fchips',style:{justifyContent:'center',marginBottom:'16px'}},
        h('button',{className:'fchip'+(soloMarcadas?'':' on'),onClick:()=>{setSoloMarcadas(false);setI(0);setFlipped(false)}},'Todas'),
        h('button',{className:'fchip'+(soloMarcadas?' on':''),onClick:()=>{setSoloMarcadas(true);setI(0);setFlipped(false)}},'Marcadas ',h('span',{style:{opacity:.65}},`(${nStars})`)),
        h('button',{className:'fchip',onClick:barajear},'Mezclar')),
      it
        ? h('div',{className:'slide '+(anim||''),key:'slide'+pos},
            h(Ficha,{it,flipped,onFlip:()=>{ if(Date.now()-swipedAt<500) return; setFlipped(f=>!f) },onStar:star,star:it.star}))
        : h('div',{className:'qcard endcard'},
            h('div',{className:'big'},'★'),
            h('h3',null,'Aún no hay fichas marcadas'),
            h('p',null,'Recorra el mazo y marque con la estrella las fichas que le resulten difíciles; quedarán reunidas aquí para un repaso rápido.')),
      h('div',{className:'deckbar'},
        h('button',{className:'dbtn',onClick:()=>ir(-1),'aria-label':'Ficha anterior',disabled:!deck.length},
          h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.4,strokeLinecap:'round',strokeLinejoin:'round'},h('path',{d:'m15 18-6-6 6-6'}))),
        h('span',{className:'counter'},deck.length?`${pos+1} / ${deck.length}`:'0 / 0'),
        h('button',{className:'dbtn',onClick:()=>ir(1),'aria-label':'Ficha siguiente',disabled:!deck.length},
          h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.4,strokeLinecap:'round',strokeLinejoin:'round'},h('path',{d:'m9 18 6-6-6-6'}))),
        h('button',{className:'dbtn primary',onClick:()=>setFlipped(f=>!f)},'Girar ficha'),
        h('a',{className:'dbtn',href:'quiz.html'},'Ir al quiz →')));
  }
  montar('app-fichas',App);
})();
