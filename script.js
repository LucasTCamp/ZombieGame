/* ═══════════════════════════════════════════════════════════════════════════
   TYPING SURVIVAL — script.js
   ═══════════════════════════════════════════════════════════════════════════

   CUSTOMIZATION GUIDE
   ───────────────────
   All tunable data lives in the CONFIG block below.

   ► ADD A NEW ZOMBIE TYPE
     Add an entry to CONFIG.zombieTypes with:
       health, speed, worth (currency), sprite (emoji or img path),
       and phrases (array of strings)
     Then add it to wave spawn tables in CONFIG.waves.

   ► EDIT PHRASE POOLS
     Find the zombie type in CONFIG.zombieTypes and edit its `phrases` array.
     Use any strings you like — short words for fast zombies, long sentences
     for brutes, etc.

   ► ADJUST DIFFICULTY
     Tweak CONFIG.waves[] entries:
       count = how many zombies spawn,  spawnInterval = ms between spawns
       speedMult = global speed modifier for that wave
       types = weighted table e.g. [{type:'basic',weight:3},{type:'brute',weight:1}]
     Boss waves are flagged with  boss: true

   ► ADD / CHANGE BOSSES
     Edit CONFIG.bossConfig or add boss: true to a wave and
     set bossType to the key you want from CONFIG.zombieTypes.

   ► REPLACE ZOMBIE IMAGES
     Set the sprite field to an <img> path like "images/zombie_basic.png"
     The game will render an <img> tag instead of an emoji if it ends in
     a common image extension.

   ═══════════════════════════════════════════════════════════════════════════ */

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 1 — CUSTOMIZABLE CONFIGURATION              ║
   ╚══════════════════════════════════════════════════════╝ */

