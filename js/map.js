/**
 * map.js
 * 4-chapter map definitions. Each is a one-way winding corridor maze.
 * No pressure plates. Mini-boss guards the chapter gate.
 *
 * Tile legend:
 *   0=floor  1=wall  2=chest  3=enemy  4=trap
 *   5=checkpoint  6=locked door  7=open door  9=gate
 */

const MAPS = {

  // ════════════════════════════════════════════════════════
  //  CHAPTER 1 — Dungeon Escape
  // ════════════════════════════════════════════════════════
  chapter1: {
    rows: 28, cols: 42,
    startRow: 1, startCol: 1,
    startDir: DIR.RIGHT,
    chapterId: 'chapter1',
    miniBossType: 'DUNGEON_WARDEN',

    grid: (function(){
      const W=1,_=0,C=2,E=3,T=4,S=5,G=9;
      return [
        /*r0 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r1 */ [W,_,_,_,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r2 */ [W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r3 */ [W,W,W,W,W,W,W,W,_,_,_,_,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r4 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r5 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,_,_,_,_,E,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r6 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r7 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,C,_,_,_,_,_,_,W,W,W,W,W,W],
        /*r8 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W],
        /*r9 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W],
        /*r10*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,_,_,W],
        /*r11*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W],
        /*r12*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W],
        /*r13*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,T,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W],
        /*r14*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r15*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r16*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,_,E,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r17*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r18*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r19*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,_,S,_,_,_,W,W,W,W],
        /*r20*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W],
        /*r21*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W],
        /*r22*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,W],
        /*r23*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W],
        /*r24*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W],
        /*r25*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,T,_,_,_,_,E,_,_,_,_,W],
        /*r26*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W],
        /*r27*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,G,W,W,W,W,W,W,W,W,W,W],
      ];
    })(),

    enemyData: [
      { row: 5,  col: 24, type: 'SKELETON' },
      { row: 16, col: 25, type: 'GOBLIN'   },
      { row: 25, col: 36, type: 'DUNGEON_WARDEN' }, // mini-boss guards gate
    ],
    chestData:      [{ row: 7, col: 29 }],
    plateData:      [],
    doorData:       [],
    checkpointData: [{ row: 1, col: 1 }, { row: 19, col: 34 }],
    victoryRow: 27, victoryCol: 31,
    gateRow:    27, gateCol:    31,
  },

  // ════════════════════════════════════════════════════════
  //  CHAPTER 2 — Swamp Escape
  // ════════════════════════════════════════════════════════
  chapter2: {
    rows: 30, cols: 44,
    startRow: 1, startCol: 1,
    startDir: DIR.RIGHT,
    chapterId: 'chapter2',
    miniBossType: 'SWAMP_BEAST',

    grid: (function(){
      const W=1,_=0,C=2,E=3,T=4,S=5,G=9;
      return [
        /*r0 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r1 */ [W,_,_,_,_,_,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r2 */ [W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r3 */ [W,W,W,W,W,W,W,W,W,W,_,_,_,_,_,E,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r4 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r5 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r6 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r7 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,C,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W],
        /*r8 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W],
        /*r9 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,_,_,_,_,_,W,W],
        /*r10*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W],
        /*r11*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W],
        /*r12*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,T,_,_,_,_,_,_,_,E,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W],
        /*r13*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r14*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r15*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,S,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r16*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r17*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r18*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,_,_,_,_,_,W,W,W,W,W,W],
        /*r19*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W],
        /*r20*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W],
        /*r21*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,C,_,_,W,W],
        /*r22*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W],
        /*r23*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W],
        /*r24*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,W],
        /*r25*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W],
        /*r26*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,T,_,_,_,_,_,E,_,_,W],
        /*r27*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W],
        /*r28*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W],
        /*r29*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,G,W,W,W,W,W,W,W,W,W],
      ];
    })(),

    enemyData: [
      { row: 3,  col: 15, type: 'GOBLIN'      },
      { row: 12, col: 28, type: 'ORC'         },
      { row: 26, col: 40, type: 'WITCH'       },
      { row: 26, col: 41, type: 'SWAMP_BEAST' }, // mini-boss guards gate
    ],
    chestData:      [{ row: 7, col: 28 }, { row: 21, col: 39 }],
    plateData:      [],
    doorData:       [],
    checkpointData: [{ row: 1, col: 1 }, { row: 15, col: 24 }],
    victoryRow: 29, victoryCol: 34,
    gateRow:    29, gateCol:    34,
  },

  // ════════════════════════════════════════════════════════
  //  CHAPTER 3 — Inferno Escape
  // ════════════════════════════════════════════════════════
  chapter3: {
    rows: 32, cols: 46,
    startRow: 1, startCol: 1,
    startDir: DIR.RIGHT,
    chapterId: 'chapter3',
    miniBossType: 'INFERNO_KNIGHT',

    grid: (function(){
      const W=1,_=0,C=2,E=3,T=4,S=5,G=9;
      return [
        /*r0 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r1 */ [W,_,_,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r2 */ [W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r3 */ [W,W,W,W,W,W,W,_,_,_,_,_,_,_,_,T,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r4 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r5 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,E,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r6 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r7 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,C,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W],
        /*r8 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W],
        /*r9 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,_,_,W,W,W,W,W,W],
        /*r10*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W],
        /*r11*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W],
        /*r12*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,T,_,_,_,_,_,_,_,_,_,W,W,W,W,W,W],
        /*r13*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r14*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r15*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,S,_,_,_,_,W,W,W,W,W,W,W],
        /*r16*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W],
        /*r17*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W],
        /*r18*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,E,_,_,W,W],
        /*r19*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W],
        /*r20*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W],
        /*r21*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,W],
        /*r22*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W],
        /*r23*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W],
        /*r24*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,T,_,_,_,_,_,E,_,_,W],
        /*r25*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W],
        /*r26*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W],
        /*r27*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,_,_,_,W,W,W],
        /*r28*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W],
        /*r29*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W],
        /*r30*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W],
        /*r31*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,G,W,W,W],
      ];
    })(),

    enemyData: [
      { row: 5,  col: 20, type: 'GOBLIN'         },
      { row: 18, col: 41, type: 'WITCH'           },
      { row: 24, col: 42, type: 'INFERNO_KNIGHT'  }, // mini-boss guards gate
    ],
    chestData:      [{ row: 7, col: 29 }],
    plateData:      [],
    doorData:       [],
    checkpointData: [{ row: 1, col: 1 }, { row: 15, col: 34 }],
    victoryRow: 31, victoryCol: 42,
    gateRow:    31, gateCol:    42,
  },

  // ════════════════════════════════════════════════════════
  //  CHAPTER 4 — Final: Save The Brother
  // ════════════════════════════════════════════════════════
  chapter4: {
    rows: 34, cols: 48,
    startRow: 1, startCol: 1,
    startDir: DIR.RIGHT,
    chapterId: 'chapter4',
    miniBossType: 'BOSS',

    grid: (function(){
      const W=1,_=0,C=2,E=3,T=4,S=5,G=9;
      return [
        /*r0 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r1 */ [W,_,_,_,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r2 */ [W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r3 */ [W,W,W,W,W,W,W,W,_,_,_,_,_,T,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r4 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r5 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,E,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r6 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r7 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,C,_,_,_,_,_,_,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r8 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r9 */ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,_,_,_,W,W,W,W,W,W],
        /*r10*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W],
        /*r11*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W],
        /*r12*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,T,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,W,W],
        /*r13*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r14*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        /*r15*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,S,_,_,_,_,_,_,W,W,W,W,W,W,W,W,W],
        /*r16*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W],
        /*r17*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W,W,W,W,W,W,W],
        /*r18*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,_,_,E,_,_,W,W,W],
        /*r19*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W],
        /*r20*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W],
        /*r21*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,C,W],
        /*r22*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W],
        /*r23*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W],
        /*r24*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W],
        /*r25*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W],
        /*r26*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,T,_,_,W],
        /*r27*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W],
        /*r28*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W,W],
        /*r29*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,_,W,W],
        /*r30*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W],
        /*r31*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_,W,W],
        /*r32*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,E,W,W],
        /*r33*/ [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,G,W,W],
      ];
    })(),

    enemyData: [
      { row: 5,  col: 22, type: 'ORC'   },
      { row: 18, col: 42, type: 'WITCH' },
      { row: 32, col: 45, type: 'BOSS'  }, // final boss guards gate
    ],
    chestData:      [{ row: 7, col: 29 }, { row: 21, col: 46 }],
    plateData:      [],
    doorData:       [],
    checkpointData: [{ row: 1, col: 1 }, { row: 15, col: 32 }],
    victoryRow: 33, victoryCol: 45,
    gateRow:    33, gateCol:    45,
  },
};

// ── Map System ────────────────────────────────────────────
const MapSystem = {

  load(mapId) {
    const mapDef = MAPS[mapId];
    if (!mapDef) { console.error(`Map not found: ${mapId}`); return; }

    GameState.mapId   = mapId;
    GameState.mapRows = mapDef.rows;
    GameState.mapCols = mapDef.cols;
    GameState.tileGrid = mapDef.grid.map(row => [...row]);

    GameState.enemies = mapDef.enemyData.map((e, i) => ({
      id:       `enemy_${i}`,
      key:      `${e.row},${e.col}`,
      row:      e.row,
      col:      e.col,
      type:     e.type,
      hp:       ENEMY_TYPES[e.type].hp,
      maxHp:    ENEMY_TYPES[e.type].hp,
      defeated: false,
    }));

    GameState.chests = mapDef.chestData.map((c, i) => ({
      id: `chest_${i}`, key: `${c.row},${c.col}`,
      row: c.row, col: c.col, opened: false,
    }));

    // No plates or doors
    GameState.plates = [];
    GameState.doors  = [];

    const cp = mapDef.checkpointData[0];
    GameState.checkpointRow = cp.row;
    GameState.checkpointCol = cp.col;

    this.initSnake(mapDef);
  },

  initSnake(mapDef) {
    mapDef = mapDef || MAPS[GameState.mapId];
    const { startRow, startCol } = mapDef;
    GameState.direction     = mapDef.startDir || DIR.RIGHT;
    GameState.nextDirection = null;

    GameState.snake = [
      { row: startRow, col: startCol },
      { row: startRow, col: startCol - 1 },
      { row: startRow, col: startCol - 2 },
    ];

    GameState.checkpointSnake = GameState.snake.map(s => ({ ...s }));
  },

  current() { return MAPS[GameState.mapId]; },

  isVictoryTile(row, col) {
    const m = this.current();
    return m && row === m.victoryRow && col === m.victoryCol;
  },

  getMiniBossForCurrentMap() {
    const m = this.current();
    return m ? m.miniBossType : null;
  },
};
