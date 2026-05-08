# ðŸ¢ðŸ’» The Office Hackathon

> *"You're a burnt-out intern at MegaCorp Inc. The company hackathon just started. Winner leaves early Friday. Loser does everyone's code reviews â€” for a month."*

A **2D pixel RPG** built with the **Maki Framework** for **Maki Hackathon 2026**.

---

## ðŸš€ Quick Start

```bash
npm install
maki dev
```

Open **http://localhost:5173** in your browser. Press `ENTER` to begin.

---

## ðŸ•¹ï¸ How to Play â€” Step by Step (For Judges)

### Starting the Game
1. Run `npm install` then `maki dev` in the project folder
2. Open **http://localhost:5173** in your browser
3. Wait for the neon loading screen to finish (~2 seconds)
4. Press `ENTER` or click anywhere to start
5. Read through the **5 story slides** (press `ENTER` to advance each one)
6. The game begins at **Chapter 1 â€” The Office**

---

### ðŸ¢ Chapter 1 â€” The Office

**Goal:** Collect all **5 â˜• Coffee Cups**, then reach the **ðŸšª door** in the bottom-right corner.

**Step-by-step:**
1. Use **Arrow Keys** to move DEV around the office
2. Walk into a `â˜•` coffee cup to collect it â€” you need **all 5** before the door opens
3. Coffees are numbered `1`â€“`5` and spread across the full map â€” explore every corner
4. **Watch out for KAREN** â€” she chases you from the moment the level starts
   - She speeds up every time you collect a coffee
   - If she catches you: a funny HR dialogue plays and you lose **-20 Energy**
   - After catching you, she resets to a corner â€” use that window to grab more coffees
5. Floating warning text appears when Karen is close (`ðŸ“£ DEV!! JUST ONE MINUTE!!`)
6. Once all 5 coffees are collected â†’ the door flashes green and unlocks
7. Walk to the **ðŸšª door** (right side of the map) and press **`E`** to proceed to Chapter 2

**Tips for judges:**
- Stay moving â€” Karen can't corner you in open space
- Prioritise coffees furthest from Karen first
- The door panel shows your current coffee count `â˜• X/5` at all times

---

### ðŸ’» Chapter 2 â€” The Hackathon Floor

**Goal:** Survive a **3-minute timer**, avoid hazards, and press the **ðŸš€ SUBMIT button**.

**Step-by-step:**
1. Read the intro dialogue, then the **3:00 timer** starts counting down
2. Move around the floor collecting **`âš¡` Energy Drinks** to restore energy
3. **Dodge `ðŸ“‹` Code Review Piles** â€” they fall from the ceiling every few seconds
   - If you step on a landed pile: it drains your energy continuously until you move off
4. **Dodge Chad's `ðŸ’¾` projectiles** â€” Chad wanders the floor and throws code at you every 3.5 seconds
   - Projectiles travel in a straight line toward where you were standing
   - Getting hit costs **-12 Energy** and **-40 Score**
5. When you're ready, walk to the **ðŸš€ SUBMIT button** (bottom-right) and press **`E`**
6. Chapter-complete cutscene plays â†’ Chapter 3 begins

**If the timer runs out:**
- A short cutscene plays ("Chad submitted but his code doesn't compile")
- You get **60 bonus seconds** â€” use them to hit Submit

**Tips for judges:**
- Keep moving to avoid Chad's aimed shots â€” they can't home in on you
- Prioritise energy drinks when low â€” they respawn every 12 seconds
- Code piles despawn on their own in 5 seconds if you'd rather wait them out

---

### ðŸšª Chapter 3 â€” The Escape (Boss Fight)

**Goal:** Defeat the **ðŸ“… Monday Morning Standup** boss, then walk through the exit door.

**Step-by-step:**
1. Read the intro dialogue â€” boss fight begins immediately after
2. **Collect `â˜•` Coffee Grenades** that fall from the ceiling (appear every 3.5s)
   - Walk into one to pick it up (a â˜• icon follows above DEV)
