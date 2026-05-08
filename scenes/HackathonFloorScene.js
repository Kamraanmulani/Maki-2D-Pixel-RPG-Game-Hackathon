/**
 * HackathonFloorScene.js — Chapter 2: The Hackathon Floor 💻 (Revamped)
 *
 * Mechanics:
 *   - Code Review PILES fall from the ceiling — land and create slow zones
 *   - Chad actively moves and THROWS 💾 code projectiles at the player
 *   - Collect ⚡ Energy Drinks (5 spread around) to stay powered
 *   - 3-minute timer — hit SUBMIT before time runs out
 *   - Dodge everything and ship the damn project
 *
 * Controls: Arrow keys to move, E to interact with Submit button
 */

import { Scene, manager } from '@tialops/maki'
import { DialogueSystem, HUD, floatText, screenFlash } from './DialogueSystem.js'
import EscapeScene from './EscapeScene.js'
import { sound } from './SoundManager.js'

// ── Dialogue ──────────────────────────────────────────────────────────────────

const INTRO_DIALOGUE = [
  { speaker: 'DEV (YOU)', emoji: '😤', color: '#00f5ff', text: 'The hackathon floor. Fluorescent lights. The smell of energy drinks and broken dreams.' },
  { speaker: 'DEV (YOU)', emoji: '😤', color: '#00f5ff', text: 'Chad is already here. Of course. His laptop has 14 stickers. Three of them are Neovim logos.' },
  { speaker: 'CHAD', emoji: '😎', color: '#ff006e', text: '"Oh hey DEV. I\'m building a full-stack AI blockchain microservice in Rust. Also I\'ve assigned you 47 code reviews."' },
  { speaker: 'DEV (YOU)', emoji: '😡', color: '#00f5ff', text: 'Dodge the 📋 code review PILES from the ceiling. Grab ⚡ energy drinks. Submit before the timer hits 0!' }
]

const CHAD_THROW_LINES = [
  '"Take this! I refactored your code. In Kotlin. While you were breathing."',
  '"git push --force. Your branch is gone. I call that 10x engineering."',
  '"I\'ve turned your app into a microservice. It now has 200 dependencies."',
  '"Code review assigned! Due: yesterday. Priority: CRITICAL. Enjoy!"',
  '"I added TypeScript to your project. All 800 errors are yours to fix."'
]

const SUBMIT_DIALOGUE = [
  { speaker: 'DEV (YOU)', emoji: '💻', color: '#39ff14', text: 'THE SUBMIT BUTTON. Big. Green. Beautiful. Like the end of a sprint that never should have been a sprint.' },
  { speaker: 'DEV (YOU)', emoji: '💻', color: '#39ff14', text: 'My project: rough around the edges, held together with duct tape and caffeine. But it WORKS. Chad\'s doesn\'t.' },
  { speaker: 'CHAD', emoji: '😱', color: '#ff006e', text: '"WAIT! I wasn\'t done! My 48th microservice isn\'t deployed! This is UNETHICAL! I\'m calling Karen!"' },
  { speaker: 'KAREN (HR)', emoji: '😊', color: '#ff006e', text: '"Oh Chad, do you have a minute? I need to discuss your desk plant. And trust falls. And 47 code review forms."' },
  { speaker: 'DEV (YOU)', emoji: '😂', color: '#39ff14', text: 'POETIC JUSTICE. Now — one last thing stands between me and freedom. The Monday Morning Standup boss...' },
  { speaker: 'DEV (YOU)', emoji: '😂', color: '#39ff14', text: '[ CHAPTER 2 COMPLETE ] → The final boss awaits. Press ENTER to continue...' }
]

const ENERGY_DRINK_TEXTS = [
  '⚡ ENERGY DRINK! Tastes like battery acid. Perfect.',
  '⚡ REDBULL! Wings sold separately.',
  '⚡ MONSTER! Your hands are shaking. You\'re FINE.',
  '⚡ KICKSTART! This can\'s older than the project.',
  '⚡ GENERIC BRAND! Ingredients: mystery. Effect: yes.'
]

const ENERGY_DRINK_POSITIONS = [
  { x: 180, y: 180 },
  { x: 420, y: 140 },
  { x: 640, y: 220 },
  { x: 250, y: 440 },
  { x: 600, y: 460 }
]

