const examples = [
    { who:'Late reply', rough:'sorry busy', better:"Sorry, I got caught up. Didn't mean to ignore you — I should've replied earlier." },
    { who:'Not my fault', rough:'how do i say this is not my fault', better:"I understand why it looks that way, but I want to clarify this wasn't from my side." },
    { who:'Hinglish', rough:'kkrh', better:'kuch khaas nahi, tu bata?' },
    { who:'Work mail', rough:'tell x we did not book these parts error came', better:'Hi, I\u2019d like to clarify these parts were not booked from our side. We are checking the error and will update you shortly.' },
  ];

  const dotsWrap = document.getElementById('progressDots');
  examples.forEach((_,i)=>{ const d=document.createElement('i'); if(i===0) d.className='on'; dotsWrap.appendChild(d); });

  const roughEl = document.getElementById('roughText');
  const betterEl = document.getElementById('betterText');
  const whoEl = document.getElementById('demoWho');
  const wandLabel = document.getElementById('wandLabel');
  const dots = dotsWrap.children;
  let idx = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function typeText(el, text, speed, cb){
    el.textContent = '';
    if(reduced){ el.textContent = text; cb && cb(); return; }
    let i = 0;
    const id = setInterval(()=>{
      i++;
      el.textContent = text.slice(0,i);
      if(i>=text.length){ clearInterval(id); cb && cb(); }
    }, speed);
  }

  function runCycle(){
    const ex = examples[idx];
    whoEl.textContent = ex.who;
    betterEl.textContent = '';
    roughEl.classList.remove('strike'); void roughEl.offsetWidth; roughEl.classList.add('strike');
    wandLabel.textContent = 'Tap to rewrite';
    [...dots].forEach((d,i)=> d.className = i===idx ? 'on' : '');

    typeText(roughEl, ex.rough, 42, ()=>{
      setTimeout(()=>{
        wandLabel.textContent = 'Rewritten';
        typeText(betterEl, ex.better, 16, ()=>{
          setTimeout(()=>{ idx = (idx+1) % examples.length; runCycle(); }, 2200);
        });
      }, 500);
    });
  }
  runCycle();

  const track = document.getElementById('marqueeTrack');
  const tags = ['Apologies','Late replies','Work mail','Hinglish','Crush texts','Follow-ups','DMs','Clarifications'];
  for(let d=0; d<2; d++){
    tags.forEach(t=>{
      const s = document.createElement('span');
      s.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>' + t;
      track.appendChild(s);
    });
  }

  const notesData = examples;
  const notesGrid = document.getElementById('notesGrid');
  notesData.forEach(ex=>{
    const n = document.createElement('div');
    n.className = 'note';
    n.innerHTML = `<div class="tape"></div><div class="label">${ex.who}</div><div class="before-line">${ex.rough}</div><div class="arrow">&darr;</div><div class="after-line">${ex.better}</div>`;
    notesGrid.appendChild(n);
  });

  document.querySelectorAll('.feat.spot').forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX-r.left)+'px');
      card.style.setProperty('--my', (e.clientY-r.top)+'px');
    });
  });

  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold:0.15 });
  revealEls.forEach(el=>io.observe(el));

  const statEl = document.getElementById('statCount');
  let counted = false;
  const io2 = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting && !counted){
        counted = true;
        let n = 0; const target = 14822;
        const step = ()=>{ n += Math.ceil((target-n)/12); if(n>=target){ n=target; statEl.textContent = n.toLocaleString(); return; } statEl.textContent = n.toLocaleString(); requestAnimationFrame(step); };
        step();
      }
    });
  }, { threshold:0.4 });
  io2.observe(statEl);

  /* ---------------- scroll progress bar ---------------- */
  const progressBar = document.getElementById('scrollProgress');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  /* ---------------- custom cursor ring (desktop, non-reduced-motion) ---------------- */
  if(!reduced && window.matchMedia('(hover:hover)').matches){
    const ring = document.getElementById('cursorRing');
    let rx=0, ry=0, tx=0, ty=0;
    window.addEventListener('mousemove', e=>{ tx=e.clientX; ty=e.clientY; ring.classList.add('show'); });
    window.addEventListener('mouseleave', ()=> ring.classList.remove('show'));
    (function loop(){ rx += (tx-rx)*0.18; ry += (ty-ry)*0.18; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(loop); })();
    document.querySelectorAll('a, .btn, .wall-btn, .reel, .qcard, .note').forEach(el=>{
      el.addEventListener('mouseenter', ()=> ring.classList.add('big'));
      el.addEventListener('mouseleave', ()=> ring.classList.remove('big'));
    });

    /* magnetic primary buttons */
    document.querySelectorAll('.btn-primary').forEach(btn=>{
      btn.addEventListener('mousemove', e=>{
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width/2, my = e.clientY - r.top - r.height/2;
        btn.style.transform = `translate(${mx*0.22}px, ${my*0.32}px)`;
      });
      btn.addEventListener('mouseleave', ()=> btn.style.transform = '');
    });

    /* subtle 3D tilt on the phone mockup */
    const stage = document.querySelector('.demo-stage');
    const phoneEl = document.querySelector('.phone');
    if(stage && phoneEl){
      stage.style.perspective = '900px';
      stage.addEventListener('mousemove', e=>{
        const r = stage.getBoundingClientRect();
        const px = (e.clientX - r.left)/r.width - 0.5, py = (e.clientY - r.top)/r.height - 0.5;
        phoneEl.style.transform = `rotateY(${px*10}deg) rotateX(${-py*10}deg)`;
      });
      stage.addEventListener('mouseleave', ()=> phoneEl.style.transform = 'rotateY(0deg) rotateX(0deg)');
      phoneEl.style.transition = 'transform .4s cubic-bezier(.2,.8,.2,1)';
    }
  }

  /* ---------------- confetti burst on each rewrite ---------------- */
  function burst(originEl){
    if(reduced || !originEl) return;
    const r = originEl.getBoundingClientRect();
    const colors = ['#D9A94E','#2FBF8F','#E8C77A'];
    for(let i=0;i<10;i++){
      const p = document.createElement('span');
      const size = 4 + Math.random()*4;
      p.style.cssText = `position:fixed; left:${r.left+r.width/2}px; top:${r.top+r.height/2}px; width:${size}px; height:${size}px; border-radius:${Math.random()>.5?'50%':'2px'}; background:${colors[i%3]}; pointer-events:none; z-index:80; opacity:1;`;
      document.body.appendChild(p);
      const ang = Math.random()*Math.PI*2, dist = 30+Math.random()*46;
      const dx = Math.cos(ang)*dist, dy = Math.sin(ang)*dist - 18;
      p.animate([
        { transform:'translate(0,0) rotate(0deg)', opacity:1 },
        { transform:`translate(${dx}px, ${dy}px) rotate(${(Math.random()>.5?1:-1)*180}deg)`, opacity:0 }
      ], { duration:700+Math.random()*300, easing:'cubic-bezier(.2,.8,.2,1)' }).onfinish = ()=> p.remove();
    }
  }
  const wandBtnEl = document.querySelector('.wand-btn');
  const origRunCycleHook = wandLabel;
  let lastLabel = '';
  const wandObserver = new MutationObserver(()=>{
    if(wandLabel.textContent === 'Rewritten' && lastLabel !== 'Rewritten'){ burst(wandBtnEl); }
    lastLabel = wandLabel.textContent;
  });
  wandObserver.observe(wandLabel, { childList:true, characterData:true, subtree:true });

  /* ---------------- live demo reel ---------------- */
  const reelBox = document.getElementById('reelBox');
  const reelPlay = document.getElementById('reelPlay');
  const reelRough = document.getElementById('reelRough');
  const reelArrow = document.getElementById('reelArrow');
  const reelBetter = document.getElementById('reelBetter');
  let reelTimer = null, reelPlaying = false;
  function playReel(){
    if(reelPlaying) return;
    reelPlaying = true;
    reelPlay.classList.add('hide');
    const cycle = ()=>{
      [reelRough, reelArrow, reelBetter].forEach(el=>el.classList.remove('show'));
      void reelBox.offsetWidth;
      setTimeout(()=> reelRough.classList.add('show'), 120);
      setTimeout(()=> reelArrow.classList.add('show'), 900);
      setTimeout(()=> reelBetter.classList.add('show'), 1200);
    };
    cycle();
    reelTimer = setInterval(cycle, 4200);
  }
  reelPlay.addEventListener('click', playReel);
  new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting) playReel(); });
  }, { threshold:0.5 }).observe(reelBox);

  /* ---------------- testimonial wall ---------------- */
  const testimonials = [
    { name:'Aarav K.', role:'Beta tester, Bengaluru', quote:"Used it on a client email I'd been sitting on for two days. Wand fixed the tone in one tap, sent it right after.", delta:'Work mail', hue:16 },
    { name:'Priya M.', role:'Beta tester, Pune', quote:'Typed the Hinglish exactly how I say it out loud and it still landed the right register. Nobody else gets that right.', delta:'Hinglish', hue:150 },
    { name:'Devansh R.', role:'Beta tester, Delhi NCR', quote:"The apology one is scary good. Rewrote a 'my bad' into something that actually sounded like I meant it.", delta:'Apology', hue:38 },
    { name:'Meher S.', role:'Beta tester, Mumbai', quote:'I stopped rereading my DMs five times before sending. That alone is worth the beta seat.', delta:'DM', hue:16 },
    { name:'Kabir J.', role:'Beta tester, Hyderabad', quote:'Follow-up emails used to take me ten minutes each. Now it is type rough, tap wand, done.', delta:'Follow-up', hue:150 },
  ];
  const wallTrack = document.getElementById('wallTrack');
  function initials(n){ return n.split(' ').map(w=>w[0]).slice(0,2).join(''); }
  testimonials.forEach(t=>{
    const c = document.createElement('div');
    c.className = 'qcard';
    c.innerHTML = `
      <div class="stars">${'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6L22 9.6l-5 4.9 1.2 7-6.2-3.5L5.8 21.5 7 14.5l-5-4.9 7.1-1z"/></svg>'.repeat(5)}</div>
      <div class="quote">&ldquo;${t.quote}&rdquo;</div>
      <span class="delta">${t.delta}</span>
      <div class="who">
        <div class="avatar-g" style="background:linear-gradient(155deg, hsl(${t.hue} 85% 68%), hsl(${t.hue+18} 75% 48%));">${initials(t.name)}</div>
        <div><div class="name">${t.name}</div><div class="role">${t.role}</div></div>
      </div>`;
    wallTrack.appendChild(c);
  });
  document.getElementById('wallNext').addEventListener('click', ()=> wallTrack.scrollBy({ left:340, behavior:'smooth' }));
  document.getElementById('wallPrev').addEventListener('click', ()=> wallTrack.scrollBy({ left:-340, behavior:'smooth' }));
  let isDown=false, startX=0, scrollLeft=0;
  wallTrack.addEventListener('mousedown', e=>{ isDown=true; wallTrack.classList.add('grabbing'); startX=e.pageX; scrollLeft=wallTrack.scrollLeft; });
  window.addEventListener('mouseup', ()=>{ isDown=false; wallTrack.classList.remove('grabbing'); });
  window.addEventListener('mousemove', e=>{ if(!isDown) return; e.preventDefault(); wallTrack.scrollLeft = scrollLeft - (e.pageX - startX); });
