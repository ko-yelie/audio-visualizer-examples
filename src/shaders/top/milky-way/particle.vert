precision highp float;
precision highp int;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 mouse;
attribute vec2 aFront;
attribute float random;

// uniform float uProgress;
uniform vec2 resolution;
uniform float pixelRatio;
uniform float timestamp;
uniform float volume;

uniform float size;
// uniform float delay;
uniform float speed;
uniform float far;
uniform float radius;
uniform float maxRadius;
uniform float spreadZ;
uniform float maxDiff;
uniform float diffPow;

varying float vProgress;
varying float vRandom;
varying float vDiff;
varying float vSpreadLength;

#pragma glslify: ease = require(glsl-easings/cubic-out)
// #pragma glslify: cubicBezier = require(../../modules/cubicBezier.glsl)

const float PI = 3.1415926;
const float PI2 = PI * 2.;

vec2 cartesianToPolar (vec2 p) {
  return vec2((atan(p.y, p.x) + PI) / PI2, length(p));
}

vec2 polarToCartesian (vec2 p) {
  float r = p.x * PI2 - PI;
  float l = p.y;
  return vec2(cos(r) * l, sin(r) * l);
}

void main () {
  // float progress = max(uProgress - random * delay, 0.);
  float progress = clamp((timestamp - mouse.z) * speed * mix(1., 2., pow(volume, 0.5)), 0., 1.);
  progress *= step(0., mouse.x);

  float startX = mouse.x - resolution.x / 2.;
  float startY = mouse.y - resolution.y / 2.;
  vec3 startPosition = vec3(startX, startY, random);

  float diff = clamp(mouse.w / maxDiff, 0., 1.);
  diff = pow(diff, diffPow);

  vec3 cPosition = position * 2. - 1.;

  float radian = cPosition.x * PI2 - PI;
  vec2 xySpread = vec2(cos(radian), sin(radian)) * radius * mix(0.5, 1., pow(volume, 0.7) * 1.2) * mix(1., maxRadius, diff) * cPosition.y;

  vec3 endPosition = startPosition;
  endPosition.xy += xySpread;
  endPosition.xy -= aFront * far * random;
  endPosition.z += cPosition.z * spreadZ;

  float positionProgress = ease(progress * random);
  // float positionProgress = cubicBezier(.29, .16, .3, 1., progress);
  vec3 currentPosition = mix(startPosition, endPosition, positionProgress);

  vProgress = progress;
  vRandom = random;
  vDiff = diff;
  vSpreadLength = cPosition.y;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(currentPosition, 1.);
  gl_PointSize = currentPosition.z * size * mix(0.1, 1., pow(volume, 0.25)) * mix(1., 1.5, pow(volume, 4.)) * pixelRatio;
}
