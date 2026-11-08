/* ============================================================
   datos.js · Tabla de Valencias (fuente: Tabla de Valencias.pdf)
   45 elementos + 3 radicales · atomicidades · casos especiales
   Separador de valencias: punto y coma (;)
   ============================================================ */
'use strict';

// [símbolo, nombre, clase, serie, valencias, atomicidad, nomenclatura, ejemplo, nota]
const RAW=[
['Li','Litio','metal','Metal alcalino (grupo 1)','+1',1,'','',''],
['Na','Sodio','metal','Metal alcalino (grupo 1)','+1',1,'','',''],
['K','Potasio','metal','Metal alcalino (grupo 1)','+1',1,'','',''],
['Rb','Rubidio','metal','Metal alcalino (grupo 1)','+1',1,'','',''],
['Cs','Cesio','metal','Metal alcalino (grupo 1)','+1',1,'','',''],
['Fr','Francio','metal','Metal alcalino (grupo 1)','+1',1,'','',''],
['Ag','Plata','metal','Metal de transición','+1',1,'','',''],
['Be','Berilio','metal','Metal alcalinotérreo (grupo 2)','+2',1,'','',''],
['Mg','Magnesio','metal','Metal alcalinotérreo (grupo 2)','+2',1,'','',''],
['Ca','Calcio','metal','Metal alcalinotérreo (grupo 2)','+2',1,'','',''],
['Sr','Estroncio','metal','Metal alcalinotérreo (grupo 2)','+2',1,'','',''],
['Ba','Bario','metal','Metal alcalinotérreo (grupo 2)','+2',1,'','',''],
['Ra','Radio','metal','Metal alcalinotérreo (grupo 2)','+2',1,'','',''],
['Zn','Zinc','metal','Metal de transición','+2',1,'','',''],
['Cd','Cadmio','metal','Metal de transición','+2',1,'','',''],
['Al','Aluminio','metal','Metal del bloque p (grupo 13)','+3',1,'','',''],
['Cu','Cobre','metal','Metal de transición','+1; +2',1,'Oso, ico','cuproso (+1), cúprico (+2)',''],
['Hg','Mercurio','metal','Metal de transición','+1; +2',1,'Oso, ico','',''],
['Au','Oro','metal','Metal de transición','+1; +3',1,'Oso, ico','auroso (+1), áurico (+3)',''],
['Tl','Talio','metal','Metal del bloque p (grupo 13)','+1; +3',1,'Oso, ico','',''],
['Ni','Níquel','metal','Metal de transición','+2; +3',1,'Oso, ico','',''],
['Co','Cobalto','metal','Metal de transición','+2; +3',1,'Oso, ico','',''],
['Fe','Hierro','metal','Metal de transición','+2; +3',1,'Oso, ico','ferroso (+2), férrico (+3)',''],
['Pt','Platino','metal','Metal de transición','+2; +4',1,'Oso, ico','',''],
['Pb','Plomo','metal','Metal del bloque p (grupo 14)','+2; +4',1,'Oso, ico','plumboso (+2), plúmbico (+4)',''],
['Pd','Paladio','metal','Metal de transición','+2; +4',1,'Oso, ico','',''],
['Sn','Estaño','metal','Metal del bloque p (grupo 14)','+2; +4',1,'Oso, ico','',''],
['Cr','Cromo','anfi','Metal de transición','+2; +3; +6',1,'Oso, ico, ico','','Puede actuar como <b>metal y como no metal</b> (anfótero). La valencia <b>+6</b> se emplea en <b>anhídridos y ácidos</b>.'],
['Mn','Manganeso','anfi','Metal de transición','+2; +3; +4; +6; +7',1,'Oso, ico, bi, ico, per-ico','','Puede actuar como <b>metal y como no metal</b> (anfótero). Las valencias <b>+6 y +7</b> se emplean en <b>anhídridos y ácidos</b>.'],
['F','Flúor','nometal','No metal, halógeno (grupo 17)','−1',2,'','',''],
['H','Hidrógeno','nometal','No metal','−1; +1',2,'','',''],
['O','Oxígeno','nometal','No metal, anfígeno (grupo 16)','−2',2,'','','En los <b>peróxidos</b> su valencia es <b>−1</b> (cálculos con O₂²⁻); en los <b>superóxidos</b>, <b>−½</b> (cálculos con O₂⁻).'],
['Cl','Cloro','nometal','No metal, halógeno (grupo 17)','−1; +1; +3; +5; +7',2,'Uro, hipo-oso, oso, ico, per-ico','',''],
['Br','Bromo','nometal','No metal, halógeno (grupo 17)','−1; +1; +3; +5; +7',2,'Uro, hipo-oso, oso, ico, per-ico','',''],
['I','Yodo','nometal','No metal, halógeno (grupo 17)','−1; +1; +3; +5; +7',2,'Uro, hipo-oso, oso, ico, per-ico','',''],
['S','Azufre','nometal','No metal, anfígeno (grupo 16)','−2; +4; +6',1,'Uro, oso, ico','sulfuro (−2), sulfuroso (+4), sulfúrico (+6)',''],
['Se','Selenio','nometal','No metal, anfígeno (grupo 16)','−2; +4; +6',1,'Uro, oso, ico','',''],
['Te','Telurio','nometal','No metal, anfígeno (grupo 16)','−2; +4; +6',1,'Uro, oso, ico','',''],
['N','Nitrógeno','nometal','No metal, nitrogenoide (grupo 15)','−3; +3; +5',2,'Uro, oso, ico','',''],
['P','Fósforo','nometal','No metal, nitrogenoide (grupo 15)','−3; +3; +5',4,'Uro, oso, ico','',''],
['As','Arsénico','nometal','No metal, nitrogenoide (grupo 15)','−3; +3; +5',4,'Uro, oso, ico','',''],
['Sb','Antimonio','nometal','No metal, nitrogenoide (grupo 15)','−3; +3; +5',2,'Uro, oso, ico','',''],
['C','Carbono','nometal','No metal, carbonoide (grupo 14)','−4; +2; +4',1,'Uro, oso, ico','',''],
['Si','Silicio','nometal','No metal, carbonoide (grupo 14)','−4; +2; +4',1,'Uro, oso, ico','',''],
['B','Boro','nometal','No metal, familia del boro (grupo 13)','−3; +3',1,'Uro, ico','',''],
];

