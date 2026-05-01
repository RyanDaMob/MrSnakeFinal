/**
 * combat.js
 * Turn-based combat. Supports mini-boss special moves:
 *   DUNGEON_WARDEN: slam (heavy hit every 2 turns)
 *   SWAMP_BEAST:    poison (3 HP DoT for 2 steps)
 *   INFERNO_KNIGHT: ignite (5 HP DoT for 3 steps)
 *   BOSS:           fireball (2-hit, every 3 turns) + rage at <33%
 */

const CombatSystem = {

  _timingRAF:      null,
  _timingStart:    null,
  _timingResolved: false,
  _windowStart:    0,
  _windowEnd:      0,
  _spaceHandler:   null,
  _clickHandler:   null,
  _cdInterval:     null,

  _pendingEnemyHits: [],

  // ── Start combat ──────────────────────────────────────────
  start(enemy) {
    const et = ENEMY_TYPES[enemy.type];
    const cs = GameState.combat;

    cs.active           = true;
    cs.enemy            = enemy;
    cs.enemyType        = et;
    cs.playerHp         = GameState.player.hp;
    cs.enemyHp          = enemy.hp;
    cs.enemyMaxHp       = enemy.maxHp;
    cs.playerTurn       = true;
    cs.waitingForAction = true;
    cs.turnCount        = 0;

    this._pendingEnemyHits = [];
    cs.chargeStacks = GameState.player.chargeStacks || 0;

    this._clearLog();
    this._refreshCombatUI();
    document.getElementById('enemy-name').textContent = et.name;
    const sprite = document.getElementById('enemy-sprite');
    sprite.innerHTML = '';
    if (et.image) {
      const img = document.createElement('img');
      img.src = et.image;
      img.alt = et.name;
      img.draggable = false;
      sprite.appendChild(img);
    }
    sprite.className = (et.isBoss || et.isMini) ? 'enemy-sprite boss-sprite' : 'enemy-sprite';

    this._log(`You encounter the ${et.name}!`, 'system');
    if (et.isBoss) this._log('The final guardian blocks your path!', 'system');
    if (et.isMini) this._log('A powerful guardian! Prepare yourself!', 'system');

    UI.showScreen('combat');
    this._setActionsEnabled(true);
    this._updateSkillButton();
  },

  // ═══════════════════════════════════════════════════════════
  //  PLAYER ACTIONS
  // ═══════════════════════════════════════════════════════════

  playerStrike() {
    if (!GameState.combat.waitingForAction) return;
    this._setActionsEnabled(false);
    GameState.combat.waitingForAction = false;

    const cs  = GameState.combat;
    let atk = GameState.player.attack;
    // Apply curse debuff
    if (GameState.player._cursed) {
      atk = Math.max(1, atk - 2);
      GameState.player._cursed = false;
    }
    const v   = Math.floor(Math.random() * (COMBAT_CONFIG.ATTACK_VARIANCE * 2 + 1)) - COMBAT_CONFIG.ATTACK_VARIANCE;
    const dmg = Math.max(1, atk + v);

    cs.enemyHp = Math.max(0, cs.enemyHp - dmg);
    this._log(`You strike for ${dmg} damage.`, 'player');
    this._showEffect('enemy', `-${dmg}`, '');
    this._refreshCombatUI();

    cs.chargeStacks = Math.min(COMBAT_CONFIG.FANG_STACKS_NEEDED, cs.chargeStacks + 1);
    GameState.player.chargeStacks = cs.chargeStacks;
    UI.updateChargeDisplay(cs.chargeStacks);
    this._updateSkillButton();

    if (cs.enemyHp <= 0) { setTimeout(() => this._victory(), 500); return; }
    setTimeout(() => this._enemyTurn(), 700);
  },

  playerFangStrike() {
    const cs = GameState.combat;
    if (!cs.waitingForAction) return;
    if (cs.chargeStacks < COMBAT_CONFIG.FANG_STACKS_NEEDED) return;

    this._setActionsEnabled(false);
    cs.waitingForAction = false;

    const atk  = GameState.player.attack;
    const v    = Math.floor(Math.random() * (COMBAT_CONFIG.ATTACK_VARIANCE * 2 + 1)) - COMBAT_CONFIG.ATTACK_VARIANCE;
    const base = Math.max(1, atk + v);
    const dmg  = Math.floor(base * COMBAT_CONFIG.FANG_STRIKE_MULT);

    cs.enemyHp = Math.max(0, cs.enemyHp - dmg);
    this._log(`FANG STRIKE! You bite for ${dmg} damage!`, 'skill');
    this._showEffect('enemy', `-${dmg}`, 'counter');
    this._refreshCombatUI();

    cs.chargeStacks = 0;
    GameState.player.chargeStacks = 0;
    UI.updateChargeDisplay(0);
    this._updateSkillButton();

    if (cs.enemyHp <= 0) { setTimeout(() => this._victory(), 500); return; }
    setTimeout(() => this._enemyTurn(), 700);
  },

  // ═══════════════════════════════════════════════════════════
  //  ENEMY TURN
  // ═══════════════════════════════════════════════════════════

  _enemyTurn() {
    const cs = GameState.combat;
    const et = cs.enemyType;
    cs.turnCount = (cs.turnCount || 0) + 1;

    // Boss fireball every 3 turns
    if (et.isBoss && cs.turnCount % 3 === 0) {
      this._pendingEnemyHits = ['fireball', 'fireball2'];
      this._log(`⚡ General Gavern charges a Fireball!`, 'enemy');
      setTimeout(() => this._processNextEnemyHit(), 600);
      return;
    }

    // Dungeon Warden slam every 2 turns
    if (et.specialMove === 'slam' && cs.turnCount % 2 === 0) {
      this._pendingEnemyHits = ['slam'];
      this._log(`💥 ${et.name} raises their weapon for a SLAM!`, 'enemy');
      setTimeout(() => this._processNextEnemyHit(), 600);
      return;
    }

    // Swamp Beast poison every 2 turns
    if (et.specialMove === 'poison' && cs.turnCount % 2 === 0) {
      this._pendingEnemyHits = ['poison'];
      this._log(`🧪 ${et.name} spews toxic slime!`, 'enemy');
      setTimeout(() => this._processNextEnemyHit(), 600);
      return;
    }

    // Inferno Knight ignite every 2 turns
    if (et.specialMove === 'ignite' && cs.turnCount % 2 === 0) {
      this._pendingEnemyHits = ['ignite'];
      this._log(`🔥 ${et.name} engulfs you in flames!`, 'enemy');
      setTimeout(() => this._processNextEnemyHit(), 600);
      return;
    }

    this._pendingEnemyHits = ['normal'];
    this._log(`⚔️ ${et.name} attacks!`, 'enemy');
    setTimeout(() => this._processNextEnemyHit(), 500);
  },

  _processNextEnemyHit() {
    if (this._pendingEnemyHits.length === 0) {
      this._startPlayerTurn();
      return;
    }

    const hitType = this._pendingEnemyHits.shift();
    const cs      = GameState.combat;
    const et      = cs.enemyType;

    let baseDmg;

    if (hitType === 'fireball' || hitType === 'fireball2') {
      baseDmg = et.fireballDmg || et.attack;
      const label = hitType === 'fireball' ? '🔥 FIREBALL!' : '🔥 Second blast!';
      this._log(label, 'enemy');
    } else if (hitType === 'slam') {
      baseDmg = et.slamDmg || et.attack;
      this._log(`💥 SLAM! Braces for impact!`, 'enemy');
    } else if (hitType === 'poison') {
      baseDmg = et.attack;
      // Apply poison DoT after dodge/parry resolves
    } else if (hitType === 'ignite') {
      baseDmg = et.attack;
    } else {
      const v = Math.floor(Math.random() * (COMBAT_CONFIG.ENEMY_ATTACK_VARIANCE * 2 + 1)) - COMBAT_CONFIG.ENEMY_ATTACK_VARIANCE;
      baseDmg = Math.max(1, et.attack + v);
    }

    // Witch curse
    if (et.specialMove === 'curse' && hitType === 'normal') {
      this._log('🧙 The witch curses you! ATK -2 next turn.', 'enemy');
      GameState.player._cursed = true;
    }

    this._startDodgePhase(baseDmg, hitType);
  },

  // ═══════════════════════════════════════════════════════════
  //  DODGE → PARRY FLOW
  // ═══════════════════════════════════════════════════════════

  _startDodgePhase(incomingDmg, hitType) {
    const et = GameState.combat.enemyType;
    const isRage = et.isBoss && (GameState.combat.enemyHp / GameState.combat.enemyMaxHp) < 0.33;

    this._showTimingBar({
      label:      'DODGE!',
      labelClass: 'dodge-lbl',
      windowSize: COMBAT_CONFIG.DODGE_WINDOW_SIZE,
      sweepMs:    COMBAT_CONFIG.DODGE_SWEEP_MS,
      isParry:    false,
      onSuccess: () => {
        this._log('You dodge the attack!', 'dodge');
        this._showEffect('player', 'DODGE', 'heal');
        this._refreshCombatUI();
        // Still apply DoT on dodge for poison/ignite
        if (hitType === 'poison') this._applyPoison();
        if (hitType === 'ignite') this._applyIgnite();
        setTimeout(() => this._processNextEnemyHit(), 500);
      },
      onFail: () => {
        this._log('Dodge missed! Brace for impact...', 'miss');
        setTimeout(() => this._startParryPhase(incomingDmg, hitType, isRage), 300);
      },
    });
  },

  _startParryPhase(incomingDmg, hitType, isRage) {
    const parrySize = isRage ? 0.06 : COMBAT_CONFIG.PARRY_WINDOW_SIZE;
    const parryMs   = isRage ? 1000 : COMBAT_CONFIG.PARRY_SWEEP_MS;

    this._showTimingBar({
      label:      'PARRY!',
      labelClass: 'parry-lbl',
      windowSize: parrySize,
      sweepMs:    parryMs,
      isParry:    true,
      onSuccess: () => {
        const cs      = GameState.combat;
        const counter = Math.floor(GameState.player.attack * COMBAT_CONFIG.PARRY_DAMAGE_MULT);
        cs.enemyHp = Math.max(0, cs.enemyHp - counter);
        this._log(`PARRY! Counter-strike for ${counter}!`, 'parry');
        this._showEffect('enemy', `-${counter}`, 'counter');
        this._showEffect('player', 'PARRY!', 'heal');
        this._refreshCombatUI();

        if (cs.enemyHp <= 0) { setTimeout(() => this._victory(), 500); return; }
        setTimeout(() => this._processNextEnemyHit(), 700);
      },
      onFail: () => {
        const cs = GameState.combat;
        cs.playerHp = Math.max(0, cs.playerHp - incomingDmg);
        this._log(`You take ${incomingDmg} damage!`, 'enemy');
        this._showEffect('player', `-${incomingDmg}`, '');

        document.getElementById('player-sprite').classList.add('hurt');
        setTimeout(() => document.getElementById('player-sprite').classList.remove('hurt'), 400);

        Renderer.shakeScreen();

        // Apply status effects
        if (hitType === 'poison') this._applyPoison();
        if (hitType === 'ignite') this._applyIgnite();

        this._refreshCombatUI();
        this._checkPlayerDeath(() => {
          setTimeout(() => this._processNextEnemyHit(), 600);
        });
      },
    });
  },

  _applyPoison() {
    const et = ENEMY_TYPES.SWAMP_BEAST;
    GameState.player._poisoned = (GameState.player._poisoned || 0) + 2;
    this._log(`☠ Poisoned! Will lose ${et.poisonDmg || 3} HP for 2 steps.`, 'miss');
  },

  _applyIgnite() {
    const et = ENEMY_TYPES.INFERNO_KNIGHT;
    GameState.player._ignited = (GameState.player._ignited || 0) + 3;
    this._log(`🔥 Ignited! Will lose ${et.igniteDmg || 5} HP for 3 steps.`, 'miss');
  },

  // ═══════════════════════════════════════════════════════════
  //  TIMING BAR ENGINE
  // ═══════════════════════════════════════════════════════════

  _showTimingBar(opts) {
    this._timingResolved = false;
    this._timingStart    = null;

    const ws = opts.windowSize;
    this._windowStart = Math.random() * (1 - ws);
    this._windowEnd   = this._windowStart + ws;

    const overlay = document.getElementById('timing-overlay');
    const label   = document.getElementById('timing-label');
    const win     = document.getElementById('timing-window');
    const cursor  = document.getElementById('timing-cursor');
    const cd      = document.getElementById('timing-countdown');

    overlay.classList.remove('hidden');
    label.textContent = opts.label;
    label.className   = `timing-label ${opts.labelClass || ''}`;
    win.className     = `timing-window${opts.isParry ? ' parry-win' : ''}`;
    win.style.left    = `${this._windowStart * 100}%`;
    win.style.width   = `${ws * 100}%`;
    cursor.style.left = '0%';
    cd.textContent    = '';
    cd.className      = 'timing-countdown';

    this._spaceHandler = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this._resolveTimingBar(opts);
      }
    };
    window.addEventListener('keydown', this._spaceHandler);

    const barBg = document.getElementById('timing-bar-bg');
    this._clickHandler = () => this._resolveTimingBar(opts);
    barBg.addEventListener('click', this._clickHandler);

    let remaining = opts.sweepMs;
    this._cdInterval = setInterval(() => {
      remaining -= 100;
      cd.textContent = (remaining / 1000).toFixed(1) + 's';
      if (remaining < 500) cd.classList.add('danger');
      if (remaining <= 0)  clearInterval(this._cdInterval);
    }, 100);

    this._timingRAF = requestAnimationFrame((ts) => this._animateTiming(ts, opts));
  },

  _animateTiming(timestamp, opts) {
    if (this._timingResolved) return;
    if (!this._timingStart) this._timingStart = timestamp;
    const elapsed  = timestamp - this._timingStart;
    const progress = Math.min(elapsed / opts.sweepMs, 1);

    document.getElementById('timing-cursor').style.left = `${progress * 100}%`;

    if (progress >= 1) { this._finishTiming(progress, opts); return; }
    this._timingRAF = requestAnimationFrame((ts) => this._animateTiming(ts, opts));
  },

  _resolveTimingBar(opts) {
    if (this._timingResolved) return;
    const cursor = document.getElementById('timing-cursor');
    const pos    = parseFloat(cursor.style.left) / 100 || 0;
    this._finishTiming(pos, opts);
  },

  _finishTiming(cursorPos, opts) {
    this._timingResolved = true;
    cancelAnimationFrame(this._timingRAF);
    clearInterval(this._cdInterval);
    window.removeEventListener('keydown', this._spaceHandler);
    document.getElementById('timing-bar-bg').removeEventListener('click', this._clickHandler);

    setTimeout(() => document.getElementById('timing-overlay').classList.add('hidden'), 200);

    const inWindow = cursorPos >= this._windowStart && cursorPos <= this._windowEnd;
    if (inWindow) opts.onSuccess(); else opts.onFail();
  },

  // ═══════════════════════════════════════════════════════════
  //  TRAP PARRY
  // ═══════════════════════════════════════════════════════════

  startTrapParry(row, col) {
    this._showTimingBar({
      label:      'PARRY TRAP!',
      labelClass: 'parry-lbl',
      windowSize: TRAP_CONFIG.PARRY_WINDOW_SIZE,
      sweepMs:    TRAP_CONFIG.PARRY_SWEEP_MS,
      isParry:    true,
      onSuccess: () => {
        GameState.setTile(row, col, TILE.FLOOR);
        const el = Renderer.getTileEl(row, col);
        if (el) {
          el.className = 'tile tile-floor';
          const icon = el.querySelector('.tile-icon');
          if (icon) icon.textContent = '';
        }
        UI.flashMessage(TRAP_CONFIG.DISARM_MSG);
        GameState.snake[0].row = row;
        GameState.snake[0].col = col;
        Renderer.render();
        Renderer.scrollToHead();
        GameState.movementLocked = false;
        GameState.inputLocked    = false;
      },
      onFail: () => {
        GameState.player.hp = Math.max(0, GameState.player.hp - TRAP_CONFIG.DAMAGE);
        UI.flashMessage(`Trap! -${TRAP_CONFIG.DAMAGE} HP`);
        UI.updateHUD();
        Renderer.shakeScreen();

        const el = Renderer.getTileEl(row, col);
        if (el) {
          el.classList.add('triggered');
          setTimeout(() => el.classList.remove('triggered'), 400);
        }

        GameState.movementLocked = false;
        GameState.inputLocked    = false;

        if (GameState.player.hp <= 0) {
          setTimeout(() => UI.showScreen('gameover'), 600);
        }
      },
    });
  },

  // ═══════════════════════════════════════════════════════════
  //  PLAYER TURN / VICTORY / DEFEAT
  // ═══════════════════════════════════════════════════════════

  _startPlayerTurn() {
    const cs = GameState.combat;
    cs.playerTurn = true;
    cs.waitingForAction = true;
    this._setActionsEnabled(true);
    this._updateSkillButton();
    this._log('Your turn.', 'system');
  },

  _victory() {
    const cs    = GameState.combat;
    const enemy = cs.enemy;
    const xp    = cs.enemyType.xp;

    enemy.defeated = true;
    enemy.hp = 0;
    GameState.setTile(enemy.row, enemy.col, TILE.FLOOR);

    GameState.player.hp = cs.playerHp;
    GameState.player.chargeStacks = cs.chargeStacks;

    GameState.player._xp = (GameState.player._xp || 0) + xp;
    const xpNeeded = GameState.player.level * 25;
    if (GameState.player._xp >= xpNeeded) {
      GameState.player._xp -= xpNeeded;
      GameState.player.level++;
      GameState.player.attack += 2;
      GameState.player.maxHp  += 8;
      GameState.player.hp = GameState.player.maxHp;
      this._log(`Level up! Now level ${GameState.player.level}!`, 'system');
    }

    this._showResult(true, `Victory! +${xp} XP`);
  },

  _defeat() {
    GameState.combat.active = false;
    GameState.player.hp = 0;
    this._showResult(false, 'Defeated...');
  },

  _checkPlayerDeath(onAlive) {
    if (GameState.combat.playerHp <= 0) {
      setTimeout(() => this._defeat(), 600);
    } else {
      onAlive();
    }
  },

  _showResult(won, text) {
    const el = document.getElementById('combat-result');
    const resultIconEl = document.getElementById('result-icon');
    resultIconEl.innerHTML = '';
    const resultImg = document.createElement('img');
    resultImg.src = won ? 'images/ui/victory.png' : 'images/ui/defeat.png';
    resultImg.alt = won ? 'Victory' : 'Defeat';
    resultImg.draggable = false;
    resultIconEl.appendChild(resultImg);
    document.getElementById('result-text').textContent = text;
    document.getElementById('result-continue').dataset.won = won ? '1' : '0';
    el.classList.remove('hidden');
  },

  onResultContinue(won) {
    document.getElementById('combat-result').classList.add('hidden');
    GameState.combat.active = false;

    if (won) {
      GameState.inputLocked    = false;
      GameState.movementLocked = false;
      UI.showScreen('dungeon');
      Renderer.render();
      UI.updateHUD();
      UI.updateChargeDisplay(GameState.player.chargeStacks);
    } else {
      UI.showScreen('gameover');
    }
  },

  // ═══════════════════════════════════════════════════════════
  //  HELPERS
  // ═══════════════════════════════════════════════════════════

  _refreshCombatUI() {
    const cs   = GameState.combat;
    const pMax = GameState.player.maxHp;
    const pPct = Math.max(0, cs.playerHp / pMax * 100);
    const pBar = document.getElementById('player-combat-hp-bar');
    pBar.style.width = `${pPct}%`;
    pBar.className   = `hp-bar${pPct < 25 ? ' hp-danger' : pPct < 50 ? ' hp-low' : ''}`;
    document.getElementById('player-hp-cur').textContent = cs.playerHp;
    document.getElementById('player-hp-max').textContent = pMax;

    const ePct = Math.max(0, cs.enemyHp / cs.enemyMaxHp * 100);
    document.getElementById('enemy-hp-bar').style.width = `${ePct}%`;
    document.getElementById('enemy-hp-cur').textContent = cs.enemyHp;
    document.getElementById('enemy-hp-max').textContent = cs.enemyMaxHp;

    if (cs.enemyType?.isBoss && ePct < 33) {
      document.getElementById('enemy-sprite').classList.add('rage');
    }
  },

  _updateSkillButton() {
    const cs  = GameState.combat;
    const btn = document.getElementById('btn-skill');
    if (!btn) return;
    const ready = cs.chargeStacks >= COMBAT_CONFIG.FANG_STACKS_NEEDED;
    btn.disabled  = !ready;
    btn.className = `btn-combat${ready ? ' skill-ready' : ''}`;

    for (let i = 1; i <= COMBAT_CONFIG.FANG_STACKS_NEEDED; i++) {
      const pip = document.getElementById(`cpip-${i}`);
      if (pip) pip.className = `skill-pip${i <= cs.chargeStacks ? ' full' : ''}`;
    }
  },

  _log(msg, type) {
    const log = document.getElementById('combat-log');
    const p   = document.createElement('p');
    p.className = `log-${type}`;
    p.textContent = msg;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  },

  _clearLog() { document.getElementById('combat-log').innerHTML = ''; },

  _setActionsEnabled(enabled) {
    ['btn-attack', 'btn-skill'].forEach(id => {
      const b = document.getElementById(id);
      if (b) b.disabled = !enabled || (id === 'btn-skill' && GameState.combat.chargeStacks < COMBAT_CONFIG.FANG_STACKS_NEEDED);
    });
    if (enabled) this._updateSkillButton();
  },

  _showEffect(side, text, extraClass) {
    const id = side === 'enemy' ? 'combat-enemy-effect' : 'combat-player-effect';
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = `combat-effect ${extraClass}`;
    void el.offsetWidth;
    el.classList.add('show');
    setTimeout(() => { el.classList.remove('show'); el.textContent = ''; }, 900);
  },
};
