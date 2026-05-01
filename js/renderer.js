/**
 * renderer.js
 * DOM-based dungeon tile renderer.
 *
 * KEY CHANGE: Only the snake HEAD is drawn on the map.
 * Body segments exist in GameState but are invisible — giving
 * a single-tile serpent look rather than a trailing snake.
 */

const Renderer = {

  _tileCache: {},
  _prevHeadKey: null,   // last rendered head position for cleanup

  /**
   * Build entire map DOM once at game start.
   */
  buildMap() {
    const map  = document.getElementById('dungeon-map');
    map.innerHTML = '';
    this._tileCache   = {};
    this._prevHeadKey = null;

    const rows = GameState.mapRows;
    const cols = GameState.mapCols;
    map.style.gridTemplateColumns = `repeat(${cols}, var(--tile-size))`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const div = document.createElement('div');
        div.className = 'tile';
        const key = `${r},${c}`;
        div.dataset.key = key;
        this._tileCache[key] = div;
        this._applyTileStyle(div, r, c);
        map.appendChild(div);
      }
    }

    this._renderHead();
  },

  /**
   * Efficient render: only touch tiles that changed.
   * Called after each move.
   */
  render() {
    // Clear old head tile
    this._clearHead();

    // Re-apply any dynamically changed tiles
    for (const key in GameState.tileState) {
      const [r, c] = key.split(',').map(Number);
      const el = this._tileCache[key];
      if (el) this._applyTileStyle(el, r, c);
    }

    // Paint new head
    this._renderHead();
  },

  _applyTileStyle(el, row, col) {
    const tileId = GameState.getTile(row, col);
    const cfg    = TILE_CONFIG[tileId];
    if (!cfg) return;

    el.className = `tile ${cfg.cssClass}`;

    let imageSrc = cfg.image;  // path like 'images/chest.png' or null

    // Enemy — use enemy-type image, hide if defeated
    if (tileId === TILE.ENEMY) {
      const e = GameState.enemies.find(e => e.key === `${row},${col}`);
      if (e) {
        imageSrc = e.defeated ? null : (ENEMY_TYPES[e.type]?.image || null);
        if (e.defeated) el.classList.add('defeated');
      }
    }

    // Chest — show opened variant if opened
    if (tileId === TILE.CHEST) {
      const c = GameState.chests.find(c => c.key === `${row},${col}`);
      if (c?.opened) { imageSrc = 'images/chest_open.png'; el.classList.add('opened'); }
    }

    // Plate — activated glow
    if (tileId === TILE.PLATE) {
      const p = GameState.plates.find(p => p.key === `${row},${col}`);
      if (p?.activated) {
        imageSrc = 'images/plate_activated.png';
        el.classList.add('activated');
      }
    }

    // Ensure icon span
    let span = el.querySelector('.tile-icon');
    if (!span) {
      span = document.createElement('span');
      span.className = 'tile-icon';
      el.appendChild(span);
    }

    // Render image or clear
    span.innerHTML = '';
    if (imageSrc) {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = '';
      img.draggable = false;
      span.appendChild(img);
    }
  },

  // ── Head rendering ──────────────────────────────────────────

  _clearHead() {
    if (!this._prevHeadKey) return;
    const el = this._tileCache[this._prevHeadKey];
    if (!el) return;

    // Remove snake segments
    el.querySelectorAll('.snake-head-seg').forEach(s => s.remove());

    // Restore tile's icon span if it was hidden
    const span = el.querySelector('.tile-icon');
    if (span) span.style.display = '';

    // Re-apply base tile style
    const [r, c] = this._prevHeadKey.split(',').map(Number);
    this._applyTileStyle(el, r, c);

    this._prevHeadKey = null;
  },

  _renderHead() {
    const head = GameState.snake[0];
    if (!head) return;

    const key = `${head.row},${head.col}`;
    const el  = this._tileCache[key];
    if (!el) return;

    this._prevHeadKey = key;

    // Hide tile icon behind head
    const span = el.querySelector('.tile-icon');
    if (span) span.style.display = 'none';

    // Remove any old head seg
    el.querySelectorAll('.snake-head-seg').forEach(s => s.remove());

    const seg = document.createElement('div');
    seg.className = `snake-head-seg dir-${GameState.direction.name}`;
    el.appendChild(seg);
  },

  getTileEl(row, col) {
    return this._tileCache[`${row},${col}`] || null;
  },

  /**
   * Smooth-scroll viewport to keep head centred.
   */
  scrollToHead() {
    const head = GameState.snake[0];
    if (!head) return;
    const vp = document.getElementById('dungeon-viewport');
    const x  = head.col * TILE_SIZE - vp.clientWidth  / 2 + TILE_SIZE / 2;
    const y  = head.row * TILE_SIZE - vp.clientHeight / 2 + TILE_SIZE / 2;
    vp.scrollTo({ left: Math.max(0, x), top: Math.max(0, y), behavior: 'smooth' });
  },

  shakeScreen() {
    const vp = document.getElementById('dungeon-viewport');
    vp.classList.remove('screen-shake');
    void vp.offsetWidth;
    vp.classList.add('screen-shake');
    setTimeout(() => vp.classList.remove('screen-shake'), 350);
  },

  flashTile(row, col) {
    const el = this.getTileEl(row, col);
    if (!el) return;
    el.classList.add('tile-dmg-flash');
    setTimeout(() => el.classList.remove('tile-dmg-flash'), 380);
  },
};
