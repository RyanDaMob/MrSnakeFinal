/**
 * state.js
 * Central mutable game state + settings + chapter progress.
 */

const GameState = {

  currentScreen: 'menu',

  player: {
    hp:           PLAYER_DEFAULTS.hp,
    maxHp:        PLAYER_DEFAULTS.maxHp,
    attack:       PLAYER_DEFAULTS.attack,
    level:        PLAYER_DEFAULTS.level,
    chargeStacks: 0,
    _xp:          0,
    _cursed:      false,
    _poisoned:    0,   // turns remaining
    _ignited:     0,
  },

  // Snake array: [{ row, col }]. segments[0] = head.
  snake: [],

  direction:     DIR.RIGHT,
  nextDirection: null,

  mapId:    CHAPTER1_MAP,
  mapRows:  0,
  mapCols:  0,
  tileGrid: [],
  tileState: {},

  enemies: [],
  chests:  [],
  plates:  [],
  doors:   [],

  trapCooldowns: {},

  checkpointRow:   0,
  checkpointCol:   0,
  checkpointSnake: [],

  combat: {
    active:             false,
    enemy:              null,
    enemyType:          null,
    playerHp:           0,
    enemyHp:            0,
    enemyMaxHp:         0,
    playerTurn:         true,
    waitingForAction:   false,
    chargeStacks:       0,
    turnCount:          0,
  },

  pendingChest:    null,
  inputLocked:     false,
  movementLocked:  false,

  // ── Settings ──────────────────────────────────────────────
  settings: {
    musicVolume: 70,
    sfxVolume:   80,
  },

  // ── Chapter progress ──────────────────────────────────────
  progress: {
    chapter1: false,
    chapter2: false,
    chapter3: false,
    chapter4: false,
  },

  reset() {
    this.player.hp           = PLAYER_DEFAULTS.hp;
    this.player.maxHp        = PLAYER_DEFAULTS.maxHp;
    this.player.attack       = PLAYER_DEFAULTS.attack;
    this.player.level        = PLAYER_DEFAULTS.level;
    this.player.chargeStacks = 0;
    this.player._xp          = 0;
    this.player._cursed      = false;
    this.player._poisoned    = 0;
    this.player._ignited     = 0;

    this.snake         = [];
    this.direction     = DIR.RIGHT;
    this.nextDirection = null;
    this.tileState     = {};
    this.enemies       = [];
    this.chests        = [];
    this.plates        = [];
    this.doors         = [];
    this.trapCooldowns = {};
    this.pendingChest  = null;
    this.inputLocked   = false;
    this.movementLocked= false;

    this.combat = {
      active: false, enemy: null, enemyType: null,
      playerHp: 0, enemyHp: 0, enemyMaxHp: 0,
      playerTurn: true, waitingForAction: false,
      chargeStacks: 0, turnCount: 0,
    };
  },

  getTile(row, col) {
    const key = `${row},${col}`;
    if (this.tileState[key] !== undefined) return this.tileState[key];
    return this.tileGrid[row]?.[col] ?? TILE.WALL;
  },

  setTile(row, col, tileId) {
    this.tileState[`${row},${col}`] = tileId;
  },

  isPassable(row, col) {
    const t = this.getTile(row, col);
    if (t === TILE.TRAP) return false;
    return TILE_CONFIG[t]?.passable ?? false;
  },

  getEnemyAt(row, col) {
    return this.enemies.find(e => e.key === `${row},${col}` && !e.defeated) || null;
  },

  getChestAt(row, col) {
    return this.chests.find(c => c.key === `${row},${col}` && !c.opened) || null;
  },

  saveCheckpoint(row, col) {
    this.checkpointRow   = row;
    this.checkpointCol   = col;
    this.checkpointSnake = this.snake.map(s => ({ ...s }));
    this.saveToLocalStorage();
  },

  loadCheckpoint() {
    this.player.hp = this.player.maxHp;
    this.player._poisoned = 0;
    this.player._ignited  = 0;
    if (this.checkpointSnake.length > 0) {
      this.snake = this.checkpointSnake.map(s => ({ ...s }));
    } else {
      MapSystem.initSnake();
    }
    this.direction     = DIR.RIGHT;
    this.nextDirection = null;
  },

  completeChapter(chapterId) {
    this.progress[chapterId] = true;
    // Unlock next chapter
    const idx = CHAPTERS.findIndex(c => c.id === chapterId);
    if (idx >= 0 && idx + 1 < CHAPTERS.length) {
      CHAPTERS[idx + 1].unlocked = true;
    }
    this.saveToLocalStorage();
  },

  saveToLocalStorage() {
    try {
      const save = {
        player:          this.player,
        checkpointRow:   this.checkpointRow,
        checkpointCol:   this.checkpointCol,
        checkpointSnake: this.checkpointSnake,
        tileState:       this.tileState,
        enemies:         this.enemies,
        chests:          this.chests,
        plates:          this.plates,
        doors:           this.doors,
        settings:        this.settings,
        progress:        this.progress,
        currentMapId:    this.mapId,
      };
      localStorage.setItem('dungeonSerpent_save', JSON.stringify(save));
    } catch(e) {}
  },

  loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem('dungeonSerpent_save');
      if (!raw) return false;
      const save = JSON.parse(raw);
      Object.assign(this.player, save.player);
      this.checkpointRow   = save.checkpointRow;
      this.checkpointCol   = save.checkpointCol;
      this.checkpointSnake = save.checkpointSnake;
      this.tileState       = save.tileState;
      this.enemies         = save.enemies;
      this.chests          = save.chests;
      this.plates          = save.plates  || [];
      this.doors           = save.doors   || [];
      if (save.settings) Object.assign(this.settings, save.settings);
      if (save.progress) {
        Object.assign(this.progress, save.progress);
        // Re-apply unlocks
        CHAPTERS.forEach(c => { if (this.progress[c.id]) c.unlocked = true; });
        // Unlock next after each completed
        CHAPTERS.forEach((c, i) => {
          if (this.progress[c.id] && i + 1 < CHAPTERS.length) CHAPTERS[i+1].unlocked = true;
        });
      }
      return true;
    } catch(e) {
      return false;
    }
  },
};
