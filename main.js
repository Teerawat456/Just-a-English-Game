// --- CONFIG ---
let playerHP, playerATK, enemyHP, enemyATK, score, currentDifficulty, isGuarding;
let questionPool = [];
const elements = {
  playerHPBar: document.getElementById("player-hp-bar"),
  enemyHPBar: document.getElementById("enemy-hp-bar"),
  battleContainer: document.getElementById("battle-container"),
  questionBox: document.getElementById("question"),
  questionText: document.getElementById("question-text"),
  answerButtons: document.getElementById("answerButtons"),
  actionButtons: document.getElementById("action-buttons"),
  log: document.getElementById("log"),
  scoreText: document.getElementById("score")
};

// --- LOBBY ---
window.addEventListener('DOMContentLoaded', () => {
  // สร้าง lobby revamp
  if (!document.getElementById('lobby-wrap')) {
    const wrap = document.createElement('div');
    wrap.id = 'lobby-wrap';
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.justifyContent = 'center';
    wrap.style.minHeight = '100vh';
    wrap.innerHTML = `
      <div id="lobby-logo" style="font-size:2.5em;margin-bottom:10px;">⚔️</div>
      <div id="lobby-title" style="font-size:2em;font-weight:800;color:#ffe082;margin-bottom:8px;">เลือกความยาก</div>
      <div id="lobby-subtitle" style="font-size:1.1em;color:#b2ff59;margin-bottom:10px;">Turn-based Quiz Battle</div>
      <div id="lobby-desc" style="font-size:1em;color:#fffde7;margin-bottom:22px;max-width:340px;text-align:center;">ตอบคำถามให้ถูกต้องเพื่อโจมตีศัตรู เลือกโหมดที่ท้าทายและพิชิตชัย!<br>โจมตี, ป้องกัน, และวางแผนเพื่อเอาชนะ!</div>
      <div id="difficulty-select" style="display:flex;flex-direction:column;gap:18px;background:rgba(30,30,40,0.98);border-radius:22px;box-shadow:0 8px 32px 0 rgba(31,38,135,0.22);padding:38px 24px 32px 24px;max-width:370px;">
        <button onclick="initGame('Easy')">ง่าย</button>
        <button onclick="initGame('Normal')">ปกติ</button>
        <button onclick="initGame('Hard')">ยาก</button>
        <button onclick="initGame('Lunatic')">Lunatic</button>
      </div>
    `;
    document.body.appendChild(wrap);
  }
  // ซ่อน game-ui ตอนแรก
  document.getElementById('game-ui').style.display = 'none';
});

// --- GAME INIT ---
function initGame(mode) {
  // ซ่อน lobby
  const lobby = document.getElementById('lobby-wrap');
  if (lobby) lobby.style.display = 'none';
  document.getElementById('game-ui').style.display = '';

  // บังคับเล่นเพลง (ใช้ tryPlayBGM จาก window)
  if (typeof window.tryPlayBGM === 'function') window.tryPlayBGM();
  currentDifficulty = mode;
  isGuarding = false;
  score = 0;

  const config = {
    Easy: { player: [120, 12], enemy: [100, 10], pool: easyQuestions },
    Normal: { player: [100, 15], enemy: [100, 15], pool: normalQuestions },
    Hard: { player: [100, 12], enemy: [120, 18], pool: hardQuestions },
    Lunatic: { player: [80, 10], enemy: [200, 35], pool: lunaticQuestions }
  };
  const { player, enemy, pool } = config[mode];
  [playerHP, playerATK] = player;
  [enemyHP, enemyATK] = enemy;
  questionPool = [...pool];

  elements.playerHPBar.dataset.max = playerHP;
  elements.enemyHPBar.dataset.max = enemyHP;
  updateHPBars();

  elements.log.textContent = '';
  elements.scoreText.textContent = 'Score: 0';
  elements.actionButtons.style.display = 'none';
  elements.questionBox.style.display = 'block';
  askQuestion();
}
window.initGame = initGame;

