precision highp float;
precision highp int;

uniform sampler2D map;
uniform float     time;
uniform vec2      resolution;
uniform float     volume;

varying vec2 vUv;

#pragma glslify: random = require(glsl-random)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

const float divisionPx = 8.;
const float deflection = 0.01;
const float rgbDiff = 0.5;

void main(){
  vec2 cUv = (vUv - 0.5) * mix(0.01, 1.1, 1. - pow(volume, 1.2)) + 0.5;

  float rnd = random(vec2(time));
  float slowSn = step(0.74, snoise2(floor(vec2(0., cUv.y * 2.) * random(vec2(floor(time * 50.))) * 60.)));
  float sn = step(0.5, snoise2(floor(vec2(cUv.x * 0.05, cUv.y * 0.8) * rnd * 100.)));
  float strength = (rnd * 2. - 1.) * (volume * 0.25);

  float yRnd = random(vec2(0., floor(cUv.y * resolution.y / divisionPx)) + mod(time, 10.));
  vec2 uv = vec2(cUv.x + (yRnd * 2. - 1.) * deflection * (strength + rnd * 0.4), cUv.y);

  uv += slowSn * volume * 0.1;
  uv.x += strength * (1. - sn);
  uv.y += strength * 0.5;
  float cRgbDiff = rgbDiff * (strength + rnd * 0.01);
  float r = texture2D(map, vec2(uv.x + cRgbDiff, uv.y)).r;
  float g = texture2D(map, vec2(uv.x, uv.y)).g;
  float b = texture2D(map, vec2(uv.x - cRgbDiff, uv.y)).b;
  vec3 color = vec3(r, g, b);

  vec2 nUv = cUv * 2. - 1.;

  float vignette = 1.5 - length(nUv);
  color *= vignette;

  float scanLine = abs(sin(gl_FragCoord.y + time * 0.8)) * 0.5 + 0.5;
  color *= scanLine;

  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(vec3(slowSn * 0.1), 1.0);
  // gl_FragColor = texture2D(map, vUv);
  // gl_FragColor = vec4(1.0);
}
