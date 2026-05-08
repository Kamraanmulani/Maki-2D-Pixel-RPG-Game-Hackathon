/**
 * OfficeScene.js — Chapter 1: The Office 🏢 (Revamped)
 *
 * Mechanics:
 *   - ONE Karen that actively CHASES the player (speeds up each coffee grab)
 *   - 5 coffees scattered across the map
 *   - Meeting room door LOCKED until all 5 coffees collected
 *   - Funny proximity quips + catch dialogues
 *   - Passive energy drain — coffee is the only recovery
 *
 * Controls: Arrow keys to move, E to interact with door
 */

import { Scene, manager } from '@tialops/maki'
import { DialogueSystem, HUD, floatText, screenFlash } from './DialogueSystem.js'
import HackathonFloorScene from './HackathonFloorScene.js'
import { sound } from './SoundManager.js'

// ── Dialogue ──────────────────────────────────────────────────────────────────

const INTRO_DIALOGUE = [
  { speaker: 'BOB THE MANAGER', emoji: '👔', color: '#ffd700', text: 'DEV! Company hackathon TODAY. Winner leaves early Friday. Loser does ALL code reviews for a month. ...Anyway!' },
  { speaker: 'DEV (YOU)', emoji: '😰', color: '#00f5ff', text: 'Okay. Need coffee. Five cups minimum. Brain will not boot without it. The meeting room door is my only escape.' },
  { speaker: 'BOB THE MANAGER', emoji: '👔', color: '#ffd700', text: 'Oh — Karen from HR is looking for you. Something about trust falls. And a form. And your emergency contact.' },
  { speaker: 'DEV (YOU)', emoji: '😱', color: '#00f5ff', text: 'CONTROLS: Arrow keys to move. Grab ☕ x5 to unlock the door. DON\'T let Karen catch you — she gets faster every coffee!' }
]

const KAREN_CATCH_DIALOGUES = [
  [
    { speaker: 'KAREN (HR)', emoji: '😊', color: '#ff006e', text: 'GOT YOU! TPS reports — blue ink, three copies, notarized, faxed, emailed, AND stapled in the "correct" way (I will know).' },
    { speaker: 'KAREN (HR)', emoji: '😊', color: '#ff006e', text: 'Also trust falls. Parking lot. 3pm. I\'ve CC\'d Bob, Bob\'s boss, and your emergency contact. It\'s MANDATORY.' },
    { speaker: 'DEV (YOU)', emoji: '😩', color: '#00f5ff', text: '...Lost 20 energy. She\'s faster now. Worth it? Absolutely not.' }
  ],
  [
    { speaker: 'KAREN (HR)', emoji: '😊', color: '#ff006e', text: 'DEV! Your desk plant is violating Office Flora Policy §4B. I\'ve scheduled a 90-minute review meeting.' },
    { speaker: 'KAREN (HR)', emoji: '😊', color: '#ff006e', text: 'Slide 1 is just a photo of your plant looking guilty. Slide 47 is a pie chart of leaf infractions. Very thorough.' },
    { speaker: 'DEV (YOU)', emoji: '😩', color: '#00f5ff', text: 'I DON\'T HAVE A PLANT. -20 energy. I need to move FASTER.' }
  ],
  [
    { speaker: 'KAREN (HR)', emoji: '😊', color: '#ff006e', text: 'Your ergonomic chair assessment is 6 months overdue! I have measuring tape. And a chiropractor. SIT. DOWN.' },
    { speaker: 'DEV (YOU)', emoji: '😡', color: '#00f5ff', text: 'I WAS STANDING. I CHOSE TO STAND. THIS IS CORPORATE VIOLENCE.' },
    { speaker: 'KAREN (HR)', emoji: '😊', color: '#ff006e', text: '"Resistant to ergonomic feedback." That\'s a flag, DEV. A BIG flag. In your permanent file. A RED flag.' }
  ],
  [
    { speaker: 'KAREN (HR)', emoji: '😊', color: '#ff006e', text: 'DEV! The potluck signup sheet! You wrote "I\'ll bring plates." That means NOTHING. Plates aren\'t food, DEV.' },
    { speaker: 'KAREN (HR)', emoji: '😊', color: '#ff006e', text: 'I\'ve escalated this to Bob. Bob has escalated to Legal. Legal says plates are in a "grey area." We\'re doing mediation.' },
    { speaker: 'DEV (YOU)', emoji: '😩', color: '#00f5ff', text: 'Mediation. About PLATES. I\'ve lost 20 energy and my faith in the justice system.' }
  ]
]