3. Press **`SPACE`** to throw the grenade at the boss â€” it flies to the boss position
4. **5 hits** defeat the boss â€” each hit triggers a shake animation and screen flash
5. **Dodge `ðŸ“Œ` Action Item projectiles** that fall from the boss toward the floor
6. **Avoid `ðŸš«` Blocker Zones** â€” red squares that appear on the floor (despawn in 4s)
7. At **2 HP remaining**, the boss enters Phase 2 â€” projectile count doubles
8. Once the boss is defeated â†’ the **ðŸšª Exit Door** lights up on the right wall
9. Walk to the door and press **`E`** â†’ Win screen with score + credits

**Tips for judges:**
- Keep one grenade in hand at all times â€” pick up the next one the moment you throw
- Stay in the lower-centre of the arena to have room to dodge left/right
- Blocker zones are temporary â€” if you're cornered, wait 4 seconds

---

### ðŸ† Win Screen
- Your **Final Score** counts up with a jingle
- A **Rank** is assigned: S (1500+) Â· A (1000+) Â· B (600+) Â· C (below 600)
- Credits roll with all characters and a narrative ending
- Press **`R`** to play again from the beginning

---

## ðŸŽ® Controls

| Key | Action |
|-----|--------|
| `â†‘ â†“ â† â†’` Arrow Keys | Move DEV around |
| `E` | Interact with objects / doors / dismiss dialogue |
| `SPACE` | Squash bugs (Ch.2) / Throw coffee grenades at boss (Ch.3) |
| `ENTER` | Advance story slides / Confirm |
| `R` *(Win Screen)* | Play again from the start |

---

## ðŸ“– Story â€” 3 Chapters

| # | Scene | One-line Goal |
|---|-------|---------------|
| ðŸ¢ **Chapter 1** | The Office | Collect 5 coffees while dodging Karen, then escape through the locked door |
| ðŸ’» **Chapter 2** | The Hackathon Floor | Dodge falling code reviews + Chad's projectiles, grab energy drinks, hit Submit |
| ðŸšª **Chapter 3** | The Escape | Boss fight â€” defeat the Monday Morning Standup calendar to reach the exit |

---

## ðŸ¢ Chapter 1 â€” The Office

### ðŸŽ¯ Objective
Collect **5 â˜• Coffee Cups** scattered across the office floor, then reach the **ðŸšª Meeting Room Door** to proceed to the hackathon.

### âš ï¸ The Threat â€” KAREN (HR)
- Karen **actively chases you** across the entire map
- She starts slow but **speeds up by +16px/s for every coffee you collect**
  - Cup 1 â†’ 76px/s Â· Cup 3 â†’ 108px/s Â· Cup 5 â†’ 140px/s (nearly as fast as you!)
- When Karen **catches you** (gets within 34px):
  - A funny mandatory HR dialogue fires (4 unique scenes â€” TPS reports, desk plants, ergonomics, potluck plates)
  - You lose **-20 Energy**
  - Karen teleports to a far corner to reset the chase
- When Karen is **close but hasn't caught you yet**, floating quip text appears:
  - *"ðŸ“£ DEV!! JUST ONE MINUTE!!"* / *"ðŸ“£ I PRINTED THE FORM IN COLOR!!"* etc.

### â˜• Coffee Mechanic
| Coffee # | Message | Karen Speed After |
|----------|----------|-------------------|
| 1st | "Brain.exe initialising..." | 76 px/s |
| 2nd | "Warning: Karen has noticed." | 92 px/s |
| 3rd | "Karen is picking up speed..." | 108 px/s |
| 4th | "KAREN IS SPRINTING. RUN." | 124 px/s |
| 5th | "DOOR UNLOCKED â€” GO GO GO!!" | 140 px/s |

- Each coffee restores **+18 Energy** and adds **+100 Score**
- Coffees are numbered (1â€“5) and spread across the full map

