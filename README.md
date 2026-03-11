
# 🧟 TYPING SURVIVAL

> *The undead don't stop. Neither can your fingers.*

**Typing Survival** is a browser-based typing defense game where your keyboard is your only weapon. Waves of zombies march toward your castle wall — type the word or phrase displayed above each zombie to shoot it down before it reaches you. Survive all 30 waves to win.

No downloads. No installs. Open `index.html` and start typing.

---

## 🎮 How to Play

### The Basics

- Zombies spawn from the **right side** of the screen and march left toward your castle.
- Every zombie has a **word or phrase** floating above it.
- Type that word or phrase **exactly** and press **Enter** to fire at the zombie.
- If a zombie reaches the castle wall, you **lose health**.
- Reach 0 health and it's **Game Over**.

### Targeting

| Action | How |
|---|---|
| **Click a zombie** | Directly targets it — the phrase appears in the input bar |
| **Tab** | Auto-targets the nearest zombie (closest to your wall) |
| **Start typing** | Automatically targets the first zombie whose phrase starts with what you typed |
| **Enter** | Fires at the currently targeted zombie |

> 💡 **Tip:** On chaotic waves, click the zombie that's closest to your wall first — don't let anything slip through.

### The Input Bar

At the bottom of the screen you'll see the typing input. The current target's phrase is shown above the text box with live feedback:

- **Green characters** = correctly typed so far
- **Red characters** = wrong — clear it and retype

The phrase is also shown **directly above the zombie** at all times so you can read ahead and plan your next target.

---

## 🌊 Waves

The game has **30 waves** total. Difficulty increases with each wave:

| Waves | What to Expect |
|---|---|
| 1–4 | Gentle warmup. Basic zombies, slow spawn rate. |
| 5 | ☠️ **First Boss** |
| 6–7 | Faster spawns, speed zombies appear |
| **8+** | **It gets crazy.** Multiple zombie types, under 1 second between spawns |
| 10, 15, 20, 25, 30 | ☠️ **Boss Waves** |
| 26–29 | Relentless. Dozens of fast zombies across all lanes |
| 30 | ☠️ **Final Boss** |

Every 5 waves is a **Boss Wave**. The boss has massive health and requires many phrases typed correctly to defeat — keep going, don't stop.

---

## 🧟 Zombie Types

| Zombie | Speed | Health | Phrases | Notes |
|---|---|---|---|---|
| 🧟 **Basic** | Normal | 1 hit | Short words | Standard enemy |
| 🏃 **Speed** | Very fast | 1 hit | Short words | Closes distance quickly — prioritize! |
| 🧟‍♂️ **Brute** | Slow | 4 hits | Long sentences | Takes multiple phrases to kill |
| ☣️ **Toxic** | Medium | 2 hits | Medium phrases | Glows green |
| 👹 **Boss** | Slow | 12 hits | Long sentences | Appears every 5 waves — keep typing! |

> ⚠️ **Multi-hit zombies** (Brute, Toxic, Boss): After each successful phrase, a new phrase appears above the zombie. Keep typing until it dies.

---

## 🔥 Combo Multiplier

Kill zombies quickly and back-to-back to build your **Combo Multiplier**:

| Consecutive Kills | Multiplier |
|---|---|
| 1–2 | 1x |
| 3–5 | 2x |
| 6–9 | 3x |
| 10–14 | 4x |
| 15+ | 5x |

A higher combo means more **currency** and **score** per kill. The combo resets if you take too long between kills or type something wrong.

---

## 💰 Currency & the Shop

You earn currency for every zombie you kill. Between waves a **Shop** opens where you can spend it on upgrades:

| Item | Effect |
|---|---|
| 🩹 Med Kit | Restore 25 health |
| 🦺 Reinforced Vest | Increase max health by 20 |
| 💼 Scavenger | Earn +25% more currency per kill |
| 🔥 Hot Streak | Combo timer lasts 2 seconds longer |
| 🔫 Auto Turret | Deploys a turret that chips small damage over time (support only — you still have to type!) |
| ⚡ Spike Trap | Ground trap that damages zombies walking over it |
| ❄️ Freeze Mine | Ground trap that slows zombies to 30% speed for 3 seconds |
| 💣 Hollow Points | Each typed phrase deals +1 bonus damage |

> 💡 **Tip:** Med Kits and Reinforced Vest are good early investments. Freeze Mines become incredibly powerful in the later waves where zombie density is high.

---

## ❤️ Health

- You start with **100 HP**
- Damage per zombie that reaches the wall varies by type:
  - Speed Zombie: 8 damage
  - Basic/Toxic: 12 damage
  - Brute: 20 damage
  - Boss: 30 damage
- A red flash on screen means you just took damage
- Reach 0 HP → Game Over

---

## 🏆 Scoring

Your score is based on currency earned × 10. A higher combo multiplier at the time of a kill increases both currency and score, so chaining kills efficiently is the path to a high score.

---

## 🛠️ Customization

The game is designed to be easy to customize. Everything is in `script.js` at the top in the `CONFIG` block.

**Edit zombie phrases:**
```js
CONFIG.zombieTypes.basic.phrases = ['your', 'custom', 'words', 'here'];
```

**Adjust difficulty:**
```js
CONFIG.waves[0].count = 10;          // more zombies on wave 1
CONFIG.waves[0].spawnInterval = 2000; // 2 seconds between spawns
CONFIG.waves[0].speedMult = 1.5;      // zombies move 50% faster
```

**Add your own zombie images** (replace emoji with image path):
```js
CONFIG.zombieTypes.basic.sprite = 'images/my_zombie.png';
```

---

## 🖥️ Running the Game

1. Download and unzip the game folder
2. Open `index.html` in any modern browser
3. No server, no install, no internet required

**Compatible with:** Chrome, Firefox, Edge, Safari

---

## 📁 File Structure

```
typing-survival/
├── index.html   — Game layout and screens
├── style.css    — All visual styling
├── script.js    — All game logic + CONFIG at the top
└── README.md    — This file
```

---

*Good luck. The horde never sleeps.*