const RADICALS=[
{s:'OH',disp:'(OH)',n:'Hidróxido',v:'−1',serie:'Radical, grupo (OH)⁻¹',nota:'Grupo <b>(OH)⁻¹</b>: se combina con los metales para formar los hidróxidos. Valencia I (−1) según la tabla.'},
{s:'NH4',disp:'(NH₄)',n:'Amonio',v:'−1',serie:'Radical, grupo (NH₄)⁻¹',nota:'Grupo <b>(NH₄)</b>: en la tabla figura con valencia I; como catión, su carga real es <b>+1 (NH₄⁺)</b> y se comporta como un metal en las fórmulas.'},
{s:'CN',disp:'(CN)',n:'Cianuro',v:'−1',serie:'Radical, grupo (CN)⁻¹',nota:'Grupo <b>(CN)⁻¹</b>: cianuro. Valencia I (−1) según la tabla.'},
];

/* Filas de la tabla, tal como aparecen en el PDF (una tarjeta por fila) */
const GROUPS=[
{cat:'Metales',kind:'metal',syms:['Li','Na','K','Rb','Cs','Fr','Ag'],v:'+1'},
{cat:'Metales',kind:'metal',syms:['Be','Mg','Ca','Sr','Zn','Cd','Ba','Ra'],v:'+2'},
{cat:'Metales',kind:'metal',syms:['Al'],v:'+3'},
{cat:'Metales',kind:'metal',syms:['Cu','Hg'],v:'+1; +2',nom:'Oso, ico',ej:'Cu: cuproso (+1), cúprico (+2)'},
{cat:'Metales',kind:'metal',syms:['Au','Tl'],v:'+1; +3',nom:'Oso, ico',ej:'Au: auroso (+1), áurico (+3)'},
{cat:'Metales',kind:'metal',syms:['Ni','Co','Fe'],v:'+2; +3',nom:'Oso, ico',ej:'Fe: ferroso (+2), férrico (+3)'},
{cat:'Metales',kind:'metal',syms:['Pt','Pb','Pd','Sn'],v:'+2; +4',nom:'Oso, ico',ej:'Pb: plumboso (+2), plúmbico (+4)'},
{cat:'Metales anfóteros',kind:'anfi',syms:['Cr'],v:'+2; +3; +6',nom:'Oso, ico, ico',nota:'Puede actuar como <b>metal y como no metal</b>. La valencia <b>+6</b> se emplea en <b>anhídridos y ácidos</b>.'},
{cat:'Metales anfóteros',kind:'anfi',syms:['Mn'],v:'+2; +3; +4; +6; +7',nom:'Oso, ico, bi, ico, per-ico',nota:'Puede actuar como <b>metal y como no metal</b>. Las valencias <b>+6 y +7</b> se emplean en <b>anhídridos y ácidos</b>.'},
{cat:'No metales',kind:'nometal',syms:['F'],v:'−1'},
{cat:'No metales',kind:'nometal',syms:['H'],v:'−1; +1'},
{cat:'No metales',kind:'nometal',syms:['O'],v:'−2',nota:'En los <b>peróxidos</b> vale <b>−1</b> (cálculos con O₂²⁻); en los <b>superóxidos</b>, <b>−½</b> (cálculos con O₂⁻).'},
{cat:'No metales',kind:'nometal',syms:['Cl','Br','I'],v:'−1; +1; +3; +5; +7',nom:'Uro, hipo-oso, oso, ico, per-ico'},
{cat:'No metales',kind:'nometal',syms:['S','Se','Te'],v:'−2; +4; +6',nom:'Uro, oso, ico',ej:'S: sulfuro (−2), sulfuroso (+4), sulfúrico (+6)'},
{cat:'No metales',kind:'nometal',syms:['N','P','As','Sb'],v:'−3; +3; +5',nom:'Uro, oso, ico'},
{cat:'No metales',kind:'nometal',syms:['C','Si'],v:'−4; +2; +4',nom:'Uro, oso, ico'},
{cat:'No metales',kind:'nometal',syms:['B'],v:'−3; +3',nom:'Uro, ico'},
{cat:'Radicales',kind:'radical',syms:['OH','NH4','CN'],v:'I (−1)',nota:'Valencia I: <b>(OH)⁻¹ hidróxido, (NH₄) amonio y (CN)⁻¹ cianuro</b>. El amonio, como catión, tiene carga real +1 (NH₄⁺).'},
];

