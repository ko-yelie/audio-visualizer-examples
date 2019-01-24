precision highp float;
uniform sampler2D texture;
uniform float time;
uniform vec2 resolution;
uniform vec2 imageResolution;
varying vec2 vUv;
varying vec2 vPosition;

uniform bool auto;
uniform bool onlyColor;
uniform float zoom;
uniform float frame;
uniform float timeK;
uniform float radius;
uniform float startX;
uniform float mixMin;
uniform float smoothstepMin;
uniform float uvXK;
uniform float uvYK;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: random = require(glsl-random)
#pragma glslify: adjustRatio = require(../shaders/modules/ratio.glsl)

const float delay = 0.8;

void main(){
  vec2 uv = adjustRatio(vUv, imageResolution, resolution);
  float zoomScale = 1. / zoom;
  uv = uv * zoomScale + (1. - zoomScale) / 2.;
  vec2 cUv = uv;

  vec4 baseColor;
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) {
    baseColor = vec4(0.);
  } else {
    baseColor = texture2D(texture, uv);
  }

  float cTime = max(time - delay, 0.);
  cTime = -cos(cTime * timeK) * 0.5 + 0.5;
  if (!auto) {
    cTime = frame;
  }
  float rndVal = random(uv + cTime);
  vec2 position = vPosition;
  position.x += mix(startX * radius, 0., cTime) + mix(mixMin, 1., rndVal);
  float dist = radius / length(position);
  dist = smoothstep(smoothstepMin, 1., dist);
  // dist = smoothstep(smoothstepMin, 1., dist) * baseColor.a;
  cUv.x += dist * uvXK * zoomScale;
  // cUv.y += sin(snoise2(vec2(cUv.x) * 0.1) * sin(cTime)) * uvYK;

  vec4 color;
  if (cUv.x < 0. || cUv.x > 1. || cUv.y < 0. || cUv.y > 1.) {
    color = vec4(0.);
  } else {
    color = texture2D(texture, cUv);
  }
  // color.a = 1. - dist;

  gl_FragColor = onlyColor ? vec4(dist) : color;
}
