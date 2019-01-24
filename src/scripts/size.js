import * as THREE from 'three'

// import './modules/three/original/postprocessing/BloomPass'
import store from './store'
import Media from './modules/media'

import vertexShader from '../shaders/size/particle.vert'
import fragmentShader from '../shaders/size/particle.frag'

const data = {
  volumePow: {
    value: 3,
    range: [0, 5]
  }
}

const uniformData = {
  maxSize: {
    type: '1f',
    value: 256,
    range: [0, 256]
  },
  sizePow: {
    type: '1f',
    value: 2.3,
    range: [0, 5]
  },
  blur: {
    type: '1f',
    value: 0.2,
    range: [0, 0.99]
  },
  minAlpha: {
    type: '1f',
    value: 0.7
  }
}
const DATA_KEYS = Object.keys(uniformData)

const COUNT = 32

export default class Size {
  constructor () {
    const { root, controller } = store
    this.root = root

    this.rate = 1
    this.setSize()

    const folder = controller.addFolder('Size')
    this.datData = controller.addData(data, { folder })

    const uniforms = {
    }

    this.datUniformData = controller.addUniformData(uniformData, uniforms, { folder })

    const geometry = this.geometry = new THREE.BufferGeometry()
    const positions = []
    const volumes = []
    const radius = store.clientHalfHeight - 100
    for (let i = 0; i < COUNT; i++) {
      const radian = Math.PI * 2 * i / COUNT + Math.PI * 0.5
      positions.push(Math.cos(radian) * radius, Math.sin(radian) * radius, 0)
      volumes.push(0)
    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.addAttribute('volume', new THREE.Float32BufferAttribute(volumes, 1))
    this.position = geometry.attributes['position']
    this.volume = geometry.attributes['volume']

    const material = this.material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending
    })

    const mesh = this.mesh = new THREE.Points(geometry, material)
    mesh.frustumCulled = false
    // mesh.visible = this.datData.visible

    root.add(mesh)

    // root.initPostProcessing([
    //   new THREE.BloomPass(1.3, 25, 3.1, 256),
    //   new THREE.ShaderPass(THREE.CopyShader)
    // ])

    root.addResizeCallback(() => {
      this.setSize()
    })

    this.startAudio = () => {
      window.removeEventListener('click', this.startAudio)

      this.initMedia().then(() => {
        root.addUpdateCallback(timestamp => {
          this.update(timestamp)
        })
      })
    }
    window.addEventListener('click', this.startAudio)
  }

  initMedia () {
    const media = this.media = new Media({
      bufferLength: COUNT
    })

    // media.setAudio(require('../audio/Funky_Magic.mp3'))
    media.setAudio(require('../audio/Feather_of_the_Angel.mp3'))
    // media.setAudio(require('../audio/New_Departure.mp3'))
    // media.setAudio(require('../audio/Odd_Forest.mp3'))
    // media.setAudio(require('../audio/Missions.mp3'))
    // media.setAudio(require('../audio/apple.mp3'))
    // media.setAudio(require('../audio/グルーヴァー.mp3'))
    return Promise.resolve()

    // return new Promise(resolve => {
    //   media.enumerateDevices().then(() => {
    //     media.getUserMedia().then(() => { resolve() })
    //   })
    // })
  }

  update (timestamp) {
    const volumeArray = this.media.getVolumeArray()

    const volumes = this.volume.array
    for (let i = 0; i < COUNT; i++) {
      const volume = Math.abs(volumeArray[i] / 255 * 2 - 1)
      volumes[i] = volume
    }
    this.volume.needsUpdate = true

    const positions = this.position.array
    const radius = (store.clientHalfHeight - 100) * Math.pow(this.media.getWrongVolume() * 1.1, this.datData.volumePow)
    for (let i = 0; i < COUNT * 3; i += 3) {
      const radian = Math.PI * 2 * i / COUNT + Math.PI * 0.5
      positions[i] = Math.cos(radian) * radius
      positions[i + 1] = Math.sin(radian) * radius
    }
    this.position.needsUpdate = true

    // this.mesh.visible = this.datData.visible
    DATA_KEYS.forEach(key => {
      this.material.uniforms[key].value = this.datUniformData[key]
    })
  }

  setSize () {
    this.rate = Math.min(
      store.ratio > store.initialRatio
        ? store.clientHeight / store.initialClientHeight
        : store.clientWidth / store.initialClientWidth
      , 1)
    this.rate *= 1 / (store.clientHeight / store.initialClientHeight)
  }
}