const CONFIG = {

  /* ── PLAYER ────────────────────────────────────────── */
  player: {
    maxHealth:    100,
    startCurrency: 0,
  },

  /* ── COMBO SYSTEM ──────────────────────────────────── */
  combo: {
    // kills needed to reach each multiplier tier
    // [0] = 1x, [1] = 2x, [2] = 3x, [3] = 4x …
    thresholds: [1, 3, 6, 10, 15],
    resetOnMiss: true,     // reset if player types wrong
    timeoutMs:   5000,     // reset if no kill within this many ms
  },

  /* ── ZOMBIE TYPES ──────────────────────────────────── */
  /*
    health:  how many hits to kill (each correct phrase = 1 hit)
    speed:   base pixels/frame (will be multiplied by wave speed)
    worth:   base currency reward (multiplied by combo)
    sprite:  emoji or image URL (e.g. "img/zombie.png")
    phrases: CUSTOMIZE THESE — your word/phrase pools
  */
  zombieTypes: {

    basic: {
      health:  1,
      speed:   0.55,
      worth:   10,
      sprite:  '🧟',
      color:   '#39ff14',
      // ► EDIT BASIC ZOMBIE PHRASES HERE ◄
      phrases: [
        'groan', 'moan', 'brain', 'bite', 'crawl', 'dead',
        'rot', 'flesh', 'horde', 'lurch', 'decay', 'risen',
        'undead', 'shamble', 'hunger', 'virus', 'infect',
        'type it', 'shoot me', 'stay back', 'help me',
        'dont stop', 'keep going', 'run away', 'quick shot',
      ],
    },

    brute: {
      health:  4,
      speed:   0.30,
      worth:   35,
      sprite:  '🧟‍♂️',
      color:   '#ff8800',
      // ► EDIT BRUTE ZOMBIE PHRASES HERE ◄
      phrases: [
        'the brute approaches with fury',
        'nothing can stop this monster',
        'your bullets only slow me down',
        'i will tear down your barricades',
        'smash through every obstacle',
        'feel the weight of the undead',
        'my hunger drives me forward',
        'you cannot outrun the horde',
        'type faster or face your doom',
        'survivors never last out here',
        'the dead outnumber the living',
        'scream all you want nobody hears',
      ],
    },

    speed: {
      health:  1,
      speed:   1.4,
      worth:   20,
      sprite:  '🏃',
      color:   '#00cfff',
      // ► EDIT SPEED ZOMBIE PHRASES HERE ◄
      phrases: [
        'fast', 'run', 'dash', 'zip', 'zoom', 'go',
        'bolt', 'rush', 'flee', 'quick', 'dart',
        'sprint', 'rapid', 'swift', 'hurry', 'skip',
      ],
    },

    toxic: {
      health:  2,
      speed:   0.45,
      worth:   25,
      sprite:  '☣️',
      color:   '#aaff00',
      // ► EDIT TOXIC ZOMBIE PHRASES HERE ◄
      phrases: [
        'toxic waste', 'poison gas', 'acid blood',
        'chemical burn', 'biohazard zone', 'green fog',
        'mutant strain', 'mutation spread', 'contaminated',
        'hazmat suit', 'spill alert', 'exposure risk',
      ],
    },

    boss: {
      health:  12,   // requires 12 correct phrases
      speed:   0.20,
      worth:   200,
      sprite:  '👹',
      color:   '#ff2222',
      isBoss:  true,
      // ► EDIT BOSS PHRASES HERE ◄
      phrases: [
        'the boss has arrived to end you',
        'your typing skills will be tested',
        'no human can survive my wrath',
        'each phrase you type only slows me',
        'i have devoured entire cities whole',
        'the apocalypse bows to my command',
        'keep typing until your fingers bleed',
        'you will join my undead legion soon',
        'the final wave is just the beginning',
        'type every word if you want to live',
        'my hunger is endless and so is my rage',
        'survivors are just food that can run',
        'every keystroke brings you closer to death',
        'the horde follows behind me like a shadow',
        'you cannot escape what i have become now',
      ],
    },

  }, // end zombieTypes

  /* ── WAVE TABLE ────────────────────────────────────── */
  /*
    count:         number of zombies this wave
    spawnInterval: ms between spawns
    speedMult:     multiplier on all zombie speeds
    types:         weighted spawn table
    boss:          true = boss wave (spawns 1 boss)
    bossType:      which zombie type to use as boss
  */
  waves: [
    // Wave 1 — gentle intro
    { count:4,  spawnInterval:3500, speedMult:0.9, types:[{type:'basic',weight:1}] },
    // Wave 2
    { count:6,  spawnInterval:3000, speedMult:1.0, types:[{type:'basic',weight:1}] },
    // Wave 3
    { count:8,  spawnInterval:2500, speedMult:1.1, types:[{type:'basic',weight:3},{type:'speed',weight:1}] },
    // Wave 4
    { count:10, spawnInterval:2000, speedMult:1.2, types:[{type:'basic',weight:2},{type:'speed',weight:2}] },
    // Wave 5 — BOSS
    { count:1,  spawnInterval:3000, speedMult:1.0, boss:true, bossType:'boss' },
    // Wave 6 — getting spicy
    { count:12, spawnInterval:1800, speedMult:1.3, types:[{type:'basic',weight:3},{type:'speed',weight:2},{type:'brute',weight:1}] },
    // Wave 7 — ramping hard
    { count:15, spawnInterval:1400, speedMult:1.4, types:[{type:'basic',weight:2},{type:'speed',weight:3},{type:'brute',weight:2}] },
    // Wave 8 — CRAZY starts here
    { count:18, spawnInterval:1000, speedMult:1.6, types:[{type:'basic',weight:1},{type:'speed',weight:4},{type:'brute',weight:2},{type:'toxic',weight:2}] },
    // Wave 9 — madness
    { count:20, spawnInterval:800,  speedMult:1.7, types:[{type:'speed',weight:4},{type:'brute',weight:3},{type:'toxic',weight:3}] },
    // Wave 10 — BOSS
    { count:1,  spawnInterval:3000, speedMult:1.0, boss:true, bossType:'boss' },
    // Wave 11
    { count:22, spawnInterval:750,  speedMult:1.8, types:[{type:'basic',weight:1},{type:'speed',weight:5},{type:'brute',weight:3},{type:'toxic',weight:3}] },
    // Wave 12
    { count:24, spawnInterval:700,  speedMult:1.85,types:[{type:'speed',weight:5},{type:'brute',weight:3},{type:'toxic',weight:4}] },
    // Wave 13
    { count:26, spawnInterval:650,  speedMult:1.9, types:[{type:'speed',weight:5},{type:'brute',weight:4},{type:'toxic',weight:4}] },
    // Wave 14
    { count:28, spawnInterval:600,  speedMult:2.0, types:[{type:'speed',weight:6},{type:'brute',weight:4},{type:'toxic',weight:4}] },
    // Wave 15 — BOSS
    { count:1,  spawnInterval:3000, speedMult:1.0, boss:true, bossType:'boss' },
    // Wave 16
    { count:30, spawnInterval:550,  speedMult:2.1, types:[{type:'speed',weight:6},{type:'brute',weight:5},{type:'toxic',weight:5}] },
    // Wave 17
    { count:32, spawnInterval:500,  speedMult:2.2, types:[{type:'speed',weight:7},{type:'brute',weight:5},{type:'toxic',weight:5}] },
    // Wave 18
    { count:34, spawnInterval:480,  speedMult:2.3, types:[{type:'speed',weight:7},{type:'brute',weight:6},{type:'toxic',weight:5}] },
    // Wave 19
    { count:36, spawnInterval:450,  speedMult:2.4, types:[{type:'speed',weight:8},{type:'brute',weight:6},{type:'toxic',weight:6}] },
    // Wave 20 — BOSS
    { count:1,  spawnInterval:3000, speedMult:1.0, boss:true, bossType:'boss' },
    // Wave 21
    { count:38, spawnInterval:420,  speedMult:2.5, types:[{type:'speed',weight:8},{type:'brute',weight:7},{type:'toxic',weight:6}] },
    // Wave 22
    { count:40, spawnInterval:400,  speedMult:2.6, types:[{type:'speed',weight:9},{type:'brute',weight:7},{type:'toxic',weight:7}] },
    // Wave 23
    { count:42, spawnInterval:380,  speedMult:2.7, types:[{type:'speed',weight:9},{type:'brute',weight:8},{type:'toxic',weight:7}] },
    // Wave 24
    { count:44, spawnInterval:360,  speedMult:2.8, types:[{type:'speed',weight:10},{type:'brute',weight:8},{type:'toxic',weight:8}] },
    // Wave 25 — BOSS
    { count:1,  spawnInterval:3000, speedMult:1.0, boss:true, bossType:'boss' },
    // Wave 26
    { count:46, spawnInterval:340,  speedMult:3.0, types:[{type:'speed',weight:10},{type:'brute',weight:9},{type:'toxic',weight:9}] },
    // Wave 27
    { count:48, spawnInterval:320,  speedMult:3.1, types:[{type:'speed',weight:11},{type:'brute',weight:9},{type:'toxic',weight:9}] },
    // Wave 28
    { count:50, spawnInterval:300,  speedMult:3.3, types:[{type:'speed',weight:11},{type:'brute',weight:10},{type:'toxic',weight:10}] },
    // Wave 29
    { count:55, spawnInterval:280,  speedMult:3.5, types:[{type:'speed',weight:12},{type:'brute',weight:10},{type:'toxic',weight:10}] },
    // Wave 30 — FINAL BOSS
    { count:1,  spawnInterval:3000, speedMult:1.0, boss:true, bossType:'boss' },
  ],

  /* ── SHOP ITEMS ────────────────────────────────────── */
  /*
    id, name, desc, icon, cost, maxLevel,
    effect: function(player, level) — applied when purchased
  */
  shopItems: [
    {
      id:'health_up', name:'Med Kit', icon:'🩹',
      desc:'Restore 25 health.', cost:50, maxLevel:99,
      effect(p) { p.health = Math.min(p.maxHealth, p.health + 25); updateHealthBar(); },
    },
    {
      id:'max_health', name:'Reinforced Vest', icon:'🦺',
      desc:'Increase max health by 20.', cost:80, maxLevel:5,
      effect(p) { p.maxHealth += 20; p.health = Math.min(p.health + 20, p.maxHealth); updateHealthBar(); },
    },
    {
      id:'currency_mult', name:'Scavenger', icon:'💼',
      desc:'Earn +25% more currency per kill.', cost:100, maxLevel:4,
      effect(p) { p.currencyMult = (p.currencyMult || 1) + 0.25; },
    },
    {
      id:'combo_extend', name:'Hot Streak', icon:'🔥',
      desc:'Combo timer lasts +2 seconds.', cost:70, maxLevel:3,
      effect(p) { p.comboTimeBonus = (p.comboTimeBonus || 0) + 2000; },
    },
    {
      id:'turret_basic', name:'Auto Turret', icon:'🔫',
      desc:'Deploys an auto-turret that chips 0.2 damage every 3s. Support only — you still need to type!', cost:150, maxLevel:3,
      effect(p) { deployTurret(); },
    },
    {
      id:'spike_trap', name:'Spike Trap', icon:'⚡',
      desc:'Places a ground trap that deals 1 damage to zombies walking over it.', cost:90, maxLevel:5,
      effect(p) { deployTrap('spike'); },
    },
    {
      id:'slow_trap', name:'Freeze Mine', icon:'❄️',
      desc:'Places a trap that slows zombies to 30% speed for 3s.', cost:110, maxLevel:5,
      effect(p) { deployTrap('slow'); },
    },
    {
      id:'damage_up', name:'Hollow Points', icon:'💣',
      desc:'Each typed phrase deals +1 bonus damage.', cost:130, maxLevel:3,
      effect(p) { p.bonusDamage = (p.bonusDamage || 0) + 1; },
    },
  ],

}; // end CONFIG

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 2 — GAME STATE                              ║
   ╚══════════════════════════════════════════════════════╝ */

