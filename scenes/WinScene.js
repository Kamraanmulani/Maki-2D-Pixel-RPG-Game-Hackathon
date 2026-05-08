/**
 * WinScene.js — YOU SHIPPED IT. YOU'RE FREE.
 * Animated win screen with score, fake credits, and a restart option.
 */

import Phaser from 'phaser'
import { sound } from './SoundManager.js'

const COLORS = {
  neonGreen: '#39ff14',
  neonBlue: '#00f5ff',
  neonPink: '#ff006e',
  yellow: '#ffd700',
  white: '#ffffff',
  dark: 0x0d0d1a,
  panel: 0x111122
}

const CREDITS = [
  { role: 'STARRING', name: 'DEV — The Intern' },
  { role: 'ALSO STARRING', name: 'CHAD — "I\'ll build it in Rust"' },
  { role: 'SPECIAL APPEARANCE', name: 'KAREN — HR Department' },
  { role: 'VILLAIN', name: 'BOB — Circle-Back Manager' },
  { role: 'FINAL BOSS', name: 'MONDAY MORNING STANDUP' },
  { role: 'ENEMIES', name: '🐛 5 Production Bugs (now squashed)' },
  { role: 'POWER-UPS', name: '☕ Coffee (the real MVP)' },
  { role: 'RUNTIME', name: '~15 minutes of corporate trauma' },
  { role: 'MADE WITH', name: 'Maki Framework 🎮' },
  { role: 'SUBMITTED TO', name: 'MegaCorp Hackathon 2026' },
  { role: 'RESULT', name: '🏆 YOU SHIPPED IT. YOU WIN.' }
]

const ENDING_TEXT = [
  '"You walk out the door at 3pm on Friday.',
  'The sun is warm. The air smells like freedom.',
  'Your laptop bag weighs nothing.',
  'Chad is still in a standup. He will always be in a standup.',
  'You check Slack. You close Slack.',
  'You are free."'
]

export default class WinScene extends Phaser.Scene {
  constructor () {
    super('WinScene')
  }

  init (data) {
    this.finalScore = data?.score || 0
  }