/* Nomenclatura tradicional con ejemplos del PDF */
const NOM_EX=[['Cu','cobre','cuproso','+1'],['Cu','cobre','cúprico','+2'],['Au','oro','auroso','+1'],['Au','oro','áurico','+3'],['Fe','hierro','ferroso','+2'],['Fe','hierro','férrico','+3'],['Pb','plomo','plumboso','+2'],['Pb','plomo','plúmbico','+4'],['S','azufre','sulfuroso','+4'],['S','azufre','sulfúrico','+6']];

/* Atomicidades moleculares de la tabla (10) */
const ATOMS=[['H','Hidrógeno',2],['O','Oxígeno',2],['N','Nitrógeno',2],['F','Flúor',2],['Cl','Cloro',2],['Br','Bromo',2],['I','Yodo',2],['Sb','Antimonio',2],['P','Fósforo',4],['As','Arsénico',4]];

/* Casos especiales: Sb, B, P y As (+ otros casos señalados) */
const SPECIALS=[
{c:'c-sb',sym:'Sb',tt:'Antimonio',tag:'Caso especial, no metal',body:'Metaloide del <b>grupo del nitrógeno</b> (grupo 15). La tabla lo trata como <b>no metal</b>: sus valencias son III y V (−3; +3; +5), con los sufijos <b>uro, oso e ico</b>. Particularidad: su <b>atomicidad molecular es 2</b> (Sb₂), a diferencia del fósforo y del arsénico, que forman moléculas de cuatro átomos.',facts:['−3; +3; +5','Sb₂, atomicidad 2','No metal, grupo 15']},
{c:'c-b',sym:'B',tt:'Boro',tag:'Caso especial, no metal',body:'Metaloide de la <b>familia del boro</b> (grupo 13). Es el único elemento de la tabla con <b>una sola valencia</b>, III (−3 y +3); por ello su nomenclatura admite únicamente los sufijos <b>uro e ico</b> (boruro y bórico). No figura entre las atomicidades moleculares: en las fórmulas se escribe B (atomicidad 1).',facts:['−3; +3','Atomicidad 1','Uro, ico']},
{c:'c-p',sym:'P',tt:'Fósforo',tag:'Caso especial, no metal',body:'No metal del <b>grupo del nitrógeno</b>, con valencias III y V (−3; +3; +5) y nomenclatura <b>uro, oso e ico</b> (fosfuro, fosforoso y fosfórico). Se destaca por su <b>atomicidad molecular 4</b>: forma moléculas <b>P₄</b> de estructura tetraédrica, dato que conviene recordar al escribir fórmulas.',facts:['−3; +3; +5','P₄, atomicidad 4','Uro, oso, ico']},
{c:'c-as',sym:'As',tt:'Arsénico',tag:'Caso especial, no metal',body:'Metaloide del <b>grupo del nitrógeno</b>, tratado como <b>no metal</b> en la tabla: valencias III y V (−3; +3; +5) y sufijos <b>uro, oso e ico</b>. Al igual que el fósforo, forma moléculas de cuatro átomos (<b>As₄</b>). Advertencia: no debe confundirse con Ar (argón), gas noble que no forma compuestos; el elemento de esta tabla es <b>As (arsénico)</b>.',facts:['−3; +3; +5','As₄, atomicidad 4','No metal, grupo 15']},
];
const OTROS=[
{c:'c-as',sym:'Cr',tt:'Cromo, anfótero',body:'Metal de transición que puede actuar como <b>metal y como no metal</b>. Presenta las valencias +2; +3 y <b>+6</b>; la última se emplea en <b>anhídridos y ácidos</b>. Nomenclatura: oso, ico, ico.'},
{c:'c-as',sym:'Mn',tt:'Manganeso, anfótero',body:'Al igual que el cromo, es <b>anfótero</b>. Presenta cinco valencias: +2; +3; +4; <b>+6</b> y <b>+7</b>; las dos últimas, en <b>anhídridos y ácidos</b>. Nomenclatura: oso, ico, bi, ico, per-ico.'},
{c:'c-p',sym:'O',tt:'Oxígeno, peróxidos',body:'No metal con valencia <b>−2</b>, con excepciones: en los <b>peróxidos</b> vale <b>−1</b> (cálculos con O₂²⁻) y en los <b>superóxidos</b>, <b>−½</b> (cálculos con O₂⁻).'},
];

