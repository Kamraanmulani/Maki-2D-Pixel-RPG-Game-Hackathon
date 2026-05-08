/**
 * SoundManager.js
 * Procedural chiptune sound engine using the Web Audio API.
 * Mimics GBA/SNES-era RPG sound design with oscillators + noise buffers.
 * No audio files needed — 100% synthesized.
 *
 * Usage (singleton):
 *   import { sound } from './SoundManager.js'
 *   sound.coffeePickup()
 */

class SoundManager {
  constructor () {
    this.ctx = null
    this.masterGain = null
    this.enabled = false
    this._ready = false
  }

  // Call once on first user interaction (required by browser autoplay policy)
  init () {
    if (this._ready) return
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.28
      this.masterGain.connect(this.ctx.destination)
      this.enabled = true
      this._ready = true
    } catch (e) {
      console.warn('[SoundManager] Web Audio API not available:', e)
    }
  }

  _resume () {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume()
  }

  // ── Core: single oscillator note ──────────────────────────────────────────
  _note (freq, dur, type = 'square', vol = 0.22, startDelay = 0) {
    if (!this.enabled) return
    this._resume()
    const t = this.ctx.currentTime + startDelay
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.start(t)
    osc.stop(t + dur + 0.01)
  }

  // ── Core: frequency sweep ─────────────────────────────────────────────────
  _sweep (freqFrom, freqTo, dur, type = 'square', vol = 0.2, startDelay = 0) {
    if (!this.enabled) return
    this._resume()
    const t = this.ctx.currentTime + startDelay
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.type = type
    osc.frequency.setValueAtTime(freqFrom, t)
    osc.frequency.exponentialRampToValueAtTime(freqTo, t + dur)
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.start(t)
    osc.stop(t + dur + 0.01)
  }

  // ── Core: white noise burst (for impacts/crunches) ────────────────────────
  _noise (vol = 0.25, dur = 0.1, startDelay = 0) {
    if (!this.enabled) return
    this._resume()
    const t = this.ctx.currentTime + startDelay
    const samples = Math.ceil(this.ctx.sampleRate * dur)
    const buf = this.ctx.createBuffer(1, samples, this.ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < samples; i++) data[i] = Math.random() * 2 - 1
    const src = this.ctx.createBufferSource()
    src.buffer = buf
    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(gain)
    gain.connect(this.masterGain)
    src.start(t)
  }

  // ── Core: arpeggio helper ─────────────────────────────────────────────────
  _arp (notes, stepDur = 0.09, type = 'square', vol = 0.2) {
    notes.forEach((freq, i) => this._note(freq, stepDur * 1.4, type, vol, i * stepDur))
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UI / MENU SOUNDS
  // ═══════════════════════════════════════════════════════════════════════════

  menuCursor () {
    // Short blip — cursor move
    this._note(440, 0.055, 'square', 0.12)
  }

  menuConfirm () {
    // Ascending 3-note confirm
    this._arp([523, 659, 784], 0.08, 'square', 0.18)
  }

  menuBack () {
    this._arp([784, 523, 392], 0.07, 'square', 0.14)
  }

  slideAdvance () {
    // Story slide blip
    this._note(660, 0.06, 'square', 0.15)
    this._note(880, 0.09, 'square', 0.12, 0.07)
  }

  dialogueBlip () {
    // Typewriter character blip — random pitch variance for personality
    const freq = 200 + Math.random() * 160
    this._note(freq, 0.035, 'square', 0.07)
  }

  chapterBanner () {
    // Dramatic 2-note + hold
    this._note(392, 0.12, 'sawtooth', 0.22)
    this._note(523, 0.22, 'square', 0.2, 0.13)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 1 — THE OFFICE
  // ═══════════════════════════════════════════════════════════════════════════

  coffeePickup () {
    // Happy Pokémon-style item pickup arpeggio
    this._arp([523, 659, 784, 1047], 0.09, 'square', 0.2)
  }

  karenAlert () {
    // Descending "uh oh" sweep — ominous
    this._sweep(523, 196, 0.4, 'square', 0.2)
    this._note(147, 0.35, 'sawtooth', 0.15, 0.15)
  }

  meetingTrap () {
    // Heavy bass slam + crunch
    this._noise(0.35, 0.08)
    this._note(110, 0.45, 'sawtooth', 0.35)
    this._note(82, 0.5, 'square', 0.25, 0.08)
  }

  energyDrain () {
    // Short descending sweep
    this._sweep(330, 110, 0.35, 'sawtooth', 0.18)
  }

  signupSheet () {
    // Triumphant fanfare — chapter milestone
    this._arp([523, 659, 784, 1047, 784, 1047], 0.09, 'square', 0.22)
    this._note(1047, 0.35, 'square', 0.2, 0.58)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 2 — HACKATHON FLOOR
  // ═══════════════════════════════════════════════════════════════════════════

  bugSquash () {
    // Satisfying crunch + descend
    this._noise(0.4, 0.07)
    this._sweep(880, 220, 0.18, 'sawtooth', 0.25, 0.04)
    this._note(220, 0.12, 'square', 0.15, 0.1)
  }

  allBugsFixed () {
    // Bonus arp — all bugs done!
    this._arp([262, 330, 392, 523, 659, 784], 0.075, 'square', 0.2)
  }

  wifiPickup () {
    // Digital ascending beeps
    this._arp([440, 660, 880], 0.07, 'sawtooth', 0.18)
  }

  chadSteal () {
    // Annoying descending boing — cartoonish villain
    this._sweep(880, 110, 0.55, 'square', 0.22)
  }

  timerWarning () {
    // Urgent double-beep (fires each second ≤ 30s)
    this._note(880, 0.07, 'square', 0.22)
    this._note(880, 0.07, 'square', 0.2, 0.14)
  }

  timerCritical () {
    // More intense triple-beep for ≤ 10s
    this._note(1108, 0.07, 'square', 0.3)
    this._note(1108, 0.07, 'square', 0.3, 0.12)
    this._note(1108, 0.1, 'square', 0.3, 0.24)
  }

  submitProject () {
    // Big rising victory fanfare — climactic
    this._arp([262, 330, 392, 523, 659, 784, 1047], 0.085, 'square', 0.22)
    this._note(1047, 0.5, 'square', 0.2, 0.65)
  }

  bonusTime () {
    // Second-chance — uplifting blip
    this._arp([392, 523, 659, 784], 0.1, 'square', 0.2)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 3 — BOSS FIGHT
  // ═══════════════════════════════════════════════════════════════════════════

  bossIntro () {
    // Ominous descending tritone — dread
    this._note(220, 0.35, 'sawtooth', 0.3)
    this._note(155, 0.35, 'sawtooth', 0.28, 0.32)
    this._note(110, 0.55, 'square', 0.25, 0.64)
    this._noise(0.15, 0.5, 0.64)
  }

  projectileSpawn () {
    // Short descending whistle — incoming!
    this._sweep(660, 220, 0.25, 'sawtooth', 0.15)
  }

  playerHit () {
    // Impact crunch + low hit tone
    this._noise(0.45, 0.08)
    this._note(196, 0.25, 'square', 0.25, 0.05)
    this._sweep(330, 110, 0.3, 'sawtooth', 0.18, 0.05)
  }

  blockerSlam () {
    // Blocker zone drops — thud
    this._noise(0.3, 0.06)
    this._note(110, 0.3, 'sawtooth', 0.28)
  }

  grenadePickup () {
    // Power-up ascending sweep
    this._sweep(440, 880, 0.22, 'square', 0.2)
    this._note(1047, 0.12, 'square', 0.18, 0.22)
  }

  grenadeThrow () {
    // Ascending whoosh
    this._sweep(330, 1320, 0.28, 'sawtooth', 0.18)
  }

  bossHit () {
    // Hit impact — satisfying crunch
    this._noise(0.45, 0.09)
    this._note(440, 0.1, 'square', 0.3)
    this._note(220, 0.22, 'sawtooth', 0.22, 0.07)
  }

  bossPhase2 () {
    // Alarm-like riff — phase intensifies
    this._arp([440, 554, 440, 554, 659], 0.1, 'square', 0.25)
  }

  bossDefeated () {
    // Full triumphant ascending fanfare
    this._arp([262, 330, 392, 523, 659, 784, 1047], 0.1, 'square', 0.22)
    this._note(784, 0.12, 'square', 0.2, 0.72)
    this._note(1047, 0.6, 'square', 0.22, 0.85)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WIN SCREEN
  // ═══════════════════════════════════════════════════════════════════════════

  victoryJingle () {
    // Full 8-bar victory melody — GBA end-credits style
    const melody = [
      [523, 0.13, 0.0], [523, 0.13, 0.14], [523, 0.13, 0.28],
      [415, 0.42, 0.42], [466, 0.42, 0.85],
      [523, 0.13, 1.28], [466, 0.13, 1.42], [523, 0.55, 1.56]
    ]
    melody.forEach(([freq, dur, delay]) => this._note(freq, dur, 'square', 0.2, delay))

    // Harmony (lower octave)
    const harmony = [
      [262, 0.13, 0.0], [262, 0.13, 0.14], [262, 0.13, 0.28],
      [207, 0.42, 0.42], [233, 0.42, 0.85],
      [262, 0.13, 1.28], [233, 0.13, 1.42], [262, 0.55, 1.56]
    ]
    harmony.forEach(([freq, dur, delay]) => this._note(freq, dur, 'sawtooth', 0.1, delay))
  }

  scoreCount () {
    // Rapid score tick blip
    const freq = 440 + Math.random() * 220
    this._note(freq, 0.03, 'square', 0.08)
  }

  confettiPop () {
    // Sparkle for each confetti particle
    const freq = 880 + Math.random() * 660
    this._note(freq, 0.07, 'sine', 0.07)
  }

  playerDowned () {
    // Knocked down — sad descend
    this._arp([523, 415, 330, 262], 0.1, 'sawtooth', 0.2)
    this._note(196, 0.4, 'square', 0.15, 0.45)
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const sound = new SoundManager()