const COFFEE_TEXTS = [
  '☕ Cup 1! Brain.exe initialising...',
  '☕ Cup 2! Warning: Karen has noticed.',
  '☕ Cup 3! Karen is picking up speed...',
  '☕ Cup 4! KAREN IS SPRINTING. RUN.',
  '☕ ALL 5! DOOR UNLOCKED — GO GO GO!!'
]

const DOOR_LOCKED_TEXT = [
  { speaker: 'DEV (YOU)', emoji: '🚪', color: '#ff006e', text: 'Locked! Sign reads: "HACKATHON FLOOR — Must present 5 coffees. HR Policy #4471-B. Karen approves all entries."' },
  { speaker: 'DEV (YOU)', emoji: '😤', color: '#00f5ff', text: 'Of course Karen controls the door. Collect all ☕ x5 first. And avoid her on the way.' }
]

const DOOR_OPEN_TEXT = [
  { speaker: 'DEV (YOU)', emoji: '🎉', color: '#39ff14', text: 'ALL 5 COFFEES! The door clicks open! I can hear Karen behind me. I can FEEL her HR forms approaching.' },
  { speaker: 'DEV (YOU)', emoji: '🏃', color: '#39ff14', text: '[ CHAPTER 1 COMPLETE ] → Hackathon floor awaits. Karen will never reach me there. Probably. ENTER to continue...' }
]

const COFFEE_POSITIONS = [
  { x: 180, y: 180 },
  { x: 440, y: 140 },
  { x: 640, y: 260 },
  { x: 280, y: 430 },
  { x: 580, y: 470 }
]

const KAREN_QUIPS = [
  '📣 DEV!! JUST ONE MINUTE!!',
  '📣 I PRINTED THE FORM IN COLOR!!',
  '📣 TRUST FALLS!! PARKING LOT!! NOW!!',
  '📣 YOUR SLACK STATUS IS A LIE, DEV!!',
  '📣 ONLY 47 SLIDES!! VERY QUICK!!',
  '📣 I\'VE CC\'D BOB, DEV!! BOB KNOWS!!'
]

// ── Scene ─────────────────────────────────────────────────────────────────────

export default class OfficeScene extends Scene {
  constructor () {
    super('OfficeScene')
    this.coffeeCollected = 0
    this.coffeeTarget = 5
    this.doorUnlocked = false
    this.doorInteractCooldown = false
    this.playerFrozen = false
    this.karenCaught = false
    this.karenCatchCount = 0
    this.karenSpeed = 60
    this.karenQuipCooldown = 0
    this.coffees = []
  }

  preload () {
    this._makiPlayers = []
    super.preload()
    this.lia = this.maki.player('lia')
    manager.map(this, 'office_map')
    manager.preload(this)
  }