// --- HP BAR ---
function updateHPBars() {
  elements.playerHPBar.textContent = `${playerHP} / ${elements.playerHPBar.dataset.max}`;
  elements.enemyHPBar.textContent = `${enemyHP} / ${elements.enemyHPBar.dataset.max}`;
}

// --- PLAYER ACTION ---
function playerAction(type) {
  isGuarding = type === 'guard';
  elements.actionButtons.style.display = 'none';
  if (type === 'attack') showPlayerAttackAnim();
  askQuestion();
}
window.playerAction = playerAction;

// --- PLAYER ANIMATION (Redesign) ---
function showPlayerAttackAnim() {
  const playerImg = document.getElementById('player-img');
  if (!playerImg) return;
  const oldSrc = playerImg.src;
  playerImg.onerror = function() {
    playerImg.src = 'asset/texture/player/P1_attack.gif';
    playerImg.onerror = null;
  };
  playerImg.src = 'asset/texture/player/P1_attack.mp4';
  playerImg.classList.add('player-attack-anim-redesign');
  setTimeout(() => {
    playerImg.src = oldSrc;
    playerImg.classList.remove('player-attack-anim-redesign');
    playerImg.onerror = null;
  }, 700);
}

function showPlayerHitAnim() {
  const playerImg = document.getElementById('player-img');
  if (!playerImg) return;
  const oldSrc = playerImg.src;
  playerImg.onerror = function() {
    playerImg.src = 'asset/texture/player/P1_hit.gif';
    playerImg.onerror = null;
  };
  playerImg.src = 'asset/texture/player/P1_hit.mp4';
  playerImg.classList.add('player-hit-anim-redesign');
  setTimeout(() => {
    playerImg.src = oldSrc;
    playerImg.classList.remove('player-hit-anim-redesign');
    playerImg.onerror = null;
  }, 700);
}

