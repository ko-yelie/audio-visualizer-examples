import * as THREE from 'three'

import { noop } from './utils'

const textureLoader = new THREE.TextureLoader()
// const jsonLoader = new THREE.JSONLoader()
const fontLoader = new THREE.FontLoader()

export function loadTexture (url) {
  return new Promise(resolve => {
    textureLoader.load(url, resolve)
  })
}

// export function loadJSON (url) {
//   return new Promise(resolve => {
//     jsonLoader.load(url, resolve)
//   })
// }

export function loadFont (url, text) {
  return new Promise((resolve, reject) => {
    fontLoader.load(
      url,
      font => {
        const geometry = new THREE.TextGeometry(text, {
          font: font,
          size: 60 / (text.length / 4),
          height: 20,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 1,
          bevelSize: 1,
          bevelSegments: 5
        })
        resolve(geometry)
      },
      noop,
      reject
    )
  })
}
