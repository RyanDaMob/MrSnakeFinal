/**
 * main.js
 * Entry point.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Load saved settings & progress
  GameState.loadFromLocalStorage();
  CHAPTERS[0].unlocked = true; // chapter 1 always unlocked

  // 2. Bind all button click handlers
  UI.bindButtons();

  // 3. Wire up confirm-clear overlay
  const yesBtn = document.getElementById('btn-confirm-clear-yes');
  const noBtn  = document.getElementById('btn-confirm-clear-no');
  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      localStorage.removeItem('dungeonSerpent_save');
      // Reset progress
      GameState.progress = { chapter1: false, chapter2: false, chapter3: false, chapter4: false };
      CHAPTERS.forEach((c, i) => { c.unlocked = i === 0; });
      document.getElementById('overlay-confirm-clear').classList.add('hidden');
      UI.flashMessage && UI.flashMessage('Game data cleared.');
    });
  }
  if (noBtn) {
    noBtn.addEventListener('click', () => {
      document.getElementById('overlay-confirm-clear').classList.add('hidden');
    });
  }

  // 3b. Wire up pause overlay
  const resumeBtn    = document.getElementById('btn-pause-resume');
  const pauseMenuBtn = document.getElementById('btn-pause-menu');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      document.getElementById('overlay-pause').classList.add('hidden');
      GameState.inputLocked    = false;
      GameState.movementLocked = false;
    });
  }
  if (pauseMenuBtn) {
    pauseMenuBtn.addEventListener('click', () => {
      document.getElementById('overlay-pause').classList.add('hidden');
      GameState.inputLocked    = false;
      GameState.movementLocked = false;
      UI.showScreen('menu');
    });
  }

  // 4. Set up keyboard + touch input
  InputSystem.init();

  // 5. Show the main menu
  UI.showScreen('menu');

  // ── Dev: F1 to jump into chapter 1 ───────────────────────
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
      e.preventDefault();
      UI._startChapter('chapter1');
    }
  });

  console.log(
    '%c🐍 MR. SNAKE – Dungeon Serpent loaded',
    'color:#e8c84a;font-family:monospace;font-size:14px;',
  );
});
