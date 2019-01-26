import init from './scripts/init'
import Size from './scripts/size2'

init()

const visualizer = new Size()

const playButton = document.getElementById('play')
playButton.addEventListener('click', () => {
  playButton.parentNode.removeChild(playButton)

  visualizer.start()
})
