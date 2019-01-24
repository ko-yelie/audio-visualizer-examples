import * as THREE from 'three'

import {
  animate,
  easingList
} from './modules/animation'
import store from './store'
import {
  EASE,
  TEXT_DELAY
} from './constant'

import vertexShader from '../shaders/top/particle/particle.vert'
import fragmentShader from '../shaders/top/particle/particle.frag'

const data = {
  visible: {
    value: true
  },
  duration: {
    value: 3400,
    range: [0, 5000]
  },
  easing: {
    value: EASE,
    range: [easingList]
  }
}

const uniformData = {
  size: {
    type: '1f',
    value: 0.1,
    range: [0, 1]
  },
  delay: {
    type: '1f',
    value: 0.5,
    range: [0, 10]
  },
  maxX: {
    type: '1f',
    value: 0.5
  },
  maxY: {
    type: '1f',
    value: 0.5
  }
}
const DATA_KEYS = Object.keys(uniformData)

const COUNT = 1000
const DELAY = TEXT_DELAY

export default class Particle {
  constructor () {
    const { root, controller, clientWidth, clientHeight } = store

    const folder = controller.addFolder('Text Particle')
    this.datData = controller.addData(data, { folder })

    const uniforms = {
      uProgress: {
        value: 0
      },
      resolution: {
        value: new THREE.Vector2(clientWidth, clientHeight)
      },
      pixelRatio: {
        value: root.renderer.getPixelRatio()
      }
    }

    this.datUniformData = controller.addUniformData(uniformData, uniforms, { folder })

    const geometry = new THREE.BufferGeometry()
    const positions = []
    const start = []
    for (let i = 0; i < COUNT; i++) {
      positions.push(Math.random(), Math.random(), Math.random())
      start.push(i / COUNT)
    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.addAttribute('start', new THREE.Float32BufferAttribute(start, 1))

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
    mesh.visible = this.datData.visible
    // mesh.position.setZ(0.1)

    root.add(mesh)
  }

  change () {
    this.material.uniforms['uProgress'].value = 0
    setTimeout(() => {
      animate(progress => { this.update(progress) }, {
        duration: this.datData.duration + this.datUniformData.delay,
        easing: this.datData.easing
      })
    }, DELAY)
  }

  update (progress) {
    this.material.uniforms['uProgress'].value = progress

    this.mesh.visible = this.datData.visible
    DATA_KEYS.forEach(key => {
      this.material.uniforms[key].value = this.datUniformData[key]
    })
  }
}