const state = {
  screen: 'title',
  running: false,
  waveIndex: 0,          // 0-based index into CONFIG.waves
  zombies: [],
  traps: [],
  turrets: [],
  targetZombie: null,    // currently targeted zombie
  typedBuffer: '',       // what player has typed

  // player stats
  player: {
    health:     CONFIG.player.maxHealth,
    maxHealth:  CONFIG.player.maxHealth,
    currency:   CONFIG.player.startCurrency,
    score:      0,
    kills:      0,
    currencyMult: 1,
    bonusDamage:  0,
    comboTimeBonus: 0,
  },

  // combo
  combo: {
    count:      0,   // consecutive kills
    multiplier: 1,
    timer:      null,
  },

  // shop upgrade levels
  upgradeLevels: {},

  // timing
  spawnTimer:   null,
  spawnCount:   0,
  gameLoop:     null,
  comboTimeout: null,
};

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 3 — DOM REFS                                ║
   ╚══════════════════════════════════════════════════════╝ */

const $ = id => document.getElementById(id);

const dom = {
  // screens
  title:    $('screen-title'),
  howto:    $('screen-howto'),
  game:     $('screen-game'),
  shop:     $('screen-shop'),
  gameover: $('screen-gameover'),
  victory:  $('screen-victory'),
  // hud
  waveNum:    $('wave-num'),
  bossBanner: $('boss-banner'),
  healthBar:  $('health-bar'),
  healthText: $('health-text'),
  currency:   $('currency'),
  score:      $('score'),
  comboDisplay: $('combo-display'),
  comboVal:   $('combo-val'),
  // input
  typingInput: $('typing-input'),
  typedPrefix: $('typed-prefix'),
  remainingText: $('remaining-text'),
  hitOverlay: $('hit-overlay'),
  muzzleFlash: $('muzzle-flash'),
  // layers
  zombiesLayer:     $('zombies-layer'),
  projectilesLayer: $('projectiles-layer'),
  effectsLayer:     $('effects-layer'),
  trapsLayer:       $('traps-layer'),
  turretsLayer:     $('turrets-layer'),
  gameArea:         $('game-area'),
  // shop
  shopWaveNum:  $('shop-wave-num'),
  shopCurrency: $('shop-currency-val'),
  shopGrid:     $('shop-grid'),
};

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 4 — SCREEN MANAGEMENT                       ║
   ╚══════════════════════════════════════════════════════╝ */

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = {
    title: dom.title, howto: dom.howto, game: dom.game,
    shop: dom.shop, gameover: dom.gameover, victory: dom.victory,
  }[name];
  if (target) target.classList.add('active');
  state.screen = name;
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 5 — UTILITY                                 ║
   ╚══════════════════════════════════════════════════════╝ */

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedRandom(table) {
  const total = table.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const entry of table) {
    r -= entry.weight;
    if (r <= 0) return entry.type;
  }
  return table[0].type;
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function getGameAreaWidth()  { return dom.gameArea.clientWidth; }
function getGameAreaHeight() { return dom.gameArea.clientHeight; }

