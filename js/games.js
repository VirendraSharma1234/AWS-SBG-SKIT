(() => {
  // --- Core Game Manager ---
  const gameModal = document.getElementById('gameModal');
  const gameLibrary = document.getElementById('gameLibrary');
  const gamePlayArea = document.getElementById('gamePlayArea');
  const gameCanvas = document.getElementById('gameCanvas');
  const gameDom = document.getElementById('gameDom');
  const gameOverlay = document.getElementById('gameOverlay');
  const gameStartBtn = document.getElementById('gameStartBtn');
  const gameBackBtn = document.getElementById('gameBackBtn');
  const gameCloseBtn = document.getElementById('gameCloseBtn');
  const gameLauncher = document.getElementById('gameLauncher');
  const gameTitleText = document.getElementById('gameTitleText');
  const gameFooter = document.getElementById('gameFooter');
  const gameScoreLabel = document.getElementById('gameScoreLabel');
  const gameBestLabel = document.getElementById('gameBestLabel');

  let activeGame = null;

  class BaseGame {
    constructor(id, name, type) {
      this.id = id;
      this.name = name;
      this.type = type; // 'canvas' or 'dom'
      this.score = 0;
      this.best = 0;
      this.running = false;
      this.raf = null;
      this.lastTime = 0;
      
      try { this.best = parseInt(localStorage.getItem(this.id + '_best'), 10) || 0; } 
      catch(e) { this.best = 0; }
    }

    mount() {
      gameTitleText.textContent = `🎮 ${this.name}`;
      gameScoreLabel.textContent = 'Score: 0';
      gameBestLabel.textContent = `Best: ${this.best}`;
      gameFooter.style.display = 'flex';
      
      if (this.type === 'canvas') {
        gameCanvas.style.display = 'block';
        gameDom.style.display = 'none';
        this.ctx = gameCanvas.getContext('2d');
        this.w = gameCanvas.width;
        this.h = gameCanvas.height;
        this.ctx.clearRect(0, 0, this.w, this.h);
      } else {
        gameCanvas.style.display = 'none';
        gameDom.style.display = 'flex';
        gameDom.innerHTML = ''; 
      }
      
      this.showStartScreen();
    }

    unmount() {
      this.stop();
    }

    showStartScreen(gameOver = false) {
      gameOverlay.style.display = 'flex';
      gameStartBtn.textContent = gameOver ? 'Play Again 🚀' : 'Start 🚀';
    }

    start() {
      this.score = 0;
      this.running = true;
      gameOverlay.style.display = 'none';
      if(gameScoreLabel) gameScoreLabel.textContent = `Score: ${this.score}`;
      this.lastTime = performance.now();
      this.raf = requestAnimationFrame((t) => this.loop(t));
    }

    stop() {
      this.running = false;
      if (this.raf) cancelAnimationFrame(this.raf);
    }

    endGame() {
      this.stop();
      if (this.score > this.best) {
        this.best = Math.floor(this.score);
        try { localStorage.setItem(this.id + '_best', String(this.best)); } catch(e){}
      }
      gameBestLabel.textContent = `Best: ${this.best}`;
      this.showStartScreen(true);
    }

    loop(t) {
      if (!this.running) return;
      const dt = Math.min(40, t - this.lastTime);
      this.lastTime = t;
      this.update(dt);
      this.draw();
      this.raf = requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {}
    draw() {}
    handleKey(e) {}
    handlePointer(e, rect) {}
  }

  // --- Game 1: Latency Dodger ---
  class LatencyDodger extends BaseGame {
    constructor() {
      super('ld', 'Latency Dodger', 'canvas');
      this.keys = {};
      
      this.onKeyDown = (e) => { this.keys[e.key] = true; };
      this.onKeyUp = (e) => { this.keys[e.key] = false; };
    }

    mount() {
      super.mount();
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);
    }

    unmount() {
      super.unmount();
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('keyup', this.onKeyUp);
    }

    showStartScreen(gameOver = false) {
      super.showStartScreen(gameOver);
      const title = document.getElementById('overlayTitle');
      const desc = document.getElementById('overlayDesc');
      if (gameOver) {
        title.textContent = 'Game Over';
        desc.innerHTML = `You scored <strong style="color:#ffc94d">${Math.floor(this.score)}</strong>.<br>Best so far: ${this.best}.`;
      } else {
        title.textContent = 'Latency Dodger';
        desc.innerHTML = 'Dodge the red latency spikes.<br>Grab green cache hits for points.<br>Arrow keys / A D to move, or drag with your mouse.';
      }
    }

    start() {
      this.player = { x: this.w/2, y: this.h-50, r:18, targetX: this.w/2 };
      this.obstacles = [];
      this.orbs = [];
      this.elapsed = 0;
      this.spawnTimer = 500;
      super.start();
    }

    update(dt) {
      this.elapsed += dt;
      const speedMul = 1 + this.elapsed / 22000;

      let dir = 0;
      if(this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) dir -= 1;
      if(this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) dir += 1;
      if(dir !== 0){
        this.player.targetX += dir * 0.55 * dt;
        this.player.targetX = Math.max(this.player.r, Math.min(this.w - this.player.r, this.player.targetX));
      }
      this.player.x += (this.player.targetX - this.player.x) * 0.22;

      this.spawnTimer -= dt;
      if(this.spawnTimer <= 0){
        this.spawnTimer = Math.max(240, 620 - this.elapsed / 45);
        const x = 26 + Math.random() * (this.w - 52);
        if(Math.random() < 0.28){
          this.orbs.push({ x, y:-20, r:9, vy:0.17 * speedMul });
        } else {
          this.obstacles.push({ x, y:-30, w:30 + Math.random()*22, h:20, vy:0.21 * speedMul });
        }
      }

      this.obstacles.forEach(o => o.y += o.vy * dt);
      this.orbs.forEach(o => o.y += o.vy * dt);
      this.obstacles = this.obstacles.filter(o => o.y < this.h + 40);
      this.orbs = this.orbs.filter(o => o.y < this.h + 40);

      for(const o of this.obstacles){
        const cx = Math.max(o.x - o.w/2, Math.min(this.player.x, o.x + o.w/2));
        const cy = Math.max(o.y - o.h/2, Math.min(this.player.y, o.y + o.h/2));
        const dx = this.player.x - cx, dy = this.player.y - cy;
        if(dx*dx + dy*dy < this.player.r*this.player.r){ this.endGame(); return; }
      }
      
      for(let i = this.orbs.length - 1; i >= 0; i--){
        const o = this.orbs[i];
        const dx = this.player.x - o.x, dy = this.player.y - o.y;
        if(Math.sqrt(dx*dx + dy*dy) < this.player.r + o.r){ this.orbs.splice(i, 1); this.score += 15; }
      }

      this.score += dt * 0.012;
      if(gameScoreLabel) gameScoreLabel.textContent = 'Score: ' + Math.floor(this.score);
    }

    draw() {
      const gctx = this.ctx;
      gctx.clearRect(0, 0, this.w, this.h);
      gctx.fillStyle = '#050a10';
      gctx.fillRect(0, 0, this.w, this.h);

      gctx.strokeStyle = 'rgba(255,153,0,0.07)';
      gctx.lineWidth = 1;
      for(let gx = 0; gx < this.w; gx += 40){ gctx.beginPath(); gctx.moveTo(gx, 0); gctx.lineTo(gx, this.h); gctx.stroke(); }

      gctx.fillStyle = '#ff4d4d';
      this.obstacles.forEach(o => {
        gctx.beginPath();
        gctx.moveTo(o.x, o.y - o.h/2);
        gctx.lineTo(o.x + o.w/2, o.y + o.h/2);
        gctx.lineTo(o.x - o.w/2, o.y + o.h/2);
        gctx.closePath();
        gctx.fill();
      });

      gctx.fillStyle = '#3ddc84';
      this.orbs.forEach(o => {
        gctx.beginPath();
        gctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
        gctx.fill();
      });

      gctx.fillStyle = '#eaf0f5';
      gctx.beginPath();
      gctx.arc(this.player.x - 9, this.player.y + 4, 11, 0, Math.PI*2);
      gctx.arc(this.player.x + 9, this.player.y + 4, 11, 0, Math.PI*2);
      gctx.arc(this.player.x, this.player.y - 7, 13, 0, Math.PI*2);
      gctx.fill();
    }

    handlePointer(e, rect) {
      if(!this.running) return;
      const scaleX = this.w / rect.width;
      const x = (e.clientX - rect.left) * scaleX;
      this.player.targetX = Math.max(this.player.r, Math.min(this.w - this.player.r, x));
    }
  }

  // --- Game 2: Cloud Stacker ---
  class CloudStacker extends BaseGame {
    constructor() {
      super('cs', 'Cloud Stacker', 'canvas');
      this.onKeyDown = (e) => { 
        if (this.running && (e.key === ' ' || e.key === 'Enter')) {
          this.dropBlock();
        }
      };
    }

    mount() {
      super.mount();
      window.addEventListener('keydown', this.onKeyDown);
    }
    
    unmount() {
      super.unmount();
      window.removeEventListener('keydown', this.onKeyDown);
    }

    showStartScreen(gameOver = false) {
      super.showStartScreen(gameOver);
      const title = document.getElementById('overlayTitle');
      const desc = document.getElementById('overlayDesc');
      if (gameOver) {
        title.textContent = 'Game Over';
        desc.innerHTML = `Tower Height: <strong style="color:#ffc94d">${this.score}</strong>.<br>Best so far: ${this.best}.`;
      } else {
        title.textContent = 'Cloud Stacker';
        desc.innerHTML = 'Stack the server blocks.<br>Click/Tap or press Space to drop.<br>Overhangs are sliced off!';
      }
    }

    start() {
      this.blocks = [];
      this.debris = [];
      this.cameraY = 0;
      this.targetCameraY = 0;
      this.blockHeight = 35;
      this.awsServices = ['EC2', 'S3', 'Lambda', 'RDS', 'DynamoDB', 'VPC', 'IAM', 'CloudFront', 'ECS', 'EKS', 'SNS', 'SQS', 'Route 53', 'Redshift'];
      
      // Base block
      this.blocks.push({ x: this.w/2, y: this.h - this.blockHeight, w: 200, h: this.blockHeight, fixed: true, text: this.awsServices[0] });
      
      this.spawnBlock();
      super.start();
    }

    spawnBlock() {
      const topBlock = this.blocks[this.blocks.length - 1];
      const newY = topBlock.y - this.blockHeight;
      const w = topBlock.w;
      const speed = 2 + (this.score * 0.15); // Gets faster
      const dir = Math.random() > 0.5 ? 1 : -1;
      const startX = dir === 1 ? -w/2 : this.w + w/2;
      
      this.currentBlock = {
        x: startX,
        y: newY,
        w: w,
        h: this.blockHeight,
        vx: speed * dir,
        fixed: false,
        text: this.awsServices[(this.score + 1) % this.awsServices.length]
      };
      
      this.targetCameraY = Math.max(0, this.h - newY - 250);
    }

    dropBlock() {
      if(this.currentBlock.fixed) return;
      
      const topFixed = this.blocks[this.blocks.length - 1];
      const drop = this.currentBlock;
      
      // Calculate intersection
      const left1 = drop.x - drop.w/2;
      const right1 = drop.x + drop.w/2;
      const left2 = topFixed.x - topFixed.w/2;
      const right2 = topFixed.x + topFixed.w/2;
      
      const overlapLeft = Math.max(left1, left2);
      const overlapRight = Math.min(right1, right2);
      const overlap = overlapRight - overlapLeft;
      
      if (overlap > 5) { // Minimum tolerance
        // Successful drop
        this.score++;
        if(gameScoreLabel) gameScoreLabel.textContent = 'Score: ' + this.score;
        
        // Spawn debris for overhang
        if (left1 < left2) { // Debris on left
          this.debris.push({
            x: left1 + (left2 - left1)/2,
            y: drop.y, w: left2 - left1, h: drop.h,
            vx: -0.5, vy: 0
          });
        }
        if (right1 > right2) { // Debris on right
          this.debris.push({
            x: right2 + (right1 - right2)/2,
            y: drop.y, w: right1 - right2, h: drop.h,
            vx: 0.5, vy: 0
          });
        }
        
        // Fix the block
        drop.w = overlap;
        drop.x = overlapLeft + overlap/2;
        drop.fixed = true;
        this.blocks.push(drop);
        
        this.spawnBlock();
      } else {
        // Missed entirely
        drop.vy = 0;
        this.debris.push(drop);
        this.currentBlock = null;
        this.endGame();
      }
    }

    update(dt) {
      const gctx = this.ctx;
      
      // Camera pan
      this.cameraY += (this.targetCameraY - this.cameraY) * 0.1;
      
      // Current moving block
      if (this.currentBlock && !this.currentBlock.fixed) {
        this.currentBlock.x += this.currentBlock.vx * (dt/16);
        // Bounce off walls
        const hw = this.currentBlock.w/2;
        if (this.currentBlock.x - hw < 0) {
          this.currentBlock.x = hw;
          this.currentBlock.vx *= -1;
        } else if (this.currentBlock.x + hw > this.w) {
          this.currentBlock.x = this.w - hw;
          this.currentBlock.vx *= -1;
        }
      }
      
      // Update debris
      for(let i=this.debris.length-1; i>=0; i--) {
        const d = this.debris[i];
        d.vy += 0.3 * (dt/16); // gravity
        d.x += d.vx * (dt/16);
        d.y += d.vy * (dt/16);
        if (d.y > this.h + this.cameraY + 100) this.debris.splice(i, 1);
      }
    }

    draw() {
      const gctx = this.ctx;
      gctx.clearRect(0, 0, this.w, this.h);
      gctx.fillStyle = '#050a10';
      gctx.fillRect(0, 0, this.w, this.h);
      
      gctx.save();
      gctx.translate(0, this.cameraY);
      
      // Draw fixed blocks
      this.blocks.forEach((b, i) => {
        const hue = (200 + i * 20) % 360;
        gctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        gctx.fillRect(b.x - b.w/2, b.y, b.w, b.h);
        gctx.strokeStyle = '#050a10';
        gctx.lineWidth = 2;
        gctx.strokeRect(b.x - b.w/2, b.y, b.w, b.h);

        if (b.w > 40) {
          gctx.fillStyle = '#050a10';
          gctx.font = 'bold 13px monospace';
          gctx.textAlign = 'center';
          gctx.textBaseline = 'middle';
          gctx.fillText(b.text || '', b.x, b.y + b.h/2 + 1);
        }
      });
      
      // Draw moving block
      if (this.currentBlock) {
        const hue = (200 + this.blocks.length * 20) % 360;
        gctx.fillStyle = `hsl(${hue}, 80%, 70%)`;
        const b = this.currentBlock;
        gctx.fillRect(b.x - b.w/2, b.y, b.w, b.h);
        gctx.strokeStyle = '#050a10';
        gctx.lineWidth = 2;
        gctx.strokeRect(b.x - b.w/2, b.y, b.w, b.h);

        if (b.w > 40) {
          gctx.fillStyle = '#050a10';
          gctx.font = 'bold 13px monospace';
          gctx.textAlign = 'center';
          gctx.textBaseline = 'middle';
          gctx.fillText(b.text || '', b.x, b.y + b.h/2 + 1);
        }
      }
      
      // Draw debris
      gctx.fillStyle = '#ff4d4d';
      this.debris.forEach(d => {
        gctx.fillRect(d.x - d.w/2, d.y, d.w, d.h);
      });
      
      gctx.restore();
    }

    handlePointer(e, rect) {
      if(e.type === 'pointerdown' || e.type === 'touchstart') {
        if(this.running) this.dropBlock();
      }
    }
  }

  // --- Game 3: Deploy Race ---
  class DeployRace extends BaseGame {
    constructor() {
      super('dr', 'Deploy Race', 'dom');
      this.commands = [
        "aws s3 mb s3://my-bucket",
        "aws ec2 run-instances",
        "aws lambda invoke",
        "aws iam create-user",
        "aws rds create-db-instance",
        "aws sns publish",
        "aws sqs send-message",
        "aws cloudformation deploy",
        "aws dynamodb put-item",
        "aws ecs run-task",
        "aws route53 change-resource-record-sets",
        "aws apigateway create-rest-api",
        "aws ecr get-login-password",
        "aws secretsmanager get-secret-value",
        "aws cloudfront create-invalidation"
      ];
      
      this.onInputKeyDown = (e) => {
        if(e.key === 'Enter' && this.running) {
          const val = this.inputEl.value.trim();
          if(val === this.targetCmd) {
            this.handleSuccess();
          } else {
            // Shake effect on error
            this.inputEl.style.transform = 'translateX(10px)';
            setTimeout(() => this.inputEl.style.transform = 'translateX(-10px)', 50);
            setTimeout(() => this.inputEl.style.transform = 'translateX(0)', 100);
          }
        }
      };
    }

    showStartScreen(gameOver = false) {
      super.showStartScreen(gameOver);
      const title = document.getElementById('overlayTitle');
      const desc = document.getElementById('overlayDesc');
      if (gameOver) {
        const minutes = this.totalTime / 60000;
        // WPM approx: 1 command ~ 4 words
        const wpm = minutes > 0 ? Math.round((this.score * 4) / minutes) : 0;
        title.textContent = 'Timeout!';
        desc.innerHTML = `Commands typed: <strong style="color:#ffc94d">${this.score}</strong>.<br>Est. WPM: ${wpm}<br>Best so far: ${this.best}.`;
      } else {
        title.textContent = 'Deploy Race';
        desc.innerHTML = 'Type the AWS CLI commands exactly.<br>Hit Enter before the timer runs out.<br>It gets faster every time!';
      }
    }

    start() {
      gameDom.innerHTML = `
        <div style="width:85%; max-width:350px; display:flex; flex-direction:column; gap:20px; font-family:var(--mono);">
          <div style="width:100%; height:6px; background:#222; border-radius:3px; overflow:hidden;">
            <div id="drTimer" style="height:100%; width:100%; background:var(--orange); transition:width 0.1s linear;"></div>
          </div>
          <div>
            <span style="color:var(--text-dim); font-size:12px;">TARGET COMMAND:</span><br>
            <span id="drTarget" style="color:#3ddc84; font-size:16px; word-wrap:break-word;"></span>
          </div>
          <input type="text" id="drInput" autocomplete="off" spellcheck="false" 
            style="width:100%; background:rgba(0,0,0,0.5); border:1px solid var(--border); color:var(--text); padding:12px; font-family:var(--mono); border-radius:6px; font-size:14px; outline:none; transition:transform 0.1s;">
        </div>
      `;
      this.timerEl = document.getElementById('drTimer');
      this.targetEl = document.getElementById('drTarget');
      this.inputEl = document.getElementById('drInput');
      
      this.inputEl.addEventListener('keydown', this.onInputKeyDown);
      this.onDomClick = () => { if(this.inputEl) this.inputEl.focus(); };
      gameDom.addEventListener('click', this.onDomClick);
      gameDom.addEventListener('touchstart', this.onDomClick, {passive: true});
      
      this.timeLimit = 8000; // Start with 8 seconds
      this.timeRemaining = this.timeLimit;
      this.totalTime = 0;
      
      this.pickCommand();
      super.start();
      
      // Auto-focus needs slight delay in some browsers when DOM just inserted
      setTimeout(() => this.inputEl.focus(), 50);
    }

    stop() {
      if(this.inputEl) {
        this.inputEl.removeEventListener('keydown', this.onInputKeyDown);
      }
      gameDom.removeEventListener('click', this.onDomClick);
      gameDom.removeEventListener('touchstart', this.onDomClick);
      super.stop();
    }

    pickCommand() {
      let cmd;
      do {
        cmd = this.commands[Math.floor(Math.random() * this.commands.length)];
      } while(cmd === this.targetCmd && this.commands.length > 1);
      
      this.targetCmd = cmd;
      this.targetEl.textContent = '> ' + this.targetCmd;
      this.inputEl.value = '';
    }

    handleSuccess() {
      this.score++;
      if(gameScoreLabel) gameScoreLabel.textContent = 'Score: ' + this.score;
      
      // Speed up (floor at 2.6s)
      this.timeLimit = Math.max(2600, this.timeLimit - 400);
      this.timeRemaining = this.timeLimit;
      
      this.timerEl.style.width = '100%';
      this.timerEl.style.background = '#3ddc84';
      setTimeout(() => { if(this.running) this.timerEl.style.background = 'var(--orange)'; }, 200);
      
      this.pickCommand();
    }

    update(dt) {
      this.timeRemaining -= dt;
      this.totalTime += dt;
      
      if (this.timeRemaining <= 0) {
        this.endGame();
      } else {
        const pct = Math.max(0, (this.timeRemaining / this.timeLimit) * 100);
        this.timerEl.style.width = pct + '%';
        if (pct < 25) this.timerEl.style.background = '#ff4d4d';
      }
    }
  }

  // --- Game 4: Snake ---
  class Snake extends BaseGame {
    constructor() {
      super('sn', 'Snake', 'canvas');
      this.grid = 26; // SNAKE_CELL
      this.SNAKE_FRUITS = [
        { type:'apple', color:'#ff4d4d' },
        { type:'orange', color:'#ffa726' },
        { type:'lime', color:'#c6ff4d' },
        { type:'berry', color:'#ff4d9e' },
        { type:'grape', color:'#b967ff' }
      ];
      this.onKeyDown = (e) => {
        if(!this.running) return;
        const key = e.key;
        if(key === 'ArrowUp' || key === 'w' || key === 'W') { e.preventDefault(); this.setSnakeDir(0, -1); }
        else if(key === 'ArrowDown' || key === 's' || key === 'S') { e.preventDefault(); this.setSnakeDir(0, 1); }
        else if(key === 'ArrowLeft' || key === 'a' || key === 'A') { e.preventDefault(); this.setSnakeDir(-1, 0); }
        else if(key === 'ArrowRight' || key === 'd' || key === 'D') { e.preventDefault(); this.setSnakeDir(1, 0); }
      };
      
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.touchActive = false;
      this.swipeFired = false;
    }

    setSnakeDir(dx, dy) {
      if(dx !== 0 && this.dx === 0){ this.pendingDx = dx; this.pendingDy = 0; }
      else if(dy !== 0 && this.dy === 0){ this.pendingDx = 0; this.pendingDy = dy; }
    }

    mount() {
      super.mount();
      window.addEventListener('keydown', this.onKeyDown);
    }
    
    unmount() {
      super.unmount();
      window.removeEventListener('keydown', this.onKeyDown);
    }

    showStartScreen(gameOver = false) {
      super.showStartScreen(gameOver);
      const title = document.getElementById('overlayTitle');
      const desc = document.getElementById('overlayDesc');
      if (gameOver) {
        title.textContent = 'Game Over';
        desc.innerHTML = `You scored <strong style="color:var(--orange-light)">${this.score}</strong>.<br>Best so far: ${this.best}.`;
      } else {
        title.textContent = 'Snake';
        desc.innerHTML = 'Swipe (or arrow keys / W A S D) to steer.<br>Eat the fruit, don\'t hit yourself or the wall.';
      }
      if(this.ctx) this.drawBoardOnly();
    }

    start() {
      this.cols = Math.floor(this.w / this.grid);
      this.rows = Math.floor(this.h / this.grid);
      const cx = Math.floor(this.cols / 2), cy = Math.floor(this.rows / 2);
      
      this.snake = [{x: cx, y: cy}, {x: cx-1, y: cy}, {x: cx-2, y: cy}];
      this.prevSnake = this.snake.map(s => ({x: s.x, y: s.y}));
      
      this.dx = 1;
      this.dy = 0;
      this.pendingDx = 1;
      this.pendingDy = 0;
      
      this.apple = this.spawnApple();
      this.moveInterval = 120;
      this.moveAcc = 0;
      this.foodPulse = 0;
      super.start();
    }

    spawnApple() {
      let fx, fy, collide;
      do {
        fx = Math.floor(Math.random() * this.cols);
        fy = Math.floor(Math.random() * this.rows);
        collide = this.snake && this.snake.some(s => s.x === fx && s.y === fy);
      } while(collide);
      return { x: fx, y: fy, fruit: this.SNAKE_FRUITS[Math.floor(Math.random() * this.SNAKE_FRUITS.length)] };
    }

    update(dt) {
      this.moveAcc += dt;
      this.foodPulse += dt;
      if (this.moveAcc >= this.moveInterval) {
        this.moveAcc -= this.moveInterval;
        this.stepSnake();
      }
    }

    stepSnake() {
      this.prevSnake = this.snake.map(s => ({x: s.x, y: s.y}));
      this.dx = this.pendingDx;
      this.dy = this.pendingDy;
      
      const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
      
      // Wall collision
      if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
        this.endGame();
        return;
      }
      
      // Self collision
      if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
        this.endGame();
        return;
      }
      
      this.snake.unshift(head);
      
      // Apple collision
      if (head.x === this.apple.x && head.y === this.apple.y) {
        this.score += 10;
        if(gameScoreLabel) gameScoreLabel.textContent = 'Score: ' + this.score;
        this.apple = this.spawnApple();
        this.moveInterval = Math.max(70, this.moveInterval - 2.5); // gets faster
      } else {
        this.snake.pop(); // remove tail
      }
    }

    roundRect(ctx, x, y, w, h, r){
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    drawBoardOnly() {
      if(!this.ctx) return;
      const snctx = this.ctx;
      const NW = this.w;
      const NH = this.h;
      const SNAKE_CELL = this.grid;
      const SNAKE_COLS = Math.floor(NW / SNAKE_CELL);
      const SNAKE_ROWS = Math.floor(NH / SNAKE_CELL);

      snctx.clearRect(0, 0, NW, NH);

      // ambient gradient base
      const grad = snctx.createRadialGradient(NW/2, NH/2, 40, NW/2, NH/2, NW * 0.78);
      grad.addColorStop(0, '#0e1922');
      grad.addColorStop(1, '#050a10');
      snctx.fillStyle = grad;
      snctx.fillRect(0, 0, NW, NH);

      // faint dot-grid at cell intersections
      snctx.fillStyle = 'rgba(255,153,0,0.08)';
      for(let gx = 0; gx <= SNAKE_COLS; gx++){
        for(let gy = 0; gy <= SNAKE_ROWS; gy++){
          snctx.beginPath();
          snctx.arc(gx * SNAKE_CELL, gy * SNAKE_CELL, 1.1, 0, Math.PI*2);
          snctx.fill();
        }
      }

      // very soft checker texture on top for depth
      for(let ry = 0; ry < SNAKE_ROWS; ry++){
        for(let rx = 0; rx < SNAKE_COLS; rx++){
          if((rx + ry) % 2 === 0) continue;
          snctx.fillStyle = 'rgba(255,255,255,0.012)';
          snctx.fillRect(rx * SNAKE_CELL, ry * SNAKE_CELL, SNAKE_CELL, SNAKE_CELL);
        }
      }

      // glowing boundary
      snctx.save();
      snctx.shadowColor = 'rgba(255,153,0,0.55)';
      snctx.shadowBlur = 12;
      snctx.strokeStyle = '#ff9900';
      snctx.lineWidth = 4;
      snctx.strokeRect(2, 2, SNAKE_COLS * SNAKE_CELL - 4, SNAKE_ROWS * SNAKE_CELL - 4);
      snctx.restore();
    }

    drawFruit(ctx, cx, cy, s, fruit){
      ctx.save();
      ctx.shadowColor = fruit.color;
      ctx.shadowBlur = 10;

      if(fruit.type === 'grape'){
        ctx.fillStyle = fruit.color;
        const r = s * 0.15;
        [[-0.22,-0.12],[0.05,-0.18],[0.3,-0.06],[-0.1,0.12],[0.16,0.16],[-0.3,0.28],[0.02,0.36]].forEach(([ox,oy]) => {
          ctx.beginPath();
          ctx.arc(cx + ox*s, cy + oy*s, r, 0, Math.PI*2);
          ctx.fill();
        });
        ctx.strokeStyle = '#3ddc84';
        ctx.lineWidth = Math.max(1.2, s*0.05);
        ctx.beginPath();
        ctx.moveTo(cx, cy - s*0.34);
        ctx.lineTo(cx, cy - s*0.16);
        ctx.stroke();
      } else {
        // round fruit body
        ctx.fillStyle = fruit.color;
        ctx.beginPath();
        ctx.arc(cx, cy + s*0.04, s*0.4, 0, Math.PI*2);
        ctx.fill();

        // stem
        ctx.strokeStyle = '#7a5a3a';
        ctx.lineWidth = Math.max(1.5, s*0.08);
        ctx.beginPath();
        ctx.moveTo(cx, cy - s*0.36);
        ctx.lineTo(cx + s*0.06, cy - s*0.52);
        ctx.stroke();

        // leaf
        ctx.fillStyle = '#3ddc84';
        ctx.beginPath();
        ctx.ellipse(cx + s*0.2, cy - s*0.48, s*0.15, s*0.08, -0.6, 0, Math.PI*2);
        ctx.fill();

        // glossy highlight
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.arc(cx - s*0.13, cy - s*0.08, s*0.09, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }

    draw() {
      this.drawBoardOnly();
      if(!this.snake) return;

      const progress = Math.min(1, this.moveAcc / this.moveInterval);
      const snctx = this.ctx;
      const SNAKE_CELL = this.grid;

      // food
      const pulse = 1 + Math.sin(this.foodPulse / 220) * 0.14;
      const fcx = this.apple.x * SNAKE_CELL + SNAKE_CELL/2;
      const fcy = this.apple.y * SNAKE_CELL + SNAKE_CELL/2;
      this.drawFruit(snctx, fcx, fcy, SNAKE_CELL * pulse, this.apple.fruit);

      // snake body
      for(let i = this.snake.length - 1; i >= 0; i--){
        const s = this.snake[i];
        const prev = (i === 0) ? (this.prevSnake[0] || s) : (this.prevSnake[i-1] || s);
        const rx = prev.x + (s.x - prev.x) * progress;
        const ry = prev.y + (s.y - prev.y) * progress;
        const px = rx * SNAKE_CELL, py = ry * SNAKE_CELL;

        snctx.fillStyle = i === 0 ? '#ffc94d' : '#ff9900';
        this.roundRect(snctx, px + 2, py + 2, SNAKE_CELL - 4, SNAKE_CELL - 4, 8);
        snctx.fill();

        if(i === 0){
          // eyes
          const cx = px + SNAKE_CELL/2, cy = py + SNAKE_CELL/2;
          const ex = this.dx * SNAKE_CELL * 0.2, ey = this.dy * SNAKE_CELL * 0.2;
          const perpX = -this.dy * SNAKE_CELL * 0.17, perpY = this.dx * SNAKE_CELL * 0.17;
          const eyeR = SNAKE_CELL * 0.1;
          snctx.fillStyle = '#0a1018';
          snctx.beginPath();
          snctx.arc(cx + ex + perpX, cy + ey + perpY, eyeR, 0, Math.PI*2);
          snctx.arc(cx + ex - perpX, cy + ey - perpY, eyeR, 0, Math.PI*2);
          snctx.fill();
        }
      }
    }

    handlePointer(e, rect) {
      if(!this.running) return;
      
      const THRESHOLD = 6;
      if(e.type === 'pointerdown' || e.type === 'touchstart') {
        this.touchActive = true;
        this.swipeFired = false;
        this.touchStartX = e.clientX;
        this.touchStartY = e.clientY;
      } else if (e.type === 'pointermove' || e.type === 'touchmove') {
        if (!this.touchActive || this.swipeFired) return;
        
        const diffX = e.clientX - this.touchStartX;
        const diffY = e.clientY - this.touchStartY;
        
        if (Math.max(Math.abs(diffX), Math.abs(diffY)) >= THRESHOLD) {
          this.swipeFired = true;
          if (Math.abs(diffX) > Math.abs(diffY)) {
            this.setSnakeDir(diffX > 0 ? 1 : -1, 0);
          } else {
            this.setSnakeDir(0, diffY > 0 ? 1 : -1);
          }
          this.touchStartX = e.clientX;
          this.touchStartY = e.clientY;
          this.swipeFired = false;
        }
      } else if (e.type === 'pointerup' || e.type === 'touchend') {
        this.touchActive = false;
      }
    }
  }

  // --- Game 5: 2048 ---
  class Game2048 extends BaseGame {
    constructor() {
      super('g2048', '2048', 'dom');
      
      this.onKeyDown = (e) => {
        if(!this.running) return;
        const key = e.key;
        let moved = false;
        if(key === 'ArrowUp') moved = this.move('up');
        else if(key === 'ArrowDown') moved = this.move('down');
        else if(key === 'ArrowLeft') moved = this.move('left');
        else if(key === 'ArrowRight') moved = this.move('right');
        
        if(moved) {
          this.spawnTile();
          this.renderGrid();
          if(this.isGameOver()) this.endGame();
        }
      };

      this.touchStartX = 0;
      this.touchStartY = 0;
      this.onTouchStart = (e) => {
        if(!this.running) return;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      };
      
      this.onTouchEnd = (e) => {
        if(!this.running) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;
        
        if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
          let moved = false;
          if (Math.abs(dx) > Math.abs(dy)) {
            moved = dx > 0 ? this.move('right') : this.move('left');
          } else {
            moved = dy > 0 ? this.move('down') : this.move('up');
          }
          if (moved) {
            this.spawnTile();
            this.renderGrid();
            if(this.isGameOver()) this.endGame();
          }
        }
      };
    }

    mount() {
      super.mount();
      window.addEventListener('keydown', this.onKeyDown);
      gameDom.addEventListener('touchstart', this.onTouchStart, {passive: true});
      gameDom.addEventListener('touchend', this.onTouchEnd, {passive: true});
    }
    
    unmount() {
      super.unmount();
      window.removeEventListener('keydown', this.onKeyDown);
      gameDom.removeEventListener('touchstart', this.onTouchStart);
      gameDom.removeEventListener('touchend', this.onTouchEnd);
    }

    showStartScreen(gameOver = false) {
      super.showStartScreen(gameOver);
      const title = document.getElementById('overlayTitle');
      const desc = document.getElementById('overlayDesc');
      if (gameOver) {
        title.textContent = 'Game Over';
        desc.innerHTML = `Score: <strong style="color:#ffc94d">${this.score}</strong>.<br>Best so far: ${this.best}.`;
      } else {
        title.textContent = '2048';
        desc.innerHTML = 'Merge numbers to reach 2048.<br>Use Arrow Keys or Swipe to slide tiles.';
      }
    }

    start() {
      gameDom.innerHTML = `
        <div style="background:#111; padding:8px; border-radius:8px; display:grid; grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(4,1fr); gap:8px; width:280px; height:280px;" id="g2048Grid">
        </div>
      `;
      this.gridEl = document.getElementById('g2048Grid');
      this.board = Array(4).fill(0).map(() => Array(4).fill(0));
      
      this.spawnTile();
      this.spawnTile();
      this.renderGrid();
      
      super.start();
    }

    spawnTile() {
      const empty = [];
      for(let r=0; r<4; r++){
        for(let c=0; c<4; c++){
          if(this.board[r][c] === 0) empty.push({r,c});
        }
      }
      if(empty.length > 0) {
        const {r,c} = empty[Math.floor(Math.random() * empty.length)];
        this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
      }
    }

    renderGrid() {
      this.gridEl.innerHTML = '';
      const colors = {
        0: '#222', 2: '#eee', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
        32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
        512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
      };
      
      for(let r=0; r<4; r++){
        for(let c=0; c<4; c++){
          const val = this.board[r][c];
          const div = document.createElement('div');
          div.style.width = '100%';
          div.style.height = '100%';
          div.style.background = colors[val] || '#3c3a32';
          div.style.color = val > 4 ? '#fff' : '#333';
          div.style.display = 'flex';
          div.style.alignItems = 'center';
          div.style.justifyContent = 'center';
          div.style.fontSize = val > 100 ? '20px' : '26px';
          div.style.fontWeight = 'bold';
          div.style.borderRadius = '4px';
          div.textContent = val > 0 ? val : '';
          this.gridEl.appendChild(div);
        }
      }
      if(gameScoreLabel) gameScoreLabel.textContent = 'Score: ' + this.score;
    }

    move(dir) {
      let moved = false;
      const b = this.board;
      
      const slide = (row) => {
        let arr = row.filter(val => val);
        let merged = [];
        for(let i=0; i<arr.length; i++) {
          if(arr[i] === arr[i+1]) {
            merged.push(arr[i]*2);
            this.score += arr[i]*2;
            i++;
          } else {
            merged.push(arr[i]);
          }
        }
        while(merged.length < 4) merged.push(0);
        return merged;
      };

      if (dir === 'left' || dir === 'right') {
        for(let r=0; r<4; r++) {
          let row = b[r];
          if(dir === 'right') row = [...row].reverse();
          let newRow = slide(row);
          if(dir === 'right') newRow.reverse();
          for(let c=0; c<4; c++) {
            if(b[r][c] !== newRow[c]) moved = true;
            b[r][c] = newRow[c];
          }
        }
      } else {
        for(let c=0; c<4; c++) {
          let col = [b[0][c], b[1][c], b[2][c], b[3][c]];
          if(dir === 'down') col.reverse();
          let newCol = slide(col);
          if(dir === 'down') newCol.reverse();
          for(let r=0; r<4; r++) {
            if(b[r][c] !== newCol[r]) moved = true;
            b[r][c] = newCol[r];
          }
        }
      }
      return moved;
    }

    isGameOver() {
      for(let r=0; r<4; r++){
        for(let c=0; c<4; c++){
          if(this.board[r][c] === 0) return false;
          if(c < 3 && this.board[r][c] === this.board[r][c+1]) return false;
          if(r < 3 && this.board[r][c] === this.board[r+1][c]) return false;
        }
      }
      return true;
    }
  }

  // --- Game 6: Reflex Rush ---
  class ReflexRush extends BaseGame {
    constructor() {
      super('rr', 'Reflex Rush', 'dom');
      
      this.onCircleClick = () => {
        if (!this.running) return;
        
        if (this.state === 'waiting') {
          // Clicked too early
          clearTimeout(this.timeout);
          this.circle.style.background = '#ff4d4d';
          this.circle.innerHTML = 'Too soon!<br><span style="font-size:16px;">Click to retry</span>';
          this.state = 'early';
        } else if (this.state === 'ready') {
          // Clicked on time
          const reactionTime = Math.round(performance.now() - this.greenTime);
          this.score = reactionTime;
          
          if (this.best === 0 || reactionTime < this.best) {
            this.best = reactionTime;
            try { localStorage.setItem(this.id + '_best', String(this.best)); } catch(e){}
          }
          if(gameBestLabel) gameBestLabel.textContent = `Best: ${this.best}ms`;
          
          let rank = '';
          if (reactionTime < 150) rank = 'Faster than 99% of players! 🤯';
          else if (reactionTime < 200) rank = 'Faster than 90% of players! 🔥';
          else if (reactionTime < 250) rank = 'Faster than 70% of players! 🚀';
          else if (reactionTime < 300) rank = 'Average human reflexes 🤷';
          else rank = 'A bit slow, try again! 🐢';
          
          this.circle.style.background = 'var(--orange)';
          this.circle.innerHTML = `${reactionTime} ms<br><span style="font-size:14px; margin-top:10px; display:block;">${rank}</span><br><span style="font-size:12px; margin-top:10px; display:block;">Click to try again</span>`;
          this.state = 'done';
        } else if (this.state === 'early' || this.state === 'done') {
          this.resetRound();
        }
      };
    }

    showStartScreen(gameOver = false) {
      super.showStartScreen(gameOver);
      const title = document.getElementById('overlayTitle');
      const desc = document.getElementById('overlayDesc');
      title.textContent = 'Reflex Rush';
      desc.innerHTML = 'Wait for the circle to turn GREEN.<br>Click it as fast as you can!';
    }

    start() {
      gameDom.innerHTML = `
        <div id="rrCircle" style="width:250px; height:250px; border-radius:50%; background:#ff4d4d; display:flex; align-items:center; justify-content:center; text-align:center; color:#fff; font-family:var(--body); font-weight:bold; font-size:24px; cursor:pointer; box-shadow:0 10px 30px rgba(0,0,0,0.5); user-select:none;">
          Wait for Green...
        </div>
      `;
      this.circle = document.getElementById('rrCircle');
      this.circle.addEventListener('pointerdown', (e) => { e.preventDefault(); this.onCircleClick(); });
      
      super.start();
      this.resetRound();
    }
    
    stop() {
      clearTimeout(this.timeout);
      super.stop();
    }

    resetRound() {
      this.state = 'waiting';
      this.circle.style.background = '#ff4d4d';
      this.circle.innerHTML = 'Wait for Green...';
      
      const randomDelay = 2000 + Math.random() * 3000;
      this.timeout = setTimeout(() => {
        if(this.running) {
          this.state = 'ready';
          this.circle.style.background = '#3ddc84';
          this.circle.innerHTML = 'CLICK!';
          this.greenTime = performance.now();
        }
      }, randomDelay);
    }
  }

  // --- Game 7: Connect 4 ---
  class Connect4 extends BaseGame {
    constructor() {
      super('c4', 'Connect 4', 'canvas');
      this.ROWS = 6;
      this.COLS = 7;
      this.CELL_SIZE = 60;
    }

    showStartScreen(gameOver = false) {
      super.showStartScreen(gameOver);
      const title = document.getElementById('overlayTitle');
      const desc = document.getElementById('overlayDesc');
      if (gameOver) {
        title.textContent = this.winner === 0 ? "It's a Draw!" : `Player ${this.winner} Wins!`;
        desc.innerHTML = `Great game.<br>Click Play Again to rematch.`;
        if(gameScoreLabel) gameScoreLabel.textContent = `P${this.winner} Won!`;
      } else {
        title.textContent = 'Connect 4';
        desc.innerHTML = '2-Player local game.<br>Click a column to drop your token.<br><span style="color:var(--orange)">P1: Orange</span> vs <span style="color:#29b6d8">P2: Blue</span>';
      }
    }

    start() {
      this.board = Array(this.ROWS).fill(0).map(() => Array(this.COLS).fill(0));
      this.currentPlayer = 1;
      this.winner = null; // 0 = draw, 1 = p1, 2 = p2
      this.animating = false;
      this.tokens = []; // falling tokens
      this.boardOffsetX = (this.w - (this.COLS * this.CELL_SIZE)) / 2;
      this.boardOffsetY = (this.h - (this.ROWS * this.CELL_SIZE)) / 2 + 30;
      
      if(gameScoreLabel) gameScoreLabel.textContent = "P1's Turn";
      
      super.start();
    }

    dropToken(col) {
      if(this.winner !== null || this.animating) return;
      
      // Find lowest empty row
      let row = -1;
      for (let r = this.ROWS - 1; r >= 0; r--) {
        if (this.board[r][col] === 0) {
          row = r;
          break;
        }
      }
      if (row === -1) return; // Col full
      
      this.animating = true;
      const targetY = this.boardOffsetY + row * this.CELL_SIZE + this.CELL_SIZE/2;
      
      this.tokens.push({
        x: this.boardOffsetX + col * this.CELL_SIZE + this.CELL_SIZE/2,
        y: 0,
        vy: 0,
        targetY: targetY,
        player: this.currentPlayer,
        r: row,
        c: col
      });
    }

    checkWin(player) {
      const b = this.board;
      // Horizontal
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS - 3; c++) {
          if (b[r][c] === player && b[r][c+1] === player && b[r][c+2] === player && b[r][c+3] === player) return true;
        }
      }
      // Vertical
      for (let r = 0; r < this.ROWS - 3; r++) {
        for (let c = 0; c < this.COLS; c++) {
          if (b[r][c] === player && b[r+1][c] === player && b[r+2][c] === player && b[r+3][c] === player) return true;
        }
      }
      // Diagonal right
      for (let r = 0; r < this.ROWS - 3; r++) {
        for (let c = 0; c < this.COLS - 3; c++) {
          if (b[r][c] === player && b[r+1][c+1] === player && b[r+2][c+2] === player && b[r+3][c+3] === player) return true;
        }
      }
      // Diagonal left
      for (let r = 0; r < this.ROWS - 3; r++) {
        for (let c = 3; c < this.COLS; c++) {
          if (b[r][c] === player && b[r+1][c-1] === player && b[r+2][c-2] === player && b[r+3][c-3] === player) return true;
        }
      }
      return false;
    }

    update(dt) {
      if(this.tokens.length > 0) {
        const t = this.tokens[0];
        t.vy += 0.08 * dt; // gravity
        t.y += t.vy * dt;
        
        if (t.y >= t.targetY) {
          // Landed
          this.board[t.r][t.c] = t.player;
          this.tokens.pop();
          this.animating = false;
          
          if(this.checkWin(this.currentPlayer)) {
            this.winner = this.currentPlayer;
            this.endGame();
          } else {
            // Check draw
            let full = true;
            for(let c=0; c<this.COLS; c++) if(this.board[0][c] === 0) full = false;
            if(full) {
              this.winner = 0;
              this.endGame();
            } else {
              this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
              if(gameScoreLabel) {
                gameScoreLabel.textContent = `P${this.currentPlayer}'s Turn`;
                gameScoreLabel.style.color = this.currentPlayer === 1 ? 'var(--orange)' : '#29b6d8';
              }
            }
          }
        }
      }
    }

    draw() {
      const gctx = this.ctx;
      gctx.clearRect(0, 0, this.w, this.h);
      gctx.fillStyle = '#050a10';
      gctx.fillRect(0, 0, this.w, this.h);

      // Draw tokens already on board
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS; c++) {
          if(this.board[r][c] !== 0) {
            gctx.fillStyle = this.board[r][c] === 1 ? '#ff9900' : '#29b6d8';
            gctx.beginPath();
            gctx.arc(this.boardOffsetX + c * this.CELL_SIZE + this.CELL_SIZE/2, this.boardOffsetY + r * this.CELL_SIZE + this.CELL_SIZE/2, 24, 0, Math.PI*2);
            gctx.fill();
          }
        }
      }

      // Draw falling tokens
      this.tokens.forEach(t => {
        gctx.fillStyle = t.player === 1 ? '#ff9900' : '#29b6d8';
        gctx.beginPath();
        gctx.arc(t.x, t.y, 24, 0, Math.PI*2);
        gctx.fill();
      });

      // Draw board overlay (the blue plastic grid) with holes!
      gctx.fillStyle = '#1e385c';
      gctx.beginPath();
      // Outer board rect
      gctx.rect(this.boardOffsetX, this.boardOffsetY, this.COLS * this.CELL_SIZE, this.ROWS * this.CELL_SIZE);
      // Cut holes using counter-clockwise arcs
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS; c++) {
          const cx = this.boardOffsetX + c * this.CELL_SIZE + this.CELL_SIZE/2;
          const cy = this.boardOffsetY + r * this.CELL_SIZE + this.CELL_SIZE/2;
          gctx.moveTo(cx + 22, cy);
          gctx.arc(cx, cy, 22, 0, Math.PI*2, true);
        }
      }
      gctx.fill('evenodd');
    }

    handlePointer(e, rect) {
      if(!this.running) return;
      if (e.type === 'pointerdown' || e.type === 'touchstart') {
        const x = (e.clientX || (e.touches && e.touches[0].clientX) || 0) - rect.left;
        const scaleX = this.w / rect.width;
        const canvasX = x * scaleX;
        
        if (canvasX >= this.boardOffsetX && canvasX <= this.boardOffsetX + this.COLS * this.CELL_SIZE) {
          const col = Math.floor((canvasX - this.boardOffsetX) / this.CELL_SIZE);
          if (col >= 0 && col < this.COLS) {
            this.dropToken(col);
          }
        }
      }
    }
  }

  // --- Game 8: Flappy Cloud ---
  class FlappyCloud extends BaseGame {
    constructor() {
      super('fc', 'Flappy Cloud', 'canvas');
      
      this.onKeyDown = (e) => {
        if (this.running && (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w')) {
          this.jump();
        }
      };
    }

    mount() {
      super.mount();
      window.addEventListener('keydown', this.onKeyDown);
    }
    
    unmount() {
      super.unmount();
      window.removeEventListener('keydown', this.onKeyDown);
    }

    showStartScreen(gameOver = false) {
      super.showStartScreen(gameOver);
      const title = document.getElementById('overlayTitle');
      const desc = document.getElementById('overlayDesc');
      if (gameOver) {
        title.textContent = 'Game Over';
        desc.innerHTML = `Score: <strong style="color:#ffc94d">${this.score}</strong>.<br>Best so far: ${this.best}.`;
      } else {
        title.textContent = 'Flappy Cloud';
        desc.innerHTML = 'Dodge the firewalls.<br>Tap, Click, or Space to jump.';
      }
    }

    start() {
      this.player = {
        x: 100,
        y: this.h / 2,
        r: 14,
        vy: 0
      };
      
      this.gravity = 0.0016;
      this.jumpStrength = -0.55;
      
      this.pipes = [];
      this.pipeWidth = 60;
      this.pipeGap = 160;
      this.pipeSpeed = 0.25;
      this.spawnTimer = 0;
      
      this.bgX = 0;
      
      super.start();
      
      // Give them a slight jump on start
      this.jump();
    }

    jump() {
      this.player.vy = this.jumpStrength;
    }

    spawnPipe() {
      const minHeight = 50;
      const maxHeight = this.h - this.pipeGap - minHeight;
      const topHeight = minHeight + Math.random() * (maxHeight - minHeight);
      
      this.pipes.push({
        x: this.w,
        topHeight: topHeight,
        passed: false
      });
    }

    update(dt) {
      const gctx = this.ctx;
      
      // Physics
      this.player.vy += this.gravity * dt;
      this.player.y += this.player.vy * dt;
      
      // Floor / Ceiling collision
      if (this.player.y + this.player.r > this.h) {
        this.endGame();
        return;
      }
      if (this.player.y - this.player.r < 0) {
        this.player.y = this.player.r;
        this.player.vy = 0;
      }
      
      // Pipes
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnPipe();
        this.spawnTimer = 1600; // spawn every 1.6s
      }
      
      for (let i = this.pipes.length - 1; i >= 0; i--) {
        const p = this.pipes[i];
        p.x -= this.pipeSpeed * dt;
        
        // Check passing
        if (!p.passed && p.x + this.pipeWidth < this.player.x - this.player.r) {
          p.passed = true;
          this.score++;
          if(gameScoreLabel) gameScoreLabel.textContent = 'Score: ' + this.score;
        }
        
        // Check collision (AABB vs Circle approx)
        // Top pipe
        if (this.player.x + this.player.r > p.x && this.player.x - this.player.r < p.x + this.pipeWidth) {
          if (this.player.y - this.player.r < p.topHeight) {
            this.endGame();
            return;
          }
        }
        // Bottom pipe
        if (this.player.x + this.player.r > p.x && this.player.x - this.player.r < p.x + this.pipeWidth) {
          if (this.player.y + this.player.r > p.topHeight + this.pipeGap) {
            this.endGame();
            return;
          }
        }
        
        if (p.x + this.pipeWidth < 0) {
          this.pipes.splice(i, 1);
        }
      }
      
      // Background parallax
      this.bgX -= (this.pipeSpeed * 0.3) * dt;
      if (this.bgX <= -this.w) this.bgX = 0;
    }

    draw() {
      const gctx = this.ctx;
      gctx.clearRect(0, 0, this.w, this.h);
      gctx.fillStyle = '#050a10';
      gctx.fillRect(0, 0, this.w, this.h);
      
      // Draw parallax bg
      gctx.strokeStyle = 'rgba(41, 182, 216, 0.1)';
      gctx.lineWidth = 1;
      for(let x = 0; x < this.w * 2; x += 40) {
        gctx.beginPath();
        gctx.moveTo(x + this.bgX, 0);
        gctx.lineTo(x + this.bgX, this.h);
        gctx.stroke();
      }
      
      // Draw pipes (firewalls)
      gctx.fillStyle = '#ff4d4d'; // Red firewalls
      gctx.strokeStyle = '#ff9900';
      gctx.lineWidth = 2;
      
      this.pipes.forEach(p => {
        // Top
        gctx.fillRect(p.x, 0, this.pipeWidth, p.topHeight);
        gctx.strokeRect(p.x, 0, this.pipeWidth, p.topHeight);
        
        // Bottom
        const bottomY = p.topHeight + this.pipeGap;
        gctx.fillRect(p.x, bottomY, this.pipeWidth, this.h - bottomY);
        gctx.strokeRect(p.x, bottomY, this.pipeWidth, this.h - bottomY);
      });
      
      // Draw Cloud player
      gctx.fillStyle = '#eaf0f5';
      gctx.beginPath();
      const px = this.player.x;
      const py = this.player.y;
      gctx.arc(px - 10, py + 4, 11, 0, Math.PI*2);
      gctx.arc(px + 10, py + 4, 11, 0, Math.PI*2);
      gctx.arc(px, py - 6, 14, 0, Math.PI*2);
      gctx.fill();
    }

    handlePointer(e, rect) {
      if(!this.running) return;
      if (e.type === 'pointerdown' || e.type === 'touchstart') {
        this.jump();
      }
    }
  }

  // --- Registry & Routing ---
  const games = {
    latencyDodger: new LatencyDodger(),
    cloudStacker: new CloudStacker(),
    deployRace: new DeployRace(),
    snake: new Snake(),
    2048: new Game2048(),
    reflexRush: new ReflexRush(),
    connect4: new Connect4(),
    flappyCloud: new FlappyCloud(),
  };

  function openArcade() {
    gameModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    showLibrary();
  }

  function closeArcade() {
    gameModal.classList.remove('open');
    document.body.style.overflow = '';
    if (activeGame) {
      activeGame.unmount();
      activeGame = null;
    }
  }

  function showLibrary() {
    if (activeGame) {
      activeGame.unmount();
      activeGame = null;
    }
    gameLibrary.style.display = 'grid';
    gamePlayArea.style.display = 'none';
    gameBackBtn.style.display = 'none';
    gameFooter.style.display = 'none';
    gameTitleText.textContent = '🎮 Arcade Library';
  }

  function launchGame(gameId) {
    if (games[gameId]) {
      gameLibrary.style.display = 'none';
      gamePlayArea.style.display = 'block';
      gameBackBtn.style.display = 'inline-flex';
      activeGame = games[gameId];
      activeGame.mount();
    }
  }

  // --- Global Event Listeners ---
  if(gameLauncher) gameLauncher.addEventListener('click', openArcade);
  if(gameCloseBtn) gameCloseBtn.addEventListener('click', closeArcade);
  if(gameBackBtn) gameBackBtn.addEventListener('click', showLibrary);

  document.querySelectorAll('.gl-card').forEach(card => {
    card.addEventListener('click', () => {
      launchGame(card.dataset.game);
    });
  });

  if(gameStartBtn) {
    gameStartBtn.addEventListener('click', () => {
      if(activeGame) activeGame.start();
    });
  }

  window.addEventListener('keydown', (e) => {
    if(activeGame && !activeGame.running && gameOverlay.style.display !== 'none') {
      if(e.key === 'Enter' || e.key === ' ') {
        gameStartBtn.click();
      }
    }
    if(activeGame) activeGame.handleKey(e);
  });

  if(gameCanvas) {
    gameCanvas.addEventListener('touchstart', (e) => { 
      e.preventDefault(); 
    }, { passive: false });
    
    gameCanvas.addEventListener('touchmove', (e) => { 
      e.preventDefault(); 
    }, { passive: false });
    
    gameCanvas.addEventListener('pointermove', (e) => {
      if(activeGame && activeGame.type === 'canvas') {
        activeGame.handlePointer(e, gameCanvas.getBoundingClientRect());
      }
    });

    gameCanvas.addEventListener('pointerdown', (e) => {
      if(activeGame && activeGame.type === 'canvas') {
        activeGame.handlePointer(e, gameCanvas.getBoundingClientRect());
      }
    });
  }

})();
