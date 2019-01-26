import init from './scripts/init'
import Glitch from './scripts/glitch'

init()

const visualizer = new Glitch()

const playButton = document.getElementById('play')
playButton.addEventListener('click', () => {
  playButton.parentNode.removeChild(playButton)

  visualizer.start()
})
