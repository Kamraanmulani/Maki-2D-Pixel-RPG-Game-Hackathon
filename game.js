import Phaser from 'phaser'
import OfficeScene from './scenes/OfficeScene.js'
import HackathonFloorScene from './scenes/HackathonFloorScene.js'
import EscapeScene from './scenes/EscapeScene.js'
import IntroScene from './scenes/IntroScene.js'
import WinScene from './scenes/WinScene.js'

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [IntroScene, OfficeScene, HackathonFloorScene, EscapeScene, WinScene]
}

new Phaser.Game(config)