  create () {
    super.create()
    manager.create(this)

    const { width, height } = this.scale

    if (!this.scene.get('HackathonFloorScene')) {
      this.scene.add('HackathonFloorScene', HackathonFloorScene, false)
    }

    this.lia.sprite.setPosition(120, 300)
    this.lia.sprite.setDepth(10)
    this.physics.add.collider(this.lia.sprite, manager.getWallGroup(this, 'office_map'))

    this.hud = new HUD(this, { maxEnergy: 100, objective: '☕ COLLECT 5 COFFEES → 🚪 UNLOCK THE DOOR' })
    this.dialogue = new DialogueSystem(this)

    // Cache E key once
    this.eKey = this.input.keyboard.addKey('E')

    this.spawnOfficeDecor(width, height)
    this.spawnCoffees()
    this.spawnKaren()
    this.buildDoor()

    // Passive energy drain every 5s
    this.time.addEvent({
      delay: 5000, loop: true,
      callback: () => {
        if (!this.playerFrozen) {
          this.hud.drainEnergy(4)
          sound.energyDrain()
        }
      }
    })

    this.playerFrozen = true
    this.time.delayedCall(400, () => {
      this.dialogue.show(INTRO_DIALOGUE, () => { this.playerFrozen = false })
    })

    this.showChapterBanner('CHAPTER 1', 'THE OFFICE 🏢')
    sound.chapterBanner()
    this.cameras.main.fadeIn(500)
  }

  // ── Office Decor (visual desks/chairs) ────────────────────────────────────

  spawnOfficeDecor (w, h) {
    const deskPositions = [
      { x: 240, y: 240 }, { x: 400, y: 190 }, { x: 570, y: 160 },
      { x: 200, y: 390 }, { x: 460, y: 360 }, { x: 600, y: 390 }
    ]
    deskPositions.forEach(p => {
      this.add.rectangle(p.x, p.y, 70, 40, 0x1a2040).setStrokeStyle(1, 0x334477).setDepth(3)
      this.add.text(p.x, p.y, '🖥️', { fontSize: '18px' }).setOrigin(0.5).setDepth(4)
    })
  }

  // ── Karen ─────────────────────────────────────────────────────────────────

  spawnKaren () {
    this.karen = this.add.text(660, 130, '😊', { fontSize: '30px' }).setOrigin(0.5).setDepth(8)
    this.karenNameTag = this.add.text(660, 102, 'KAREN', {
      fontSize: '7px', fontFamily: '"Press Start 2P"',
      color: '#ff006e', backgroundColor: '#0d0d1a', padding: { x: 3, y: 2 }
    }).setOrigin(0.5).setDepth(9)
    this.karenBubble = this.add.text(660, 78, '❗', { fontSize: '18px' })
      .setOrigin(0.5).setDepth(9).setAlpha(0)
  }

  updateKaren (delta) {
    if (!this.karen || this.playerFrozen || this.karenCaught) return

    const px = this.lia.sprite.x
    const py = this.lia.sprite.y
    const kx = this.karen.x
    const ky = this.karen.y

    const angle = Phaser.Math.Angle.Between(kx, ky, px, py)
    const dist = Phaser.Math.Distance.Between(kx, ky, px, py)

    // Move toward player
    this.karen.x += Math.cos(angle) * this.karenSpeed * (delta / 1000)
    this.karen.y += Math.sin(angle) * this.karenSpeed * (delta / 1000)

    // Sync UI elements
    this.karenNameTag.x = this.karen.x
    this.karenNameTag.y = this.karen.y - 26
    this.karenBubble.x = this.karen.x
    this.karenBubble.y = this.karen.y - 44

    // Alert bubble when close
    this.karenBubble.setAlpha(dist < 130 ? 1 : 0)

    // Floating quip when close but not caught
    if (dist < 110 && !this.dialogue.isActive()) {
      this.karenQuipCooldown += delta
      if (this.karenQuipCooldown > 2500) {
        this.karenQuipCooldown = 0
        const q = KAREN_QUIPS[Phaser.Math.Between(0, KAREN_QUIPS.length - 1)]
        floatText(this, this.karen.x, this.karen.y - 55, q, '#ff006e')
        sound.karenAlert()
      }
    } else {
      this.karenQuipCooldown = 0
    }

    // Caught!
    if (dist < 34 && !this.dialogue.isActive()) {
      this.onKarenCatch()
    }
  }

