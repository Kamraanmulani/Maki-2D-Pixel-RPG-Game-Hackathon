/**
 * IntroScene.js
 * The animated title screen + story intro for The Office Hackathon
 * Uses Phaser directly (no Maki map needed — pure UI scene)
 */

import Phaser from 'phaser'
import { sound } from './SoundManager.js'

const COLORS = {
  neonGreen: 0x39ff14,
  neonBlue: 0x00f5ff,
  neonPink: 0xff006e,
  darkBg: 0x0d0d1a,
  panelBg: 0x1a1a2e,
  yellow: 0xffd700,
  white: 0xffffff,
  dimGray: 0x4a4a6a
}

const STORY_SLIDES = [
  {
    emoji: '🌅',
    title: 'MONDAY MORNING.',
    lines: [
      'You are DEV.',
      'Intern. Scapegoat. Coffee runner.',
      'At MegaCorp Inc. — where dreams come',
      'to file quarterly reports and die.'
    ]
  },
  {
    emoji: '📣',
    title: 'THE ANNOUNCEMENT.',
    lines: [
      'Your boss Bob just sent a calendar invite.',
      'Subject: "EXCITING NEWS (mandatory)"',
      '"MegaCorp Annual Hackathon!"',
      '"Winner gets to leave early on Friday."'
    ]
  },
  {
    emoji: '😨',
    title: 'THE STAKES.',
    lines: [
      'The loser does ALL code reviews.',
      'For EVERYONE.',
      'For a MONTH.',
      'You cannot afford to lose.'
    ]
  },
  {
    emoji: '⚔️',
    title: 'YOUR ENEMIES.',
    lines: [
      'KAREN from HR — "Do you have a minute?"',
      'CHAD — "I could build that in React Native"',
      'BOB — "Let\'s circle back on that"',
      'And the dreaded... MONDAY STANDUP.'
    ]
  },
  {
    emoji: '💪',
    title: 'YOUR MISSION.',
    lines: [
      'Survive the office.',
      'Debug the hackathon floor.',
      'Beat the Monday Standup boss.',
      'Ship it. And walk out that door.'
    ]
  }
]

export default class IntroScene extends Phaser.Scene {
  constructor () {
    super('IntroScene')
    this.slideIndex = 0
    this.canAdvance = false
    this.typing = false
  }

  create () {
    const { width, height } = this.scale

    // ── Background ──────────────────────────────────────────
    this.add.rectangle(0, 0, width, height, COLORS.darkBg).setOrigin(0)

    // Pixel grid dots
    for (let x = 0; x < width; x += 32) {
      for (let y = 0; y < height; y += 32) {
        this.add.circle(x, y, 1, COLORS.dimGray, 0.3)
      }
    }

    // ── Title Screen ────────────────────────────────────────
    this.titleContainer = this.add.container(0, 0)
    this.storyContainer = this.add.container(0, 0)
    this.storyContainer.setVisible(false)

    this.buildTitleScreen(width, height)
    this.buildStoryScreen(width, height)

    // ── Input ────────────────────────────────────────────────
    this.input.keyboard.on('keydown-ENTER', () => this.handleAdvance())
    this.input.keyboard.on('keydown-SPACE', () => this.handleAdvance())
    this.input.on('pointerdown', () => this.handleAdvance())
    this.input.setDefaultCursor('pointer')

    // Init audio on first interaction (browser autoplay policy)
    this.input.once('pointerdown', () => sound.init())
    this.input.keyboard.once('keydown', () => sound.init())
  }

