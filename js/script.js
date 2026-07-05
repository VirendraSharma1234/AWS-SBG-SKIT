(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- scroll-scrubbed assembly story ----------
  const storySection = document.getElementById('scrollStory');
  if(storySection){
    const shapeEls = [
      document.getElementById('shape1'), document.getElementById('shape2'),
      document.getElementById('shape3'), document.getElementById('shape4'),
      document.getElementById('shape5'), document.getElementById('shape6')
    ];
    const storyCore = document.getElementById('storyCore');
    const storyText = document.getElementById('storyText');
    const storyHint = document.getElementById('storyHint');

    // [startX, startY, startRot, endX, endY, endRot] — end positions form a hexagon ring
    const shapeConfig = [
      [-420, -260, -140,    0, -130,  -6],
      [ 480, -300,  150,  112,  -65,   8],
      [ 440,  320, -110,  112,   65,  -8],
      [ -60,  420,  190,    0,  130,   6],
      [-460,  180, -170, -112,   65,  -8],
      [  90, -440,  120, -112,  -65,   8]
    ];

    function lerp(a, b, t){ return a + (b - a) * t; }
    function smoothstep(t){ return t*t*(3 - 2*t); }

    let ticking = false;
    function updateStory(){
      ticking = false;
      const rect = storySection.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if(total <= 0) return;
      let progress = -rect.top / total;
      progress = Math.max(0, Math.min(1, progress));
      const eased = smoothstep(progress);

      shapeEls.forEach((el, i) => {
        if(!el) return;
        const [sx, sy, sr, ex, ey, er] = shapeConfig[i];
        const x = lerp(sx, ex, eased);
        const y = lerp(sy, ey, eased);
        const rot = lerp(sr, er, eased);
        const scale = lerp(0.7, 1, eased);
        const opacity = lerp(0.35, 1, eased);
        el.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`;
        el.style.opacity = opacity;
      });

      storyCore.classList.toggle('show', progress > 0.72);
      storyText.classList.toggle('show', progress > 0.6);
      if(storyHint) storyHint.style.opacity = progress > 0.08 ? '0' : '0.7';
    }
    function onStoryScroll(){
      if(!ticking){ requestAnimationFrame(updateStory); ticking = true; }
    }
    document.addEventListener('scroll', onStoryScroll, { passive:true });
    window.addEventListener('resize', updateStory);
    updateStory();
  }

  // ---------- magnifying-glass gradient text reveal ----------
  const magnifyWrapper = document.getElementById('magnifyWrapper');
  if(magnifyWrapper && !reduceMotion){
    const baseContent = document.getElementById('magnifyBase');
    const overlay = baseContent.cloneNode(true);
    overlay.id = '';
    overlay.classList.add('mh-gradient');
    overlay.setAttribute('aria-hidden', 'true');
    magnifyWrapper.appendChild(overlay);

    const lens = document.createElement('div');
    lens.className = 'magnify-lens';
    magnifyWrapper.appendChild(lens);

    const radius = 110;
    let targetX = 0, targetY = 0, curX = 0, curY = 0, raf = null;

    function render(){
      const dx = targetX - curX;
      const dy = targetY - curY;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        curX += dx * 0.18;
        curY += dy * 0.18;
        overlay.style.clipPath = `circle(${radius}px at ${curX}px ${curY}px)`;
        lens.style.transform = `translate(${curX - 110}px, ${curY - 110}px)`;
        raf = requestAnimationFrame(render);
      } else {
        raf = null;
      }
    }

    magnifyWrapper.addEventListener('pointerenter', (e) => {
      if(e.pointerType === 'touch') return;
      const rect = magnifyWrapper.getBoundingClientRect();
      curX = targetX = e.clientX - rect.left;
      curY = targetY = e.clientY - rect.top;
      overlay.style.clipPath = `circle(${radius}px at ${curX}px ${curY}px)`;
      lens.style.transform = `translate(${curX - 110}px, ${curY - 110}px)`;
      magnifyWrapper.classList.add('hovering');
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    });

    magnifyWrapper.addEventListener('pointermove', (e) => {
      if(e.pointerType === 'touch') return;
      const rect = magnifyWrapper.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (!raf) raf = requestAnimationFrame(render);
    });

    magnifyWrapper.addEventListener('pointerleave', (e) => {
      if(e.pointerType === 'touch') return;
      magnifyWrapper.classList.remove('hovering');
      if(raf) cancelAnimationFrame(raf);
      overlay.style.clipPath = `circle(0px at ${curX}px ${curY}px)`;
    });

    // Touch events for mobile
    magnifyWrapper.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const rect = magnifyWrapper.getBoundingClientRect();
      curX = targetX = touch.clientX - rect.left;
      curY = targetY = touch.clientY - rect.top;
      overlay.style.clipPath = `circle(${radius}px at ${curX}px ${curY}px)`;
      lens.style.transform = `translate(${curX - 110}px, ${curY - 110}px)`;
      magnifyWrapper.classList.add('hovering');
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    }, {passive: true});

    magnifyWrapper.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = magnifyWrapper.getBoundingClientRect();
      targetX = touch.clientX - rect.left;
      targetY = touch.clientY - rect.top;
      if (!raf) raf = requestAnimationFrame(render);
    }, {passive: true});

    magnifyWrapper.addEventListener('touchend', () => {
      magnifyWrapper.classList.remove('hovering');
      if(raf) cancelAnimationFrame(raf);
      overlay.style.clipPath = `circle(0px at ${curX}px ${curY}px)`;
    });
  }

  // ---------- boot loader ----------
  const bootLoader = document.getElementById('bootLoader');
  const bootBarFill = document.getElementById('bootBarFill');
  if(bootLoader){
    if(reduceMotion){
      bootLoader.remove();
    } else {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => { bootBarFill.style.width = '100%'; });
      setTimeout(() => {
        bootLoader.classList.add('exit');
        document.body.style.overflow = '';
        setTimeout(() => bootLoader.remove(), 750);
      }, 1900);
    }
  }

  // ---------- spotlight hover tracking ----------
  document.querySelectorAll('.spotlight').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  // ---------- cursor cloud-particle trail ----------
  const canvas = document.getElementById('cursorCanvas');
  if(canvas && !reduceMotion){
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    let lastSpawn = 0;
    
    function spawnParticle(x, y) {
      const now = performance.now();
      if(now - lastSpawn < 35) return;
      lastSpawn = now;
      const colors = ['255,153,0', '41,182,216', '234,240,245'];
      particles.push({
        x:x, y:y,
        vx:(Math.random()-0.5)*0.4, vy:-0.3 - Math.random()*0.4,
        r:6 + Math.random()*10,
        life:1,
        color:colors[Math.floor(Math.random()*colors.length)]
      });
      if(particles.length > 90) particles.shift();
    }

    window.addEventListener('mousemove', (e) => spawnParticle(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => spawnParticle(e.touches[0].clientX, e.touches[0].clientY), {passive: true});

    function tick(){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.012; p.r += 0.15;
        if(p.life > 0){
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${p.color},${p.life*0.18})`;
          ctx.filter = 'blur(2px)';
          ctx.fill();
        }
      });
      particles = particles.filter(p => p.life > 0);
      requestAnimationFrame(tick);
    }
    tick();
  }

  // ---------- hero scroll parallax ----------
  const heroNetwork = document.querySelector('.hero-network-wrap');
  function heroParallax(){
    const y = window.scrollY;
    if(y < window.innerHeight && heroNetwork){
      heroNetwork.style.transform = `translateY(calc(-50% + ${y*0.18}px)) scale(${1 - y*0.0003})`;
    }
  }
  document.addEventListener('scroll', heroParallax, { passive:true });

  // ---------- nav scroll state ----------
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('progressBar');
  const toTop = document.getElementById('toTop');

  function onScroll(){
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    const h = document.documentElement;
    const scrollPct = (y / (h.scrollHeight - h.clientHeight)) * 100;
    progressBar.style.width = scrollPct + '%';
    toTop.classList.toggle('show', y > 600);
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // ---------- cloud parallax ----------
  const cloudEls = document.querySelectorAll('.cloud-parallax');
  function onCloudScroll(){
    const y = window.scrollY;
    cloudEls.forEach(el => {
      const speed = parseFloat(el.dataset.speed || 0.05);
      el.style.transform = `translateY(${y * speed}px)`;
    });
  }
  document.addEventListener('scroll', onCloudScroll, { passive:true });
  onCloudScroll();

  toTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  // ---------- mobile nav ----------
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('active');
    header.classList.toggle('nav-open');
  });
  
  mainNav.addEventListener('click', (e) => {
    if(e.target === mainNav || e.target.tagName === 'UL') {
      mainNav.classList.remove('open');
      navToggle.classList.remove('active');
      header.classList.remove('nav-open');
    }
  });

  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('active');
    header.classList.remove('nav-open');
  }));

  // ---------- interactive terminal chatbot (rule-based, no external API) ----------
  const termOutput = document.getElementById('termOutput');
  const termInput = document.getElementById('termInput');
  let awaitingName = true;
  let builderName = '';

  function scrollTermToBottom(){
    if(termOutput) termOutput.scrollTop = termOutput.scrollHeight;
  }

  function printLine(text, cls){
    if(!termOutput) return;
    const div = document.createElement('div');
    div.className = 'line' + (cls ? ' ' + cls : '');
    div.textContent = text;
    termOutput.appendChild(div);
    scrollTermToBottom();
  }

  function printTyped(text, cls, speed){
    return new Promise((resolve) => {
      if(!termOutput) return resolve();
      const div = document.createElement('div');
      div.className = 'line' + (cls ? ' ' + cls : '');
      termOutput.appendChild(div);
      let i = 0;
      const step = () => {
        div.textContent = text.slice(0, i);
        scrollTermToBottom();
        i++;
        if(i <= text.length){
          setTimeout(step, speed || 16);
        } else {
          resolve();
        }
      };
      step();
    });
  }

  const jokes = [
    'Why did the developer go broke? Because they lost their domain in a divorce.',
    'There is no cloud — it is just someone else\'s computer (with really good uptime).',
    'S3 bucket walks into a bar. Bartender says "sorry, access denied."',
    '99 little bugs in the code, 99 little bugs — take one down, patch it around, 127 little bugs in the code.'
  ];

  const knowledgeBase = [
    { keys: ['event', 'workshop', 'hackathon', 'schedule', 'session'], reply: "Our year kicks off with the Orientation Session — date dropping soon! More sessions are lined up right after. Scroll to the Events section 👇" },
    { keys: ['team', 'lead', 'who', 'runs', 'founder'], reply: "We're run by 6 students — Shlok (Club Lead), Virendra (Technical Lead), Tushar (Events), Naman (Community), Vansh (PR) and Soumya (Social/Marketing). Full squad is in the Team section." },
    { keys: ['join', 'member', 'sign', 'up', 'register'], reply: "Easiest way in: hit the WhatsApp group in the Join section, or tap the 'Join the crew' button up top. Zero forms, zero fees." },
    { keys: ['social', 'instagram', 'linkedin', 'meetup', 'insta'], reply: "We're on LinkedIn, Instagram and Meetup — links are in the Join section footer." },
    { keys: ['about', 'what', 'purpose', 'mission'], reply: "AWS Student Builder Group SKIT is a student-run community that turns cloud theory into shipped projects — workshops, hackathons, cert sprints, all of it." },
    { keys: ['ec2', 'elastic', 'compute'], reply: "Amazon EC2 provides scalable computing capacity in the cloud. It's like renting a virtual computer to run your own computer applications." },
    { keys: ['s3', 'simple', 'storage'], reply: "Amazon S3 is an object storage service. You can use it to store and protect any amount of data for a range of use cases." },
    { keys: ['lambda', 'serverless'], reply: "AWS Lambda lets you run code without provisioning or managing servers. You pay only for the compute time you consume." },
    { keys: ['dynamodb', 'database', 'db'], reply: "Amazon DynamoDB is a fast and flexible NoSQL database service for any scale." },
    { keys: ['vpc', 'virtual', 'private', 'network'], reply: "Amazon VPC lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define." },
    { keys: ['cloudfront', 'cdn', 'delivery'], reply: "Amazon CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally." },
    { keys: ['iam', 'identity', 'access', 'security'], reply: "AWS IAM provides fine-grained access control across all of AWS. You can control who can access which services and resources." },
    { keys: ['rds', 'relational'], reply: "Amazon RDS makes it easy to set up, operate, and scale a relational database in the cloud." },
    { keys: ['route53', 'dns', 'domain'], reply: "Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service." },
    { keys: ['sqs', 'queue', 'message'], reply: "Amazon SQS is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications." }
  ];

  let botState = 'normal';

  function findMatch(q) {
    const words = q.split(/[\s,.-]+/);
    for (const kb of knowledgeBase) {
      if (kb.keys.some(k => q.includes(k))) return kb.reply;
      for (const w of words) {
        for (const k of kb.keys) {
          if (k.length > 3 && w.length >= 3 && (w.startsWith(k.slice(0, 3)) || k.startsWith(w.slice(0, 3)))) {
            return kb.reply;
          }
        }
      }
    }
    return null;
  }

  const helpText = 'Try: about · events · team · join · socials · joke · clear · help';

  function botReply(raw){
    const q = raw.toLowerCase().trim();
    if(!q) return "Say something, I don't bite — I'm just JavaScript.";
    
    if (botState === 'menu') {
      botState = 'normal';
      if (q === '1') return "Our year kicks off with the Orientation Session! Check the Events section for more.";
      if (q === '2') return "Try asking me about specific services like EC2, S3, Lambda, VPC, DynamoDB, RDS, etc.";
      if (q === '3') return "You can reach us on LinkedIn or Instagram. Links are at the bottom of the page!";
      return "Exiting menu. What else can I help you with?";
    }

    if(/\bhelp\b/.test(q)) return helpText;
    if(/(joke|funny|pun)/.test(q)) return jokes[Math.floor(Math.random() * jokes.length)];
    if(/(clear|reset)/.test(q)){ 
      termOutput.innerHTML = ''; 
      (async () => {
        await printTyped('Booting AWS Student Builder Group console...', 'sys', 12);
        await printTyped('✓ Connected — ready to chat', 'bot', 12);
      })();
      return null; 
    }
    if(/(thank|thanks|thx)/.test(q)) return "Anytime, builder. 🚀";
    if(/(hi|hello|hey|yo)/.test(q)) return `Hey again, ${builderName || 'builder'}! What do you want to know?`;
    if(/(bye|exit|quit)/.test(q)) return "Catch you in the WhatsApp group 👋";
    
    // Easter Eggs
    if(q === 'sudo' || q.startsWith('sudo ')) return "User is not in the sudoers file. This incident will be reported to Shlok.";
    if(q === 'theme matrix') {
      document.documentElement.style.setProperty('--bg', '#000');
      document.documentElement.style.setProperty('--bg-panel', '#050a05');
      document.documentElement.style.setProperty('--bg-panel-2', '#0a140a');
      document.documentElement.style.setProperty('--text', '#00ff00');
      document.documentElement.style.setProperty('--text-dim', '#00cc00');
      document.documentElement.style.setProperty('--orange', '#00ff00');
      document.documentElement.style.setProperty('--orange-light', '#ccffcc');
      document.documentElement.style.setProperty('--blue', '#00aa00');
      document.documentElement.style.setProperty('--border', 'rgba(0,255,0,0.2)');
      document.documentElement.style.setProperty('--border-bright', 'rgba(0,255,0,0.6)');
      return "Wake up, Neo... The Matrix theme has been applied.";
    }

    const match = findMatch(q);
    if (match) return match;

    botState = 'menu';
    return "I'm not sure about that! But I can help you with:\n[1] Upcoming Events\n[2] AWS Service Summaries\n[3] Contact the Team\nType a number to continue.";
  }

  async function handleTermInput(value){
    const trimmed = value.trim();
    if(!trimmed) return;
    printLine('$ ' + trimmed, 'you');

    if(awaitingName){
      builderName = trimmed.split(' ')[0];
      awaitingName = false;
      await printTyped(`Nice to meet you, ${builderName}! Welcome to the AWS Student Builder Group, SKIT. 🚀`, 'bot');
      await printTyped(helpText, 'sys');
      return;
    }

    const reply = botReply(trimmed);
    if(reply) await printTyped(reply, 'bot');
  }

  if(termInput){
    termInput.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){
        const value = termInput.value;
        termInput.value = '';
        handleTermInput(value);
      }
    });

    // boot sequence for the terminal chat
    (async function bootTerminalChat(){
      await new Promise(r => setTimeout(r, 900));
      await printTyped('$ aws sbg --init', 'sys', 10);
      await new Promise(r => setTimeout(r, 200));
      await printTyped('Booting AWS Student Builder Group console...', 'sys', 12);
      await printTyped('✓ Connected — ready to chat', 'bot', 12);
      await printTyped("What's your name, builder?", 'bot', 20);
    })();
  }

  // node chip stagger & click handler
  document.querySelectorAll('.node-chip').forEach((chip, i) => {
    chip.style.animationDelay = (1.1 + i * 0.09) + 's';
    chip.addEventListener('click', () => {
      handleTermInput(chip.textContent.trim());
    });
  });

  // ---------- word-by-word heading reveal ----------
  const splitEls = document.querySelectorAll('.split-reveal');
  splitEls.forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="word"><span class="word-inner">${w}</span></span>`).join(' ');
    el.querySelectorAll('.word-inner').forEach((w, i) => {
      w.style.transitionDelay = (i * 0.055) + 's';
    });
  });
  const splitIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        splitIo.unobserve(entry.target);
      }
    });
  }, { threshold:0.35 });
  splitEls.forEach(el => splitIo.observe(el));

  // ---------- scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });
  revealEls.forEach(el => io.observe(el));

  // ---------- counter animation ----------
  const statNums = document.querySelectorAll('.stat-num');
  const counted = new WeakSet();
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting && !counted.has(entry.target)){
        counted.add(entry.target);
        const el = entry.target;
        const match = el.textContent.match(/\d+/);
        if(!match) return;
        const target = parseInt(match[0], 10);
        const suffix = el.textContent.replace(/\d+/, '');
        let start = 0;
        const dur = 1200;
        const startTime = performance.now();
        function step(now){
          const progress = Math.min((now - startTime) / dur, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if(progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    });
  }, { threshold:0.5 });
  statNums.forEach(el => statIo.observe(el));

  // ---------- team card tilt ----------
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ---------- terminal window controls ----------
  const terminalWrap = document.getElementById('terminalWrap');
  const terminalEl = document.getElementById('terminalEl');
  const tdotClose = document.getElementById('tdotClose');
  const tdotMin = document.getElementById('tdotMin');
  const tdotMax = document.getElementById('tdotMax');

  // red: close — fades out then the window is fully removed
  tdotClose.addEventListener('click', () => {
    terminalWrap.classList.add('is-closing');
    setTimeout(() => terminalWrap.classList.add('is-removed'), 350);
  });

  // yellow: toggles minimize (top bar only, 3 dots) <-> maximize (full window)
  tdotMin.addEventListener('click', () => {
    terminalEl.classList.toggle('is-minimized');
  });

  // green: intentionally a no-op (traffic-light look only)
  tdotMax.addEventListener('click', () => {});

  // ---------- Latency Dodger Logic ----------
  const gameLauncher = document.getElementById('gameLauncher');
  const gameModal = document.getElementById('gameModal');
  const gameCloseBtn = document.getElementById('gameCloseBtn');
  const gameCanvas = document.getElementById('gameCanvas');
  const gameOverlay = document.getElementById('gameOverlay');
  const gameStartBtn = document.getElementById('gameStartBtn');
  const gameScoreLabel = document.getElementById('gameScoreLabel');
  const gameBestLabel = document.getElementById('gameBestLabel');

  if (gameLauncher && gameCanvas) {
    const gctx = gameCanvas.getContext('2d');
    const GW = gameCanvas.width, GH = gameCanvas.height;

    // ---- best score (persisted) ----
    let best = 0;
    try{ best = parseInt(localStorage.getItem('ld_best') || '0', 10) || 0; }catch(e){ best = 0; }
    if(gameBestLabel) gameBestLabel.textContent = 'Best: ' + best;

    // ---- game state ----
    let player, obstacles, orbs, score, spawnTimer, elapsed;
    let running = false, raf = null, lastTime = 0;
    const keys = {};

    function resetGame(){
      player = { x: GW/2, y: GH-50, r:18, targetX: GW/2 };
      obstacles = [];
      orbs = [];
      score = 0;
      elapsed = 0;
      spawnTimer = 500;
    }

    // ---- modal open/close ----
    function openGameModal(){
      gameModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      showStartScreen();
    }
    function closeGameModal(){
      gameModal.classList.remove('open');
      document.body.style.overflow = '';
      running = false;
      if(raf) cancelAnimationFrame(raf);
    }
    gameLauncher.addEventListener('click', openGameModal);
    if(gameCloseBtn) gameCloseBtn.addEventListener('click', closeGameModal);
    gameModal.addEventListener('click', (e) => { if(e.target === gameModal) closeGameModal(); });

    function showStartScreen(){
      gameOverlay.style.display = 'flex';
      gameOverlay.querySelector('h3').textContent = 'Latency Dodger';
      gameOverlay.querySelector('p').innerHTML = 'Dodge the red latency spikes.<br>Grab green cache hits for points.<br>Arrow keys / A&nbsp;D to move, or drag with your mouse.';
      gameStartBtn.textContent = 'Start ▶';
    }

    if(gameStartBtn) {
      gameStartBtn.addEventListener('click', () => {
        resetGame();
        gameOverlay.style.display = 'none';
        running = true;
        lastTime = performance.now();
        raf = requestAnimationFrame(loop);
      });
    }

    // ---- main loop ----
    function loop(t){
      if(!running) return;
      const dt = Math.min(40, t - lastTime); // clamp dt so tab-switching doesn't cause huge jumps
      lastTime = t;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }

    function update(dt){
      elapsed += dt;
      const speedMul = 1 + elapsed / 22000; // difficulty ramps up over ~22s cycles

      // keyboard movement
      let dir = 0;
      if(keys['ArrowLeft'] || keys['a'] || keys['A']) dir -= 1;
      if(keys['ArrowRight'] || keys['d'] || keys['D']) dir += 1;
      if(dir !== 0){
        player.targetX += dir * 0.55 * dt;
        player.targetX = Math.max(player.r, Math.min(GW - player.r, player.targetX));
      }
      player.x += (player.targetX - player.x) * 0.22; // smooth easing toward target

      // spawn obstacles/orbs
      spawnTimer -= dt;
      if(spawnTimer <= 0){
        spawnTimer = Math.max(240, 620 - elapsed / 45); // spawns get faster over time
        const x = 26 + Math.random() * (GW - 52);
        if(Math.random() < 0.28){
          orbs.push({ x, y:-20, r:9, vy:0.17 * speedMul });
        } else {
          obstacles.push({ x, y:-30, w:30 + Math.random()*22, h:20, vy:0.21 * speedMul });
        }
      }

      obstacles.forEach(o => o.y += o.vy * dt);
      orbs.forEach(o => o.y += o.vy * dt);
      obstacles = obstacles.filter(o => o.y < GH + 40);
      orbs = orbs.filter(o => o.y < GH + 40);

      // collision: player vs obstacle
      for(const o of obstacles){
        const cx = Math.max(o.x - o.w/2, Math.min(player.x, o.x + o.w/2));
        const cy = Math.max(o.y - o.h/2, Math.min(player.y, o.y + o.h/2));
        const dx = player.x - cx, dy = player.y - cy;
        if(dx*dx + dy*dy < player.r*player.r){ endGame(); return; }
      }
      // collision: player vs orb
      for(let i = orbs.length - 1; i >= 0; i--){
        const o = orbs[i];
        const dx = player.x - o.x, dy = player.y - o.y;
        if(Math.sqrt(dx*dx + dy*dy) < player.r + o.r){ orbs.splice(i, 1); score += 15; }
      }

      score += dt * 0.012; // slow trickle of survival points
      if(gameScoreLabel) gameScoreLabel.textContent = 'Score: ' + Math.floor(score);
    }

    function draw(){
      gctx.clearRect(0, 0, GW, GH);
      gctx.fillStyle = '#050a10';
      gctx.fillRect(0, 0, GW, GH);

      // faint grid backdrop
      gctx.strokeStyle = 'rgba(255,153,0,0.07)';
      gctx.lineWidth = 1;
      for(let gx = 0; gx < GW; gx += 40){ gctx.beginPath(); gctx.moveTo(gx, 0); gctx.lineTo(gx, GH); gctx.stroke(); }

      // obstacles (triangles)
      gctx.fillStyle = '#ff4d4d';
      obstacles.forEach(o => {
        gctx.beginPath();
        gctx.moveTo(o.x, o.y - o.h/2);
        gctx.lineTo(o.x + o.w/2, o.y + o.h/2);
        gctx.lineTo(o.x - o.w/2, o.y + o.h/2);
        gctx.closePath();
        gctx.fill();
      });

      // orbs (circles)
      gctx.fillStyle = '#3ddc84';
      orbs.forEach(o => {
        gctx.beginPath();
        gctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
        gctx.fill();
      });

      // player (simple cloud made of 3 overlapping circles)
      gctx.fillStyle = '#eaf0f5';
      gctx.beginPath();
      gctx.arc(player.x - 9, player.y + 4, 11, 0, Math.PI*2);
      gctx.arc(player.x + 9, player.y + 4, 11, 0, Math.PI*2);
      gctx.arc(player.x, player.y - 7, 13, 0, Math.PI*2);
      gctx.fill();
    }

    function endGame(){
      running = false;
      if(raf) cancelAnimationFrame(raf);
      const finalScore = Math.floor(score);
      if(finalScore > best){
        best = finalScore;
        try{ localStorage.setItem('ld_best', String(best)); }catch(e){}
      }
      if(gameBestLabel) gameBestLabel.textContent = 'Best: ' + best;
      gameOverlay.style.display = 'flex';
      gameOverlay.querySelector('h3').textContent = 'Game over';
      gameOverlay.querySelector('p').innerHTML = 'You scored <strong style="color:#ffc94d">' + finalScore + '</strong>.<br>Best so far: ' + best + '.';
      gameStartBtn.textContent = 'Play again ▶';
    }

    // ---- input ----
    window.addEventListener('keydown', (e) => { 
      keys[e.key] = true;
      if (!running && gameModal.classList.contains('open') && (e.key === 'Enter' || e.key === ' ')) {
        if (gameOverlay.style.display !== 'none' && gameStartBtn) {
          gameStartBtn.click();
        }
      }
    });
    window.addEventListener('keyup', (e) => { keys[e.key] = false; });

    gameCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });
    gameCanvas.addEventListener('pointermove', (e) => {
      if(!running) return;
      const rect = gameCanvas.getBoundingClientRect();
      const scaleX = GW / rect.width;
      const x = (e.clientX - rect.left) * scaleX;
      player.targetX = Math.max(player.r, Math.min(GW - player.r, x));
    });
  }

})();

