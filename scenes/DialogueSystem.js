/**
 * DialogueSystem.js
 * Reusable typewriter dialogue box for all scenes.
 * Usage:
 *   this.dialogue = new DialogueSystem(scene)
 *   this.dialogue.show([{ speaker, text, color }], onComplete)
 *   this.dialogue.update()  ← call in scene update
 */

import { sound } from './SoundManager.js'

const COLORS = {
  neonGreen: '#39ff14',
  neonBlue: '#00f5ff',
  neonPink: '#ff006e',
  yellow: '#ffd700',
  white: '#ffffff',
  darkBg: 0x0d0d1a,
  panelBg: 0x111122
}

export class DialogueSystem {
  constructor (scene) {
    this.scene = scene
    this.active = false
    this.queue = []
    this.currentIndex = 0
    this.onComplete = null
    this.typeTimer = null
    this.charIndex = 0
    this.currentText = ''
    this.fullText = ''
    this.typeSpeed = 28 // ms per character

    const { width, height } = scene.scale
    this.buildUI(width, height)
  }

  buildUI (w, h) {
    const boxH = 130
    const boxY = h - boxH - 12
    const boxX = 60
    const boxW = w - 120

    // Background panel
    this.bg = this.scene.add.graphics()
    this.bg.fillStyle(COLORS.panelBg, 0.95)
    this.bg.fillRoundedRect(boxX, boxY, boxW, boxH, 8)
    this.bg.lineStyle(2, 0x39ff14, 1)
    this.bg.strokeRoundedRect(boxX, boxY, boxW, boxH, 8)
    this.bg.setDepth(100).setVisible(false)

    // Portrait area
    this.portrait = this.scene.add.text(boxX + 20, boxY + 20, '🤖', {
      fontSize: '36px'
    }).setDepth(101).setVisible(false)

    // Speaker name tag
    this.speakerTag = this.scene.add.text(boxX + 70, boxY + 14, '', {
      fontSize: '9px',
      fontFamily: '"Press Start 2P"',
      color: COLORS.neonGreen,
      backgroundColor: '#0d0d1a',
      padding: { x: 6, y: 3 }
    }).setDepth(101).setVisible(false)

    // Dialogue text
    this.textObj = this.scene.add.text(boxX + 70, boxY + 40, '', {
      fontSize: '10px',
      fontFamily: '"Press Start 2P"',
      color: COLORS.white,
      wordWrap: { width: boxW - 90 },
      lineSpacing: 8
    }).setDepth(101).setVisible(false)

    // Continue prompt
    this.prompt = this.scene.add.text(boxX + boxW - 30, boxY + boxH - 20, '▼', {
      fontSize: '10px',
      fontFamily: '"Press Start 2P"',
      color: COLORS.yellow
    }).setDepth(101).setVisible(false)

    this.scene.tweens.add({
      targets: this.prompt,
      y: this.prompt.y + 4,
      duration: 400,
      yoyo: true,
      repeat: -1
    })

    // Keyboard listener
    this.scene.input.keyboard.on('keydown-E', () => this.advance())
    this.scene.input.keyboard.on('keydown-ENTER', () => this.advance())
    this.scene.input.on('pointerdown', () => this.advance())
  }

  show (lines, onComplete) {
    this.queue = lines
    this.currentIndex = 0
    this.onComplete = onComplete
    this.active = true
    this.showLine(0)
  }

  showLine (index) {
    if (index >= this.queue.length) {
      this.hide()
      if (this.onComplete) this.onComplete()
      return
    }

    const line = this.queue[index]
    this.fullText = line.text
    this.currentText = ''
    this.charIndex = 0
    this.typing = true
    this.prompt.setVisible(false)

    // Set portrait & speaker
    this.portrait.setText(line.emoji || '💬').setVisible(true)
    this.speakerTag.setText(line.speaker || '???').setVisible(true)
    this.speakerTag.setColor(line.color || COLORS.neonGreen)
    this.textObj.setText('').setVisible(true)
    this.bg.setVisible(true)

    // Typewriter
    if (this.typeTimer) this.typeTimer.destroy()
    this._blipCounter = 0
    this.typeTimer = this.scene.time.addEvent({
      delay: this.typeSpeed,
      repeat: this.fullText.length - 1,
      callback: () => {
        this.currentText += this.fullText[this.charIndex]
        this.charIndex++
        this.textObj.setText(this.currentText)
        // Play blip every 2 characters (avoid spamming on spaces)
        this._blipCounter++
        const ch = this.fullText[this.charIndex - 1]
        if (this._blipCounter % 2 === 0 && ch !== ' ') sound.dialogueBlip()
        if (this.charIndex >= this.fullText.length) {
          this.typing = false
          this.prompt.setVisible(true)
        }
      }
    })
  }