/* ---------- Tabla periódica: posición de cada elemento ---------- */
/* [simbolo]: [periodo, grupo de 1 a 18] */
const PT={H:[1,1],Li:[2,1],Be:[2,2],B:[2,13],C:[2,14],N:[2,15],O:[2,16],F:[2,17],
Na:[3,1],Mg:[3,2],Al:[3,13],Si:[3,14],P:[3,15],S:[3,16],Cl:[3,17],
K:[4,1],Ca:[4,2],Cr:[4,6],Mn:[4,7],Fe:[4,8],Co:[4,9],Ni:[4,10],Cu:[4,11],Zn:[4,12],As:[4,15],Se:[4,16],Br:[4,17],
Rb:[5,1],Sr:[5,2],Pd:[5,10],Ag:[5,11],Cd:[5,12],Sn:[5,14],Sb:[5,15],Te:[5,16],I:[5,17],
Cs:[6,1],Ba:[6,2],Au:[6,11],Hg:[6,12],Tl:[6,13],Pb:[6,14],
Pt:[6,10],Fr:[7,1],Ra:[7,2]};

/* Números romanos de los 18 grupos (notación tradicional A/B) */
const PT_GRUPOS=['IA','IIA','IIIB','IVB','VB','VIB','VIIB','VIIIB','VIIIB','VIIIB','IB','IIB','IIIA','IVA','VA','VIA','VIIA','VIIIA'];
const NUM_ATOMICO={H:1,Li:3,Be:4,B:5,C:6,N:7,O:8,F:9,Na:11,Mg:12,Al:13,Si:14,P:15,S:16,Cl:17,K:19,Ca:20,Cr:24,Mn:25,Fe:26,Co:27,Ni:28,Cu:29,Zn:30,As:33,Se:34,Br:35,Rb:37,Sr:38,Pd:46,Ag:47,Cd:48,Sn:50,Sb:51,Te:52,I:53,Cs:55,Ba:56,Pt:78,Au:79,Hg:80,Tl:81,Pb:82,Fr:87,Ra:88};

/* ---------- Ítems de estudio y utilidades ---------- */
const ITEMS=RAW.map(r=>({id:'E'+r[0],s:r[0],disp:r[0],n:r[1],kind:r[2],serie:r[3],v:r[4],at:r[5],nom:r[6],ej:r[7],nota:r[8],star:false}))
  .concat(RADICALS.map(r=>({id:'R'+r.s,s:r.s,disp:r.disp,n:r.n,kind:'radical',serie:r.serie,v:r.v,at:0,nom:'',ej:'',nota:r.nota,star:false})));
const BYSYM={}; ITEMS.forEach(x=>BYSYM[x.s]=x);

