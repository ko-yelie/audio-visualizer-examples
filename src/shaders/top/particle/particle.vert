precision highp float;
precision highp int;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute float start;

uniform float uProgress;
uniform vec2 resolution;
uniform float pixelRatio;
uniform float size;
uniform float delay;
uniform float maxX;
uniform float maxY;

varying float vProgress;
varying float vRandom;

#pragma glslify: ease = require(glsl-easings/cubic-in)

void main () {
  float progress = max(uProgress - start * delay, 0.);

  float startX = ease(start) * resolution.x - resolution.x / 2.;
  float maxPosX = resolution.x * maxX;
  vec3 startPosition = vec3(startX, 0., 0.);

  vec3 maxPos = vec3(resolution.x, resolution.y * maxY, min(resolution.x, resolution.y) * 0.5);
  vec3 nextPosition = position * maxPos - maxPos / 2.;
  nextPosition.x = startX + position.x * maxPosX - maxPosX / 2.;

  // vec3 currentPosition = mix(startPosition, nextPosition, ease(progress));
  vec3 currentPosition = mix(startPosition, nextPosition, progress);
  // vec3 currentPosition = mix(startPosition, nextPosition, 0.1);

  vProgress = progress;
  vRandom = start;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(currentPosition, 1.);
  gl_PointSize = nextPosition.z * size * pixelRatio;
}
