/**
 * snake.js
 * Snake movement and tile interaction logic.
 * Removed: pressure plates. Added: gate tile, chapter completion.
 */

const SnakeSystem = {

  move() {
    if (GameState.movementLocked || GameState.inputLocked) return;
    if (GameState.currentScreen !== 'dungeon') return;

    if (GameState.nextDirection) {
      const next = GameState.nextDirection;
      const cur  = GameState.direction;
      const is180 = (next.dr === -cur.dr && next.dc === -cur.dc);
      if (!is180) GameState.direction = next;
      GameState.nextDirection = null;
    }

    const head = GameState.snake[0];
    const dir  = GameState.direction;
    const newRow = head.row + dir.dr;
    const newCol = head.col + dir.dc;

    const tileId = GameState.getTile(newRow, newCol);

    if (tileId === TILE.TRAP) {
      this._onTrap(newRow, newCol);
      return;
    }

    if (!GameState.isPassable(newRow, newCol)) {
      return;
    }

    for (let i = GameState.snake.length - 1; i > 0; i--) {
      GameState.snake[i].row = GameState.snake[i - 1].row;
      GameState.snake[i].col = GameState.snake[i - 1].col;
    }
    GameState.snake[0].row = newRow;
    GameState.snake[0].col = newCol;

    // Apply DoT effects each move step
    this._applyDoT();

    this._handleTileInteraction(newRow, newCol);

    Renderer.render();
    UI.updateHUD();
    Renderer.scrollToHead();
  },

  _applyDoT() {
    const p = GameState.player;
    let dmg = 0;
    let msgs = [];

    if (p._poisoned > 0) {
      const et = ENEMY_TYPES.SWAMP_BEAST;
      dmg += et.poisonDmg || 3;
      p._poisoned--;
      msgs.push(`☠ Poison -${et.poisonDmg || 3} HP`);
    }
    if (p._ignited > 0) {
      const et = ENEMY_TYPES.INFERNO_KNIGHT;
      dmg += et.igniteDmg || 5;
      p._ignited--;
      msgs.push(`🔥 Burn -${et.igniteDmg || 5} HP`);
    }

    if (dmg > 0) {
      p.hp = Math.max(0, p.hp - dmg);
      msgs.forEach(m => UI.flashMessage(m));
      if (p.hp <= 0) {
        setTimeout(() => UI.showScreen('gameover'), 500);
      }
    }
  },

  _handleTileInteraction(row, col) {
    const tileId = GameState.getTile(row, col);

    switch (tileId) {
      case TILE.CHECKPOINT: this._onCheckpoint(row, col); break;
      case TILE.CHEST:      this._onChest(row, col);      break;
      case TILE.ENEMY:      this._onEnemy(row, col);      break;
      case TILE.GATE:       this._onGate(row, col);       break;
    }

    if (MapSystem.isVictoryTile(row, col)) this._onVictory();
  },

  // ── Trap ──────────────────────────────────────────────────
  _onTrap(row, col) {
    GameState.movementLocked = true;
    GameState.inputLocked    = true;
    UI.flashMessage('⚙ Spike trap! PARRY to pass!');
    setTimeout(() => {
      CombatSystem.startTrapParry(row, col);
    }, 80);
  },

  // ── Checkpoint ────────────────────────────────────────────
  _onCheckpoint(row, col) {
    const isNew   = (row !== GameState.checkpointRow || col !== GameState.checkpointCol);
    const needsHp = GameState.player.hp < GameState.player.maxHp;
    if (!isNew && !needsHp) return;

    GameState.player.hp = GameState.player.maxHp;
    GameState.player._poisoned = 0;
    GameState.player._ignited  = 0;
    GameState.saveCheckpoint(row, col);
    UI.updateHUD();

    GameState.inputLocked    = true;
    GameState.movementLocked = true;
    document.getElementById('overlay-checkpoint').classList.remove('hidden');
  },

  // ── Chest ─────────────────────────────────────────────────
  _onChest(row, col) {
    const chest = GameState.getChestAt(row, col);
    if (!chest) return;

    GameState.pendingChest   = chest.key;
    GameState.inputLocked    = true;
    GameState.movementLocked = true;
    document.getElementById('overlay-chest').classList.remove('hidden');
  },

  // ── Enemy ─────────────────────────────────────────────────
  _onEnemy(row, col) {
    const enemy = GameState.getEnemyAt(row, col);
    if (!enemy) return;

    GameState.movementLocked = true;
    GameState.inputLocked    = true;
    setTimeout(() => CombatSystem.start(enemy), 100);
  },

  // ── Gate (same as victory for now) ────────────────────────
  _onGate(row, col) {
    this._onVictory();
  },

  // ── Victory ───────────────────────────────────────────────
  _onVictory() {
    GameState.movementLocked = true;
    GameState.inputLocked    = true;

    const chapterId = GameState.mapId;
    GameState.completeChapter(chapterId);

    const isLast = chapterId === 'chapter4';

    setTimeout(() => {
      if (isLast) {
        UI.showScreen('gamecomplete');
      } else {
        UI.showVictoryScreen(chapterId);
      }
    }, 400);
  },

  respawnAtCheckpoint() {
    GameState.loadCheckpoint();
    GameState.inputLocked    = false;
    GameState.movementLocked = false;
    UI.showScreen('dungeon');
    Renderer.render();
    UI.updateHUD();
    UI.flashMessage('Returned to checkpoint.');
    Renderer.scrollToHead();
  },
};