// ── Scene ─────────────────────────────────────────────────────────────────────

export default class HackathonFloorScene extends Scene {
  constructor () {
    super('HackathonFloorScene')
    this.submitted = false
    this.playerFrozen = false
    this.playerSlowed = false
    this.timeLeft = 180
    this.energyDrinks = []
    this.slowZones = []
    this.chadProjectiles = []
    this.chadThrowCooldown = 0
    this.chadMoveTimer = 0
    this.submitInteractCooldown = false
  }

  init (data) {
    this.inheritedScore = data?.score || 0
  }

  preload () {
    this._makiPlayers = []
    super.preload()
    this.lia = this.maki.player('lia')
    manager.map(this, 'hackathon_map')
    manager.preload(this)
  }

  create () {
    super.create()
    manager.create(this)

    const { width, height } = this.scale

    if (!this.scene.get('EscapeScene')) {
      this.scene.add('EscapeScene', EscapeScene, false)
    }

    this.lia.sprite.setPosition(120, 300)
    this.lia.sprite.setDepth(10)
    this.physics.add.collider(this.lia.sprite, manager.getWallGroup(this, 'hackathon_map'))

    this.hud = new HUD(this, { maxEnergy: 100, objective: '⚡ GRAB DRINKS • DODGE REVIEWS • HIT SUBMIT!' })
    this.hud.score = this.inheritedScore
    this.hud.scoreText.setText(`SCORE: ${this.hud.score}`)

    this.dialogue = new DialogueSystem(this)

    // Cache E key
    this.eKey = this.input.keyboard.addKey('E')

    this.buildTimer(width)
    this.buildHackathonDecor(width, height)
    this.spawnEnergyDrinks()
    this.spawnChad(width, height)
    this.buildSubmitButton(width, height)

    // Code review piles fall every 3.5s
    this.codeReviewTimer = this.time.addEvent({
      delay: 3500, loop: true,
      callback: () => { if (!this.playerFrozen && !this.submitted) this.spawnCodeReviewPile(width, height) }
    })

    // Intro dialogue, then start timer
    this.playerFrozen = true
    this.time.delayedCall(300, () => {
      this.dialogue.show(INTRO_DIALOGUE, () => {
        this.playerFrozen = false
        this.startTimer()
      })
    })

    this.showChapterBanner('CHAPTER 2', 'THE HACKATHON FLOOR 💻')
    sound.chapterBanner()
    this.cameras.main.fadeIn(500)
  }

  // ── Timer ─────────────────────────────────────────────────────────────────

  buildTimer (width) {
    this.timerBg = this.add.rectangle(width / 2, 22, 140, 22, 0x1a0000)
      .setStrokeStyle(1, 0xff006e).setDepth(92)
    this.timerText = this.add.text(width / 2, 22, '⏱ 3:00', {
      fontSize: '9px', fontFamily: '"Press Start 2P"', color: '#ff006e'
    }).setOrigin(0.5).setDepth(93)
  }

  startTimer () {
    this.timerEvent = this.time.addEvent({
      delay: 1000, loop: true,
      callback: () => {
        if (this.submitted || this.playerFrozen) return
        this.timeLeft--
        const m = Math.floor(this.timeLeft / 60)
        const s = String(this.timeLeft % 60).padStart(2, '0')
        this.timerText.setText(`⏱ ${m}:${s}`)
        if (this.timeLeft <= 30) {
          this.timerText.setColor(this.timeLeft % 2 === 0 ? '#ff006e' : '#ffffff')
          if (this.timeLeft <= 10) sound.timerCritical()
          else sound.timerWarning()
        }
        if (this.timeLeft <= 0) this.onTimerExpired()
      }
    })
  }

  // ── Decor ─────────────────────────────────────────────────────────────────

  buildHackathonDecor (w, h) {
    // Laptop stations
    const tables = [
      { x: 200, y: 200 }, { x: 370, y: 160 }, { x: 540, y: 200 },
      { x: 230, y: 380 }, { x: 490, y: 400 }
    ]
    tables.forEach(p => {
      this.add.rectangle(p.x, p.y, 80, 44, 0x0a1628).setStrokeStyle(1, 0x223366).setDepth(3)
      this.add.text(p.x, p.y, '💻', { fontSize: '20px' }).setOrigin(0.5).setDepth(4)
    })

    // Whiteboards
    this.add.rectangle(700, 200, 50, 90, 0xf0f0f0).setStrokeStyle(2, 0x334477).setDepth(3)
    this.add.text(700, 200, '📊', { fontSize: '28px' }).setOrigin(0.5).setDepth(4)
  }

