precision highp float;
precision highp int;

// uniform float uProgress;
uniform float alphaSpeed;
uniform float maxAlpha;
uniform float volume;

varying float vProgress;
varying float vRandom;
varying float vDiff;
varying float vSpreadLength;

#pragma glslify: random = require(glsl-random)
#pragma glslify: diffEase = require(glsl-easings/quadratic-in)
#pragma glslify: spreadEase = require(glsl-easings/sine-out)

const float w = 0.5;
const vec3 color = vec3(170., 133., 88.) / 255.;

void main(){
	vec2 p = gl_PointCoord.st * 2. - 1.;
	float len = length(p);

  float cRandom = random(vec2(vProgress * 0.001 * vRandom));
  cRandom = mix(0.3, 2., cRandom);

  float cW = w * vRandom;
	float light = smoothstep(1. - cW, 1. + cW, (1. - cW) / len);
  light *= mix(0.5, 1., vRandom);

  float alphaProgress = vProgress * alphaSpeed;
  alphaProgress *= mix(maxAlpha, 1., spreadEase(vSpreadLength) * diffEase(vDiff));
  float alpha = 1. - min(alphaProgress, 1.);
  alpha *= cRandom * mix(0.5, 1., vDiff);

	gl_FragColor = vec4(color * cRandom, light * alpha * mix(0.1, 1., pow(volume, 0.3) * 2.));
	// gl_FragColor = vec4(1.);
}
