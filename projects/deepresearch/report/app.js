'use strict';
(() => {
  document.documentElement.classList.add('reader-enhanced');
  const header=document.querySelector('.reader-header');
  const mobile=document.querySelector('.mobile-toc');
  const links=[...document.querySelectorAll('.toc-links a')];
  const sections=[...new Set(links.map(a=>a.hash))].map(hash=>document.getElementById(hash.slice(1)));
  const setHeader=()=>document.documentElement.style.setProperty('--header-height',`${header.getBoundingClientRect().height}px`);
  setHeader();if('ResizeObserver' in window)new ResizeObserver(setHeader).observe(header);
  const update=()=>{
    const threshold=header.getBoundingClientRect().height+(matchMedia('(max-width:900px)').matches?85:55);
    const current=[...sections].reverse().find(s=>s.getBoundingClientRect().top<threshold)||sections[0];
    for(const link of links){if(link.hash===`#${current.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
  };
  let queued=false;addEventListener('scroll',()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{update();queued=false;});},{passive:true});
  addEventListener('resize',()=>{setHeader();update();});update();
  function reveal(hash){
    let id;try{id=decodeURIComponent(hash.slice(1));}catch{return;}
    const target=document.getElementById(id);if(!target)return;
    let node=target;while(node){if(node instanceof HTMLDetailsElement)node.open=true;node=node.parentElement;}
    requestAnimationFrame(()=>{
      target.scrollIntoView({block:'start'});
      const focusTarget=target instanceof HTMLDetailsElement?target.querySelector(':scope>summary'):target;
      if(focusTarget){if(!focusTarget.matches('a,button,input,select,textarea,summary,[tabindex]'))focusTarget.setAttribute('tabindex','-1');focusTarget.focus({preventScroll:true});}
      update();
    });
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');if(!link)return;
    if(link.closest('.mobile-toc'))mobile.open=false;
    // Opening the target also opens every containing <details>; no fetched HTML.
    reveal(link.hash);
  });
  addEventListener('hashchange',()=>reveal(location.hash));
  if(location.hash)reveal(location.hash);
})();