  onKarenCatch () {
    this.karenCaught = true
    this.playerFrozen = true
    screenFlash(this, 0xff006e, 0.45)
    sound.meetingTrap()

    const lines = KAREN_CATCH_DIALOGUES[this.karenCatchCount % KAREN_CATCH_DIALOGUES.length]
    this.karenCatchCount++

    this.dialogue.show(lines, () => {
      this.hud.drainEnergy(20)
      floatText(this, this.lia.sprite.x, this.lia.sprite.y - 44, '-20 ENERGY 😩', '#ff006e')
      this.playerFrozen = false

      // Reset Karen to a far corner
      const corners = [{ x: 100, y: 100 }, { x: 700, y: 100 }, { x: 100, y: 500 }, { x: 700, y: 500 }]
      const c = corners[Phaser.Math.Between(0, 3)]
      this.karen.setPosition(c.x, c.y)

      this.time.delayedCall(1200, () => { this.karenCaught = false })
    })
  }

  // ── Coffees ───────────────────────────────────────────────────────────────

  spawnCoffees () {
    COFFEE_POSITIONS.forEach((pos, i) => {
      const glow = this.add.circle(pos.x, pos.y, 22, 0xffd700, 0.15).setDepth(4)
      this.tweens.add({ targets: glow, scaleX: 1.4, scaleY: 1.4, alpha: 0, duration: 900, yoyo: true, repeat: -1 })

      const cup = this.add.text(pos.x, pos.y, '☕', { fontSize: '28px' }).setOrigin(0.5).setDepth(5)
      this.tweens.add({ targets: cup, y: pos.y - 7, duration: 600 + i * 110, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })

      const badge = this.add.text(pos.x + 15, pos.y - 15, `${i + 1}`, {
        fontSize: '7px', fontFamily: '"Press Start 2P"',
        color: '#ffd700', backgroundColor: '#0d0d1a', padding: { x: 2, y: 1 }
      }).setOrigin(0.5).setDepth(6)

      this.coffees.push({ cup, glow, badge, pos, collected: false })
    })
  }

  checkCoffeePickup () {
    this.coffees.forEach((item, i) => {
      if (item.collected) return
      const dist = Phaser.Math.Distance.Between(this.lia.sprite.x, this.lia.sprite.y, item.pos.x, item.pos.y)
      if (dist < 38) {
        item.collected = true
        item.cup.setVisible(false)
        item.glow.setVisible(false)
        item.badge.setVisible(false)
        this.coffeeCollected++
        this.hud.addEnergy(18)
        this.hud.addScore(100)
        sound.coffeePickup()
        floatText(this, item.pos.x, item.pos.y - 12, COFFEE_TEXTS[i], '#ffd700')

        // Karen accelerates with each coffee
        this.karenSpeed = 60 + this.coffeeCollected * 16

        if (this.coffeeCollected < this.coffeeTarget) {
          const left = this.coffeeTarget - this.coffeeCollected
          this.hud.setObjective(`☕ ${this.coffeeCollected}/${this.coffeeTarget} — ${left} MORE! KAREN IS ${this.coffeeCollected > 2 ? 'SPRINTING!' : 'FASTER!'}`)
          floatText(this, this.lia.sprite.x, this.lia.sprite.y - 50,
            `Karen speed: +${this.coffeeCollected * 16} 😱`, '#ff006e')
        } else {
          this.hud.setObjective('🚪 ALL COFFEES! SPRINT TO THE DOOR!')
          sound.signupSheet()
          this.activateDoor()
        }
      }
    })
  }

  // ── Door ─────────────────────────────────────────────────────────────────

