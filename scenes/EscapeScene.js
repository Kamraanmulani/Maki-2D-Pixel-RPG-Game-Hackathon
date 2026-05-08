/**
 * EscapeScene.js — Chapter 3: The Escape 🚪
 *
 * BOSS FIGHT: Monday Morning Standup — a giant calendar that attacks with:
 *   - "Action items" (projectiles you dodge)
 *   - "Blocking issues" (spawns slow zones on the floor)
 *   - "Circle-back" beam (a sweeping attack)
 *
 * To damage the boss: collect "blockers" that fall from the ceiling and
 *   throw them at the boss with SPACE (walk into them to pick up, then press SPACE)
 *
 * Win: Deplete boss HP → cutscene → WinScene
 */

import { Scene, manager } from '@tialops/maki'
import { DialogueSystem, HUD, floatText, screenFlash } from './DialogueSystem.js'
import WinScene from './WinScene.js'
import { sound } from './SoundManager.js'

// ── Dialogue Scripts ──────────────────────────────────────────────────────────

const INTRO_DIALOGUE = [
  { speaker: 'DEV (YOU)', emoji: '😤', color: '#00f5ff', text: "The exit is RIGHT THERE. The door. FREEDOM. Early Friday is within reach." },
  { speaker: 'DEV (YOU)', emoji: '😤', color: '#00f5ff', text: "But between me and that door... a calendar invite has opened a rift in reality." },
  { speaker: 'MONDAY STANDUP', emoji: '📅', color: '#ffd700', text: '"GOOD MORNING TEAM. Let\'s go around the room. I want to hear: what you did, what you\'ll do, and your BLOCKERS."' },
  { speaker: 'MONDAY STANDUP', emoji: '📅', color: '#ffd700', text: '"We\'ll also discuss the Q4 roadmap, reorg implications, KPIs, and whether the coffee machine is a team resource."' },
  { speaker: 'DEV (YOU)', emoji: '💀', color: '#ff006e', text: "THE BOSS. Dodge its attacks! Collect ☕ COFFEE GRENADES from the ground and throw them with SPACE!" }
]

const BOSS_PHASE_1 = [
  { speaker: 'MONDAY STANDUP', emoji: '📅', color: '#ffd700', text: '"DEV, what are your BLOCKERS? Please be specific. Use bullet points. And a pie chart. And a GANTT chart."' },
  { speaker: 'MONDAY STANDUP', emoji: '📅', color: '#ffd700', text: '"Let\'s take this offline. Let\'s get alignment. Let\'s boil the ocean. Let\'s circle back at the end of time."' }
]

const BOSS_PHASE_2 = [
  { speaker: 'MONDAY STANDUP', emoji: '📅', color: '#ffd700', text: '"I see you\'ve been VERY productive, DEV. Perhaps TOO productive. Have you considered a 12-hour daily scrum?"' },
  { speaker: 'DEV (YOU)', emoji: '😤', color: '#00f5ff', text: "You're a CALENDAR. You are literally a recurring event. I will NOT be attending." }
]

const BOSS_DEFEATED = [
  { speaker: 'MONDAY STANDUP', emoji: '💀', color: '#4a4a6a', text: '"I... I\'ve been... CANCELLED. The meeting... has been... declined by all participants..."' },
  { speaker: 'MONDAY STANDUP', emoji: '💀', color: '#4a4a6a', text: '"...Will this be... rescheduled? Should I... find a time that works for... ev—"' },
  { speaker: 'DEV (YOU)', emoji: '🎉', color: '#39ff14', text: "DECLINED. WITH EXTREME PREJUDICE. Now get out of my way, I have a DOOR to walk through." }
]

// ── Scene ─────────────────────────────────────────────────────────────────────

export default class EscapeScene extends Scene {
  constructor () {
    super('EscapeScene')
    this.bossHP = 5
    this.bossMaxHP = 5
    this.playerHP = 5
    this.playerMaxHP = 5
    this.carriedGrenade = false
    this.grenades = []
    this.projectiles = []
    this.blocked = []
    this.playerFrozen = false
    this.bossDefeated = false
    this.phase = 1
  }

