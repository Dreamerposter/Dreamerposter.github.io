(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav?.classList.contains('is-open')) { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded','false'); menu.focus(); }
  });
  const play = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const pause = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
  const format = t => `${String(Math.floor(t/60)).padStart(2,'0')}:${t%60<10?'0':''}${(t%60).toFixed(1)}`;
  document.querySelectorAll('[data-video-console]').forEach(box => {
    const video = box.querySelector('video'), button = box.querySelector('.video-play'), slider = box.querySelector('.video-scrub');
    const update = () => { const p=video.duration?video.currentTime/video.duration*100:0; slider.value=p; slider.style.setProperty('--progress',`${p}%`); box.querySelector('[data-time]').textContent=format(video.currentTime); box.querySelector('[data-frame]').textContent=String(Math.round(video.currentTime*30)).padStart(3,'0'); slider.setAttribute('aria-valuetext',format(video.currentTime)); };
    button.addEventListener('click', async () => { try { if(video.paused) await video.play(); else video.pause(); } catch { button.setAttribute('aria-label','视频暂时无法播放，请重新尝试'); } });
    video.addEventListener('play',()=>{box.classList.add('is-playing');button.innerHTML=pause;button.setAttribute('aria-label','暂停示例视频');});
    video.addEventListener('pause',()=>{box.classList.remove('is-playing');button.innerHTML=play;button.setAttribute('aria-label','播放示例视频');});
    video.addEventListener('ended',()=>{box.classList.remove('is-playing');button.innerHTML=play;button.setAttribute('aria-label','重新播放示例视频');});
    video.addEventListener('loadedmetadata',()=>{box.querySelector('[data-duration]').textContent=format(video.duration);update();});
    video.addEventListener('timeupdate',update);
    slider.addEventListener('input',()=>{if(Number.isFinite(video.duration)){video.currentTime=Number(slider.value)/100*video.duration;update();}});
  });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    let visible=0;document.querySelectorAll('[data-project-grid] [data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)visible++;});
    const empty=document.querySelector('.filter-empty');if(empty)empty.hidden=visible>0;
  }));
  const tabs=[...document.querySelectorAll('[data-cv-tab]')];
  function activate(tab){
    tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});
    const title=tab.dataset.cvTab==='academic'?'学术 CV':'求职简历';document.title=`${title} · ${document.querySelector('.cv-paper h2')?.textContent||''}`;
    const download=document.querySelector('[data-cv-download]');
    if(download){const href=download.dataset[tab.dataset.cvTab];download.hidden=!href;if(href)download.href=href;}
  }
  tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;activate(tabs[next]);tabs[next].focus();}});});
  document.querySelector('.print-cv')?.addEventListener('click',()=>window.print());
  document.querySelectorAll('.copy-citation').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(button.dataset.citation);button.textContent='已复制';}catch{button.textContent='请手动复制';}}));
})();
