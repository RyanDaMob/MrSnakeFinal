/**
 * input.js
 * Keyboard and touch input routing.
 */

const InputSystem = {

  init() {
    window.addEventListener('keydown', (e) => this._onKey(e));

    this._touchStartX = 0;
    this._touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      this._touchStartX = e.changedTouches[0].clientX;
      this._touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', (e) => this._onSwipe(e), { passive: true });
  },

  _onKey(e) {
    const screen = GameState.currentScreen;

    if (e.key === 'Escape') {
      if (screen === 'howto') { UI.showScreen('menu'); return; }
      if (screen === 'dungeon') { UI._showPauseMenu(); return; }
      if (screen === 'dungeon') return; // handled above
    }

    // Dungeon movement
    if (screen === 'dungeon') {
      let dir = null;
      switch (e.key) {
        case 'ArrowUp':   case 'w': case 'W': dir = DIR.UP;    break;
        case 'ArrowDown': case 's': case 'S': dir = DIR.DOWN;  break;
        case 'ArrowLeft': case 'a': case 'A': dir = DIR.LEFT;  break;
        case 'ArrowRight':case 'd': case 'D': dir = DIR.RIGHT; break;
      }
      if (dir) {
        e.preventDefault();
        GameState.nextDirection = dir;
        SnakeSystem.move();
        return;
      }
    }

    // Combat: 1 = Strike, 2 = Fang Strike
    if (screen === 'combat') {
      if (e.key === '1') CombatSystem.playerStrike();
      if (e.key === '2') CombatSystem.playerFangStrike();
    }
  },

  _onSwipe(e) {
    if (GameState.currentScreen !== 'dungeon') return;
    const dx = e.changedTouches[0].clientX - this._touchStartX;
    const dy = e.changedTouches[0].clientY - this._touchStartY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
    const dir = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? DIR.RIGHT : DIR.LEFT)
      : (dy > 0 ? DIR.DOWN  : DIR.UP);
    GameState.nextDirection = dir;
    SnakeSystem.move();
  },
};
