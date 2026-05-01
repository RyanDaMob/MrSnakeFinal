/**
 * ui.js
 * Screen switching, HUD updates, overlays, button wiring.
 * Adds: Settings, Chapter Select (Play), Credits screens.
 */

const UI = {

  showScreen(name) {
    GameState.currentScreen = name;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(`screen-${name}`);
    if (el) el.classList.add('active');
  },

  updateHUD() {
    const p   = GameState.player;
    const pct = Math.max(0, (p.hp / p.maxHp) * 100);

    const bar = document.getElementById('hp-bar');
    bar.style.width = `${pct}%`;
    bar.className   = `hp-bar${pct < 25 ? ' hp-danger' : pct < 50 ? ' hp-low' : ''}`;

    document.getElementById('hp-text').textContent  = `${p.hp}/${p.maxHp}`;
    document.getElementById('atk-text').textContent = p.attack;
    document.getElementById('lvl-text').textContent = p.level;

    this.updateChargeDisplay(p.chargeStacks || 0);

    // Status icons
    const statusEl = document.getElementById('hud-status');
    if (statusEl) {
      let s = '';
      if (p._poisoned > 0) s += '☠';
      if (p._ignited  > 0) s += '🔥';
      statusEl.textContent = s;
    }
  },

  updateChargeDisplay(stacks) {
    for (let i = 1; i <= COMBAT_CONFIG.FANG_STACKS_NEEDED; i++) {
      const pip = document.getElementById(`charge-pip-${i}`);
      if (pip) pip.className = `charge-pip${i <= stacks ? ' filled' : ''}`;
    }
  },

  // ── Message flash ─────────────────────────────────────────
  _msgTimer: null,

  flashMessage(text) {
    const el = document.getElementById('hud-msg');
    el.textContent = text;
    el.className = 'hud-message show';
    clearTimeout(this._msgTimer);
    this._msgTimer = setTimeout(() => {
      el.className = 'hud-message hide';
      setTimeout(() => { el.textContent = ''; el.className = 'hud-message'; }, 600);
    }, 2400);
  },

  // ── Overlays ──────────────────────────────────────────────
  closeChestOverlay() {
    document.getElementById('overlay-chest').classList.add('hidden');
  },

  closeCheckpointOverlay() {
    document.getElementById('overlay-checkpoint').classList.add('hidden');
    GameState.inputLocked    = false;
    GameState.movementLocked = false;
  },

  // ── Settings screen ───────────────────────────────────────
  openSettings() {
    // Sync sliders to current state
    const mv = document.getElementById('slider-music');
    const sv = document.getElementById('slider-sfx');
    const ml = document.getElementById('slider-music-val');
    const sl = document.getElementById('slider-sfx-val');
    if (mv) { mv.value = GameState.settings.musicVolume; ml.textContent = GameState.settings.musicVolume + '%'; }
    if (sv) { sv.value = GameState.settings.sfxVolume;   sl.textContent = GameState.settings.sfxVolume   + '%'; }
    this.showScreen('settings');
  },

  // ── Chapter Select screen ─────────────────────────────────
  openChapterSelect() {
    this._renderChapterCards();
    this.showScreen('chapters');
  },

  _renderChapterCards() {
    const container = document.getElementById('chapter-cards');
    if (!container) return;
    container.innerHTML = '';

    CHAPTERS.forEach((ch, idx) => {
      const completed = GameState.progress[ch.id];
      const unlocked  = ch.unlocked;

      const card = document.createElement('div');
      card.className = `chapter-card${unlocked ? '' : ' locked'}${completed ? ' completed' : ''}`;

      const icons = ['🏰', '🌿', '🔥', '👑'];
      const subtitles = [
        'Escape the ancient dungeon',
        'Cross the poisoned swamp',
        'Survive the blazing inferno',
        'Rescue your brother from darkness',
      ];

      card.innerHTML = `
        <div class="chapter-icon">${icons[idx]}</div>
        <div class="chapter-info">
          <div class="chapter-name">${ch.name}</div>
          <div class="chapter-sub">${subtitles[idx]}</div>
          ${completed ? '<div class="chapter-done">✔ Completed</div>' : ''}
          ${!unlocked ? '<div class="chapter-lock">🔒 Complete previous chapter first</div>' : ''}
        </div>
      `;

      if (unlocked) {
        card.addEventListener('click', () => this._startChapter(ch.id));
      }

      container.appendChild(card);
    });
  },

  _startChapter(chapterId) {
    GameState.reset();
    MapSystem.load(chapterId);
    Renderer.buildMap();
    this.updateHUD();
    this.showScreen('dungeon');
    Renderer.scrollToHead();
    const chDef = CHAPTERS.find(c => c.id === chapterId);
    this.flashMessage(`${chDef ? chDef.name : chapterId} begins...`);
  },

  // ── Button bindings ───────────────────────────────────────
  bindButtons() {

    // Dungeon in-game menu button
    const dungeonMenuBtn = document.getElementById('btn-dungeon-menu');
    if (dungeonMenuBtn) {
      dungeonMenuBtn.addEventListener('click', () => this._showPauseMenu());
    }

    // Main menu
    document.getElementById('btn-start').addEventListener('click', () => this.openChapterSelect());
    document.getElementById('btn-howto').addEventListener('click', () => this.showScreen('howto'));
    document.getElementById('btn-settings').addEventListener('click', () => this.openSettings());
    document.getElementById('btn-credits').addEventListener('click', () => this.showScreen('credits'));

    // How to play back
    document.getElementById('btn-howto-back').addEventListener('click', () => this.showScreen('menu'));

    // Settings
    document.getElementById('btn-settings-back').addEventListener('click', () => {
      GameState.saveToLocalStorage();
      this.showScreen('menu');
    });
    document.getElementById('btn-clear-data').addEventListener('click', () => this._confirmClearData());

    const mv = document.getElementById('slider-music');
    const sv = document.getElementById('slider-sfx');
    const ml = document.getElementById('slider-music-val');
    const sl = document.getElementById('slider-sfx-val');
    if (mv) mv.addEventListener('input', () => {
      GameState.settings.musicVolume = parseInt(mv.value);
      ml.textContent = mv.value + '%';
    });
    if (sv) sv.addEventListener('input', () => {
      GameState.settings.sfxVolume = parseInt(sv.value);
      sl.textContent = sv.value + '%';
    });

    // Credits
    document.getElementById('btn-credits-back').addEventListener('click', () => this.showScreen('menu'));

    // Chapter select
    document.getElementById('btn-chapters-back').addEventListener('click', () => this.showScreen('menu'));

    // Chest
    document.getElementById('chest-hp').addEventListener('click', () => this._resolveChest('hp'));
    document.getElementById('chest-atk').addEventListener('click', () => this._resolveChest('atk'));

    // Checkpoint
    document.getElementById('checkpoint-continue').addEventListener('click', () => this.closeCheckpointOverlay());

    // Combat
    document.getElementById('btn-attack').addEventListener('click', () => CombatSystem.playerStrike());
    document.getElementById('btn-skill').addEventListener('click', () => CombatSystem.playerFangStrike());

    // Combat result
    document.getElementById('result-continue').addEventListener('click', () => {
      const won = document.getElementById('result-continue').dataset.won === '1';
      CombatSystem.onResultContinue(won);
    });

    // Game over
    document.getElementById('btn-respawn').addEventListener('click', () => SnakeSystem.respawnAtCheckpoint());
    document.getElementById('btn-main-menu').addEventListener('click', () => this.showScreen('menu'));

    // Victory
    document.getElementById('btn-victory-next').addEventListener('click', () => this._goToNextChapter());
    document.getElementById('btn-victory-menu').addEventListener('click', () => this.showScreen('menu'));

    // Game Complete
    document.getElementById('btn-complete-menu').addEventListener('click', () => this.showScreen('menu'));
  },

  _showPauseMenu() {
    const box = document.getElementById('overlay-pause');
    if (box) {
      GameState.inputLocked = true;
      GameState.movementLocked = true;
      box.classList.remove('hidden');
    }
  },

  _confirmClearData() {
    const box = document.getElementById('overlay-confirm-clear');
    if (box) box.classList.remove('hidden');
  },

  showClearConfirm() {
    document.getElementById('overlay-confirm-clear').classList.remove('hidden');
  },

  _resolveChest(choice) {
    const key   = GameState.pendingChest;
    const chest = GameState.chests.find(c => c.key === key);

    if (!chest) {
      this.closeChestOverlay();
      GameState.inputLocked    = false;
      GameState.movementLocked = false;
      return;
    }

    chest.opened = true;

    if (choice === 'hp') {
      GameState.player.maxHp += CHEST_REWARDS.HP_AMOUNT;
      GameState.player.hp    += CHEST_REWARDS.HP_AMOUNT;
      this.flashMessage(`Max HP +${CHEST_REWARDS.HP_AMOUNT}!`);
    } else {
      GameState.player.attack += CHEST_REWARDS.ATK_AMOUNT;
      this.flashMessage(`Attack +${CHEST_REWARDS.ATK_AMOUNT}!`);
    }

    GameState.pendingChest   = null;
    GameState.inputLocked    = false;
    GameState.movementLocked = false;

    this.closeChestOverlay();
    this.updateHUD();
    Renderer.render();

    const [r, c] = key.split(',').map(Number);
    const el = Renderer.getTileEl(r, c);
    if (el) {
      el.classList.add('opened');
      const icon = el.querySelector('.tile-icon');
      if (icon) icon.textContent = '🗃';
    }
  },

  showVictoryScreen(chapterId) {
    const chDef = CHAPTERS.find(c => c.id === chapterId);
    const titleEl = document.getElementById('victory-chapter-name');
    const nextBtn = document.getElementById('btn-victory-next');

    if (titleEl) titleEl.textContent = chDef ? chDef.name : chapterId;

    const nextIdx = CHAPTERS.findIndex(c => c.id === chapterId) + 1;
    if (nextBtn) {
      if (nextIdx < CHAPTERS.length) {
        nextBtn.style.display = '';
        nextBtn.dataset.next  = CHAPTERS[nextIdx].id;
      } else {
        nextBtn.style.display = 'none';
      }
    }

    this.showScreen('victory');
  },

  _goToNextChapter() {
    const btn = document.getElementById('btn-victory-next');
    if (!btn) return;
    const nextId = btn.dataset.next;
    if (nextId) {
      this.openChapterSelect();
    }
  },
};