  // ── Energy Drinks ─────────────────────────────────────────────────────────

  spawnEnergyDrinks () {
    ENERGY_DRINK_POSITIONS.forEach((pos, i) => {
      const glow = this.add.circle(pos.x, pos.y, 20, 0x00f5ff, 0.15).setDepth(4)
      this.tweens.add({ targets: glow, scaleX: 1.4, scaleY: 1.4, alpha: 0, duration: 800, yoyo: true, repeat: -1 })

      const can = this.add.text(pos.x, pos.y, '⚡', { fontSize: '26px' }).setOrigin(0.5).setDepth(5)
      this.tweens.add({ targets: can, y: pos.y - 8, duration: 700 + i * 130, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })

      this.energyDrinks.push({ can, glow, pos, collected: false })
    })
  }

  checkEnergyDrinkPickup () {
    this.energyDrinks.forEach((item, i) => {
      if (item.collected) return
      const dist = Phaser.Math.Distance.Between(this.lia.sprite.x, this.lia.sprite.y, item.pos.x, item.pos.y)
      if (dist < 38) {
        item.collected = true
        item.can.setVisible(false)
        item.glow.setVisible(false)
        this.hud.addEnergy(22)
        this.hud.addScore(60)
        sound.wifiPickup()
        floatText(this, item.pos.x, item.pos.y - 12, ENERGY_DRINK_TEXTS[i % ENERGY_DRINK_TEXTS.length], '#00f5ff')

        // Respawn after 12s
        this.time.delayedCall(12000, () => {
          if (!this.submitted) {
            item.collected = false
            item.can.setVisible(true)
            item.glow.setVisible(true)
          }
        })
      }
    })
  }

  // ── Code Review Piles ─────────────────────────────────────────────────────

  spawnCodeReviewPile (w, h) {
    const x = Phaser.Math.Between(80, w - 80)

    // Falling emoji from top
    const pile = this.add.text(x, 50, '📋', { fontSize: '30px' }).setOrigin(0.5).setDepth(8)
    const stack = this.add.text(x + 8, 62, '📋', { fontSize: '20px' }).setOrigin(0.5).setDepth(8).setAlpha(0)

    const landY = Phaser.Math.Between(220, h - 80)

    // Fall animation
    this.tweens.add({
      targets: pile, y: landY, duration: 900, ease: 'Bounce.easeOut',
      onComplete: () => {
        stack.setPosition(x + 8, landY + 12).setAlpha(1)

        // Slow zone on ground
        const zone = this.add.rectangle(x, landY, 70, 70, 0xff4400, 0.18)
          .setStrokeStyle(2, 0xff6600).setDepth(5)
        const label = this.add.text(x, landY + 28, 'CODE\nREVIEW', {
          fontSize: '5px', fontFamily: '"Press Start 2P"', color: '#ff6600', align: 'center'
        }).setOrigin(0.5).setDepth(6)

        sound.blockerSlam()

        const entry = { rect: zone, label, pile, stack, x, y: landY, active: true }
        this.slowZones.push(entry)

        // Despawn after 5s
        this.time.delayedCall(5000, () => {
          entry.active = false
          pile.destroy()
          stack.destroy()
          zone.destroy()
          label.destroy()
          this.slowZones = this.slowZones.filter(z => z !== entry)
        })
      }
    })
  }

  checkSlowZones () {
    let inZone = false
    this.slowZones.forEach(z => {
      if (!z.active) return
      const dist = Phaser.Math.Distance.Between(this.lia.sprite.x, this.lia.sprite.y, z.x, z.y)
      if (dist < 42) {
        inZone = true
        // Drain energy slowly while standing in pile
        if (!z._draining) {
          z._draining = true
          z._drainTimer = this.time.addEvent({
            delay: 800, loop: true,
            callback: () => {
              if (!z.active) { z._drainTimer.destroy(); return }
              const d2 = Phaser.Math.Distance.Between(this.lia.sprite.x, this.lia.sprite.y, z.x, z.y)
              if (d2 < 42) {
                this.hud.drainEnergy(3)
                floatText(this, this.lia.sprite.x, this.lia.sprite.y - 30, '📋 CODE REVIEW! -3', '#ff6600')
              } else {
                z._draining = false
                z._drainTimer.destroy()
              }
            }
          })
        }
      }
    })
    this.playerSlowed = inZone
  }