  init (data) {
    this.inheritedScore = data?.score || 0
    this.timeBonus = data?.timeBonus || 0
  }

  preload () {
    this._makiPlayers = []
    super.preload()
    this.lia = this.maki.player('lia')
    manager.map(this, 'escape_map')
    manager.preload(this)
  }

  create () {
    super.create()
    manager.create(this)

    if (!this.scene.get('WinScene')) {
      this.scene.add('WinScene', WinScene, false)
    }

    this.lia.sprite.setPosition(120, 400)
    this.lia.sprite.setDepth(10)
    this.physics.add.collider(this.lia.sprite, manager.getWallGroup(this, 'escape_map'))

    // ── HUD ──────────────────────────────────────────────────
    this.hud = new HUD(this, {
      maxEnergy: 100,
      objective: '⚔️ DEFEAT THE MONDAY STANDUP BOSS'
    })
    this.hud.score = this.inheritedScore
    this.hud.scoreText.setText(`SCORE: ${this.hud.score}`)

    // ── Dialogue ───────────────────────────────────────────────
    this.dialogue = new DialogueSystem(this)

    // ── Build scene ───────────────────────────────────────────
    this.buildBoss()
    this.buildPlayerHPBar()
    this.buildExitDoor()

    // ── Space key for throwing ─────────────────────────────────
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    // ── Intro ─────────────────────────────────────────────────
    this.playerFrozen = true
    this.time.delayedCall(300, () => {
      this.dialogue.show(INTRO_DIALOGUE, () => {
        this.playerFrozen = false
        sound.bossIntro()
        this.startBossPatterns()
        this.startGrenadeSpawner()
      })
    })

    this.showChapterBanner('CHAPTER 3', 'THE ESCAPE 🚪 — BOSS FIGHT!')
    sound.chapterBanner()
    this.cameras.main.fadeIn(500)
  }

