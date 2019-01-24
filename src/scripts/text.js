import * as THREE from 'three'
import * as BAS from 'three-bas'

import { getTextCoordinate } from './modules/canvas'
import {
  animate,
  easingList
} from './modules/animation'
import store from './store'
import {
  EASE,
  TEXT_DELAY
} from './constant'
// import './modules/three/ShaderChunk'
import Particle from './text-particle'

import vertexInit from '../shaders/top/text/vertexInit.vert'
import vertexPosition from '../shaders/top/text/vertexPosition.vert'

const TEXT = 'Audio Visualizer'
const FONT_SIZE = 30
const LETTER_SPACING = 0.2
const FONT = 'Georgia, "ヒラギノ明朝 ProN W3", "Hiragino Mincho ProN W3", "游明朝", "Yu Mincho", YuMincho, serif'
const COLOR = '#fff'

const data = {
  play: {
    value: null
  },
  visible: {
    value: true
  },
  duration: {
    value: 2200,
    range: [0, 5000]
  },
  easing: {
    value: EASE,
    range: [easingList]
  }
}

const DELAY = TEXT_DELAY + 300

export default class Text {
  constructor () {
    this.initText()

    this.particle = new Particle()
  }

  initText () {
    const { root, controller } = store

    data['play'].value = () => {
      this.change()
    }
    const folder = controller.addFolder('Text')
    const datData = this.datData = controller.addData(data, { folder })

    const textWidth = FONT_SIZE * TEXT.length + FONT_SIZE * LETTER_SPACING * (TEXT.length - 1)
    const textHeight = FONT_SIZE * 1.2
    const pixelRatio = window.devicePixelRatio
    const textCanvas = getTextCoordinate({
      text: TEXT,
      fontSize: FONT_SIZE,
      height: textHeight,
      letterSpacing: LETTER_SPACING,
      font: FONT,
      color: COLOR,
      pixelRatio
    })
    const width = textCanvas.width / pixelRatio
    const height = textCanvas.height / pixelRatio

    const texture = new THREE.Texture(textCanvas)
    texture.needsUpdate = true
    texture.minFilter = THREE.LinearFilter

    const plane = new THREE.PlaneGeometry(width, height, textWidth * 0.5, textHeight * 0.5)
    BAS.Utils.separateFaces(plane)
    const geometry = new BAS.ModelBufferGeometry(plane, {
      localizeFaces: true,
      computeCentroids: true
    })
    geometry.bufferUVs()

    geometry.createAttribute('aPosition', 4, (data, index) => {
      const centroid = geometry.centroids[index]
      new THREE.Vector4(
        centroid.x,
        centroid.y,
        centroid.z,
        Math.random()
      ).toArray(data)
    })

    const uniforms = {
      uProgress: {
        type: '1f',
        value: 0
      },
      uSize: {
        type: 'vf2',
        value: [width, height]
      }
    }
    uniforms['uDuration'] = data.duration

    const material = this.material = new BAS.BasicAnimationMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      uniforms,
      uniformValues: {
        map: texture
      },
      vertexFunctions: [
        BAS.ShaderChunk['quaternion_rotation']
        // THREE.ShaderChunk['simplex_2d'],
      ],
      vertexParameters: `
        attribute vec4 aPosition;

        uniform float uProgress;
        uniform float uDuration;
        uniform vec2 uSize;

        const float delayK = 2000.;
        const float delayAngle = 45.;
        const float minWeight = 0.6;
        const float minOffsetX = 100.;
        const float maxOffsetX = 2000.;
        const float maxOffsetY = 300.;
        const float minOffsetZ = 0.1;
        const float maxOffsetZ = 4000.;
        const float minScale = 0.2;
        const float maxScale = 0.8;
      `,
      varyingParameters: `
        varying float vAlpha;
      `,
      vertexInit,
      vertexPosition,
      vertexColor: `
        vAlpha = progress * step(1., progress);
      `,
      fragmentDiffuse: `
        diffuseColor.a *= vAlpha;
      `
    })

    const mesh = this.mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = false
    mesh.visible = datData.visible
    mesh.position.setZ(0.1)

    root.add(mesh)
  }

  change () {
    this.material.uniforms['uProgress'].value = 0
    setTimeout(() => {
      animate(progress => { this.update(progress) }, {
        duration: this.datData.duration,
        easing: this.datData.easing
      })
    }, DELAY)

    this.particle.change()
  }

  update (progress) {
    this.material.uniforms['uProgress'].value = progress

    this.mesh.visible = this.datData.visible
    this.material.uniforms['uDuration'].value = this.datData['duration']
  }
}