  buildDoor () {
    const dx = 735, dy = 300
    this.doorX = dx
    this.doorY = dy

    this.doorBg = this.add.rectangle(dx, dy, 60, 80, 0x1a1a3e).setStrokeStyle(3, 0xff006e).setDepth(4)
    this.doorEmoji = this.add.text(dx, dy - 8, '🚪', { fontSize: '36px' }).setOrigin(0.5).setDepth(5)
    this.lockEmoji = this.add.text(dx, dy + 24, '🔒', { fontSize: '16px' }).setOrigin(0.5).setDepth(6)

    this.doorProgress = this.add.text(dx, dy - 58, '☕ 0/5', {
      fontSize: '7px', fontFamily: '"Press Start 2P"',
      color: '#ff006e', backgroundColor: '#0d0d1a', padding: { x: 3, y: 2 }
    }).setOrigin(0.5).setDepth(7)

    this.doorHint = this.add.text(dx, dy + 52, '[ E ] ENTER', {
      fontSize: '6px', fontFamily: '"Press Start 2P"',
      color: '#39ff14', backgroundColor: '#0d0d1a', padding: { x: 3, y: 2 }
    }).setOrigin(0.5).setDepth(7).setAlpha(0)
  }

  activateDoor () {
    this.doorUnlocked = true
    this.lockEmoji.setText('🔓')
    this.doorBg.setStrokeStyle(3, 0x39ff14)
    this.doorProgress.setText('✅ OPEN!').setColor('#39ff14')

    this.tweens.add({ targets: this.doorBg, scaleX: 1.06, scaleY: 1.06, duration: 380, yoyo: true, repeat: -1 })
    screenFlash(this, 0x39ff14, 0.25)
    floatText(this, this.doorX, this.doorY - 80, '🚪 DOOR UNLOCKED!! RUN!!', '#39ff14')
  }

  checkDoorInteraction () {
    const dist = Phaser.Math.Distance.Between(this.lia.sprite.x, this.lia.sprite.y, this.doorX, this.doorY)

    // Update progress label
    if (!this.doorUnlocked) {
      this.doorProgress.setText(`☕ ${this.coffeeCollected}/5`)
    }

    // Show hint when close and unlocked
    this.doorHint.setAlpha(dist < 85 && this.doorUnlocked ? 1 : 0)

    if (dist < 60 && Phaser.Input.Keyboard.JustDown(this.eKey) && !this.dialogue.isActive()) {
      if (!this.doorUnlocked) {
        // Locked — show hint
        if (!this.doorInteractCooldown) {
          this.doorInteractCooldown = true
          this.playerFrozen = true
          this.dialogue.show(DOOR_LOCKED_TEXT, () => {
            this.playerFrozen = false
            this.time.delayedCall(3000, () => { this.doorInteractCooldown = false })
          })
        }
      } else {
        // Unlocked — chapter complete
        this.playerFrozen = true
        this.hud.addScore(300)
        this.dialogue.show(DOOR_OPEN_TEXT, () => {
          this.cameras.main.fadeOut(700, 0, 0, 0)
          this.time.delayedCall(700, () => {
            this.scene.stop('OfficeScene')
            this.scene.start('HackathonFloorScene', { score: this.hud.getScore() })
          })
        })
      }
    }
  }

  // ── Chapter Banner ────────────────────────────────────────────────────────

  showChapterBanner (title, subtitle) {
    const { width, height } = this.scale
    const bg = this.add.rectangle(width / 2, height / 2, 500, 90, 0x0d0d1a, 0.95)
      .setStrokeStyle(2, 0x39ff14).setDepth(300)
    const t1 = this.add.text(width / 2, height / 2 - 14, title, {
      fontSize: '18px', fontFamily: '"Press Start 2P"', color: '#ffd700'
    }).setOrigin(0.5).setDepth(301)
    const t2 = this.add.text(width / 2, height / 2 + 18, subtitle, {
      fontSize: '11px', fontFamily: '"Press Start 2P"', color: '#39ff14'
    }).setOrigin(0.5).setDepth(301)
    this.time.delayedCall(2200, () => {
      this.tweens.add({ targets: [bg, t1, t2], alpha: 0, duration: 400, onComplete: () => { bg.destroy(); t1.destroy(); t2.destroy() } })
    })
  }

  // ── Update ────────────────────────────────────────────────────────────────

  update (time, delta) {
    if (!this.playerFrozen) {
      this.maki.move(this.lia)
    }
    this.updateKaren(delta)
    this.checkCoffeePickup()
    this.checkDoorInteraction()
  }
}
