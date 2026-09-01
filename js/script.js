document.addEventListener('DOMContentLoaded', function(){

  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30));

  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');
  burgerBtn.addEventListener('click', ()=>{ mobileMenu.classList.add('open'); burgerBtn.setAttribute('aria-expanded','true'); });
  closeMenu.addEventListener('click', ()=>{ mobileMenu.classList.remove('open'); burgerBtn.setAttribute('aria-expanded','false'); });
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>mobileMenu.classList.remove('open')));

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  function makeCarousel(trackId, dotsId, prevId, nextId, autoplay, interval, swipe){
    const track = document.getElementById(trackId);
    if(!track) return;
    const slides = track.children;
    const dotsWrap = document.getElementById(dotsId);
    let i = 0;
    if(dotsWrap){
      for(let k=0;k<slides.length;k++){
        const d = document.createElement('button');
        d.className = 'idot' + (k===0?' active':'');
        d.setAttribute('aria-label','Slayd ' + (k+1));
        d.addEventListener('click', ()=>go(k));
        dotsWrap.appendChild(d);
      }
    }
    function go(n){
      i = (n+slides.length)%slides.length;
      track.style.transform = `translateX(-${i*100}%)`;
      if(dotsWrap) [...dotsWrap.children].forEach((d,k)=>d.classList.toggle('active', k===i));
    }
    if(prevId) document.getElementById(prevId).addEventListener('click', ()=>go(i-1));
    if(nextId) document.getElementById(nextId).addEventListener('click', ()=>go(i+1));
    let timer;
    function play(){ timer = setInterval(()=>go(i+1), interval); }
    function stop(){ clearInterval(timer); }
    if(autoplay){ play(); track.parentElement.addEventListener('mouseenter', stop); track.parentElement.addEventListener('mouseleave', play); }
    if(swipe){
      let startX = 0;
      track.parentElement.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; stop(); }, {passive:true});
      track.parentElement.addEventListener('touchend', e=>{
        const dx = e.changedTouches[0].clientX - startX;
        if(dx > 40) go(i-1); else if(dx < -40) go(i+1);
        if(autoplay) play();
      });
    }
    return {go};
  }
  makeCarousel('itrack','idots','iprev','inext', true, 5000, true);
  makeCarousel('qtrack','qdots', null, null, true, 6000, true);
  makeCarousel('ptrack','pdots','pprev','pnext', false, 0, true);

  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(open => { open.classList.remove('open'); open.querySelector('.faq-a').style.maxHeight = null; });
      if(!isOpen){ item.classList.add('open'); answer.style.maxHeight = answer.scrollHeight + 'px'; }
    });
  });

  // media tabs (Instagram Reels / YouTube)
  const tabs = document.querySelectorAll('.media-tab');
  const panels = document.querySelectorAll('.media-panel');
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      panels.forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });

  const bookForm = document.getElementById('bookForm');
  if(bookForm){
    bookForm.addEventListener('submit', function(e){
      e.preventDefault();
      this.style.display = 'none';
      document.getElementById('formSuccess').classList.add('show');
    });
  }

});
