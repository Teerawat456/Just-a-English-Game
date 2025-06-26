const playerHPBar = document.getElementById("player-hp-bar");
const enemyHPBar = document.getElementById("enemy-hp-bar");
const difficultyMenu = document.getElementById("difficulty-select");
const battleContainer = document.getElementById("battle-container");
const questionBox = document.getElementById("question");
const questionText = document.querySelector("#question p");
const log = document.getElementById("log");
const scoreText = document.getElementById("score");
const bgm = document.getElementById("bgm"); // เพิ่มตรงนี้
const hitSound = new Audio("audio/Touhou-Bonus.mp3");
const missSound = new Audio("audio/Touhou-Death-Sound.mp3");

let playerHP, playerATK, enemyHP, enemyATK;
let score = 0;
let questionPool = [];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function updateHPBars() {
  playerHPBar.textContent = `${playerHP} / ${playerHP}`;
  playerHPBar.style.width = (playerHP / parseInt(playerHPBar.dataset.max)) * 100 + "%";
  enemyHPBar.textContent = `${enemyHP} / ${enemyHP}`;
  enemyHPBar.style.width = (enemyHP / parseInt(enemyHPBar.dataset.max)) * 100 + "%";
}

function startBGM() {
  bgm.volume = 0.4;
  bgm.play().catch(e => {
    console.log("BGM play error:", e);
  });
}

function startGame(mode) {
  if (mode === "Easy") {
    playerHP = 120;
    playerATK = 30;
    enemyHP = 100;
    enemyATK = 15;
    questionPool = [...easyQuestions];
  } else if (mode === "Hard") {
    playerHP = 100;
    playerATK = 15;
    enemyHP = 120;
    enemyATK = 45;
    questionPool = [...hardQuestions];
  } else {
    playerHP = 100;
    playerATK = 25;
    enemyHP = 100;
    enemyATK = 25;
    questionPool = [...normalQuestions];
  }

  playerHPBar.dataset.max = playerHP;
  enemyHPBar.dataset.max = enemyHP;

  difficultyMenu.style.display = "none";
  battleContainer.style.display = "flex";
  questionBox.style.display = "block";
  log.textContent = "";
  score = 0;
  scoreText.textContent = "Score: 0";

  updateHPBars();

  startBGM();  // เริ่มเล่นเพลง BGM

  showRandomQuestion();
}

function showRandomQuestion() {
  if (questionPool.length === 0) {
    questionPool = [...hardQuestions]; // ปรับได้ตามโหมดหรือเก็บชุดคำถามต้นฉบับไว้ดีกว่า
  }

  const randomIndex = Math.floor(Math.random() * questionPool.length);
  const q = questionPool.splice(randomIndex, 1)[0];

  questionText.innerHTML = `❓ ${q.question}`;

  const answersHTML = shuffle(q.choices).map(choice => `
    <button onclick="checkAnswer('${choice}', '${q.correct}')">${choice}</button>
  `).join("");

  questionText.insertAdjacentHTML("beforeend", `<div>${answersHTML}</div>`);
}

function checkAnswer(choice, correct) {
  // ปิดปุ่มทั้งหมดระหว่างประมวลผล
  const allButtons = questionText.querySelectorAll("button");
  allButtons.forEach(btn => btn.disabled = true);

  if (choice === correct) {
    enemyHP -= playerATK;
    if (enemyHP < 0) enemyHP = 0;
    log.textContent = "โจมตีสำเร็จ!";
    score += 1;
    hitSound.play(); // 🎵 เสียงโจมตี
  } else {
    playerHP -= enemyATK;
    if (playerHP < 0) playerHP = 0;
    log.textContent = "ตอบผิด! Enemy counter!";
    missSound.play(); // 🎵 เสียงพลาด
  }

  animateHPChange();

  scoreText.textContent = `Score: ${score}`;

  if (playerHP <= 0) {
    log.textContent = "คุณแพ้แล้ว!";
    questionBox.style.display = "none";
  } else if (enemyHP <= 0) {
    log.textContent = "คุณชนะแล้ว!";
    questionBox.style.display = "none";
  } else {
    setTimeout(() => {
      questionText.innerHTML = "";
      showRandomQuestion();
    }, 500);
  }
}

function animateHPChange() {
  const playerMax = parseInt(playerHPBar.dataset.max);
  const enemyMax = parseInt(enemyHPBar.dataset.max);

  const currentPlayerHP = parseInt(playerHPBar.style.width) || 100;
  const currentEnemyHP = parseInt(enemyHPBar.style.width) || 100;

  const targetPlayer = (playerHP / playerMax) * 100;
  const targetEnemy = (enemyHP / enemyMax) * 100;

  let p = currentPlayerHP;
  let e = currentEnemyHP;

  const animate = setInterval(() => {
    if (p > targetPlayer) p -= 1;
    if (p < targetPlayer) p += 1;
    if (e > targetEnemy) e -= 1;
    if (e < targetEnemy) e += 1;

    playerHPBar.style.width = `${p}%`;
    enemyHPBar.style.width = `${e}%`;

    playerHPBar.textContent = `${playerHP} / ${playerMax}`;
    enemyHPBar.textContent = `${enemyHP} / ${enemyMax}`;

    if (Math.abs(p - targetPlayer) <= 1 && Math.abs(e - targetEnemy) <= 1) {
      clearInterval(animate);
      playerHPBar.style.width = `${targetPlayer}%`;
      enemyHPBar.style.width = `${targetEnemy}%`;
    }
  }, 10);
}

function resetGame() {
  location.reload();
}
