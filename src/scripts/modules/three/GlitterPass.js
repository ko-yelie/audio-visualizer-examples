import * as THREE from 'three'

import './original/postprocessing/core/ShaderPass'
import vertexShader from '../../../shaders/general/three-plain.vert'

export default class GlitterPass extends THREE.ShaderPass {
  constructor ({ startTime = 0, interval = 0 }) {
    super({
      uniforms: {
        'tDiffuse': { type: 't', value: null },
        'uTime': { type: 'f', value: startTime },
        'uInterval': { type: 'f', value: interval }
      },
      vertexShader,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform float uInterval;
        varying vec2 vUv;
        const float size = 0.031;
        const float halfSize = size * 0.5;
        const float n = size * 4.;
        const float brightness = 700.;
        const float speed = 0.03;
        const float threshold = 0.0008;

        vec4 getMosaicColor (vec2 coord) {
          return texture2D(tDiffuse, coord);
        }
        float lengthN (vec2 v, float n) {
          vec2 tmp = pow(abs(v), vec2(n));
          return pow(tmp.x + tmp.y, size / n);
        }
        float random (vec2 st) {
          return fract(sin(dot(st, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        void main () {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec2 mosaicCoord = floor(vUv / size) * size + halfSize;
          vec4 mosaicColor = getMosaicColor(mosaicCoord);
          vec2 p = mod(vUv, size) - halfSize;
          float time = uTime / 60.;
          time = mod(time, uInterval);
          float mosaicBrightness = mosaicColor.r * mosaicColor.g * mosaicColor.b;
          float isBlink = step(threshold, mosaicBrightness);
          float l = (1. - clamp(lengthN(p, n), 0., 1.)) * isBlink;
          float n = random(mosaicCoord) * 10.;
          float blink = l * brightness * max(sin(uTime * speed + n) - 0.99, 0.);
          gl_FragColor = texel + vec4(vec3(blink), 1.);
        }
      `
    })
  }
}
