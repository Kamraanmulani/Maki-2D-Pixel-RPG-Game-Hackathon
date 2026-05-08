# The Office Hackathon

> *"You're a burnt-out intern at MegaCorp Inc. The company hackathon just started. Winner leaves early Friday. Loser does everyone's code reviews — for a month."*

A **2D pixel RPG** built with the **Maki Framework** for **Maki Hackathon 2026**.

---

## Quick Start

```bash
npm install
maki dev
```

Open **http://localhost:5173** in your browser. Press `ENTER` to begin.

---

## How to Play Step by Step

### Starting the Game
1. Run `npm install` then `maki dev` in the project folder
2. Open **http://localhost:5173** in your browser
3. Wait for the neon loading screen to finish (~2 seconds)
4. Press `ENTER` or click anywhere to start
5. Read through the **5 story slides** (press `ENTER` to advance each one)
6. The game begins at **Chapter 1: The Office**

---

### 🏢 Chapter 1 — The Office

**Goal:** Collect all **5 ☕ Coffee Cups**, then reach the **🚪 door** in the bottom-right corner.

**Step-by-step:**
1. Use **Arrow Keys** to move DEV around the office
2. Walk into a `☕` coffee cup to collect it — you need **all 5** before the door opens
3. Coffees are numbered `1`–`5` and spread across the full map — explore every corner
4. **Watch out for KAREN** — she chases you from the moment the level starts
   - She speeds up every time you collect a coffee
   - If she catches you: a funny HR dialogue plays and you lose **-20 Energy**
   - After catching you, she resets to a corner — use that window to grab more coffees
5. Floating warning text appears when Karen is close (`📣 DEV!! JUST ONE MINUTE!!`)
6. Once all 5 coffees are collected → the door flashes green and unlocks
7. Walk to the **🚪 door** (right side of the map) and press **`E`** to proceed to Chapter 2

**Tips for judges:**
- Stay moving — Karen can't corner you in open space
- Prioritise coffees furthest from Karen first
- The door panel shows your current coffee count `☕ X/5` at all times

---

### 💻 Chapter 2 — The Hackathon Floor

**Goal:** Survive a **3-minute timer**, avoid hazards, and press the **🚀 SUBMIT button**.

**Step-by-step:**
1. Read the intro dialogue, then the **3:00 timer** starts counting down
2. Move around the floor collecting **`⚡` Energy Drinks** to restore energy
3. **Dodge `🔋` Code Review Piles** — they fall from the ceiling every few seconds
   - If you step on a landed pile: it drains your energy continuously until you move off
4. **Dodge Chad's `👾` projectiles** — Chad wanders the floor and throws code at you every 3.5 seconds
   - Projectiles travel in a straight line toward where you were standing
   - Getting hit costs **-12 Energy** and **-40 Score**
5. When you're ready, walk to the **🚀 SUBMIT button** (bottom-right) and press **`E`**
6. Chapter-complete cutscene plays → Chapter 3 begins

**If the timer runs out:**
- A short cutscene plays ("Chad submitted but his code doesn't compile")
- You get **60 bonus seconds** — use them to hit Submit

**Tips for judges:**
- Keep moving to avoid Chad's aimed shots — they can't home in on you
- Prioritise energy drinks when low — they respawn every 12 seconds
- Code piles despawn on their own in 5 seconds if you'd rather wait them out

---

### 🚪 Chapter 3 — The Escape (Boss Fight)

**Goal:** Defeat the **📅 Monday Morning Standup** boss, then walk through the exit door.

**Step-by-step:**
1. Read the intro dialogue — boss fight begins immediately after
2. **Collect `☕` Coffee Grenades** that fall from the ceiling (appear every 3.5s)
   - Walk into one to pick it up (a ☕ icon follows above DEV)
3. Press **`SPACE`** to throw the grenade at the boss — it flies to the boss position
4. **5 hits** defeat the boss — each hit triggers a shake animation and screen flash
5. **Dodge `📌` Action Item projectiles** that fall from the boss toward the floor
6. **Avoid `🚫` Blocker Zones** — red squares that appear on the floor (despawn in 4s)
7. At **2 HP remaining**, the boss enters Phase 2 — projectile count doubles
8. Once the boss is defeated → the **🚪 Exit Door** lights up on the right wall
9. Walk to the door and press **`E`** → Win screen with score + credits

**Tips for judges:**
- Keep one grenade in hand at all times — pick up the next one the moment you throw
- Stay in the lower-centre of the arena to have room to dodge left/right
- Blocker zones are temporary — if you're cornered, wait 4 seconds

---

### 🏆 Win Screen
- Your **Final Score** counts up with a jingle
- A **Rank** is assigned: S (1500+) · A (1000+) · B (600+) · C (below 600)
- Credits roll with all characters and a narrative ending
- Press **`R`** to play again from the beginning

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| `↑ ↓ ← →` Arrow Keys | Move DEV around |
| `E` | Interact with objects / doors / dismiss dialogue |
| `SPACE` | Squash bugs (Ch.2) / Throw coffee grenades at boss (Ch.3) |
| `ENTER` | Advance story slides / Confirm |
| `R` *(Win Screen)* | Play again from the start |

