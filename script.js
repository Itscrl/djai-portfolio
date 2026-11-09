/* Djai final — browser-only. No form, backend, tracker or external library. */
(()=>{'use strict';
const owner='__djaiFinalRuntimeV1';if(window[owner]){window[owner].scan();return;}
let current=null,dispose=()=>{},scheduled=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const wantsReduced=()=>reduced.matches&&document.documentElement.dataset.djaiMotion!=='full';
function scan(){const root=document.getElementById('djai-final');if(root===current)return;dispose();current=root;if(!root)return;dispose=mount(root);}
function mount(root){
 const controller=new AbortController(),signal=controller.signal,cleanups=[];
 const on=(el,type,fn,options={})=>el?.addEventListener(type,fn,{...options,signal});
 const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
 // Full-page builder hosts only: mark structural ancestors, never the app/editor shell.
 let host=root.parentElement;while(host&&host!==document.body&&!host.matches('main,[role=main]')){
  if(host.matches('.c-custom-code,.custom-code-container,.c-column,.c-row,.c-section,.inner')){const markedHost=host;markedHost.classList.add('djai-final-host');cleanups.push(()=>markedHost.classList.remove('djai-final-host'));}
  host=host.parentElement;
 }
 const themeButton=$('[data-theme-toggle]'),system=matchMedia('(prefers-color-scheme: dark)');let manual=false,storedTheme=null;
 try{storedTheme=localStorage.getItem('djai-theme');manual=['dark','light'].includes(storedTheme);}catch{}
 const theme=()=>document.documentElement.dataset.djaiTheme==='dark'?'dark':'light';
 const syncTheme=()=>{const dark=theme()==='dark';themeButton.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} mode`);themeButton.setAttribute('aria-pressed',String(dark));document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#151a30':'#f4f7ff');};
 if(!document.documentElement.dataset.djaiTheme)document.documentElement.dataset.djaiTheme=manual?storedTheme:system.matches?'dark':'light';syncTheme();
 on(themeButton,'click',()=>{manual=true;const next=theme()==='dark'?'light':'dark';const change=()=>{document.documentElement.dataset.djaiTheme=next;try{localStorage.setItem('djai-theme',next);}catch{}syncTheme();};if(document.startViewTransition&&!wantsReduced())document.startViewTransition(change);else change();});
 on(system,'change',()=>{if(!manual){document.documentElement.dataset.djaiTheme=system.matches?'dark':'light';syncTheme();}});
 on(window,'storage',e=>{if(e.key==='djai-theme'){manual=['dark','light'].includes(e.newValue);document.documentElement.dataset.djaiTheme=manual?e.newValue:system.matches?'dark':'light';syncTheme();}});
 const menu=$('.menu-toggle'),nav=$('.main-nav');
 function closeMenu(restore=false){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');if(restore)menu.focus();}
 on(menu,'click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('is-open',open);});
 on(root,'click',e=>{const a=e.target.closest('a[href^="#djai-"]');if(a)closeMenu();});
 on(document,'keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open'))closeMenu(true);});
 on(document,'click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
 const cards=$$('.art-card'),filters=$$('[data-filter]'),grid=$('.art-grid');
 const art=cards.map(card=>{const img=card.querySelector('img');return{number:Number(card.querySelector('[data-art]').dataset.art),type:card.dataset.type,label:card.querySelector('.art-caption>span').textContent,src:img.getAttribute('src'),alt:card.querySelector('.art-caption>span').textContent+' '+card.querySelector('[data-art]').dataset.art+' by Djai'};});
 let activeFilter='all',viewerItems=art,index=0,opener=null;
 filters.forEach(button=>on(button,'click',()=>{
  const positions=new Map(cards.filter(c=>!c.hidden).map(c=>[c,c.getBoundingClientRect()]));activeFilter=button.dataset.filter;
  filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));grid.classList.toggle('is-filtered',activeFilter!=='all');
  cards.forEach(card=>{card.hidden=activeFilter!=='all'&&card.dataset.type!==activeFilter;card.classList.add('is-visible');});
  if(!wantsReduced())cards.filter(c=>!c.hidden).forEach(card=>{const before=positions.get(card),after=card.getBoundingClientRect();card.animate(before?[{transform:`translate(${before.left-after.left}px,${before.top-after.top}px)`},{transform:'none'}]:[{opacity:.1,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:450,easing:'cubic-bezier(.2,.7,.2,1)'});});
  const count=cards.filter(c=>!c.hidden).length;$('#djai-gallery-status').textContent=`Showing ${count} ${activeFilter==='all'?'artworks':button.childNodes[0].textContent.trim().toLowerCase()}.`;
 }));
 const dialog=$('.art-viewer'),viewerImage=$('.viewer-image');let scrollBefore='';
 function showArt(){const item=viewerItems[index];viewerImage.src=item.src;viewerImage.alt=item.alt;$('#djai-viewer-title').textContent=item.label;$('.viewer-counter').textContent=`${String(item.number).padStart(2,'0')} / 10`;
  if(!wantsReduced())viewerImage.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:300,easing:'ease-out'});
 }
 function step(delta){index=(index+delta+viewerItems.length)%viewerItems.length;showArt();}
 on(root,'click',e=>{const button=e.target.closest('[data-art]');if(!button)return;opener=button;const number=Number(button.dataset.art);const filtered=art.filter(a=>activeFilter==='all'||a.type===activeFilter);viewerItems=filtered.some(a=>a.number===number)?filtered:art;index=viewerItems.findIndex(a=>a.number===number);showArt();scrollBefore=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();$('.viewer-close').focus();});
 on($('.viewer-close'),'click',()=>dialog.close());on($('.viewer-prev'),'click',()=>step(-1));on($('.viewer-next'),'click',()=>step(1));
 on(dialog,'keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='Tab'){const first=$('.viewer-close'),last=$('.viewer-next');if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 on(dialog,'click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 on(dialog,'close',()=>{document.body.style.overflow=scrollBefore;opener?.focus({preventScroll:true});});
 let revealObserver,navObserver;
 if('IntersectionObserver'in window){revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObserver.unobserve(e.target);}}),{threshold:.08,rootMargin:'0px 0px -15px 0px'});$$('[data-reveal]').forEach(el=>{el.classList.add('reveal-ready');revealObserver.observe(el);});
 navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)$$('.main-nav a').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}),{rootMargin:'-15% 0px -55% 0px'});$$('main>section[id]').forEach(s=>navObserver.observe(s));}
 let raf=0;const progress=()=>{raf=0;const r=root.getBoundingClientRect(),range=root.offsetHeight-innerHeight;$('.reading-progress').style.transform=`scaleX(${range>0?Math.min(1,Math.max(0,-r.top/range)):0})`;};
 on(window,'scroll',()=>{if(!raf)raf=requestAnimationFrame(progress);},{passive:true});on(window,'resize',()=>{if(innerWidth>760)closeMenu();progress();});progress();
 $('[data-year]').textContent=new Date().getFullYear();
 return()=>{if(dialog.open){dialog.close();document.body.style.overflow=scrollBefore;}controller.abort();revealObserver?.disconnect();navObserver?.disconnect();cancelAnimationFrame(raf);cleanups.forEach(fn=>fn());};
}
const observer=new MutationObserver(()=>{if(!scheduled){scheduled=true;queueMicrotask(()=>{scheduled=false;scan();});}});observer.observe(document.documentElement,{childList:true,subtree:true});window[owner]={scan};scan();
})();
