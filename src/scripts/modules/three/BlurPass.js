import * as THREE from 'three'

import './original/postprocessing/core/ShaderPass'
import vertexShader from '../../../shaders/general/three-plain.vert'
import triangleBlur from '../../../shaders/modules/blur.glsl'

export class BlurPass extends THREE.ShaderPass {
  constructor (delta) {
    super({
      uniforms: {
        'tDiffuse': { type: 't', value: null },
        'delta': { type: '2f', value: delta }
      },
      vertexShader,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 delta;
        varying vec2 vUv;

        ${triangleBlur}

        void main () {
          gl_FragColor = triangleBlur(tDiffuse, vUv, delta);
        }
      `
    })
  }
}

export function getBlur (radius, resolution) {
  const blurX = new BlurPass(new THREE.Vector2(radius / resolution.x, 0))
  blurX.updateRadius = radius => {
    blurX.uniforms.delta.value.x = radius / resolution.x
  }

  const blurY = new BlurPass(new THREE.Vector2(0, radius / resolution.y))
  blurY.updateRadius = radius => {
    blurY.uniforms.delta.value.y = radius / resolution.y
  }

  return {
    x: blurX,
    y: blurY
  }
}