  advance () {
    if (!this.active) return
    if (this.typing) {
      // Skip typewriter — show full text immediately
      if (this.typeTimer) this.typeTimer.destroy()
      this.textObj.setText(this.fullText)
      this.typing = false
      this.prompt.setVisible(true)
      sound.menuCursor()
    } else {
      sound.menuConfirm()
      this.currentIndex++
      this.showLine(this.currentIndex)
    }
  }

  hide () {
    this.active = false
    this.bg.setVisible(false)
    this.portrait.setVisible(false)
    this.speakerTag.setVisible(false)
    this.textObj.setVisible(false)
    this.prompt.setVisible(false)
  }

  isActive () {
    return this.active
  }
}

/**
 * HUD - top bar with score, energy, objectives
 */
export class HUD {
  constructor (scene, config = {}) {
    this.scene = scene
    this.energy = config.maxEnergy || 100
    this.maxEnergy = config.maxEnergy || 100
    this.score = 0
    this.objective = config.objective || ''

    const { width } = scene.scale
    this.buildUI(width, config)
  }

  buildUI (w, config) {
    // Top bar background
    this.bar = this.scene.add.graphics()
    this.bar.fillStyle(0x0d0d1a, 0.9)
    this.bar.fillRect(0, 0, w, 40)
    this.bar.lineStyle(1, 0x39ff14, 0.6)
    this.bar.lineBetween(0, 40, w, 40)
    this.bar.setDepth(90)

    // Energy label
    this.scene.add.text(12, 12, '⚡ ENERGY:', {
      fontSize: '8px',
      fontFamily: '"Press Start 2P"',
      color: '#ffd700'
    }).setDepth(91)

    // Energy bar background
    this.energyBarBg = this.scene.add.graphics()
    this.energyBarBg.fillStyle(0x222233)
    this.energyBarBg.fillRect(110, 14, 120, 12)
    this.energyBarBg.setDepth(91)

    // Energy bar fill
    this.energyBar = this.scene.add.graphics()
    this.energyBar.setDepth(92)
    this.updateEnergyBar()

    // Score
    this.scoreText = this.scene.add.text(260, 12, `SCORE: ${this.score}`, {
      fontSize: '8px',
      fontFamily: '"Press Start 2P"',
      color: '#00f5ff'
    }).setDepth(91)

    // Chapter / objective
    this.objectiveText = this.scene.add.text(w / 2, 12, this.objective, {
      fontSize: '7px',
      fontFamily: '"Press Start 2P"',
      color: '#39ff14'
    }).setOrigin(0.5, 0).setDepth(91)

    // Keys hint
    this.scene.add.text(w - 12, 12, 'ARROWS:MOVE  E:TALK', {
      fontSize: '6px',
      fontFamily: '"Press Start 2P"',
      color: '#4a4a6a'
    }).setOrigin(1, 0).setDepth(91)
  }

  updateEnergyBar () {
    this.energyBar.clear()
    const pct = Math.max(0, this.energy / this.maxEnergy)
    const color = pct > 0.5 ? 0x39ff14 : pct > 0.25 ? 0xffd700 : 0xff006e
    this.energyBar.fillStyle(color)
    this.energyBar.fillRect(110, 14, 120 * pct, 12)
  }

  addEnergy (amount) {
    this.energy = Math.min(this.maxEnergy, this.energy + amount)
    this.updateEnergyBar()
  }

  drainEnergy (amount) {
    this.energy = Math.max(0, this.energy - amount)
    this.updateEnergyBar()
    return this.energy <= 0
  }

  addScore (amount) {
    this.score += amount
    this.scoreText.setText(`SCORE: ${this.score}`)
  }

  setObjective (text) {
    this.objectiveText.setText(text)
  }

  getEnergy () { return this.energy }
  getScore () { return this.score }
}

/**
 * Floating popup text (like "+10 ☕")
 */
export function floatText (scene, x, y, text, color = '#39ff14') {
  const t = scene.add.text(x, y, text, {
    fontSize: '11px',
    fontFamily: '"Press Start 2P"',
    color,
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5).setDepth(200)

  scene.tweens.add({
    targets: t,
    y: y - 50,
    alpha: 0,
    duration: 900,
    ease: 'Cubic.easeOut',
    onComplete: () => t.destroy()
  })
}

/**
 * Screen flash effect
 */
export function screenFlash (scene, color = 0xff0000, alpha = 0.4) {
  const { width, height } = scene.scale
  const flash = scene.add.rectangle(width / 2, height / 2, width, height, color, alpha)
    .setDepth(500)
  scene.tweens.add({
    targets: flash,
    alpha: 0,
    duration: 300,
    onComplete: () => flash.destroy()
  })
}
