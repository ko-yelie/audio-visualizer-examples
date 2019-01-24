import * as THREE from 'three'

import THREERoot from './scripts/modules/THREERoot'
import Controller from './scripts/modules/datGUI-utils'
import Wave3d from './scripts/3d-wave'
import store from './scripts/store'

const canvas = document.getElementById('canvas')
const container = document.body

const controller = new Controller({
  closed: true
})
store.controller = controller

const initialClientWidth = store.initialClientWidth = container.clientWidth
const initialClientHeight = store.initialClientHeight = container.clientHeight
// store.initialRatio = container.clientWidth / container.clientHeight
store.initialRatio = 1

const root = store.root = new THREERoot({
  isDev: true,
  container,
  fov: 75,
  zFar: 10000,
  cameraPosition: [0, 25, 1000],
  // clearColor: 0xffffff,
  aspect: window.innerWidth / window.innerHeight,
  canvas,
  alpha: true
})

function setSize () {
  const clientWidth = store.clientWidth = root.canvas.clientWidth
  const clientHeight = store.clientHeight = root.canvas.clientHeight
  store.clientHalfWidth = clientWidth / 2
  store.clientHalfHeight = clientHeight / 2
  store.resolution = new THREE.Vector2(clientWidth, clientHeight)
  store.ratio = clientWidth / clientHeight
}

setSize()
root.addResizeCallback(() => {
  setSize()
})

let pointerRateY = root.camera.position.y
let lookAtY = 0

root.addUpdateCallback(timestamp => {
  lookAtY += ((root.scene.position.y - pointerRateY * 5) - lookAtY) * 0.05
  root.camera.position.y += (pointerRateY - root.camera.position.y) * 0.05
  root.camera.lookAt(root.scene.position.x, lookAtY, root.camera.position.z - 1000)
})

window.addEventListener('pointermove', ({ clientY }) => {
  pointerRateY = (-(clientY - store.clientHalfHeight) / store.clientHalfHeight) * store.clientHeight * 0.06
})

const wave3d = new Wave3d()