  // ── Chad ──────────────────────────────────────────────────────────────────

  spawnChad (w, h) {
    this.chad = this.add.text(680, 180, '😎', { fontSize: '28px' }).setOrigin(0.5).setDepth(9)
    this.chadLabel = this.add.text(680, 152, 'CHAD', {
      fontSize: '7px', fontFamily: '"Press Start 2P"',
      color: '#ff006e', backgroundColor: '#0d0d1a', padding: { x: 3, y: 2 }
    }).setOrigin(0.5).setDepth(10)
    this.chadTargetX = 680
    this.chadTargetY = 180
  }

  updateChad (delta, width, height) {
    if (this.submitted || this.playerFrozen) return

    // Chad wanders to a new spot every 3s
    this.chadMoveTimer += delta
    if (this.chadMoveTimer > 3000) {
      this.chadMoveTimer = 0
      this.chadTargetX = Phaser.Math.Between(120, width - 80)
      this.chadTargetY = Phaser.Math.Between(80, height - 80)
    }

    // Smoothly move Chad toward his target
    const angleToTarget = Phaser.Math.Angle.Between(this.chad.x, this.chad.y, this.chadTargetX, this.chadTargetY)
    const distToTarget = Phaser.Math.Distance.Between(this.chad.x, this.chad.y, this.chadTargetX, this.chadTargetY)
    if (distToTarget > 5) {
      this.chad.x += Math.cos(angleToTarget) * 80 * (delta / 1000)
      this.chad.y += Math.sin(angleToTarget) * 80 * (delta / 1000)
    }

    this.chadLabel.x = this.chad.x
    this.chadLabel.y = this.chad.y - 24

    // Throw code at player every 3.5s
    this.chadThrowCooldown += delta
    if (this.chadThrowCooldown > 3500) {
      this.chadThrowCooldown = 0
      this.chadThrowCode()
    }
  }

  chadThrowCode () {
    const startX = this.chad.x
    const startY = this.chad.y
    const targetX = this.lia.sprite.x
    const targetY = this.lia.sprite.y

    const angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY)
    const speed = 220 // px/s

    const proj = this.add.text(startX, startY, '💾', { fontSize: '20px' }).setOrigin(0.5).setDepth(9)

    // Floating quip
    const quip = CHAD_THROW_LINES[Phaser.Math.Between(0, CHAD_THROW_LINES.length - 1)]
    floatText(this, startX, startY - 40, quip, '#ff006e')

    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed

    this.chadProjectiles.push({ proj, vx, vy, active: true })

