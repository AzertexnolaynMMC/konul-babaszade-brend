document.addEventListener('DOMContentLoaded', function(){

  /* ============ GLOSSARY ACCORDION ============ */
  document.querySelectorAll('.glossary-item').forEach(item => {
    const btn = item.querySelector('.glossary-q');
    const answer = item.querySelector('.glossary-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.glossary-item.open').forEach(o => { o.classList.remove('open'); o.querySelector('.glossary-a').style.maxHeight = null; });
      if(!isOpen){ item.classList.add('open'); answer.style.maxHeight = answer.scrollHeight + 'px'; }
    });
  });

  /* ============ MOOD SELECTOR ============ */
  const moodResponses = {
    great: 'Bunu eşitmək çox xoşdur! 🌿 Yaxşı anları qeyd etmək və xatırlamaq da öz-özlüyündə faydalı bir vərdişdir.',
    okay: 'Normal hiss etmək də tamamilə qəbul edilən bir haldır — hər gün "əla" olmaq məcburi deyil.',
    tired: 'Yorğunluq bədəninizin sizə nəyisə demək istədiyinin işarəsi ola bilər. Özünüzə bir az yumşaq davranın.',
    anxious: 'Narahatlıq hiss etmək çox insan üçün tanışdır. Aşağıdakı nəfəs məşqini sınamaq kömək edə bilər.',
    down: 'Kədərli hiss etdiyinizi bölüşdüyünüz üçün təşəkkürlər. Bunu tək daşımaq məcburiyyətində deyilsiniz — danışmaq faydalı ola bilər.'
  };
  const moodRow = document.getElementById('moodRow');
  const moodResponse = document.getElementById('moodResponse');
  if(moodRow){
    moodRow.querySelectorAll('.mood-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        moodRow.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
        const mood = btn.dataset.mood;
        let extra = '';
        if(mood === 'anxious' || mood === 'down'){
          extra = ' <a href="#booking">Real dəstək üçün buradan yaza bilərsiniz</a>.';
        }
        moodResponse.innerHTML = `<p>${moodResponses[mood]}</p>` + (extra ? `<div>${extra}</div>` : '');
        moodResponse.classList.add('show');
      });
    });
  }

  /* ============ BREATHING EXERCISE ============ */
  const circle = document.getElementById('breatheCircle');
  const startBtn = document.getElementById('breatheStart');
  const stopBtn = document.getElementById('breatheStop');
  const cycleLbl = document.getElementById('breatheCycles');
  let breatheTimer = null;
  let breatheStep = 0;
  let cycleCount = 0;
  const steps = [
    { cls:'expand', label:'Nəfəs alın...', duration:4000 },
    { cls:'hold', label:'Saxlayın...', duration:4000 },
    { cls:'contract', label:'Buraxın...', duration:6000 }
  ];
  function runBreatheStep(){
    const s = steps[breatheStep % steps.length];
    circle.className = 'breathe-circle ' + s.cls;
    circle.textContent = s.label;
    if(breatheStep % steps.length === 0) cycleCount++;
    cycleLbl.textContent = `Dövr: ${cycleCount}`;
    breatheStep++;
    breatheTimer = setTimeout(runBreatheStep, s.duration);
  }
  if(startBtn){
    startBtn.addEventListener('click', ()=>{
      if(breatheTimer) return;
      cycleCount = 0; breatheStep = 0;
      runBreatheStep();
    });
    stopBtn.addEventListener('click', ()=>{
      clearTimeout(breatheTimer);
      breatheTimer = null;
      circle.className = 'breathe-circle';
      circle.textContent = 'Başlayın';
      cycleLbl.textContent = 'Tövsiyə: 4-5 dövr';
    });
  }

  /* ============ QUIZ ============ */
  const quizBox = document.querySelector('.quiz-box');
  if(quizBox){
    const questions = [...quizBox.querySelectorAll('.quiz-question')];
    const progressDots = [...quizBox.querySelectorAll('.qp')];
    const result = document.getElementById('quizResult');
    const answers = [];

    function showQuestion(i){
      questions.forEach(q=>q.classList.remove('active'));
      if(i < questions.length){
        questions[i].classList.add('active');
        progressDots.forEach((d,k)=>d.classList.toggle('done', k < i));
      } else {
        progressDots.forEach(d=>d.classList.add('done'));
        showResult();
      }
    }

    function showResult(){
      const tally = {};
      answers.forEach(a=>{ tally[a] = (tally[a]||0) + 1; });
      let category = 'fardi';
      if(answers.includes('yeniyetme')) category = 'yeniyetme';
      else if(answers.includes('cutluk')) category = 'cutluk';
      else if(answers.includes('onlayn')) category = 'onlayn';

      const map = {
        fardi: { title:'Fərdi Konsultasiya sizə uyğun ola bilər', text:'Cavablarınıza görə, öz temponuzda, fərdi dəstəyə ehtiyacınız var kimi görünür.' },
        cutluk: { title:'Cütlük Konsultasiyası sizə uyğun ola bilər', text:'Birlikdə ünsiyyəti gücləndirmək istəyirsinizsə, bu format faydalı olacaq.' },
        yeniyetme: { title:'Yeniyetmə Konsultasiyası uyğun ola bilər', text:'Yeniyetmə üçün dəstəkləyici, valideyn iştirakı ilə aparılan format tövsiyə olunur.' },
        onlayn: { title:'Onlayn Konsultasiya sizə uyğun ola bilər', text:'Rahatlıq və çeviklik önəmlidirsə, onlayn format əla seçimdir.' }
      };
      document.getElementById('quizResultTitle').textContent = map[category].title;
      document.getElementById('quizResultText').textContent = map[category].text;
      result.classList.add('active');
    }

    quizBox.querySelectorAll('.quiz-option').forEach(opt=>{
      opt.addEventListener('click', ()=>{
        answers.push(opt.dataset.val);
        const current = questions.findIndex(q=>q.classList.contains('active'));
        showQuestion(current+1);
      });
    });

    const restart = document.getElementById('quizRestart');
    if(restart){
      restart.addEventListener('click', ()=>{
        answers.length = 0;
        result.classList.remove('active');
        showQuestion(0);
      });
    }
  }

  /* ============ FONT SIZE TOGGLE ============ */
  const fontLevels = ['', 'font-lg', 'font-xl'];
  let fontIdx = 0;
  function applyFont(){
    document.body.classList.remove('font-lg','font-xl');
    if(fontLevels[fontIdx]) document.body.classList.add(fontLevels[fontIdx]);
  }
  function cycleFont(){ fontIdx = (fontIdx+1) % fontLevels.length; applyFont(); }
  ['fontToggle','fontToggle_m'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('click', cycleFont);
  });

  /* ============ HIGH CONTRAST TOGGLE ============ */
  function toggleContrast(){
    document.body.classList.toggle('high-contrast');
    const on = document.body.classList.contains('high-contrast');
    ['contrastToggle','contrastToggle_m'].forEach(id=>{
      const el = document.getElementById(id);
      if(el) el.classList.toggle('active', on);
    });
  }
  ['contrastToggle','contrastToggle_m'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('click', toggleContrast);
  });

  /* ============ LANGUAGE SWITCHER (partial demo) ============ */
  const translations = {
    az: {
      nav_about:'Haqqımda', nav_pricing:'Xidmətlər', nav_media:'Video & Bloq', nav_faq:'FAQ', nav_contact:'Əlaqə',
      nav_cta:'Konsultasiya üçün müraciət et',
      hero_kicker:'Psixoloq · Psixoterapevt',
      hero_title:'Özünüzü daha yaxşı anlamağa doğru ilk addım.',
      hero_lede:'Daxili rahatlıq, sağlam münasibətlər və özünüzlə daha güclü bağ qurmaq üçün təhlükəsiz və mühakiməsiz bir məkan.',
      hero_secondary:'Məni tanıyın'
    },
    ru: {
      nav_about:'Обо мне', nav_pricing:'Услуги', nav_media:'Видео и блог', nav_faq:'Вопросы', nav_contact:'Контакты',
      nav_cta:'Записаться на консультацию',
      hero_kicker:'Психолог · Психотерапевт',
      hero_title:'Первый шаг к тому, чтобы лучше понять себя.',
      hero_lede:'Безопасное и непредвзятое пространство для внутреннего спокойствия, здоровых отношений и более глубокой связи с собой.',
      hero_secondary:'Узнать обо мне'
    },
    en: {
      nav_about:'About', nav_pricing:'Services', nav_media:'Video & Blog', nav_faq:'FAQ', nav_contact:'Contact',
      nav_cta:'Request a consultation',
      hero_kicker:'Psychologist · Psychotherapist',
      hero_title:'The first step toward understanding yourself better.',
      hero_lede:'A safe, non-judgmental space for inner calm, healthier relationships, and a stronger connection with yourself.',
      hero_secondary:'About me'
    }
  };

  function setLanguage(lang){
    const dict = translations[lang] || translations.az;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.dataset.i18n;
      if(dict[key]) el.textContent = dict[key];
    });
    document.documentElement.lang = lang;
    [['langAZ','az'],['langRU','ru'],['langEN','en'],['langAZ_m','az'],['langRU_m','ru'],['langEN_m','en']].forEach(([id,code])=>{
      const el = document.getElementById(id);
      if(el) el.classList.toggle('active', code === lang);
    });
  }
  [['langAZ','az'],['langRU','ru'],['langEN','en'],['langAZ_m','az'],['langRU_m','ru'],['langEN_m','en']].forEach(([id,code])=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('click', ()=>setLanguage(code));
  });

  /* ============ AMBIENT SOUND (synthesized, no file needed) ============ */
  let audioCtx, noiseSource, filterNode, gainNode;
  let soundOn = false;
  const soundFab = document.getElementById('soundFab');

  function startAmbientSound(){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++){ data[i] = Math.random()*2 - 1; }

    noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 500;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;

    noiseSource.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    noiseSource.start(0);
    gainNode.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 1.2);
  }

  function stopAmbientSound(){
    if(!audioCtx) return;
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.6);
    setTimeout(()=>{ if(noiseSource) noiseSource.stop(); if(audioCtx) audioCtx.close(); audioCtx = null; }, 700);
  }

  if(soundFab){
    soundFab.addEventListener('click', ()=>{
      soundOn = !soundOn;
      soundFab.classList.toggle('active', soundOn);
      if(soundOn) startAmbientSound(); else stopAmbientSound();
    });
  }

});