const KIND_LABEL={metal:'Metal',nometal:'No metal',anfi:'Metal anfótero',radical:'Radical (grupo)'};
const KC={metal:'metal',nometal:'nometal',anfi:'anfi',radical:'radical'};
const CSSK={metal:'k-metal',nometal:'k-nometal',anfi:'k-anfi',radical:'k-radical'};
const DOTK={metal:'metal',nometal:'nometal',anfi:'anfi',radical:'radical'};
const CATC={metal:'metal',nometal:'nometal',anfi:'anfi',radical:'radical'};

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function sample(arr,n){return shuffle(arr.slice()).slice(0,n)}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
const LS={
  get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};

/* Distracciones para preguntas de valencia */
const VAL_EXTRAS=['+1','+2','+3','+4','−1','−2','−3','−4','−1; +1','+1; +2','+1; +3','+2; +3','+2; +4','−2; +4','−3; +3','−4; +2','+2; +3; +4','−1; +1; +3; +5; +7','−2; +4; +6','−3; +3; +5'];
function distractores(correct,n){
  const pool=[...new Set(ITEMS.map(x=>x.v).concat(VAL_EXTRAS).filter(v=>v!==correct))];
  return sample(pool,n);
}

/* Lectura de valencias escritas: "+2; +3", "+2 +3", "-1 +1" → normalizado */
function parseVal(str){
  if(str==null) return null;
  const toks=String(str).split(/[·,;/\s]+/).map(t=>t.trim()).filter(Boolean);
  if(!toks.length) return null;
  const out=[];
  for(let t of toks){
    t=t.replace(/[()]/g,'').replace(/−/g,'-').replace(/[–—]/g,'-');
    let m;
    if(m=t.match(/^([+-]?)(\d+)$/)){out.push((m[1]==='-'?'-':'+')+m[2]);}
    else if(m=t.match(/^(\d+)([+-])$/)){out.push((m[2]==='-'?'-':'+')+m[1]);}
    else return null;
  }
  return out.sort();
}
function sameVal(a,b){const x=parseVal(a),y=parseVal(b);return !!x&&!!y&&x.join(' ')===y.join(' ')}

/* Generador de preguntas (quiz / examen) */
const QTYPES=[{k:'v',t:'Valencia del elemento'},{k:'c',t:'Clase del elemento'},{k:'a',t:'Atomicidad del elemento'}];
function generarPregunta(it,k){
  if(k==='v'){
    return {k,it,type:'mcq',q:'¿Qué valencias tiene?',opts:shuffle([it.v,...distractores(it.v,3)]),correct:it.v,
      extra:`${it.n}: ${KIND_LABEL[it.kind]}, ${it.serie}`};
  }
  if(k==='c'){
    const correct=KIND_LABEL[it.kind];
    return {k,it,type:'mcq',q:'¿Qué clase de elemento es?',opts:shuffle([correct,...sample(Object.values(KIND_LABEL).filter(x=>x!==correct),3)]),correct,
      extra:`${it.n}: ${it.v}, ${it.serie}`};
  }
  // atomicidad
  let correct,fakes;
  if(it.kind==='radical'){correct='No forma moléculas (es un grupo)';fakes=['Monoatómica (atomicidad 1)','Diatómica, X₂ (atomicidad 2)','Tetraatómica, X₄ (atomicidad 4)']}
  else if(it.at===4){correct=`Tetraatómica, ${it.s}₄ (atomicidad ${it.at})`;fakes=['Monoatómica (atomicidad 1)','Diatómica, X₂ (atomicidad 2)','No forma moléculas']}
  else if(it.at===2){correct=`Diatómica, ${it.s}₂ (atomicidad ${it.at})`;fakes=['Monoatómica (atomicidad 1)','Tetraatómica, X₄ (atomicidad 4)','No forma moléculas']}
  else {correct='Monoatómica (atomicidad 1)';fakes=['Diatómica, X₂ (atomicidad 2)','Tetraatómica, X₄ (atomicidad 4)','No forma moléculas']}
  return {k,it,type:'mcq',q:'¿Cómo forma molécula este elemento? (atomicidad)',opts:shuffle([correct,...[...new Set(fakes)].filter(f=>f!==correct).slice(0,3)]),correct,
    extra:`${it.n}: ${it.at>1?`atomicidad ${it.at}, molécula ${it.s}<sub>${it.at}</sub>`:'atomicidad 1 (no molecular)'}`};
}

/* gancho de utilidades para pruebas/QA */
window.VV={ITEMS,BYSYM,LS,parseVal,sameVal,generarPregunta,ATOMS,PT,PT_GRUPOS};