    // Auto-destroy after 3s
    this.time.delayedCall(3000, () => {
      const idx = this.chadProjectiles.findIndex(p => p.proj === proj)
      if (idx !== -1) {
        this.chadProjectiles[idx].active = false
        proj.destroy()
        this.chadProjectiles.splice(idx, 1)
      }
    })
  }

  updateChadProjectiles (delta) {
    this.chadProjectiles.forEach((p, i) => {
      if (!p.active) return
      p.proj.x += p.vx * (delta / 1000)
      p.proj.y += p.vy * (delta / 1000)

      // Hit check
      const dist = Phaser.Math.Distance.Between(p.proj.x, p.proj.y, this.lia.sprite.x, this.lia.sprite.y)
      if (dist < 28) {
        p.active = false
        p.proj.destroy()
        this.chadProjectiles.splice(i, 1)
        this.hud.drainEnergy(12)
        this.hud.addScore(-40)
        sound.playerHit()
        screenFlash(this, 0xff006e, 0.3)
        floatText(this, this.lia.sprite.x, this.lia.sprite.y - 36, '💾 CODE HIT! -12 ENERGY -40 SCORE', '#ff006e')
      }
    })
  }

  // ── Submit Button ─────────────────────────────────────────────────────────

  buildSubmitButton (w, h) {
    const sx = 700, sy = 490
    this.submitX = sx
    this.submitY = sy

    this.submitBg = this.add.rectangle(sx, sy, 90, 44, 0x003300).setStrokeStyle(3, 0x39ff14).setDepth(6)
    this.submitText = this.add.text(sx, sy, '🚀\nSUBMIT', {
      fontSize: '8px', fontFamily: '"Press Start 2P"', color: '#39ff14', align: 'center'
    }).setOrigin(0.5).setDepth(7)
    this.submitHint = this.add.text(sx, sy - 34, '[ E ] SUBMIT', {
      fontSize: '6px', fontFamily: '"Press Start 2P"',
      color: '#39ff14', backgroundColor: '#0d0d1a', padding: { x: 3, y: 2 }
    }).setOrigin(0.5).setDepth(8).setAlpha(0)

    this.tweens.add({ targets: this.submitBg, scaleX: 1.04, scaleY: 1.04, duration: 600, yoyo: true, repeat: -1 })
  }

  checkSubmitButton () {
    if (this.submitted) return
    const dist = Phaser.Math.Distance.Between(this.lia.sprite.x, this.lia.sprite.y, this.submitX, this.submitY)
    this.submitHint.setAlpha(dist < 80 ? 1 : 0)

    if (dist < 55 && Phaser.Input.Keyboard.JustDown(this.eKey) && !this.dialogue.isActive()) {
      this.submitted = true
      this.playerFrozen = true
      if (this.timerEvent) this.timerEvent.destroy()
      if (this.codeReviewTimer) this.codeReviewTimer.destroy()
      this.hud.addScore(300)
      sound.submitProject()
      this.dialogue.show(SUBMIT_DIALOGUE, () => {
        this.cameras.main.fadeOut(600, 0, 0, 0)
        this.time.delayedCall(600, () => {
          this.scene.stop('HackathonFloorScene')
          this.scene.start('EscapeScene', { score: this.hud.getScore(), timeBonus: this.timeLeft })
        })
      })
    }
  }

  onTimerExpired () {
    if (this.submitted) return
    this.playerFrozen = true
    const { width, height } = this.scale
    const msg = this.add.text(width / 2, height / 2,
      "⏱ TIME'S UP!\nChad submitted first...\n\n...but his code doesn't compile.\n(It never did.)", {
        fontSize: '10px', fontFamily: '"Press Start 2P"', color: '#ff006e',
        align: 'center', backgroundColor: '#0d0d1a', padding: { x: 16, y: 12 }
      }).setOrigin(0.5).setDepth(400)

    this.time.delayedCall(3200, () => {
      msg.destroy()
      this.timeLeft = 60
      this.startTimer()
      sound.bonusTime()
      floatText(this, width / 2, height / 2, '🎲 BONUS 60 SECONDS! FINISH IT!', '#ffd700')
      this.playerFrozen = false
    })
  }

  // ── Chapter Banner ────────────────────────────────────────────────────────

  showChapterBanner (title, subtitle) {
    const { width, height } = this.scale
    const bg = this.add.rectangle(width / 2, height / 2, 520, 90, 0x0d0d1a, 0.95)
      .setStrokeStyle(2, 0x00f5ff).setDepth(300)
    const t1 = this.add.text(width / 2, height / 2 - 14, title, {
      fontSize: '18px', fontFamily: '"Press Start 2P"', color: '#ffd700'
    }).setOrigin(0.5).setDepth(301)
    const t2 = this.add.text(width / 2, height / 2 + 18, subtitle, {
      fontSize: '11px', fontFamily: '"Press Start 2P"', color: '#00f5ff'
    }).setOrigin(0.5).setDepth(301)
    this.time.delayedCall(2200, () => {
      this.tweens.add({ targets: [bg, t1, t2], alpha: 0, duration: 400, onComplete: () => { bg.destroy(); t1.destroy(); t2.destroy() } })
    })
  }

  // ── Update ────────────────────────────────────────────────────────────────

  update (time, delta) {
    const { width, height } = this.scale

    if (!this.playerFrozen) {
      // Slow movement when in a code review pile
      if (this.playerSlowed) {
        // Still move but Maki handles reduced-feeling movement — flash overlay hint
        this.maki.move(this.lia)
      } else {
        this.maki.move(this.lia)
      }
    }

    this.updateChad(delta, width, height)
    this.updateChadProjectiles(delta)
    this.checkEnergyDrinkPickup()
    this.checkSlowZones()
    this.checkSubmitButton()
  }
}
