/* ============================================================
   ui.js · tema claro/oscuro, ventana del autor, marca de pestaña
   cargado en TODAS las páginas
   ============================================================ */
'use strict';
(function(){
  /* ---- tema (arranque sin destello ya hecho en <head>) ---- */
  const btn=document.getElementById('themeBtn');
  if(btn) btn.addEventListener('click',()=>{
    const nx=document.documentElement.dataset.theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=nx;
    try{localStorage.setItem('vv_theme',nx)}catch(e){}
  });

  /* ---- pestaña activa ---- */
  const nav=document.querySelector('nav.tabs[data-nav]');
  if(nav){
    const cur=nav.dataset.nav;
    nav.querySelectorAll('.tab').forEach(a=>{
      if(a.dataset.page===cur) a.classList.add('on');
    });
  }

  /* ---- ventana flotante del autor ---- */
  const fab=document.getElementById('fab'), au=document.getElementById('author');
  if(fab&&au){
    fab.addEventListener('click',e=>{e.stopPropagation();au.classList.toggle('on')});
    const cx=au.querySelector('.close-x');
    if(cx) cx.addEventListener('click',()=>au.classList.remove('on'));
    document.addEventListener('click',e=>{
      if(au.classList.contains('on')&&!e.target.closest('#author')&&!e.target.closest('#fab')) au.classList.remove('on');
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape')au.classList.remove('on')});
  }

  /* ---- año del footer ---- */
  const y=document.getElementById('footYear');
  if(y) y.textContent=new Date().getFullYear();
})();
