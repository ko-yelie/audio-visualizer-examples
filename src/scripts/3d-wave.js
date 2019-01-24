import * as THREE from 'three'

import { downloadFile } from './modules/file'
// import './modules/three/original/postprocessing/BloomPass'
import store from './store'
import Media from './modules/media'

import vertexShader from '../shaders/3d-wave/particle.vert'
import fragmentShader from '../shaders/3d-wave/particle.frag'

const data = {
  visible: {
    value: true
  }
}

const uniformData = {
  size: {
    type: '1f',
    value: 0.05,
    range: [0, 1]
  },
  speed: {
    type: '1f',
    value: 0.012,
    range: [0, 0.05]
  },
  alphaSpeed: {
    type: '1f',
    value: 1.1,
    range: [1, 2]
  },
  maxAlpha: {
    type: '1f',
    value: 1.5,
    range: [1, 5]
  },
  radius: {
    type: '1f',
    value: 6,
    range: [0, 20]
  },
  maxRadius: {
    type: '1f',
    value: 5,
    range: [1, 10]
  },
  spreadZ: {
    type: '1f',
    value: 100,
    range: [0, 500]
  },
  far: {
    type: '1f',
    value: 10,
    range: [0, 100]
  },
  maxDiff: {
    type: '1f',
    value: 100,
    range: [0, 1000]
  },
  diffPow: {
    type: '1f',
    value: 0.24,
    range: [0, 10]
  }
}
const DATA_KEYS = Object.keys(uniformData)

const POINT_RESOLUTION = 512
const SEPARATION = 0.33
const AMOUNTY = 1000
const Z_INTERVAL = 1.5

export default class Wave3d {
  constructor () {
    const { root, controller } = store
    this.root = root

    this.rate = 1
    this.setSize()

    const folder = controller.addFolder('3D Wave')
    this.datData = controller.addData(data, { folder })

    const uniforms = {
      resolution: {
        value: store.resolution
      },
      pixelRatio: {
        value: root.renderer.getPixelRatio()
      },
      timestamp: {
        value: 0
      }
    }

    this.datUniformData = controller.addUniformData(uniformData, uniforms, { folder })

    root.addResizeCallback(() => {
      this.setSize()

      // material.uniforms['resolution'].value = store.resolution
    })

    this.startAudio = () => {
      this.initMedia().then(() => {
        this.initParticle()

        root.addUpdateCallback(timestamp => {
          this.update(timestamp)
        })
      })
    }
    window.addEventListener('click', this.startAudio)
  }

  initMedia () {
    window.removeEventListener('click', this.startAudio)

    const media = this.media = new Media({
      bufferLength: POINT_RESOLUTION
    })

    // media.setAudio(require('../audio/Odd_Forest.mp3'))
    media.setAudio(require('../audio/South_Wind.mp3'))

    // media.setAudio(require('../audio/Funky_Magic.mp3'))
    // media.setAudio(require('../audio/Feather_of_the_Angel.mp3'))
    // media.setAudio(require('../audio/New_Departure.mp3'))
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

  initParticle () {
    this.z = 960

    this.amountX = POINT_RESOLUTION
    const numParticles = this.amountX * AMOUNTY
    const positions = new Float32Array(numParticles * 3)
    const scales = new Float32Array(numParticles)
    // const colors = new Float32Array(numParticles * 3)
    const halfWidth = this.amountX * SEPARATION / 2
    let i = 0
    let j = 0
    for (let iy = 0; iy < AMOUNTY; iy++) {
      for (let ix = 0; ix < this.amountX; ix++) {
        positions[i] = ix * SEPARATION - halfWidth // x
        positions[i + 1] = 0 // y
        positions[i + 2] = this.z // z
        scales[j] = 0
        // colors[i] = colors[i + 1] = colors[i + 2] = 1
        i += 3
        j++
      }
    }
    const geometry = this.geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.addAttribute('scale', new THREE.BufferAttribute(scales, 1))
    // geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    this.position = this.geometry.attributes['position']
    this.scale = this.geometry.attributes['scale']
    // this.color = this.geometry.attributes['color']
    const material = this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x66d9ef) },
        colorUnder: { value: new THREE.Color(0xf92672) },
        cameraZ: { value: this.root.camera.position.z }
      },
      vertexShader,
      fragmentShader
    })
    // const material = this.material = new THREE.LineBasicMaterial({
    //   color: { value: new THREE.Color(0x66d9ef) },
    //   vertexColors: THREE.VertexColors
    // })
    const mesh = this.mesh = new THREE.Points(geometry, material)
    // const mesh = this.mesh = new THREE.Line(geometry, material)
    mesh.frustumCulled = false
    mesh.visible = this.datData.visible

    this.root.add(mesh)

    // this.root.initPostProcessing([
    //   new THREE.BloomPass(1.3, 25, 3.1, 256),
    //   new THREE.ShaderPass(THREE.CopyShader)
    // ])
  }

  update (timestamp) {
    // this.timestamp = timestamp

    // this.mesh.visible = this.datData.visible
    // DATA_KEYS.forEach(key => {
    //   this.material.uniforms[key].value = this.datUniformData[key]
    // })

    this.root.camera.position.z += Z_INTERVAL
    this.material.uniforms['cameraZ'].value = this.root.camera.position.z

    const volumeArray = this.media.getVolumeArray()

    const positions = this.position.array
    const scales = this.scale.array
    // const colors = this.color.array
    const startIndex = this.amountX * (Math.abs(this.z) % AMOUNTY)
    let i = startIndex * 3
    let j = startIndex
    for (let ix = 0; ix < this.amountX; ix++) {
      const volume = volumeArray[ix] / 255 * 2 - 1
      positions[i + 1] = volume * 42 // y
      positions[i + 2] = this.z // z
      scales[j] = Math.abs(volume)
      // colors[i] = colors[i + 1] = colors[i + 2] = volume
      i += 3
      j++
    }

    this.position.needsUpdate = true
    this.scale.needsUpdate = true
    // this.color.needsUpdate = true

    this.z += Z_INTERVAL
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