---

## 📖 Story — 3 Chapters

| # | Scene | One-line Goal |
|---|-------|---------------|
| 🏢 **Chapter 1** | The Office | Collect 5 coffees while dodging Karen, then escape through the locked door |
| 💻 **Chapter 2** | The Hackathon Floor | Dodge falling code reviews + Chad's projectiles, grab energy drinks, hit Submit |
| 🚪 **Chapter 3** | The Escape | Boss fight — defeat the Monday Morning Standup calendar to reach the exit |

---

## 🏢 Chapter 1 — The Office

### 🎯 Objective
Collect **5 ☕ Coffee Cups** scattered across the office floor, then reach the **🚪 Meeting Room Door** to proceed to the hackathon.

### ⚠️ The Threat — KAREN (HR)
- Karen **actively chases you** across the entire map
- She starts slow but **speeds up by +16px/s for every coffee you collect**
  - Cup 1 → 76px/s · Cup 3 → 108px/s · Cup 5 → 140px/s (nearly as fast as you!)
- When Karen **catches you** (gets within 34px):
  - A funny mandatory HR dialogue fires (4 unique scenes — TPS reports, desk plants, ergonomics, potluck plates)
  - You lose **-20 Energy**
  - Karen teleports to a far corner to reset the chase
- When Karen is **close but hasn't caught you yet**, floating quip text appears:
  - *"📣 DEV!! JUST ONE MINUTE!!"* / *"📣 I PRINTED THE FORM IN COLOR!!"* etc.

### ☕ Coffee Mechanic

| Coffee # | Message | Karen Speed After |
|----------|----------|-------------------|
| 1st | "Brain.exe initialising..." | 76 px/s |
| 2nd | "Warning: Karen has noticed." | 92 px/s |
| 3rd | "Karen is picking up speed..." | 108 px/s |
| 4th | "KAREN IS SPRINTING. RUN." | 124 px/s |
| 5th | "DOOR UNLOCKED — GO GO GO!!" | 140 px/s |

- Each coffee restores **+18 Energy** and adds **+100 Score**
- Coffees are numbered (1–5) and spread across the full map

### 🚪 The Door
- Door is **🔒 LOCKED** until all 5 coffees are collected
- Trying to enter early shows a funny locked-door dialogue (Karen controls the HR policy)
- Once unlocked: door glows green, press `E` near it to proceed
- **+300 Score** for reaching the door

### ⚡ Energy
- Passive drain: **-4 Energy every 5 seconds** (the office saps your soul)
- Catch by Karen: **-20 Energy**
- Coffee pickup: **+18 Energy**
- Reaching 0 energy keeps you alive but you get slower — drink coffee!

---

## 💻 Chapter 2 — The Hackathon Floor

### 🎯 Objective
Survive a **3-minute countdown** — collect **⚡ Energy Drinks**, dodge hazards, and press the **🚀 SUBMIT button** before time runs out.

### 🔋 Hazard 1 — Code Review Piles (Ceiling Mechanic)
- Every **3.5 seconds**, a `🔋` Code Review Pile falls from the ceiling to a random position
- It bounce-lands and creates a **70px slow zone** on the floor
- **Standing inside the zone:**
  - Drains **-3 Energy every 0.8 seconds**
  - Floating warning text appears: *"🔋 CODE REVIEW! -3"*
- Piles **despawn after 5 seconds** — dodge or wait them out
- More piles accumulate as time goes on — the floor gets crowded fast

### 😎 Hazard 2 — Chad's Code Projectiles
- Chad **wanders the floor**, moving to random positions every 3 seconds
- Every **3.5 seconds**, Chad aims and fires a `👾` code projectile at your **current position**
- Projectile speed: **220 px/s** — straight line, no homing
- **Getting hit by a projectile:**
  - **-12 Energy**, **-40 Score**
  - Screen flash + hit sound
  - Chad throws a smug one-liner (*"git push --force. Your branch is gone."* etc.)
- Projectiles despawn after 3 seconds if they miss

### ⚡ Energy Drink Pickups

| Stat | Value |
|------|-------|
| Count | 5 spread across the map |
| Energy restored | +22 per can |
| Score bonus | +60 per can |
| Respawn | Every 12 seconds after pickup |

### ⏱️ Timer
- Starts at **3:00 (180 seconds)**
- Flashes red in the last 30 seconds
- Critical triple-beep in the last 10 seconds
- **Timer expires:** Chad "submits" first — but his code doesn't compile. You get **60 bonus seconds**. Use them.

### 🚀 Submit Button
- Located at the bottom-right of the floor
- Press `E` when within range to submit your project
- Triggers the chapter-complete cutscene (featuring Karen trapping Chad)
- **+300 Score** for submitting

---

## 🚪 Chapter 3 — The Escape (Boss Fight)