### ðŸšª The Door
- Door is **ðŸ”’ LOCKED** until all 5 coffees are collected
- Trying to enter early shows a funny locked-door dialogue (Karen controls the HR policy)
- Once unlocked: door glows green, press `E` near it to proceed
- **+300 Score** for reaching the door

### âš¡ Energy
- Passive drain: **-4 Energy every 5 seconds** (the office saps your soul)
- Catch by Karen: **-20 Energy**
- Coffee pickup: **+18 Energy**
- Reaching 0 energy keeps you alive but you get slower â€” drink coffee!

---

## ðŸ’» Chapter 2 â€” The Hackathon Floor

### ðŸŽ¯ Objective
Survive a **3-minute countdown** â€” collect **âš¡ Energy Drinks**, dodge hazards, and press the **ðŸš€ SUBMIT button** before time runs out.

### ðŸ“‹ Hazard 1 â€” Code Review Piles (Ceiling Mechanic)
- Every **3.5 seconds**, a `ðŸ“‹` Code Review Pile falls from the ceiling to a random position
- It bounce-lands and creates a **70px slow zone** on the floor
- **Standing inside the zone:**
  - Drains **-3 Energy every 0.8 seconds**
  - Floating warning text appears: *"ðŸ“‹ CODE REVIEW! -3"*
- Piles **despawn after 5 seconds** â€” dodge or wait them out
- More piles accumulate as time goes on â€” the floor gets crowded fast

### ðŸ˜Ž Hazard 2 â€” Chad's Code Projectiles
- Chad **wanders the floor**, moving to random positions every 3 seconds
- Every **3.5 seconds**, Chad aims and fires a `ðŸ’¾` code projectile at your **current position**
- Projectile speed: **220 px/s** â€” straight line, no homing
- **Getting hit by a projectile:**
  - **-12 Energy**, **-40 Score**
  - Screen flash + hit sound
  - Chad throws a smug one-liner (*"git push --force. Your branch is gone."* etc.)
- Projectiles despawn after 3 seconds if they miss

### âš¡ Energy Drink Pickups
| Stat | Value |
|------|-------|
| Count | 5 spread across the map |
| Energy restored | +22 per can |
| Score bonus | +60 per can |
| Respawn | Every 12 seconds after pickup |

### â±ï¸ Timer
- Starts at **3:00 (180 seconds)**
- Flashes red in the last 30 seconds
- Critical triple-beep in the last 10 seconds
- **Timer expires:** Chad "submits" first â€” but his code doesn't compile. You get **60 bonus seconds**. Use them.

### ðŸš€ Submit Button
- Located at the bottom-right of the floor
- Press `E` when within range to submit your project
- Triggers the chapter-complete cutscene (featuring Karen trapping Chad)
- **+300 Score** for submitting

---

## ðŸšª Chapter 3 â€” The Escape (Boss Fight)

### ðŸŽ¯ Objective
Defeat the **MONDAY MORNING STANDUP** â€” a giant sentient calendar that stands between you and the exit door.

### ðŸ“… Boss â€” Monday Morning Standup
| Stat | Value |
|------|-------|
| HP | 5 hits |
| Phase 1 | 2 projectiles per wave, every 2.5s |
| Phase 2 (â‰¤2 HP) | 4 projectiles per wave, every 2.5s |
| Blocking Zones | Spawns ðŸš« slow zones every 5s |

### âš”ï¸ How to Damage the Boss
1. Wait for `â˜•` **Coffee Grenades** to fall from the ceiling (every 3.5s)
2. Walk into a grenade to **pick it up** (shows carry indicator above DEV)
3. Press `SPACE` to **throw it at the boss** â€” straight-line tween to boss position
4. Each hit: **-1 Boss HP** Â· **+100 Score** Â· Screen flash Â· Boss shakes

### ðŸ›¡ï¸ Boss Attack Patterns
| Attack | Description | How to Avoid |
|--------|-------------|--------------|
| `ðŸ“Œ` Action Items | Projectiles fall from boss toward the floor | Move left/right â€” they fall in a spread |
| `ðŸš«` Blocking Zones | Red slow squares spawn randomly | Walk around them â€” they despawn in 4s |
| **Phase 2 Rage** | Double the projectiles at 2 HP | Keep moving â€” stay in open space |

