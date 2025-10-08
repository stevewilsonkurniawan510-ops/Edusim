document.addEventListener("DOMContentLoaded", () => {
  const homeView = document.getElementById("homeView");
  const chooseView = document.getElementById("chooseView");
  const gameView = document.getElementById("gameView");
  const resultView = document.getElementById("resultView");
  const mulaiBtn = document.getElementById("mulaiBtn");
  const gameBoxes = document.querySelectorAll(".game-box");
  const gameTitle = document.getElementById("gameTitle");
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const feedbackEl = document.getElementById("feedback");
  const progressEl = document.getElementById("progress");
  const backBtn = document.getElementById("backBtn");
  const resultText = document.getElementById("resultText");
  const againBtn = document.getElementById("againBtn");
  const bgMusic = document.getElementById("bgMusic");

  let currentGame = null;
  let questionIndex = 0;
  const TOTAL = 20;
  let score = 0;
  let correctAnswer = null;
  let isWaiting = false;

  function show(view) {
    [homeView, chooseView, gameView, resultView].forEach(v => v.classList.add("hidden"));
    view.classList.remove("hidden");
  }

  mulaiBtn.addEventListener("click", () => {
    show(chooseView);
    bgMusic.play().catch(()=>{});
  });

  gameBoxes.forEach(box => {
    box.addEventListener("click", () => startGame(box.dataset.game));
  });

  backBtn.addEventListener("click", () => show(chooseView));
  againBtn.addEventListener("click", () => show(chooseView));

  function startGame(gameType) {
    currentGame = gameType;
    questionIndex = 0;
    score = 0;
    feedbackEl.textContent = "";
    show(gameView);
    gameTitle.textContent = (gameType === "penjumlahan") ? "Penjumlahan" : "Pola Aritmatika";
    nextQuestion();
  }

  function nextQuestion() {
    feedbackEl.textContent = "";
    isWaiting = false;
    if (questionIndex >= TOTAL) {
      resultText.textContent = `🎉 Selesai! Skor kamu: ${score}/${TOTAL}`;
      show(resultView);
      return;
    }
    progressEl.textContent = `Soal ${questionIndex + 1} / ${TOTAL}`;

    if (currentGame === "penjumlahan") {
      const a = rand(1, 20), b = rand(1, 20);
      correctAnswer = a + b;
      questionEl.textContent = `${a} + ${b} = ?`;
      renderOptions(makeChoices(correctAnswer));
    } else {
      const start = rand(1, 10), diff = rand(1, 5), n = 4;
      const seq = Array.from({length: n}, (_,i)=> start+i*diff);
      correctAnswer = start + n * diff;
      questionEl.textContent = `${seq.join(", ")}, ...`;
      renderOptions(makeChoices(correctAnswer));
    }
  }

  function renderOptions(arr) {
    optionsEl.innerHTML = arr.map(v => `<button class="option" data-value="${v}">${v}</button>`).join("");
  }

  optionsEl.addEventListener("click", e => {
    if (!e.target.matches("button.option") || isWaiting) return;
    const chosen = Number(e.target.dataset.value);
    isWaiting = true;
    if (chosen === correctAnswer) {
      score++;
      showFeedback("Benar", true);
    } else showFeedback("Salah", false);
    setTimeout(()=>{ questionIndex++; nextQuestion(); }, 800);
  });

  function showFeedback(text, ok) {
    feedbackEl.textContent = text;
    feedbackEl.classList.remove("benar","salah");
    feedbackEl.classList.add(ok?"benar":"salah");
  }

  const rand = (min,max)=> Math.floor(Math.random()*(max-min+1))+min;
  const makeChoices = correct => {
    const s = new Set([correct]);
    while (s.size < 4) s.add(correct + rand(-5,5));
    return [...s].sort(()=>Math.random()-0.5);
  };

  show(homeView);
});