### 🎯 Objective
Defeat the **MONDAY MORNING STANDUP** — a giant sentient calendar that stands between you and the exit door.

### 📅 Boss — Monday Morning Standup

| Stat | Value |
|------|-------|
| HP | 5 hits |
| Phase 1 | 2 projectiles per wave, every 2.5s |
| Phase 2 (≤2 HP) | 4 projectiles per wave, every 2.5s |
| Blocking Zones | Spawns 🚫 slow zones every 5s |

### ⚔️ How to Damage the Boss
1. Wait for `☕` **Coffee Grenades** to fall from the ceiling (every 3.5s)
2. Walk into a grenade to **pick it up** (shows carry indicator above DEV)
3. Press `SPACE` to **throw it at the boss** — straight-line tween to boss position
4. Each hit: **-1 Boss HP** · **+100 Score** · Screen flash · Boss shakes

### 🛡️ Boss Attack Patterns

| Attack | Description | How to Avoid |
|--------|-------------|--------------|
| `📌` Action Items | Projectiles fall from boss toward the floor | Move left/right — they fall in a spread |
| `🚫` Blocking Zones | Red slow squares spawn randomly | Walk around them — they despawn in 4s |
| **Phase 2 Rage** | Double the projectiles at 2 HP | Keep moving — stay in open space |

### ❤️ Player HP
- You have **5 HP** in this chapter (separate from Energy)
- Getting hit by `📌` Action Items: **-1 HP**
- Reaching 0 HP: **-100 Score**, restored to 3 HP (*"You always get back up"*)
- No true game over — you can always finish the fight

### 🚪 The Exit
- After boss is defeated: exit door **glows green**
- Walk to the door and press `E` — roll credits and win

---

## 👾 Characters

| Character | Role | Threat |
|-----------|------|--------|
| **Dev** | You. The intern. The underdog hero. | — |
| **Karen (HR)** | Chases you across the office. Gets faster every coffee. | 😰 Accelerating |
| **Chad** | Wanders Ch.2, throws code projectiles at you. | 😡 Annoying |
| **Bob the Manager** | Appears in intro/cutscenes. "Circle back on that." | 😩 Narrative |
| **Monday Standup** | 📅 FINAL BOSS. Fires action items. Spawns blockers. | 💀 LETHAL |

---

## 🏆 Scoring

| Action | Points |
|--------|--------|
| ☕ Collect coffee (Ch.1) | +100 |
| 🚪 Escape through door (Ch.1) | +300 |
| ⚡ Grab energy drink (Ch.2) | +60 |
| 🚀 Submit project (Ch.2) | +300 |
| 💥 Hit the boss (Ch.3) | +100 per hit |
| 📅 Boss defeated (Ch.3) | +500 |
| ⏱️ Time bonus | +2 × seconds remaining |
| 😡 Chad projectile hits you | −40 |
| 📌 Action item hits you | −100 |

### Ranks

| Rank | Score | Title |
|------|-------|-------|
| S | 1500+ | **LEGEND ⭐⭐⭐** |
| A | 1000+ | **SHIPPED IT ⭐⭐** |
| B | 600+ | **SURVIVED ⭐** |
| C | < 600 | *At least you didn't do the code reviews* |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Game Engine | Phaser 3 (`^3.60.0`) |
| RPG Framework | `@tialops/maki` (`^1.1.0`) |
| Dev Server | Vite 5 |
| Sound | Web Audio API (procedural chiptune — no audio files) |
| Language | Vanilla JS (ES Modules) |
| Font | Press Start 2P — Google Fonts |

---

## 📁 Project Structure

```
office-hackathon/
├── game.js                     # Phaser config + scene registration
├── index.html                  # Pixel-art loading screen
├── maki.config.js              # Maki framework config
├── vite.config.js              # Dev server (port 3000)
├── assets/                     # Tilemaps, sprites, tilesets
└── scenes/
    ├── SoundManager.js         # Procedural GBA-style chiptune engine
    ├── DialogueSystem.js       # Typewriter dialogue + HUD + effects
    ├── IntroScene.js           # Title screen + 5-slide story intro
    ├── OfficeScene.js          # Chapter 1 — Karen chase + coffee mechanic
    ├── HackathonFloorScene.js  # Chapter 2 — Code piles + Chad projectiles
    ├── EscapeScene.js          # Chapter 3 — Boss fight
    └── WinScene.js             # Score screen + credits + confetti
```

---

## 🐛 Troubleshooting

**Map doesn't load?**
```js
// Scene preload — map name must match export exactly:
manager.map(this, 'office_map')
```

**No sound?**
> Sound initialises on first user interaction (browser autoplay policy). Click or press any key to enable audio.

**Scene not switching?**
> All scenes must be registered in `game.js` and the `scene.get()` guard must match the scene key string exactly.

---

*Made with ☕, sleep deprivation, and genuine hatred of recurring calendar invites.*

**Built for Maki Hackathon 2026.**

*"Ship it. Or sit through another standup."*
