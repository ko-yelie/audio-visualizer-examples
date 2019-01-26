import * as THREE from 'three'

// import './modules/three/original/postprocessing/BloomPass'
import store from './store'
import Media from './modules/media'
import { loadTexture } from './modules/three-utils'

import vertexShader from '../shaders/glitch/particle.vert'
import fragmentShader from '../shaders/glitch/particle.frag'

// const data = {
//   volumePow: {
//     value: 3,
//     range: [0, 5]
//   }
// }

const uniformData = {
  // maxSize: {
  //   type: '1f',
  //   value: 256,
  //   range: [0, 256]
  // },
  // sizePow: {
  //   type: '1f',
  //   value: 2,
  //   range: [0, 5]
  // },
  // blur: {
  //   type: '1f',
  //   value: 0.2,
  //   range: [0, 0.99]
  // },
  // minAlpha: {
  //   type: '1f',
  //   value: 0.7
  // }
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
    // this.datData = controller.addData(data, { folder })

    const uniforms = {
      resolution: { value: store.resolution },
      time: { value: 0 },
      map: { value: new THREE.TextureLoader().load(require('../images/john-baker-349282-unsplash.jpg')) },
      volume: { value: 0 }
    }

    this.datUniformData = controller.addUniformData(uniformData, uniforms, { folder })

    const imageHeight = store.clientHeight * 1.2
    const geometry = this.geometry = new THREE.PlaneBufferGeometry(imageHeight / 1642 * 2627, imageHeight)

    const material = this.material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      // transparent: true,
      // depthTest: false,
      // blending: THREE.AdditiveBlending
    })

    const mesh = this.mesh = new THREE.Mesh(geometry, material)
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
  }

  start () {
    this.initMedia().then(() => {
      this.root.addUpdateCallback(timestamp => {
        this.update(timestamp)
      })
    })
  }

  initMedia () {
    const media = this.media = new Media({
      bufferLength: COUNT
    })

    media.setAudio(require('../audio/Sound_Wave.mp3'))
    // media.setAudio(require('../audio/Missions.mp3'))

    // media.setAudio(require('../audio/South_Wind.mp3'))
    // media.setAudio(require('../audio/Funky_Magic.mp3'))
    // media.setAudio(require('../audio/Feather_of_the_Angel.mp3'))
    // media.setAudio(require('../audio/New_Departure.mp3'))
    // media.setAudio(require('../audio/Odd_Forest.mp3'))
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
    this.material.uniforms['time'].value = timestamp
    this.material.uniforms['volume'].value = Math.pow(this.media.getVolume(), 3)

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