// --- QUESTION ---
function askQuestion() {
  if (questionPool.length === 0) {
    // refill pool
    const fallback = {
      Easy: easyQuestions,
      Normal: normalQuestions,
      Hard: hardQuestions,
      Lunatic: lunaticQuestions
    };
    questionPool = [...fallback[currentDifficulty]];
  }
  const q = questionPool.splice(Math.floor(Math.random() * questionPool.length), 1)[0];
  elements.questionText.textContent = `❓ ${q.question}`;
  elements.answerButtons.innerHTML = '';
  shuffle(q.choices).forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice, q.correct);
    elements.answerButtons.appendChild(btn);
  });
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function checkAnswer(choice, correct) {
  document.querySelectorAll('#answerButtons button').forEach(b => b.disabled = true);
  const enemyGuard = Math.random() < 0.5;
  let logMsg = '';
  if (choice === correct) {
    const dmg = calculateDamage(playerATK, 'Enemy', enemyGuard);
    enemyHP -= dmg;
    logMsg = `Enemy -${dmg}${enemyGuard ? ' (Guarded!)' : ''}`;
    if (enemyGuard) logMsg += ' ศัตรูป้องกัน!';
    score++;
    // (อนาคต) เอฟเฟกต์โจมตีศัตรู
  } else {
    const dmg = calculateDamage(enemyATK, 'Player', isGuarding);
    playerHP -= dmg;
    logMsg = `คุณโดน -${dmg}${isGuarding ? ' (Guarded!)' : ''}`;
    showPlayerHitAnim();
  }
// --- PLAYER ANIMATION CSS (Redesign) ---
if (!document.getElementById('player-anim-style')) {
  const style = document.createElement('style');
  style.id = 'player-anim-style';
  style.textContent = `
.player-attack-anim-redesign {
  animation: playerAttackAnimRedesign 0.7s cubic-bezier(.7,-0.2,.7,1.5);
  box-shadow: 0 0 32px 8px #ffe082cc, 0 0 0 0 #fff0;
  filter: drop-shadow(0 0 16px #ffe082) brightness(1.2) contrast(1.1) saturate(1.2) blur(0.5px);
}
.player-hit-anim-redesign {
  animation: playerHitAnimRedesign 0.7s cubic-bezier(.7,-0.2,.7,1.5);
  box-shadow: 0 0 32px 8px #ff5252cc, 0 0 0 0 #fff0;
  filter: drop-shadow(0 0 16px #ff5252) brightness(1.2) contrast(1.1) saturate(1.2) blur(0.5px);
}
@keyframes playerAttackAnimRedesign {
  0% { filter: drop-shadow(0 0 0 #ffe082) brightness(1.2); transform: scale(1) translateX(0); }
  10% { filter: drop-shadow(0 0 16px #ffe082) brightness(1.5); }
  30% { filter: drop-shadow(0 0 32px #ffe082) brightness(1.7); transform: scale(1.12) translateX(18px) skewX(-6deg) rotate(-2deg); }
  50% { filter: drop-shadow(0 0 24px #ffe082) brightness(1.2); transform: scale(0.98) translateX(-10px) skewX(3deg) rotate(2deg); }
  70% { filter: drop-shadow(0 0 8px #ffe082) brightness(1.1); transform: scale(1.04) translateX(4px); }
  100% { filter: drop-shadow(0 0 0 #ffe082) brightness(1); transform: scale(1) translateX(0); }
}
@keyframes playerHitAnimRedesign {
  0% { filter: drop-shadow(0 0 0 #ff5252) brightness(1); }
  10% { filter: drop-shadow(0 0 24px #ff5252) brightness(1.7); }
  20% { filter: drop-shadow(0 0 32px #ff5252) brightness(2.2); transform: scale(1.08) translateY(-8px) skewX(2deg) rotate(-2deg); }
  40% { filter: drop-shadow(0 0 16px #ff5252) brightness(0.7); transform: scale(0.95) translateY(6px) skewX(-2deg) rotate(2deg); }
  60% { filter: drop-shadow(0 0 8px #ff5252) brightness(1.1); transform: scale(1.02) translateY(-2px); }
  100% { filter: drop-shadow(0 0 0 #ff5252) brightness(1); transform: scale(1) translateY(0); }
}
`;
  document.head.appendChild(style);
}
  playerHP = Math.max(playerHP, 0);
  enemyHP = Math.max(enemyHP, 0);
  elements.log.textContent = logMsg;
  elements.scoreText.textContent = `Score: ${score}`;
  updateHPBars();
  if (playerHP <= 0 || enemyHP <= 0) {
    setTimeout(() => {
      elements.questionBox.style.display = 'none';
      elements.actionButtons.style.display = 'none';
      elements.log.textContent = playerHP <= 0 ? '❌ คุณแพ้แล้ว!' : '🎉 คุณชนะแล้ว!';
    }, 1500);
  } else {
    setTimeout(() => {
      elements.actionButtons.style.display = 'block';
      elements.questionText.textContent = '';
      elements.answerButtons.innerHTML = '';
    }, 1200);
  }
}

function calculateDamage(base, target, guarding) {
  const reduction = {
    Player: { Easy: 0.65, Normal: 0.35, Hard: 0.25, Lunatic: 0.2 },
    Enemy: { Easy: 0.15, Normal: 0.25, Hard: 0.5, Lunatic: 0.25 }
  };
  const rate = reduction[target][currentDifficulty];
  return guarding ? Math.round(base * (1 - rate)) : base;
}

function resetGame() {
  // กลับไป lobby
  document.getElementById('game-ui').style.display = 'none';
  const lobby = document.getElementById('lobby-wrap');
  if (lobby) lobby.style.display = '';
  const lobbyBg = document.getElementById('lobby-bg-anim');
  if (lobbyBg) lobbyBg.style.display = '';
  // บังคับเล่นเพลง (ใช้ tryPlayBGM จาก window)
  if (typeof window.tryPlayBGM === 'function') window.tryPlayBGM();
}
window.resetGame = resetGame;