  buildBoss () {
    const { width } = this.scale

    // Boss visual
    this.boss = this.add.text(width / 2, 120, '📅', {
      fontSize: '72px'
    }).setOrigin(0.5).setDepth(15)

    // Boss name
    this.bossName = this.add.text(width / 2, 60, '⚡ MONDAY MORNING STANDUP ⚡', {
      fontSize: '9px',
      fontFamily: '"Press Start 2P"',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(16)

    // Boss HP bar background
    this.add.rectangle(width / 2, 82, 350, 14, 0x111111)
      .setStrokeStyle(1, 0xff006e).setDepth(15)

    // Boss HP bar fill
    this.bossHPBar = this.add.graphics().setDepth(16)
    this.updateBossHPBar()

    // Boss idle float
    this.tweens.add({
      targets: this.boss,
      y: 130,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    // Boss zone for hit detection
    this.bossZone = this.add.zone(width / 2, 120, 100, 100)
    this.physics.world.enable(this.bossZone)
    this.bossZone.body.setAllowGravity(false)
  }

  buildPlayerHPBar () {
    const { width } = this.scale

    this.add.text(width - 200, 12, '❤️ HP:', {
      fontSize: '7px', fontFamily: '"Press Start 2P"', color: '#ff006e'
    }).setDepth(91)

    this.playerHPBg = this.add.rectangle(width - 80, 18, 100, 12, 0x111111)
      .setStrokeStyle(1, 0xff006e).setDepth(91)

    this.playerHPBar = this.add.graphics().setDepth(92)
    this.updatePlayerHPBar()
  }

  buildExitDoor () {
    const { width, height } = this.scale

    this.exitDoor = this.add.text(width - 60, height / 2, '🚪', {
      fontSize: '52px'
    }).setOrigin(0.5).setDepth(8).setAlpha(0.3)

    this.add.text(width - 60, height / 2 + 44, 'FREEDOM', {
      fontSize: '6px',
      fontFamily: '"Press Start 2P"',
      color: '#4a4a6a'
    }).setOrigin(0.5).setDepth(8)

    // Will become bright when boss is defeated
    this.exitGlow = this.add.circle(width - 60, height / 2, 40, 0x39ff14, 0)
      .setDepth(7)
  }

  updateBossHPBar () {
    const { width } = this.scale
    this.bossHPBar.clear()
    const pct = this.bossHP / this.bossMaxHP
    const color = pct > 0.5 ? 0xff6600 : pct > 0.25 ? 0xff0000 : 0x990000
    this.bossHPBar.fillStyle(color)
    this.bossHPBar.fillRect(width / 2 - 175, 75, 350 * pct, 14)
  }

  updatePlayerHPBar () {
    const { width } = this.scale
    this.playerHPBar.clear()
    const pct = this.playerHP / this.playerMaxHP
    this.playerHPBar.fillStyle(0xff006e)
    this.playerHPBar.fillRect(width - 130, 12, 100 * pct, 12)
  }

  startGrenadeSpawner () {
    this.grenadeTimer = this.time.addEvent({
      delay: 3500,
      loop: true,
      callback: () => {
        if (this.bossDefeated) return
        const x = Phaser.Math.Between(100, 700)
        const g = this.add.text(x, 200, '☕', {
          fontSize: '24px'
        }).setOrigin(0.5).setDepth(9)

        // Drop from above
        this.tweens.add({
          targets: g,
          y: Phaser.Math.Between(350, 480),
          duration: 800,
          ease: 'Bounce.easeOut'
        })

        const zone = this.add.zone(x, 420, 36, 36)
        this.physics.world.enable(zone)
        zone.body.setAllowGravity(false)
        zone.x = x
        zone.y = g.y + 30

        this.grenades.push({ icon: g, zone, pickedUp: false })

        // Despawn after 6 seconds
        this.time.delayedCall(6000, () => {
          const idx = this.grenades.findIndex(gr => gr.icon === g)
          if (idx !== -1 && !this.grenades[idx].pickedUp) {
            g.destroy()
            zone.destroy()
            this.grenades.splice(idx, 1)
          }
        })
      }
    })
  }

  startBossPatterns () {
    const { width, height } = this.scale

    // Pattern 1: Action Item projectiles (falling from boss)
    this.attackTimer1 = this.time.addEvent({
      delay: 2500,
      loop: true,
      callback: () => {
        if (this.bossDefeated || this.playerFrozen) return
        const count = this.phase === 1 ? 2 : 4
        for (let i = 0; i < count; i++) {
          this.time.delayedCall(i * 250, () => {
            const px = this.boss.x + Phaser.Math.Between(-120, 120)
            const proj = this.add.text(px, this.boss.y + 50, '📌', {
              fontSize: '18px'
            }).setOrigin(0.5).setDepth(12)
            sound.projectileSpawn()
            this.tweens.add({
              targets: proj,
              y: height,
              duration: 2200,
              onComplete: () => proj.destroy()
            })
            this.projectiles.push(proj)
          })
        }
      }
    })

    // Pattern 2: Blocking Zone (red squares on the floor)
    this.attackTimer2 = this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: () => {
        if (this.bossDefeated || this.playerFrozen) return
        const bx = Phaser.Math.Between(100, 700)
        const by = Phaser.Math.Between(300, 520)
        const blockZone = this.add.rectangle(bx, by, 80, 80, 0xff0000, 0.2)
          .setStrokeStyle(2, 0xff006e).setDepth(6)
        const blockText = this.add.text(bx, by, '🚫\nBLOCKER', {
          fontSize: '7px', fontFamily: '"Press Start 2P"', color: '#ff006e', align: 'center'
        }).setOrigin(0.5).setDepth(7)
        sound.blockerSlam()

        this.blocked.push({ rect: blockZone, text: blockText, x: bx, y: by })

        // Despawn after 4 seconds
        this.time.delayedCall(4000, () => {
          blockZone.destroy()
          blockText.destroy()
          this.blocked = this.blocked.filter(b => b.rect !== blockZone)
        })
      }
    })

    // Phase 2 dialogue trigger
    this.time.delayedCall(18000, () => {
      if (!this.bossDefeated && !this.dialogue.isActive()) {
        this.phase = 2
        this.playerFrozen = true
        this.dialogue.show(BOSS_PHASE_1, () => { this.playerFrozen = false })
      }
    })
  }

  checkGrenadePickup () {
    if (this.carriedGrenade) return
    this.grenades.forEach((g, i) => {
      if (g.pickedUp) return
      const dist = Phaser.Math.Distance.Between(
        this.lia.sprite.x, this.lia.sprite.y, g.icon.x, g.icon.y
      )
      if (dist < 40) {
        g.pickedUp = true
        g.icon.setVisible(false)
        g.zone.destroy()
        this.carriedGrenade = true
        sound.grenadePickup()
        floatText(this, this.lia.sprite.x, this.lia.sprite.y - 30, '☕ LOCKED & LOADED!', '#ffd700')

        // Show carry indicator
        this.carriedIcon = this.add.text(0, 0, '☕', {
          fontSize: '18px'
        }).setOrigin(0.5).setDepth(20)
      }
    })
  }

  checkThrow () {
    if (!this.carriedGrenade) return
    if (!Phaser.Input.Keyboard.JustDown(this.spaceKey)) return

    this.carriedGrenade = false
    if (this.carriedIcon) { this.carriedIcon.destroy(); this.carriedIcon = null }
    sound.grenadeThrow()

    // Check if near boss
    const bossX = this.scale.width / 2
    const dist = Phaser.Math.Distance.Between(
      this.lia.sprite.x, this.lia.sprite.y, bossX, this.boss.y
    )

    // Animate throw
    const thrown = this.add.text(this.lia.sprite.x, this.lia.sprite.y, '☕', {
      fontSize: '22px'
    }).setOrigin(0.5).setDepth(15)

    this.tweens.add({
      targets: thrown,
      x: bossX,
      y: this.boss.y,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        thrown.destroy()
        this.onGrenadeLand()
      }
    })
  }

  onGrenadeLand () {
    this.bossHP--
    sound.bossHit()
    screenFlash(this, 0xff6600, 0.5)
    floatText(this, this.scale.width / 2, 130, '💥 HIT! -1 HP', '#ff006e')

    // Boss shake
    this.tweens.add({
      targets: [this.boss, this.bossName],
      x: this.scale.width / 2 + 15,
      duration: 60,
      yoyo: true,
      repeat: 3
    })

    this.updateBossHPBar()
    this.hud.addScore(100)

    // Phase 2 trigger
    if (this.bossHP === 2 && this.phase === 1 && !this.dialogue.isActive()) {
      this.phase = 2
      this.playerFrozen = true
      sound.bossPhase2()
      this.dialogue.show(BOSS_PHASE_2, () => { this.playerFrozen = false })
    }

    if (this.bossHP <= 0) {
      this.onBossDefeated()
    }
  }

  checkProjectileCollision () {
    this.projectiles.forEach((proj, i) => {
      if (!proj.active) return
      const dist = Phaser.Math.Distance.Between(
        this.lia.sprite.x, this.lia.sprite.y, proj.x, proj.y
      )
      if (dist < 28) {
        proj.destroy()
        this.projectiles.splice(i, 1)
        this.playerHP--
        this.updatePlayerHPBar()
        sound.playerHit()
        screenFlash(this, 0xff0000, 0.4)
        floatText(this, this.lia.sprite.x, this.lia.sprite.y - 30, '📌 ACTION ITEM HIT! -1 HP', '#ff006e')

        if (this.playerHP <= 0) {
          this.onPlayerDowned()
        }
      }
    })

    // Check blocker zones
    this.blocked.forEach(b => {
      const dist = Phaser.Math.Distance.Between(
        this.lia.sprite.x, this.lia.sprite.y, b.x, b.y
      )
      if (dist < 50) {
        // Slow the player (handled by not calling move)
        this.playerSlowed = true
      } else {
        this.playerSlowed = false
      }
    })
  }

  onPlayerDowned () {
    // Not a true game over — restore HP but drain score
    this.playerHP = 3
    this.updatePlayerHPBar()
    this.hud.addScore(-100)
    sound.playerDowned()
    screenFlash(this, 0xff0000, 0.7)
    floatText(this, this.scale.width / 2, this.scale.height / 2, '💀 KNOCKED DOWN!\n-100 SCORE', '#ff006e')
    floatText(this, this.scale.width / 2, this.scale.height / 2 + 40, '...but you get back up.\nYou always do.', '#ffffff')
  }

  onBossDefeated () {
    this.bossDefeated = true
    if (this.attackTimer1) this.attackTimer1.destroy()
    if (this.attackTimer2) this.attackTimer2.destroy()
    if (this.grenadeTimer) this.grenadeTimer.destroy()
    this.playerFrozen = true

    // Boss death animation
    this.tweens.add({
      targets: this.boss,
      scaleX: 0, scaleY: 0,
      alpha: 0,
      angle: 720,
      duration: 1000
    })

    screenFlash(this, 0x39ff14, 0.6)
    sound.bossDefeated()
    this.hud.addScore(500)

    // Time bonus
    const bonus = this.timeBonus * 2
    if (bonus > 0) {
      this.hud.addScore(bonus)
      floatText(this, this.scale.width / 2, 200, `⏱ TIME BONUS: +${bonus}`, '#ffd700')
    }

    // Activate exit door
    this.time.delayedCall(800, () => {
      this.exitDoor.setAlpha(1)
      this.tweens.add({ targets: this.exitGlow, fillAlpha: 0.3, duration: 500, yoyo: true, repeat: -1 })
      this.dialogue.show(BOSS_DEFEATED, () => {
        // Walk to exit
        this.playerFrozen = false
        const exitText = this.add.text(this.scale.width - 60, this.scale.height / 2 - 60, '[ E ] EXIT', {
          fontSize: '7px', fontFamily: '"Press Start 2P"', color: '#39ff14',
          backgroundColor: '#0d0d1a', padding: { x: 3, y: 2 }
        }).setOrigin(0.5).setDepth(20)
        this.exitActive = true
      })
    })
  }

  checkExit () {
    if (!this.exitActive || this.playerFrozen) return
    const dist = Phaser.Math.Distance.Between(
      this.lia.sprite.x, this.lia.sprite.y,
      this.scale.width - 60, this.scale.height / 2
    )
    if (dist < 70) {
      const eKey = this.input.keyboard.addKey('E')
      if (Phaser.Input.Keyboard.JustDown(eKey)) {
        this.exitActive = false
        this.cameras.main.fadeOut(800, 0, 0, 0)
        this.time.delayedCall(800, () => {
          this.scene.stop('EscapeScene')
          this.scene.start('WinScene', { score: this.hud.getScore() })
        })
      }
    }
  }

  showChapterBanner (title, subtitle) {
    const { width, height } = this.scale
    const bg = this.add.rectangle(width / 2, height / 2, 560, 90, 0x0d0d1a, 0.95)
      .setStrokeStyle(2, 0xff006e).setDepth(300)
    const t1 = this.add.text(width / 2, height / 2 - 14, title, {
      fontSize: '18px', fontFamily: '"Press Start 2P"', color: '#ffd700'
    }).setOrigin(0.5).setDepth(301)
    const t2 = this.add.text(width / 2, height / 2 + 18, subtitle, {
      fontSize: '10px', fontFamily: '"Press Start 2P"', color: '#ff006e'
    }).setOrigin(0.5).setDepth(301)
    this.time.delayedCall(2500, () => {
      this.tweens.add({ targets: [bg, t1, t2], alpha: 0, duration: 400, onComplete: () => { bg.destroy(); t1.destroy(); t2.destroy() } })
    })
  }

  update () {
    if (!this.playerFrozen && !this.playerSlowed) {
      this.maki.move(this.lia)
    }

    // Carried grenade follows player
    if (this.carriedGrenade && this.carriedIcon) {
      this.carriedIcon.x = this.lia.sprite.x
      this.carriedIcon.y = this.lia.sprite.y - 30
    }

    this.checkGrenadePickup()
    this.checkThrow()
    this.checkProjectileCollision()
    this.checkExit()

    this.playerSlowed = false
  }
}
