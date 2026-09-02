document.addEventListener('DOMContentLoaded', function(){

  const fab = document.getElementById('aiFab');
  const panel = document.getElementById('aiChatPanel');
  const closeBtn = document.getElementById('aiChatClose');
  const body = document.getElementById('aiChatBody');
  const form = document.getElementById('aiChatForm');
  const input = document.getElementById('aiChatInput');
  const suggestions = document.getElementById('aiChatSuggestions');

  let opened = false;

  function openChat(){
    panel.classList.add('open');
    panel.setAttribute('aria-hidden','false');
    if(!opened){
      opened = true;
      setTimeout(()=>{
        addBotMessage('Salam! Mən Könül xanımın AI köməkçisiyəm 🌿 Bu, sadəcə nümunə söhbətdir, amma sizi dinləməkdən məmnun olaram. Sizi bura gətirən nədir?');
      }, 400);
    }
    input.focus();
  }
  function closeChat(){
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true');
  }

  fab.addEventListener('click', ()=> panel.classList.contains('open') ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  function scrollToBottom(){ body.scrollTop = body.scrollHeight; }

  function addUserMessage(text){
    const el = document.createElement('div');
    el.className = 'ai-msg user';
    el.textContent = text;
    body.appendChild(el);
    scrollToBottom();
  }

  function addBotMessage(html){
    const el = document.createElement('div');
    el.className = 'ai-msg bot';
    el.innerHTML = html;
    body.appendChild(el);
    scrollToBottom();
  }

  function showTyping(){
    const el = document.createElement('div');
    el.className = 'ai-typing';
    el.id = 'aiTypingIndicator';
    el.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(el);
    scrollToBottom();
  }
  function hideTyping(){
    const el = document.getElementById('aiTypingIndicator');
    if(el) el.remove();
  }

  function respond(userText){
    const t = userText.toLowerCase();

    // crisis / safety net — do not attempt "therapy", redirect to real help immediately
    const crisisWords = ['özümə zərər','intihar','yaşamaq istəmirəm','ölmək istəyirəm','bitirmək istəyirəm'];
    if(crisisWords.some(w => t.includes(w))){
      return 'Dediyiniz mənə çox ciddi gəlir və sizi tək qoymaq istəmirəm. Zəhmət olmasa dərhal real bir insanla — etibar etdiyiniz biri, ya da təcili yardım xətti ilə əlaqə saxlayın. Mən sadəcə demo AI-yam, bu tip vəziyyətdə kömək edə bilmərəm, amma <a href="#booking">Könül xanımla</a> mümkün qədər tez əlaqə saxlamağınızı çox tövsiyə edirəm.';
    }

    if(/salam|hey|necesen|necəsən/.test(t)){
      return 'Salam! Xoş gördük 🌿 Bugün sizi nə narahat edir, yoxsa sadəcə xidmətlər haqqında məlumat almaq istəyirsiniz?';
    }
    if(/qiymət|neçəyə|pul|nə qədər/.test(t)){
      return 'Xidmətlərimiz 60-100 AZN aralığındadır (formatdan asılı olaraq). Dəqiq siyahını <a href="#pricing">Xidmətlər və qiymətlər</a> bölməsində görə bilərsiniz.';
    }
    if(/görüş|seans|vaxt|rezervasiya|yazıl/.test(t)){
      return 'Əlbəttə! Aşağıdakı <a href="#booking">rezervasiya formasını</a> doldursanız, Könül xanım 24 saat ərzində sizinlə əlaqə saxlayacaq.';
    }
    if(/narahat|həyəcan|stress|təşviş/.test(t)){
      return 'Narahatlıq hiss etmək çox insan üçün tanışdır — tək deyilsiniz. Kiçik bir addım kimi, dərin nəfəs almaq faydalı ola bilər. Bu mövzunu daha dərindən danışmaq istəsəniz, real seans daha uyğun olar — <a href="#booking">buradan yazıla bilərsiniz</a>.';
    }
    if(/yuxu|yata bilmirəm|yuxusuzluq/.test(t)){
      return 'Yuxu problemləri çox vaxt gündəlik stresslə bağlı olur. Sabit yatma saatı və ekrandan uzaq durmaq kömək edə bilər. İstəsəniz, bunu seansda daha ətraflı müzakirə edə bilərik.';
    }
    if(/münasibət|sevgili|ailə|ər|arvad/.test(t)){
      return 'Münasibətlərdə çətinliklər yaşamaq normaldır və işlənə bilər. Fərdi və ya <a href="#pricing">cütlük konsultasiyası</a> bu mövzuda faydalı ola bilər.';
    }
    if(/təşəkkür|sağ ol|thanks/.test(t)){
      return 'Rica edirəm 🌿 Başqa sualınız olsa, buradayam.';
    }

    return 'Başa düşürəm, bunun sizin üçün vacib olduğunu hiss edirəm. Mən sadəcə nümunə bir AI köməkçiyəm və dərinliyinə gedə bilmərəm — amma bu mövzunu Könül xanımla real seansda ətraflı müzakirə edə bilərsiniz. <a href="#booking">Buradan müraciət edin</a>.';
  }

  function handleUserInput(text){
    if(!text.trim()) return;
    addUserMessage(text);
    input.value = '';
    suggestions.style.display = 'none';
    showTyping();
    const delay = 700 + Math.random()*700;
    setTimeout(()=>{
      hideTyping();
      addBotMessage(respond(text));
    }, delay);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    handleUserInput(input.value);
  });

  suggestions.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=> handleUserInput(chip.textContent));
  });

});