### â¤ï¸ Player HP
- You have **5 HP** in this chapter (separate from Energy)
- Getting hit by `ðŸ“Œ` Action Items: **-1 HP**
- Reaching 0 HP: **-100 Score**, restored to 3 HP (*"You always get back up"*)
- No true game over â€” you can always finish the fight

### ðŸšª The Exit
- After boss is defeated: exit door **glows green**
- Walk to the door and press `E` â€” roll credits and win

---

## ðŸ‘¾ Characters

| Character | Role | Threat |
|-----------|------|--------|
| **Dev** | You. The intern. The underdog hero. | â€” |
| **Karen (HR)** | Chases you across the office. Gets faster every coffee. | ðŸ˜° Accelerating |
| **Chad** | Wanders Ch.2, throws code projectiles at you. | ðŸ˜¡ Annoying |
| **Bob the Manager** | Appears in intro/cutscenes. "Circle back on that." | ðŸ˜© Narrative |
| **Monday Standup** | ðŸ“… FINAL BOSS. Fires action items. Spawns blockers. | ðŸ’€ LETHAL |

---

## ðŸ† Scoring

| Action | Points |
|--------|--------|
| â˜• Collect coffee (Ch.1) | +100 |
| ðŸšª Escape through door (Ch.1) | +300 |
| âš¡ Grab energy drink (Ch.2) | +60 |
| ðŸš€ Submit project (Ch.2) | +300 |
| ðŸ’¥ Hit the boss (Ch.3) | +100 per hit |
| ðŸ“… Boss defeated (Ch.3) | +500 |
| â±ï¸ Time bonus | +2 Ã— seconds remaining |
| ðŸ˜¡ Chad projectile hits you | âˆ’40 |
| ðŸ“Œ Action item hits you | âˆ’100 |

### Ranks

| Rank | Score | Title |
|------|-------|-------|
| S | 1500+ | **LEGEND â­â­â­** |
| A | 1000+ | **SHIPPED IT â­â­** |
| B | 600+ | **SURVIVED â­** |
| C | < 600 | *At least you didn't do the code reviews* |

---

## ðŸ› ï¸ Tech Stack

| Layer | Technology |
|-------|------------|
| Game Engine | Phaser 3 (`^3.60.0`) |
| RPG Framework | `@tialops/maki` (`^1.1.0`) |
| Dev Server | Vite 5 |
| Sound | Web Audio API (procedural chiptune â€” no audio files) |
| Language | Vanilla JS (ES Modules) |
| Font | Press Start 2P â€” Google Fonts |

---

## ðŸ“ Project Structure

```
office-hackathon/
â”œâ”€â”€ game.js                     # Phaser config + scene registration
â”œâ”€â”€ index.html                  # Pixel-art loading screen
â”œâ”€â”€ maki.config.js              # Maki framework config
â”œâ”€â”€ vite.config.js              # Dev server (port 3000)
â”œâ”€â”€ assets/                     # Tilemaps, sprites, tilesets
â””â”€â”€ scenes/
    â”œâ”€â”€ SoundManager.js         # Procedural GBA-style chiptune engine
    â”œâ”€â”€ DialogueSystem.js       # Typewriter dialogue + HUD + effects
    â”œâ”€â”€ IntroScene.js           # Title screen + 5-slide story intro
    â”œâ”€â”€ OfficeScene.js          # Chapter 1 â€” Karen chase + coffee mechanic
    â”œâ”€â”€ HackathonFloorScene.js  # Chapter 2 â€” Code piles + Chad projectiles
    â”œâ”€â”€ EscapeScene.js          # Chapter 3 â€” Boss fight
    â””â”€â”€ WinScene.js             # Score screen + credits + confetti
```

---

## ðŸ› Troubleshooting

**Map doesn't load?**
```js
// Scene preload â€” map name must match export exactly:
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