// Right edge spawn point (off-screen)
function spawnX() {
  const w = dom.gameArea.clientWidth;
  return (w > 200 ? w : window.innerWidth) + 80;
}

// Castle wall right edge — zombies die when they reach this x
function playerX() { return 90; }

// Number of lanes
const LANE_COUNT = 3;

// Returns the top% position for a given lane (0-indexed)
// Lanes sit inside the field which is vertically centered at 50% height.
// Field height is ~62% of game area. Each lane is 1/3 of field height.
function laneTopPx(laneIndex) {
  const areaH = dom.gameArea.clientHeight || window.innerHeight;
  const fieldH = areaH * 0.62;
  const fieldTop = (areaH - fieldH) / 2;
  const laneH = fieldH / LANE_COUNT;
  // Center of lane, offset so zombie sits in middle of lane
  return fieldTop + laneH * laneIndex + laneH / 2 - 30; // -30 to account for zombie element height
}

function randomLane() { return Math.floor(Math.random() * LANE_COUNT); }

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 6 — HEALTH & CURRENCY HUD                   ║
   ╚══════════════════════════════════════════════════════╝ */

function updateHealthBar() {
  const pct = clamp(state.player.health / state.player.maxHealth * 100, 0, 100);
  dom.healthBar.style.width = pct + '%';
  dom.healthText.textContent = Math.max(0, Math.round(state.player.health));
  // Color shift
  if (pct > 60) dom.healthBar.style.background = 'linear-gradient(90deg,#cc0000,#ff4444)';
  else if (pct > 30) dom.healthBar.style.background = 'linear-gradient(90deg,#cc6600,#ff9900)';
  else dom.healthBar.style.background = 'linear-gradient(90deg,#880000,#ff2222)';
}

function updateHUD() {
  dom.currency.textContent = state.player.currency;
  dom.score.textContent    = state.player.score;
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 7 — COMBO SYSTEM                            ║
   ╚══════════════════════════════════════════════════════╝ */

function incrementCombo() {
  state.combo.count++;
  const thresholds = CONFIG.combo.thresholds;
  let mult = 1;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (state.combo.count >= thresholds[i]) { mult = i + 1; break; }
  }
  state.combo.multiplier = mult;
  dom.comboVal.textContent = mult;
  if (mult > 1) {
    dom.comboDisplay.classList.remove('hidden');
  }
  // Reset timeout
  clearTimeout(state.comboTimeout);
  const timeoutMs = CONFIG.combo.timeoutMs + (state.player.comboTimeBonus || 0);
  state.comboTimeout = setTimeout(resetCombo, timeoutMs);
}