  create () {
    const { width, height } = this.scale

    // ── Background ────────────────────────────────────────────
    this.add.rectangle(0, 0, width, height, COLORS.dark).setOrigin(0)

    // Stars
    for (let i = 0; i < 80; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(0.2, 0.8)
      )
      this.tweens.add({
        targets: star,
        alpha: 0,
        duration: Phaser.Math.Between(800, 2000),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 1500)
      })
    }

    // ── Main content ──────────────────────────────────────────
    this.buildWinScreen(width, height)

    // ── Victory jingle ────────────────────────────────────────
    this.time.delayedCall(400, () => sound.victoryJingle())

    // ── Input ─────────────────────────────────────────────────
    this.input.keyboard.on('keydown-R', () => this.restart())
    this.input.keyboard.on('keydown-ENTER', () => this.restart())
  }

  buildWinScreen (w, h) {
    // Big win banner
    const banner = this.add.rectangle(w / 2, 90, w - 40, 120, 0x001100)
      .setStrokeStyle(3, 0x39ff14)

    this.add.text(w / 2, 55, '🏆 YOU SHIPPED IT! 🏆', {
      fontSize: '20px',
      fontFamily: '"Press Start 2P"',
      color: COLORS.yellow,
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5)

    this.add.text(w / 2, 95, 'YOU\'RE FREE.', {
      fontSize: '28px',
      fontFamily: '"Press Start 2P"',
      color: COLORS.neonGreen,
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5)

    this.add.text(w / 2, 132, 'EARLY FRIDAY PASS UNLOCKED', {
      fontSize: '9px',
      fontFamily: '"Press Start 2P"',
      color: COLORS.neonBlue
    }).setOrigin(0.5)

    // Score
    const scorePanelY = 185
    this.add.rectangle(w / 2, scorePanelY, 340, 50, 0x001133)
      .setStrokeStyle(2, 0x00f5ff)

    this.add.text(w / 2 - 60, scorePanelY - 8, 'FINAL SCORE:', {
      fontSize: '8px', fontFamily: '"Press Start 2P"', color: COLORS.neonBlue
    }).setOrigin(0, 0.5)

    const scoreNum = this.add.text(w / 2 + 90, scorePanelY - 8, '0', {
      fontSize: '14px', fontFamily: '"Press Start 2P"', color: COLORS.yellow
    }).setOrigin(1, 0.5)

    // Animate score counting up
    let displayed = 0
    const countTimer = this.time.addEvent({
      delay: 30,
      repeat: 60,
      callback: () => {
        displayed = Math.min(this.finalScore, displayed + Math.ceil(this.finalScore / 60))
        scoreNum.setText(String(displayed))
        sound.scoreCount()
      }
    })

    // Rank
    const rank = this.finalScore >= 1500 ? 'S — LEGEND ⭐⭐⭐'
      : this.finalScore >= 1000 ? 'A — SHIPPED IT ⭐⭐'
      : this.finalScore >= 600 ? 'B — SURVIVED ⭐'
      : 'C — AT LEAST YOU DIDN\'T DO ALL THE CODE REVIEWS'

    this.add.text(w / 2, scorePanelY + 14, `RANK: ${rank}`, {
      fontSize: '6px', fontFamily: '"Press Start 2P"',
      color: this.finalScore >= 1500 ? COLORS.yellow : COLORS.neonBlue
    }).setOrigin(0.5)

    // ── Ending narrative ────────────────────────────────────────
    let yOff = 230
    ENDING_TEXT.forEach((line, i) => {
      const t = this.add.text(w / 2, yOff + i * 20, line, {
        fontSize: '7px',
        fontFamily: '"Press Start 2P"',
        color: '#aaaaaa',
        wordWrap: { width: w - 60 },
        align: 'center'
      }).setOrigin(0.5).setAlpha(0)

      this.time.delayedCall(1200 + i * 350, () => {
        this.tweens.add({ targets: t, alpha: 1, duration: 400 })
      })
    })

    // ── Scrolling credits ───────────────────────────────────────
    const creditsY = 380
    this.add.rectangle(w / 2, creditsY + 80, w - 40, 160, 0x110011, 0.8)
      .setStrokeStyle(1, 0x4a0066)

    this.add.text(w / 2, creditsY, '— C R E D I T S —', {
      fontSize: '8px', fontFamily: '"Press Start 2P"', color: '#9900cc'
    }).setOrigin(0.5)

    CREDITS.forEach((c, i) => {
      const row = this.add.container(0, 0)
      const roleText = this.add.text(w / 2 - 10, creditsY + 20 + i * 16, c.role, {
        fontSize: '6px', fontFamily: '"Press Start 2P"', color: '#666688'
      }).setOrigin(1, 0.5)
      const nameText = this.add.text(w / 2 + 10, creditsY + 20 + i * 16, c.name, {
        fontSize: '6px', fontFamily: '"Press Start 2P"', color: '#cccccc'
      }).setOrigin(0, 0.5)

      this.time.delayedCall(3000 + i * 200, () => {
        this.tweens.add({ targets: [roleText, nameText], alpha: 1, duration: 300 })
      })
    })

    // ── Restart prompt ──────────────────────────────────────────
    const prompt = this.add.text(w / 2, h - 22, '▶  PRESS R TO CLOCK IN AGAIN  ◀', {
      fontSize: '8px', fontFamily: '"Press Start 2P"', color: COLORS.white
    }).setOrigin(0.5)

    this.tweens.add({ targets: prompt, alpha: 0, duration: 700, yoyo: true, repeat: -1 })

    // ── Particle confetti ──────────────────────────────────────
    this.time.delayedCall(800, () => {
      for (let i = 0; i < 30; i++) {
        this.time.delayedCall(i * 80, () => {
          const confetti = this.add.text(
            Phaser.Math.Between(0, w),
            -20,
            ['🎉', '🎊', '⭐', '🏆', '🎮', '💻'][Phaser.Math.Between(0, 5)],
            { fontSize: '20px' }
          ).setOrigin(0.5)

          this.tweens.add({
            targets: confetti,
            y: h + 40,
            x: confetti.x + Phaser.Math.Between(-80, 80),
            angle: Phaser.Math.Between(-360, 360),
            duration: Phaser.Math.Between(2000, 3500),
            onComplete: () => confetti.destroy()
          })
          sound.confettiPop()
        })
      }
    })
  }

  restart () {
    this.cameras.main.fadeOut(500, 0, 0, 0)
    this.time.delayedCall(500, () => {
      this.scene.stop('WinScene')
      this.scene.start('IntroScene')
    })
  }
}