  buildTitleScreen (w, h) {
    const c = this.titleContainer

    // Glow panel
    const panel = this.add.rectangle(w / 2, h / 2, 600, 400, COLORS.panelBg)
    panel.setStrokeStyle(2, COLORS.neonGreen)
    c.add(panel)

    // Title text
    const t1 = this.add.text(w / 2, 120, 'THE OFFICE', {
      fontSize: '36px',
      fontFamily: '"Press Start 2P"',
      color: '#39ff14',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)

    const t2 = this.add.text(w / 2, 175, 'HACKATHON', {
      fontSize: '36px',
      fontFamily: '"Press Start 2P"',
      color: '#00f5ff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)

    // Emoji graphic
    const emoji = this.add.text(w / 2, 260, '🏢💻', {
      fontSize: '56px'
    }).setOrigin(0.5)

    this.tweens.add({
      targets: emoji,
      y: 250,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    const sub = this.add.text(w / 2, 340, 'A TALE OF CORPORATE SURVIVAL', {
      fontSize: '8px',
      fontFamily: '"Press Start 2P"',
      color: '#ffd700'
    }).setOrigin(0.5)

    // Blinking prompt
    this.startPrompt = this.add.text(w / 2, 410, '▶  PRESS ENTER TO CLOCK IN  ◀', {
      fontSize: '9px',
      fontFamily: '"Press Start 2P"',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.tweens.add({
      targets: this.startPrompt,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1
    })

    // Version
    const ver = this.add.text(w - 8, h - 8, 'v1.0.0 — MAKI ENGINE', {
      fontSize: '6px',
      fontFamily: '"Press Start 2P"',
      color: '#4a4a6a'
    }).setOrigin(1, 1)

    c.add([t1, t2, emoji, sub, this.startPrompt, ver])

    // Scanline effect
    const scanlines = this.add.graphics()
    for (let y = 0; y < h; y += 4) {
      scanlines.lineStyle(1, 0x000000, 0.1)
      scanlines.lineBetween(0, y, w, y)
    }
    c.add(scanlines)

    this.canAdvance = true
    this.showingTitle = true
  }

  buildStoryScreen (w, h) {
    const c = this.storyContainer

    // Panel bg
    this.storyPanel = this.add.rectangle(w / 2, h / 2, 680, 420, COLORS.panelBg)
    this.storyPanel.setStrokeStyle(2, COLORS.neonBlue)
    c.add(this.storyPanel)

    // Chapter indicator
    this.chapterText = this.add.text(w / 2, 100, '', {
      fontSize: '9px',
      fontFamily: '"Press Start 2P"',
      color: '#ffd700'
    }).setOrigin(0.5)
    c.add(this.chapterText)

    // Big emoji
    this.slideEmoji = this.add.text(w / 2, 190, '', {
      fontSize: '52px'
    }).setOrigin(0.5)
    c.add(this.slideEmoji)

    // Title
    this.slideTitleText = this.add.text(w / 2, 270, '', {
      fontSize: '14px',
      fontFamily: '"Press Start 2P"',
      color: '#39ff14',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5)
    c.add(this.slideTitleText)

    // Story lines
    this.storyLines = []
    for (let i = 0; i < 4; i++) {
      const line = this.add.text(w / 2, 320 + i * 26, '', {
        fontSize: '9px',
        fontFamily: '"Press Start 2P"',
        color: '#c0c0c0',
        wordWrap: { width: 620 },
        align: 'center'
      }).setOrigin(0.5).setAlpha(0)
      this.storyLines.push(line)
      c.add(line)
    }

    // Progress dots
    this.dots = []
    const dotStartX = w / 2 - (STORY_SLIDES.length - 1) * 12
    for (let i = 0; i < STORY_SLIDES.length; i++) {
      const dot = this.add.circle(dotStartX + i * 24, h - 60, 5, COLORS.dimGray)
      this.dots.push(dot)
      c.add(dot)
    }

    // Prompt
    this.storyPrompt = this.add.text(w / 2, h - 35, '▶  NEXT  ◀', {
      fontSize: '8px',
      fontFamily: '"Press Start 2P"',
      color: '#ffffff'
    }).setOrigin(0.5)
    c.add(this.storyPrompt)

    this.tweens.add({
      targets: this.storyPrompt,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1
    })
  }

  handleAdvance () {
    if (!this.canAdvance) return

    if (this.showingTitle) {
      // Switch to story slides
      sound.menuConfirm()
      this.showingTitle = false
      this.titleContainer.setVisible(false)
      this.storyContainer.setVisible(true)
      this.showSlide(0)
      return
    }

    // In story mode
    if (this.slideIndex < STORY_SLIDES.length - 1) {
      sound.slideAdvance()
      this.slideIndex++
      this.showSlide(this.slideIndex)
    } else {
      // All slides done — clock in!
      sound.menuConfirm()
      this.cameras.main.fadeOut(500, 0, 0, 0)
      this.time.delayedCall(500, () => {
        this.scene.start('OfficeScene')
      })
    }
  }

  showSlide (index) {
    this.canAdvance = false
    const slide = STORY_SLIDES[index]
    const w = this.scale.width

    // Chapter banner sound
    sound.chapterBanner()

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.setFillStyle(i === index ? COLORS.neonBlue : COLORS.dimGray)
    })

    // Slide in new content
    this.storyPanel.setStrokeStyle(2, index % 2 === 0 ? COLORS.neonBlue : COLORS.neonGreen)

    this.chapterText.setText(`— CHAPTER ${index + 1} OF ${STORY_SLIDES.length} —`)

    this.slideEmoji.setText(slide.emoji).setAlpha(0)
    this.tweens.add({
      targets: this.slideEmoji,
      alpha: 1,
      y: 190,
      duration: 300,
      ease: 'Back.easeOut'
    })

    this.slideTitleText.setText(slide.title).setAlpha(0)
    this.tweens.add({
      targets: this.slideTitleText,
      alpha: 1,
      duration: 400,
      delay: 150
    })

    // Reveal story lines one by one
    this.storyLines.forEach((line, i) => {
      line.setText('').setAlpha(0)
    })

    slide.lines.forEach((lineText, i) => {
      this.time.delayedCall(400 + i * 220, () => {
        this.storyLines[i].setText(lineText)
        this.tweens.add({
          targets: this.storyLines[i],
          alpha: 1,
          y: 320 + i * 26,
          duration: 300
        })
        if (i === slide.lines.length - 1) {
          this.time.delayedCall(200, () => {
            this.canAdvance = true
            this.storyPrompt.setText(
              index === STORY_SLIDES.length - 1
                ? '▶  CLOCK IN — PRESS ENTER  ◀'
                : '▶  NEXT  ◀'
            )
          })
        }
      })
    })
  }
}