function resetCombo() {
  state.combo.count = 0;
  state.combo.multiplier = 1;
  dom.comboDisplay.classList.add('hidden');
  clearTimeout(state.comboTimeout);
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 8 — ZOMBIE FACTORY                          ║
   ╚══════════════════════════════════════════════════════╝ */

let zombieIdCounter = 0;

function createZombie(typeName, waveSpeedMult) {
  const type = CONFIG.zombieTypes[typeName];
  if (!type) { console.warn('Unknown zombie type:', typeName); return null; }

  const phrase = randomItem(type.phrases);
  const id = ++zombieIdCounter;
  const speed = type.speed * waveSpeedMult;
  const lane  = randomLane();

  // Build DOM element
  const el = document.createElement('div');
  el.className = `zombie ${typeName}`;
  el.dataset.id = id;

  // Inner wrapper (keeps phrase + sprite + hp together)
  const inner = document.createElement('div');
  inner.className = 'zombie-inner';

  // Phrase wrap
  const phraseWrap = document.createElement('div');
  phraseWrap.className = 'zombie-phrase-wrap';
  phraseWrap.innerHTML = `<span class="phrase-text">${escapeHtml(phrase)}</span>`;

  // Sprite
  const sprite = document.createElement('div');
  sprite.className = 'zombie-sprite';
  const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(type.sprite);
  if (isImage) {
    sprite.innerHTML = `<img src="${type.sprite}" alt="${typeName}" style="height:3em;vertical-align:bottom;">`;
  } else {
    sprite.textContent = type.sprite;
  }

  // HP bar
  const hpWrap = document.createElement('div');
  hpWrap.className = 'zombie-hp-wrap';
  const hpBar = document.createElement('div');
  hpBar.className = 'zombie-hp-bar';
  hpWrap.appendChild(hpBar);

  inner.appendChild(phraseWrap);
  inner.appendChild(sprite);
  inner.appendChild(hpWrap);
  el.appendChild(inner);

  // Position: spawn off-screen right, vertically in lane
  const startX = spawnX();
  el.style.left = startX + 'px';
  el.style.top  = laneTopPx(lane) + 'px';

  dom.zombiesLayer.appendChild(el);

  const zombie = {
    id, typeName, type, phrase,
    health: type.health, maxHealth: type.health,
    speed, el, hpBar, phraseWrap,
    x: startX,
    lane,
    alive: true,
    dead: false,
  };

  return zombie;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 9 — TARGETING                               ║
   ╚══════════════════════════════════════════════════════╝ */

function setTarget(zombie) {
  // Un-target old
  if (state.targetZombie && state.targetZombie.el) {
    state.targetZombie.el.classList.remove('targeted');
  }
  state.targetZombie = zombie;
  if (zombie) {
    zombie.el.classList.add('targeted');
  }
  // Update phrase display
  updatePhraseDisplay('');
  dom.typingInput.value = '';
  state.typedBuffer = '';
}

function autoTarget() {
  // Target the leftmost (closest) alive zombie
  const alive = state.zombies.filter(z => z.alive && !z.dead);
  if (!alive.length) { setTarget(null); return; }
  const closest = alive.reduce((a, b) => a.x < b.x ? a : b);
  setTarget(closest);
}

function updatePhraseDisplay(typed) {
  const target = state.targetZombie;
  if (!target || !target.alive) {
    dom.typedPrefix.textContent = '';
    dom.remainingText.textContent = '';
    return;
  }
  const phrase = target.phrase;
  const ok = phrase.startsWith(typed);
  if (ok) {
    dom.typedPrefix.textContent = typed;
    dom.remainingText.textContent = phrase.slice(typed.length);
  } else {
    dom.typedPrefix.textContent = '';
    dom.remainingText.textContent = phrase;
  }
  // Also update the zombie's phrase display
  const phraseSpan = target.phraseWrap.querySelector('.phrase-text');
  if (phraseSpan) {
    if (ok && typed.length > 0) {
      phraseSpan.innerHTML =
        `<span class="typed-ok">${escapeHtml(typed)}</span>` +
        escapeHtml(phrase.slice(typed.length));
    } else if (!ok && typed.length > 0) {
      phraseSpan.innerHTML = `<span class="typed-wrong">${escapeHtml(typed.slice(0, phrase.length))}</span>` +
        escapeHtml(phrase.slice(typed.length));
    } else {
      phraseSpan.textContent = phrase;
    }
  }
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 10 — TYPING INPUT HANDLER                   ║
   ╚══════════════════════════════════════════════════════╝ */

dom.typingInput.addEventListener('keydown', e => {
  if (state.screen !== 'game' || !state.running) return;

  // Tab = auto-target nearest
  if (e.key === 'Tab') {
    e.preventDefault();
    autoTarget();
    return;
  }

  // Enter = submit phrase
  if (e.key === 'Enter') {
    e.preventDefault();
    submitPhrase(dom.typingInput.value.trim());
    return;
  }
});

// Click a zombie to target it
dom.zombiesLayer.addEventListener('click', e => {
  if (state.screen !== 'game' || !state.running) return;
  const zombieEl = e.target.closest('.zombie');
  if (!zombieEl) return;
  const id = parseInt(zombieEl.dataset.id);
  const zombie = state.zombies.find(z => z.id === id && z.alive && !z.dead);
  if (zombie) {
    setTarget(zombie);
    dom.typingInput.focus();
  }
});

dom.typingInput.addEventListener('input', e => {
  if (state.screen !== 'game' || !state.running) return;

  const typed = dom.typingInput.value;
  state.typedBuffer = typed;

  const target = state.targetZombie;

  // If no target, try to auto-find one by prefix match
  if (!target || !target.alive) {
    const match = state.zombies.find(z =>
      z.alive && !z.dead && z.phrase.startsWith(typed)
    );
    if (match) setTarget(match);
    else { updatePhraseDisplay(typed); return; }
  }

  const phrase = state.targetZombie ? state.targetZombie.phrase : '';

  // Check if typed matches phrase completely (space-terminated single words)
  if (typed === phrase || (typed.endsWith(' ') && typed.trim() === phrase)) {
    submitPhrase(typed.trim());
    return;
  }

  // Validate prefix
  const isValid = phrase.startsWith(typed);
  dom.typingInput.classList.toggle('error', !isValid && typed.length > 0);

  if (!isValid && CONFIG.combo.resetOnMiss && typed.length > 0) {
    // Only penalise if they've typed something wrong
    // (allow them to keep trying; just visual indicator)
  }

  updatePhraseDisplay(typed);
});

function submitPhrase(typed) {
  const target = state.targetZombie;
  if (!target || !target.alive) {
    flashInputError();
    return;
  }
  if (typed === target.phrase) {
    hitZombie(target, 1 + (state.player.bonusDamage || 0));
    dom.typingInput.value = '';
    dom.typingInput.classList.remove('error');
    state.typedBuffer = '';
    // Muzzle flash
    showMuzzleFlash();
    // Re-target if still alive
    if (!target.alive || target.dead) {
      autoTarget();
    } else {
      // boss needs more phrases
      updatePhraseDisplay('');
    }
  } else {
    flashInputError();
    if (CONFIG.combo.resetOnMiss) resetCombo();
  }
}

function flashInputError() {
  dom.typingInput.classList.add('error');
  setTimeout(() => dom.typingInput.classList.remove('error'), 300);
}

function showMuzzleFlash() {
  dom.muzzleFlash.classList.remove('hidden');
  setTimeout(() => dom.muzzleFlash.classList.add('hidden'), 160);
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 11 — ZOMBIE HIT / DEATH                     ║
   ╚══════════════════════════════════════════════════════╝ */

function hitZombie(zombie, damage, fromTurret = false) {
  if (!zombie.alive || zombie.dead) return;

  if (!fromTurret) spawnProjectile(zombie);

  zombie.health -= damage;
  // Update HP bar
  const pct = Math.max(0, zombie.health / zombie.maxHealth * 100);
  zombie.hpBar.style.width = pct + '%';

  // Flash (skip subtle chip damage from turrets)
  if (!fromTurret) {
    zombie.el.classList.add('hit');
    setTimeout(() => zombie.el.classList.remove('hit'), 120);
  }

  const laneY = laneTopPx(zombie.lane);

  if (zombie.health <= 0) {
    killZombie(zombie);
  } else if (!fromTurret) {
    // Multi-hit zombie hit by player — assign new phrase
    zombie.phrase = randomItem(zombie.type.phrases);
    const phraseSpan = zombie.phraseWrap.querySelector('.phrase-text');
    if (phraseSpan) phraseSpan.textContent = zombie.phrase;
    updatePhraseDisplay('');
    floatText(zombie.x + 10, laneY - 10, `-${damage}`, 'damage');
  }
}

function killZombie(zombie) {
  zombie.alive = false;
  zombie.dead  = true;
  zombie.el.classList.add('dying');

  const laneY = laneTopPx(zombie.lane);

  // Currency & score
  const mult  = state.combo.multiplier;
  const worth = Math.round(zombie.type.worth * mult * (state.player.currencyMult || 1));
  state.player.currency += worth;
  state.player.score    += worth * 10;
  state.player.kills++;
  updateHUD();

  // Combo
  incrementCombo();

  // Float score text
  floatText(zombie.x + 10, laneY - 10, `+${worth}💰`, 'score');
  if (state.combo.multiplier > 1) {
    floatText(zombie.x + 10, laneY - 35, `${state.combo.multiplier}x COMBO!`, 'combo');
  }

  // Remove element after animation
  setTimeout(() => {
    if (zombie.el && zombie.el.parentNode) zombie.el.parentNode.removeChild(zombie.el);
  }, 480);

  // Remove from array
  const idx = state.zombies.indexOf(zombie);
  if (idx >= 0) state.zombies.splice(idx, 1);

  // Check wave complete
  checkWaveComplete();
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 12 — PROJECTILE EFFECT                      ║
   ╚══════════════════════════════════════════════════════╝ */

function spawnProjectile(targetZombie) {
  const el = document.createElement('div');
  el.className = 'projectile';
  el.textContent = '🔵';
  el.style.left = (playerX() + 50) + 'px';
  el.style.top  = (laneTopPx(targetZombie.lane) + 20) + 'px';
  dom.projectilesLayer.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 13 — FLOATING TEXT EFFECTS                  ║
   ╚══════════════════════════════════════════════════════╝ */

function floatText(x, y, text, cls) {
  const el = document.createElement('div');
  el.className = `float-text ${cls}`;
  el.textContent = text;
  el.style.left = clamp(x, 0, getGameAreaWidth() - 80) + 'px';
  el.style.top  = clamp(y, 10, getGameAreaHeight() - 20) + 'px';
  dom.effectsLayer.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 950);
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 14 — PLAYER DAMAGE                          ║
   ╚══════════════════════════════════════════════════════╝ */

function damagePlayer(amount) {
  state.player.health = Math.max(0, state.player.health - amount);
  updateHealthBar();
  resetCombo();

  // Red flash
  dom.hitOverlay.classList.remove('flash');
  void dom.hitOverlay.offsetWidth; // reflow
  dom.hitOverlay.classList.add('flash');

  floatText(playerX() + 60, laneTopPx(1), `-${amount} HP`, 'damage');

  if (state.player.health <= 0) {
    gameOver();
  }
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 15 — TRAPS & TURRETS                        ║
   ╚══════════════════════════════════════════════════════╝ */

function deployTrap(kind) {
  const lane = randomLane();
  const x = playerX() + 120 + Math.random() * (getGameAreaWidth() / 2 - 80);
  const el = document.createElement('div');
  el.className = 'trap';
  el.style.left = x + 'px';
  el.style.top  = (laneTopPx(lane) + 22) + 'px';
  el.textContent = kind === 'slow' ? '❄️' : '⚡';
  dom.trapsLayer.appendChild(el);
  state.traps.push({ kind, x, lane, el, cooldown: 0 });
}

function deployTurret() {
  const lane = randomLane();
  const existingInLane = state.turrets.filter(t => t.lane === lane).length;
  const x = playerX() + 100 + existingInLane * 80;
  const el = document.createElement('div');
  el.className = 'turret';
  el.style.left = x + 'px';
  el.style.top  = (laneTopPx(lane) + 18) + 'px';
  el.textContent = '🔫';
  dom.turretsLayer.appendChild(el);
  state.turrets.push({ x, lane, el, fireTimer: 0, fireInterval: 3000 });
}

function updateTraps(dt) {
  for (const trap of state.traps) {
    trap.cooldown = Math.max(0, trap.cooldown - dt);
    for (const z of state.zombies) {
      if (!z.alive || z.dead) continue;
      if (z.lane === trap.lane && Math.abs(z.x - trap.x) < 40 && trap.cooldown <= 0) {
        trap.el.classList.add('triggered');
        setTimeout(() => trap.el.classList.remove('triggered'), 320);
        trap.cooldown = 2000;
        if (trap.kind === 'slow') {
          z.speed *= 0.3;
          setTimeout(() => { if (z.alive) z.speed = z.type.speed * currentWaveSpeedMult(); }, 3000);
        } else {
          hitZombie(z, 1);
        }
      }
    }
  }
}

let _turretAccumulator = 0;
function updateTurrets(dt) {
  _turretAccumulator += dt;
  for (const turret of state.turrets) {
    turret.fireTimer += dt;
    if (turret.fireTimer >= turret.fireInterval) {
      turret.fireTimer = 0;
      // Find nearest zombie in same lane
      const nearest = state.zombies
        .filter(z => z.alive && !z.dead && z.lane === turret.lane && z.x > turret.x)
        .sort((a, b) => a.x - b.x)[0];
      if (nearest) {
        turret.el.classList.add('firing');
        setTimeout(() => turret.el.classList.remove('firing'), 200);
        hitZombie(nearest, 0.2, true);
      }
    }
  }
}

function currentWaveSpeedMult() {
  return CONFIG.waves[state.waveIndex]?.speedMult || 1;
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 16 — GAME LOOP                              ║
   ╚══════════════════════════════════════════════════════╝ */

let lastTimestamp = 0;
let firstFrame = true;

function gameLoop(timestamp) {
  if (!state.running) return;
  // Skip first frame to avoid a giant dt spike from layout time
  if (firstFrame) {
    firstFrame = false;
    lastTimestamp = timestamp;
    state.gameLoop = requestAnimationFrame(gameLoop);
    return;
  }
  const dt = Math.min(timestamp - lastTimestamp, 100); // cap dt at 100ms to prevent teleporting
  lastTimestamp = timestamp;

  updateZombies(dt);
  updateTraps(dt);
  updateTurrets(dt);

  state.gameLoop = requestAnimationFrame(gameLoop);
}

function updateZombies(dt) {
  const pX = playerX();
  for (let i = state.zombies.length - 1; i >= 0; i--) {
    const z = state.zombies[i];
    if (!z.alive || z.dead) continue;

    // Move left
    z.x -= z.speed * (dt / 16); // normalize to ~60fps
    z.el.style.left = z.x + 'px';

    // Reached player?
    if (z.x < pX + 30) {
      // zombie attacks player
      const dmg = z.typeName === 'brute' ? 20 : z.typeName === 'speed' ? 8 : z.typeName === 'boss' ? 30 : 12;
      damagePlayer(dmg);
      // Remove zombie
      z.alive = false;
      z.dead  = true;
      z.el.classList.add('dying');
      setTimeout(() => { if (z.el.parentNode) z.el.parentNode.removeChild(z.el); }, 450);
      state.zombies.splice(i, 1);
      // Re-target
      if (state.targetZombie === z) autoTarget();
      checkWaveComplete();
    }
  }
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 17 — WAVE SPAWNING                          ║
   ╚══════════════════════════════════════════════════════╝ */

function startWave(waveIndex) {
  state.waveIndex = waveIndex;
  const waveDef = CONFIG.waves[waveIndex];
  if (!waveDef) { triggerVictory(); return; }

  // Update HUD
  dom.waveNum.textContent = waveIndex + 1;
  dom.bossBanner.classList.toggle('hidden', !waveDef.boss);

  state.spawnCount = 0;
  state.running    = true;
  state.zombies    = [];
  dom.zombiesLayer.innerHTML = '';
  setTarget(null);

  // Focus input
  dom.typingInput.focus();

  // Start game loop
  cancelAnimationFrame(state.gameLoop);
  firstFrame = true;
  lastTimestamp = performance.now();
  state.gameLoop = requestAnimationFrame(gameLoop);

  // Small delay before first spawn so the game area has time to lay out
  // and clientWidth is correct for spawnX()
  state.spawnTimer = setTimeout(() => {
    state.spawnTimer = null;
    if (!state.running) return;
    spawnNext();
  }, 300);

  // Spawn loop
  function spawnNext() {
    if (!state.running) return;
    if (state.spawnCount >= waveDef.count) return;

    let typeName;
    if (waveDef.boss) {
      typeName = waveDef.bossType || 'boss';
    } else {
      typeName = weightedRandom(waveDef.types);
    }

    const zombie = createZombie(typeName, waveDef.speedMult || 1);
    if (zombie) {
      state.zombies.push(zombie);
      if (!state.targetZombie) autoTarget();
    }

    state.spawnCount++;
    if (state.spawnCount < waveDef.count) {
      state.spawnTimer = setTimeout(() => {
        state.spawnTimer = null;
        spawnNext();
      }, waveDef.spawnInterval);
    } else {
      state.spawnTimer = null; // all spawned
    }
  }
  // (first call is inside the delay above)
}

function checkWaveComplete() {
  const waveDef = CONFIG.waves[state.waveIndex];
  if (!waveDef) return;
  if (!state.running) return;
  const allSpawned = state.spawnCount >= waveDef.count;
  const allDead    = state.zombies.filter(z => z.alive && !z.dead).length === 0;
  // Also make sure there's no pending spawn timer still running
  if (allSpawned && allDead && !state.spawnTimer) {
    endWave();
  }
}

function endWave() {
  state.running = false;
  cancelAnimationFrame(state.gameLoop);
  clearTimeout(state.spawnTimer);
  state.spawnTimer = null;

  const nextIndex = state.waveIndex + 1;
  if (nextIndex >= CONFIG.waves.length) {
    triggerVictory();
    return;
  }

  // Open shop
  openShop(nextIndex);
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 18 — SHOP                                   ║
   ╚══════════════════════════════════════════════════════╝ */

function openShop(nextWaveIndex) {
  dom.shopWaveNum.textContent   = state.waveIndex + 1;
  dom.shopCurrency.textContent  = state.player.currency;
  renderShopItems();
  showScreen('shop');

  $('btn-next-wave').onclick = () => {
    showScreen('game');
    dom.typingInput.focus();
    startWave(nextWaveIndex);
  };
}

function renderShopItems() {
  dom.shopGrid.innerHTML = '';
  for (const item of CONFIG.shopItems) {
    const level   = state.upgradeLevels[item.id] || 0;
    const isMaxed = level >= item.maxLevel;
    const canAfford = state.player.currency >= item.cost;

    const el = document.createElement('div');
    el.className = 'shop-item' + (isMaxed ? ' maxed' : '') + (!canAfford && !isMaxed ? ' cant-afford' : '');

    el.innerHTML = `
      <div class="shop-item-level">LV ${level}/${item.maxLevel}</div>
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-desc">${item.desc}</div>
      <div class="shop-item-cost">${isMaxed ? '' : '💰 ' + item.cost}</div>
    `;

    if (!isMaxed) {
      el.addEventListener('click', () => {
        if (state.player.currency < item.cost) return;
        state.player.currency -= item.cost;
        state.upgradeLevels[item.id] = (state.upgradeLevels[item.id] || 0) + 1;
        item.effect(state.player, state.upgradeLevels[item.id]);
        updateHUD();
        dom.shopCurrency.textContent = state.player.currency;
        renderShopItems(); // refresh
      });
    }

    dom.shopGrid.appendChild(el);
  }
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 19 — GAME OVER & VICTORY                    ║
   ╚══════════════════════════════════════════════════════╝ */

function gameOver() {
  state.running = false;
  cancelAnimationFrame(state.gameLoop);
  clearTimeout(state.spawnTimer);
  state.spawnTimer = null;
  clearTimeout(state.comboTimeout);

  $('go-wave').textContent  = state.waveIndex + 1;
  $('go-score').textContent = state.player.score;
  $('go-kills').textContent = state.player.kills;
  showScreen('gameover');
}

function triggerVictory() {
  state.running = false;
  cancelAnimationFrame(state.gameLoop);
  clearTimeout(state.spawnTimer);
  clearTimeout(state.comboTimeout);

  $('vic-score').textContent = state.player.score;
  $('vic-kills').textContent = state.player.kills;
  showScreen('victory');
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 20 — GAME START                             ║
   ╚══════════════════════════════════════════════════════╝ */

function startGame() {
  // Reset state
  Object.assign(state.player, {
    health:       CONFIG.player.maxHealth,
    maxHealth:    CONFIG.player.maxHealth,
    currency:     CONFIG.player.startCurrency,
    score:        0,
    kills:        0,
    currencyMult: 1,
    bonusDamage:  0,
    comboTimeBonus: 0,
  });
  state.upgradeLevels = {};
  state.zombies = [];
  state.traps   = [];
  state.turrets = [];
  state.targetZombie = null;
  state.typedBuffer  = '';
  resetCombo();

  // Clear layers
  dom.zombiesLayer.innerHTML    = '';
  dom.trapsLayer.innerHTML      = '';
  dom.turretsLayer.innerHTML    = '';
  dom.effectsLayer.innerHTML    = '';
  dom.projectilesLayer.innerHTML= '';

  updateHealthBar();
  updateHUD();

  showScreen('game');
  dom.typingInput.value = '';
  dom.typingInput.focus();

  startWave(0);
}

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 21 — BUTTON WIRING                          ║
   ╚══════════════════════════════════════════════════════╝ */

$('btn-start').addEventListener('click', startGame);
$('btn-howto').addEventListener('click', () => showScreen('howto'));

// Keep input focused during game
document.addEventListener('click', () => {
  if (state.screen === 'game') dom.typingInput.focus();
});
document.addEventListener('keypress', () => {
  if (state.screen === 'game') dom.typingInput.focus();
});

// Global keyboard shortcut: Tab on title = start
document.addEventListener('keydown', e => {
  if (state.screen === 'title' && e.key === 'Enter') startGame();
});

/* ╔══════════════════════════════════════════════════════╗
   ║  SECTION 22 — INIT                                   ║
   ╚══════════════════════════════════════════════════════╝ */

showScreen('title');