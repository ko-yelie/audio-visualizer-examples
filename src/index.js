import init from './scripts/init'
import ShootingStar from './scripts/shooting-star'

init()

const visualizer = new ShootingStar()

const playButton = document.getElementById('play')
playButton.addEventListener('click', () => {
  playButton.parentNode.removeChild(playButton)

  visualizer.start()
})
