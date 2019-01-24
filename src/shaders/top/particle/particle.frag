precision highp float;
precision highp int;

uniform float uProgress;

varying float vProgress;
varying float vRandom;

#pragma glslify: ease = require(glsl-easings/sine-in)

void main(){
	vec2 p = gl_PointCoord.st * 2. - 1.;
	float len = length(p);
	float light = smoothstep(0., 1., 0.08 / len);
	// float light = max(1. - len, 0.);
  float alpha = light * smoothstep(0., 0.1, vProgress) * (1. - ease(uProgress));
	gl_FragColor = vec4(vec3(1.) * mix(0.5, 1., vRandom), alpha);
	// gl_FragColor = vec4(vec3(1.), 1.);
}
