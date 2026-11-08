/* ============================================================
   fondo.js · Fondo animado "ColorBends" detrás de todo el sitio.
   Shader de fragmentos portado del componente ColorBends de
   react-bits (JS/CSS) a WebGL puro, para no cargar Three.js.
   Colores: paleta propia del sitio (violeta y cian), que cambia
   con el tema claro u oscuro.

   El fondo animado sólo se muestra en computadoras. En móviles y
   tabletas el script termina antes de crear el lienzo: aunque se
   había bajado la resolución y los fps, seguir pintando cada
   fotograma saturaba la GPU y trababa el deslizamiento, así que
   allí el sitio se queda con el color de fondo liso del tema.

   Robustez en escritorio (el fondo no debe parpadear, desaparecer
   ni moverse mientras se hace scroll):
   - el lienzo se dimensiona con inset:0 y porcentajes, nunca con
     100dvh/100vw: el navegador no dispara redimensionados durante
     el scroll y el búfer no se vacía;
   - cada cambio real de tamaño redibuja de inmediato, de forma
     síncrona, sin esperar al siguiente fotograma;
   - el paralaje responde sólo al ratón, no al tacto;
   - si el navegador pierde el contexto WebGL se vuelve a montar
     solo.
   ============================================================ */
'use strict';
(function(){
  if(document.getElementById('bgFx')) return;

  /* se considera móvil/tableta el dispositivo cuyo puntero
     principal es el dedo (pointer:coarse) o cuyo navegador se
     declara móvil; una pantalla táctil de portátil no entra, porque
     el puntero principal sigue siendo el ratón */
  const ESDATIL=matchMedia('(pointer:coarse)').matches||/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if(ESDATIL) return;

  const cv=document.createElement('canvas');
  cv.id='bgFx';
  cv.setAttribute('aria-hidden','true');
  const st={position:'fixed',inset:'0',width:'100%',height:'100%',zIndex:'-1',pointerEvents:'none',display:'block',transform:'translateZ(0)'};
  for(const k in st) cv.style[k]=st[k];
  document.body.prepend(cv);

  const gl=cv.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true,powerPreference:'low-power'});
  if(!gl){ cv.remove(); return; }

  const MAX_COLORS=8;
  const frag=`
#define MAX_COLORS ${MAX_COLORS}
precision mediump float;
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

  for (int j = 0; j < 5; j++) {
    if (j >= uIterations - 1) break;
    vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q += (rr - q) * 0.15;
  }

  vec3 col = vec3(0.0);
  float a = 1.0;

  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    float cover = 0.0;
    for (int i = 0; i < MAX_COLORS; ++i) {
      if (i >= uColorCount) break;
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float m = mix(m0, m1, kMix);
      float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
      sumCol += uColors[i] * w;
      cover = max(cover, w);
    }
    col = clamp(sumCol, 0.0, 1.0);
    a = uTransparent > 0 ? cover : 1.0;
  } else {
    vec2 s = q;
    for (int k = 0; k < 3; ++k) {
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float m = mix(m0, m1, kMix);
      col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
    }
    a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
  }

  col *= uIntensity;

  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  vec3 rgb = (uTransparent > 0) ? col * a : col;
  gl_FragColor = vec4(rgb, a);
}`;

  const vert=`
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

  function shader(type,src){
    const s=gl.createShader(type);
    gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){ console.warn('bgFx:',gl.getShaderInfoLog(s)); return null; }
    return s;
  }

  let U=null;
  const cfg={speed:.2,transparent:1,scale:1,frequency:1,warpStrength:1,mouseInfluence:1,parallax:.5,noise:.15,iterations:1,intensity:1.2,bandWidth:6};
  /* paleta propia del sitio: violeta y cian */
  const PALETAS={
    light:['#6d5cff','#00b8d4','#22d3ee'],
    dark:['#8f7dff','#22d3ee','#6d5cff']
  };
  const OPAC={light:.5,dark:.55};

  function hex2v3(hex){
    const h=hex.replace('#','').trim();
    return [parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255];
  }
  let colores=PALETAS.light;
  function aplicarTema(){
    if(!U) return;
    const th=document.documentElement.dataset.theme==='dark'?'dark':'light';
    colores=PALETAS[th];
    cv.style.opacity=OPAC[th];
    const arr=new Float32Array(MAX_COLORS*3);
    colores.slice(0,MAX_COLORS).forEach((hex,i)=>{const v=hex2v3(hex);arr[i*3]=v[0];arr[i*3+1]=v[1];arr[i*3+2]=v[2]});
    gl.uniform3fv(U.uColors,arr);
    gl.uniform1i(U.uColorCount,Math.min(colores.length,MAX_COLORS));
  }

  /* monta el programa y los uniforms; devuelve true si todo compila */
  function iniciar(){
    const vs=shader(gl.VERTEX_SHADER,vert), fs=shader(gl.FRAGMENT_SHADER,frag);
    if(!vs||!fs) return false;
    const prog=gl.createProgram();
    gl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) return false;
    gl.useProgram(prog);

    const buf=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1, 3,-1, -1,3]),gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(prog,'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);

    U={};
    ['uCanvas','uTime','uSpeed','uRot','uColorCount','uColors','uTransparent','uScale','uFrequency',
     'uWarpStrength','uPointer','uMouseInfluence','uParallax','uNoise','uIterations','uIntensity','uBandWidth']
     .forEach(n=>U[n]=gl.getUniformLocation(prog,n==='uColors'?'uColors[0]':n));

    gl.uniform1f(U.uSpeed,cfg.speed);
    gl.uniform1i(U.uTransparent,cfg.transparent);
    gl.uniform1f(U.uScale,cfg.scale);
    gl.uniform1f(U.uFrequency,cfg.frequency);
    gl.uniform1f(U.uWarpStrength,cfg.warpStrength);
    gl.uniform1f(U.uMouseInfluence,cfg.mouseInfluence);
    gl.uniform1f(U.uParallax,cfg.parallax);
    gl.uniform1f(U.uNoise,cfg.noise);
    gl.uniform1i(U.uIterations,cfg.iterations);
    gl.uniform1f(U.uIntensity,cfg.intensity);
    gl.uniform1f(U.uBandWidth,cfg.bandWidth);
    const rot90=[Math.cos(Math.PI/2),Math.sin(Math.PI/2)];
    gl.uniform2f(U.uRot,rot90[0],rot90[1]);
    aplicarTema();
    return true;
  }

  /* el puntero sólo sigue al ratón: el tacto no mueve el fondo,
     así el scroll no sacude la textura */
  const puntero={tx:0,ty:0,x:0,y:0};
  function mover(e){
    if(e.pointerType && e.pointerType!=='mouse') return;
    puntero.tx=(e.clientX/innerWidth)*2-1;
    puntero.ty=-(((e.clientY/innerHeight)*2)-1);
  }
  addEventListener('pointermove',mover,{passive:true});

  function redim(){
    const dpr=Math.min(devicePixelRatio||1,2);
    const w=Math.max(1,Math.round(cv.clientWidth*dpr)), h=Math.max(1,Math.round(cv.clientHeight*dpr));
    if(cv.width!==w||cv.height!==h){ cv.width=w; cv.height=h; }
    gl.viewport(0,0,cv.width,cv.height);
    gl.uniform2f(U.uCanvas,cv.clientWidth,cv.clientHeight);
  }

  const inicio=performance.now();
  let raf=null, quieto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function cuadro(){
    if(!U) return;
    const t=(performance.now()-inicio)/1000;
    gl.uniform1f(U.uTime,t);
    puntero.x+=(puntero.tx-puntero.x)*.08;
    puntero.y+=(puntero.ty-puntero.y)*.08;
    gl.uniform2f(U.uPointer,puntero.x,puntero.y);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,3);
  }
  function bucle(){
    raf=requestAnimationFrame(bucle);
    cuadro();
  }
  function parar(){ if(raf){cancelAnimationFrame(raf); raf=null;} }

  /* al cambiar el tamaño se redibuja en el acto: el búfer queda
     lleno aunque el navegador detenga los fotogramas (scroll iOS) */
  addEventListener('resize',()=>{ if(!U) return; redim(); cuadro(); },{passive:true});

  /* pérdida y recuperación del contexto WebGL */
  cv.addEventListener('webglcontextlost',e=>{ e.preventDefault(); parar(); },false);
  cv.addEventListener('webglcontextrestored',()=>{ if(iniciar()){ redim(); if(!quieto) bucle(); else cuadro(); } },false);

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) parar();
    else if(!raf && !quieto && U) bucle();
  });

  if(iniciar()){
    gl.clearColor(0,0,0,0);
    redim();
    if(quieto) cuadro();        /* movimiento reducido: un solo fotograma */
    else bucle();
    new MutationObserver(aplicarTema).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  }
})();
