/**
 * constants.js
 * All tile IDs, enemy definitions, config constants.
 */

// ── Tile Type IDs ─────────────────────────────────────────
const TILE = {
  FLOOR:        0,
  WALL:         1,
  CHEST:        2,
  ENEMY:        3,
  TRAP:         4,
  CHECKPOINT:   5,
  DOOR_LOCKED:  6,
  DOOR_OPEN:    7,
  PLATE:        8,
  GATE:         9,   // chapter exit gate
};

// ── Tile visual config ────────────────────────────────────
// image: path relative to index.html (inside images/ folder)
// Supported formats: .png, .jpg, .webp
// Leave image: null for tiles with no icon (floor, wall)
const TILE_CONFIG = {
  [TILE.FLOOR]:       { cssClass: 'tile-floor',       passable: true,  image: null },
  [TILE.WALL]:        { cssClass: 'tile-wall',         passable: false, image: null },
  [TILE.CHEST]:       { cssClass: 'tile-chest',        passable: true,  image: 'images/chest.png' },
  [TILE.ENEMY]:       { cssClass: 'tile-enemy',        passable: true,  image: null },   // enemy image comes from ENEMY_TYPES
  [TILE.TRAP]:        { cssClass: 'tile-trap',         passable: false, image: 'images/trap.png' },
  [TILE.CHECKPOINT]:  { cssClass: 'tile-checkpoint',   passable: true,  image: 'images/checkpoint.png' },
  [TILE.DOOR_LOCKED]: { cssClass: 'tile-door-locked',  passable: false, image: 'images/door_locked.png' },
  [TILE.DOOR_OPEN]:   { cssClass: 'tile-door-open',    passable: true,  image: 'images/door_open.png' },
  [TILE.PLATE]:       { cssClass: 'tile-plate',        passable: true,  image: 'images/plate.png' },
  [TILE.GATE]:        { cssClass: 'tile-gate',         passable: true,  image: 'images/gate.png' },
};

// ── Directions ────────────────────────────────────────────
const DIR = {
  UP:    { dr: -1, dc:  0, name: 'up'    },
  DOWN:  { dr:  1, dc:  0, name: 'down'  },
  LEFT:  { dr:  0, dc: -1, name: 'left'  },
  RIGHT: { dr:  0, dc:  1, name: 'right' },
};

// ── Player defaults ───────────────────────────────────────
const PLAYER_DEFAULTS = {
  hp:       25,
  maxHp:    25,
  attack:   6,
  level:    1,
  chargeStacks: 0,
};

// ── Enemy roster ──────────────────────────────────────────
// image: path to enemy image file (place files inside images/enemies/)
// Supported formats: .png, .jpg, .webp
const ENEMY_TYPES = {
  SKELETON: {
    id: 'SKELETON', name: 'Rotted Skeleton', image: 'images/enemies/skeleton.png',
    hp: 14, attack: 4, xp: 8, isBoss: false, isMini: false,
    combatBg: '#110a08', specialMove: null,
  },
  GOBLIN: {
    id: 'GOBLIN', name: 'Cave Goblin', image: 'images/enemies/goblin.png',
    hp: 22, attack: 6, xp: 14, isBoss: false, isMini: false,
    combatBg: '#0a100a', specialMove: null,
  },
  ORC: {
    id: 'ORC', name: 'Stone Orc', image: 'images/enemies/orc.png',
    hp: 38, attack: 10, xp: 22, isBoss: false, isMini: false,
    combatBg: '#100a08', specialMove: null,
  },
  WITCH: {
    id: 'WITCH', name: 'Cursed Witch', image: 'images/enemies/witch.png',
    hp: 18, attack: 14, xp: 30, isBoss: false, isMini: false,
    combatBg: '#080810', specialMove: 'curse',
  },

  // ── Mini-Bosses (one per chapter, guard the gate) ────────
  DUNGEON_WARDEN: {
    id: 'DUNGEON_WARDEN', name: 'Dungeon Warden', image: 'images/enemies/dungeon_warden.png',
    hp: 55, attack: 13, xp: 60, isBoss: false, isMini: true,
    combatBg: '#0e0808',
    specialMove: 'slam',   // heavy slam: deals 1.4× damage every 2 turns
    slamDmg: 18,
  },
  SWAMP_BEAST: {
    id: 'SWAMP_BEAST', name: 'Swamp Beast', image: 'images/enemies/swamp_beast.png',
    hp: 70, attack: 15, xp: 80, isBoss: false, isMini: true,
    combatBg: '#061008',
    specialMove: 'poison', // poisons player for 3 HP per turn for 2 turns
    poisonDmg: 3,
  },
  INFERNO_KNIGHT: {
    id: 'INFERNO_KNIGHT', name: 'Inferno Knight', image: 'images/enemies/inferno_knight.png',
    hp: 85, attack: 18, xp: 100, isBoss: false, isMini: true,
    combatBg: '#140600',
    specialMove: 'ignite', // burns player: -5 HP for 3 turns
    igniteDmg: 5,
  },

  // ── Final Boss ────────────────────────────────────────────
  BOSS: {
    id: 'BOSS', name: 'General Gavern', image: 'images/enemies/boss.png',
    hp: 100, attack: 20, xp: 150, isBoss: true, isMini: false,
    combatBg: '#100808',
    specialMove: 'fireball',
    fireballDmg: 14,
  },
};

// ── Chapter definitions ───────────────────────────────────
const CHAPTERS = [
  { id: 'chapter1', name: 'Chapter 1 : Dungeon Escape',  unlocked: true  },
  { id: 'chapter2', name: 'Chapter 2 : Swamp Escape',    unlocked: false },
  { id: 'chapter3', name: 'Chapter 3 : Inferno Escape',  unlocked: false },
  { id: 'chapter4', name: 'Final Chapter : Save The Brother', unlocked: false },
];

// ── Combat config ─────────────────────────────────────────
const COMBAT_CONFIG = {
  DODGE_WINDOW_SIZE:    0.30,
  DODGE_SWEEP_MS:       2000,
  PARRY_WINDOW_SIZE:    0.09,
  PARRY_SWEEP_MS:       1300,
  PARRY_DAMAGE_MULT:    2.0,
  FANG_STRIKE_MULT:     1.5,
  FANG_STACKS_NEEDED:   2,
  ATTACK_VARIANCE:      2,
  ENEMY_ATTACK_VARIANCE: 2,
};

// ── Trap config ───────────────────────────────────────────
const TRAP_CONFIG = {
  DAMAGE:            8,
  PARRY_WINDOW_SIZE: 0.09,
  PARRY_SWEEP_MS:    1300,
  DISARM_MSG: 'The spikes retract — path clear!',
};

// ── Chest rewards ─────────────────────────────────────────
const CHEST_REWARDS = {
  HP_AMOUNT:  12,
  ATK_AMOUNT:  4,
};

// ── Tile pixel size ───────────────────────────────────────
const TILE_SIZE = 40;

const CHAPTER1_MAP = 'chapter1';
const CHAPTER2_MAP = 'chapter2';
const CHAPTER3_MAP = 'chapter3';
const CHAPTER4_MAP = 'chapter4';
