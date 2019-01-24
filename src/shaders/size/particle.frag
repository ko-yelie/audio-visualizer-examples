precision highp float;
precision highp int;

uniform float blur;
uniform float minAlpha;

varying float vVolume;

#pragma glslify: random = require(glsl-random)
#pragma glslify: diffEase = require(glsl-easings/quadratic-in)
#pragma glslify: spreadEase = require(glsl-easings/sine-out)

const vec3 color = vec3(170., 133., 88.) / 255.;

void main(){
	vec2 p = gl_PointCoord.st * 2. - 1.;

	float len = length(p);
  float shape = smoothstep(1., blur, len);

  float alpha = mix(minAlpha, 1., vVolume);

	gl_FragColor = vec4(color, shape * alpha);
	// gl_FragColor = vec4(1.);
}
