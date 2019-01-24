precision highp float;
precision highp int;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute float volume;

uniform float maxSize;
uniform float sizePow;

varying float vVolume;

void main () {
  vVolume = volume;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(vec3(0.), 1.);
  gl_PointSize = pow(volume, sizePow) * maxSize;
  // gl_PointSize = 10.;
}
