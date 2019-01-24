import * as THREE from 'three'

import THREERoot from './modules/THREERoot'
import Controller from './modules/datGUI-utils'
import store from './store'
import {
  CAMERA_Z,
  MAX_CAMERA_Z
} from './constant'

export default function init () {
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
    fov: Math.atan(initialClientHeight / 2 / CAMERA_Z) * (180 / Math.PI) * 2,
    zFar: MAX_CAMERA_Z,
    cameraPosition: [0, 0, CAMERA_Z],
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
}
