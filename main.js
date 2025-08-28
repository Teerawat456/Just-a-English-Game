// --- HIGH SCORE UI ---
function showHighScores() {
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem('quiz_scores')) || [];
  } catch (e) {
    saved = [];
  }
  // เรียงจากคะแนนมากไปน้อย
  saved.sort((a, b) => b.score - a.score);
  // สร้าง HTML
  let html = `<div id="highscore-modal-bg" style="position:fixed;z-index:99999;top:0;left:0;width:100vw;height:100vh;background:rgba(30,30,40,0.92);display:flex;align-items:center;justify-content:center;">
    <div id="highscore-modal" style="background:linear-gradient(135deg,#232526 80%,#414345 100%);border-radius:22px;box-shadow:0 8px 32px 0 #ffe08244;padding:32px 24px 24px 24px;min-width:340px;max-width:95vw;max-height:80vh;overflow:auto;position:relative;">
      <div style="font-size:2em;font-weight:800;color:#ffe082;text-align:center;margin-bottom:18px;text-shadow:0 2px 8px #23252688;">🏆 High Scores</div>
      <table style="width:100%;border-collapse:collapse;font-size:1.08em;">
        <tr style="color:#b2ff59;font-weight:700;background:#232526;">
          <th style="padding:6px 8px;">#</th>
          <th style="padding:6px 8px;">ชื่อ</th>
          <th style="padding:6px 8px;">คะแนน</th>
          <th style="padding:6px 8px;">ความยาก</th>
          <th style="padding:6px 8px;">วันที่</th>
        </tr>`;
  if (saved.length === 0) {
    html += `<tr><td colspan='5' style='text-align:center;color:#ff5252;padding:18px 0;'>ยังไม่มีคะแนน</td></tr>`;
  } else {
    saved.slice(0, 20).forEach((s, i) => {
      html += `<tr style="background:${i%2?'#232526':'#2e2e38'};">
        <td style="padding:6px 8px;text-align:center;">${i+1}</td>
        <td style="padding:6px 8px;">${s.name}</td>
        <td style="padding:6px 8px;text-align:center;">${s.score}</td>
        <td style="padding:6px 8px;text-align:center;">${s.difficulty||'-'}</td>
        <td style="padding:6px 8px;font-size:0.95em;">${s.date||''}</td>
      </tr>`;
    });
  }
  html += `</table>
      <button id="close-highscore-btn" style="margin-top:22px;background:linear-gradient(90deg,#ffe082,#b2ff59);color:#232526;font-weight:700;border:none;border-radius:12px;padding:12px 32px;font-size:1.1em;cursor:pointer;box-shadow:0 2px 8px 0 #ffe08222;">ปิด</button>
    </div>
  </div>`;
  // แสดง modal
  const modalDiv = document.createElement('div');
  modalDiv.innerHTML = html;
  document.body.appendChild(modalDiv);
  document.getElementById('close-highscore-btn').onclick = () => {
    modalDiv.remove();
  };
  document.getElementById('highscore-modal-bg').onclick = (e) => {
    if (e.target === document.getElementById('highscore-modal-bg')) modalDiv.remove();
  };
}
// --- SCORE SAVE SYSTEM ---
function saveScore(score) {
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem('quiz_scores')) || [];
  } catch (e) {
    saved = [];
  }
  const name = prompt('กรุณาใส่ชื่อของคุณเพื่อบันทึกคะแนน:', '');
  if (!name) return;
  // ดึง difficulty ล่าสุดจาก window (กัน currentDifficulty เปลี่ยนระหว่างเกม)
  let diff = window.currentDifficulty || currentDifficulty || '-';
  saved.push({ name, score, difficulty: diff, date: new Date().toLocaleString() });
  localStorage.setItem('quiz_scores', JSON.stringify(saved));
  alert('บันทึกคะแนนสำเร็จ!');
}
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
  // ถ้ามี lobby-wrap อยู่แล้ว ไม่ต้องสร้างซ้ำ
  if (!document.getElementById('lobby-wrap')) {
    const lobby = document.createElement('div');
    lobby.id = 'lobby-wrap';
    lobby.style.display = '';
    lobby.innerHTML = `
      <div id="lobby-logo">🎮</div>
      <div id="lobby-title">English Battle</div>
      <div id="lobby-subtitle">เลือกความยาก</div>
      <div id="difficulty-select">
        <button data-diff="Easy">Easy</button>
        <button data-diff="Normal">Normal</button>
        <button data-diff="Hard">Hard</button>
        <button data-diff="Lunatic">Lunatic</button>
      </div>
      <div id="lobby-desc">ตอบคำถามภาษาอังกฤษให้ถูกต้องเพื่อโจมตีศัตรูและสะสมคะแนนสูงสุด!</div>
      <button id="show-highscore-btn" style="margin-top:18px;background:linear-gradient(90deg,#ffe082,#b2ff59);color:#232526;font-weight:700;border:none;border-radius:12px;padding:12px 32px;font-size:1.1em;cursor:pointer;box-shadow:0 2px 8px 0 #ffe08222;">ดูคะแนนสูงสุด</button>
    `;
    document.body.appendChild(lobby);
  }
  // กดเลือกความยาก
  document.querySelectorAll('#difficulty-select button').forEach(btn => {
    btn.onclick = function() {
      const diff = this.getAttribute('data-diff');
      // กำหนดค่าตัวละครและ pool ตามความยาก
      if (diff === 'Easy') {
        window.player = [100, 25];
        window.enemy = [60, 15];
        window.pool = easyQuestions;
      } else if (diff === 'Normal') {
        window.player = [100, 20];
        window.enemy = [80, 20];
        window.pool = normalQuestions;
      } else if (diff === 'Hard') {
        window.player = [100, 18];
        window.enemy = [100, 28];
        window.pool = hardQuestions;
      } else if (diff === 'Lunatic') {
        window.player = [100, 15];
        window.enemy = [120, 50];
        window.pool = lunaticQuestions;
      }
      window.currentDifficulty = diff;
      document.getElementById('lobby-wrap').style.display = 'none';
      document.getElementById('game-ui').style.display = '';
      if (typeof window.initGame === 'function') window.initGame();
    };
  });
  // ปุ่มดูคะแนนสูงสุด
  const showBtn = document.getElementById('show-highscore-btn');
  if (showBtn) showBtn.onclick = showHighScores;
  // ซ่อน game-ui ตอนแรก
  document.getElementById('game-ui').style.display = 'none';
});
// --- INIT GAME ---
function initGame() {
  [playerHP, playerATK] = [parseInt(player[0]) || 0, parseInt(player[1]) || 0];
  [enemyHP, enemyATK] = [parseInt(enemy[0]) || 0, parseInt(enemy[1]) || 0];
  score = 0;
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
  let pHP = isNaN(playerHP) ? 0 : playerHP;
  let pMax = isNaN(parseInt(elements.playerHPBar.dataset.max)) ? 0 : parseInt(elements.playerHPBar.dataset.max);
  let eHP = isNaN(enemyHP) ? 0 : enemyHP;
  let eMax = isNaN(parseInt(elements.enemyHPBar.dataset.max)) ? 0 : parseInt(elements.enemyHPBar.dataset.max);
  elements.playerHPBar.textContent = `${pHP} / ${pMax}`;
  elements.enemyHPBar.textContent = `${eHP} / ${eMax}`;
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
    let raw = parseInt(playerATK);
    if (isNaN(raw)) raw = 0;
    let dmg = calculateDamage(playerATK, 'Enemy', enemyGuard);
    if (isNaN(dmg)) dmg = 0;
    if (enemyGuard && raw > 0 && dmg < 1) dmg = 1;
    enemyHP = isNaN(enemyHP) ? 0 : enemyHP;
    enemyHP -= dmg;
    if (isNaN(enemyHP)) enemyHP = 0;
    if (enemyGuard) {
      logMsg = `Enemy -${dmg} (Guarded! ลดจาก ${raw} เหลือ ${dmg}) ศัตรูป้องกัน!`;
    } else {
      logMsg = `Enemy -${dmg}`;
    }
  score = isNaN(score) ? 0 : score;
  // ให้คะแนนตามระดับความยาก
  let scoreTable = { Easy: 1, Normal: 2, Hard: 3, Lunatic: 5 };
  let add = scoreTable[currentDifficulty] || 1;
  score += add;
    // (อนาคต) เอฟเฟกต์โจมตีศัตรู
  } else {
    let raw = parseInt(enemyATK);
    if (isNaN(raw)) raw = 0;
    let dmg = calculateDamage(enemyATK, 'Player', isGuarding);
    if (isNaN(dmg)) dmg = 0;
    if (isGuarding && raw > 0 && dmg < 1) dmg = 1;
    playerHP = isNaN(playerHP) ? 0 : playerHP;
    playerHP -= dmg;
    if (isNaN(playerHP)) playerHP = 0;
    if (isGuarding) {
      logMsg = `คุณโดน -${dmg} (Guarded! ลดจาก ${raw} เหลือ ${dmg})`;
    } else {
      logMsg = `คุณโดน -${dmg}`;
    }
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
      // เพิ่มปุ่มบันทึกคะแนนเมื่อชนะ
      if (playerHP > 0) {
        if (!document.getElementById('save-score-btn')) {
          const btn = document.createElement('button');
          btn.id = 'save-score-btn';
          btn.textContent = 'บันทึกคะแนน';
          btn.style.marginTop = '18px';
          btn.onclick = () => {
            saveScore(score);
            btn.disabled = true;
            btn.textContent = 'บันทึกแล้ว';
          };
          elements.log.appendChild(btn);
        }
      }
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
  // ปรับสมดุล guard ใหม่: Player guard ลดดาเมจ 40/30/20/10%, Enemy guard ลดดาเมจ 30/40/50/60%
  const reduction = {
    Player: { Easy: 0.4, Normal: 0.3, Hard: 0.2, Lunatic: 0.1 },
    Enemy: { Easy: 0.3, Normal: 0.4, Hard: 0.5, Lunatic: 0.6 }
  };
  const rate = reduction[target][currentDifficulty];
  base = parseInt(base);
  if (isNaN(base)) base = 0;
  if (guarding) {
    let dmg = Math.round(base * (1 - rate));
    if (isNaN(dmg)) dmg = 0;
    if (base > 0 && dmg < 1) dmg = 1;
    return dmg;
  }
  return base;
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
