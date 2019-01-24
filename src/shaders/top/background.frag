uniform sampler2D inMap;
uniform sampler2D outMap;
uniform float uProgress;
uniform vec2 resolution;
uniform vec2 imageResolution;

// uniform float speed;
uniform float minZoom;
uniform float maxZoom;
uniform float noiseK;
uniform float uvNoiseK;
uniform float colorNoiseK;
uniform bool onlyNoiseStrength;

varying vec2 vUv;

// #pragma glslify: ease = require(glsl-easings/cubic-out)
#pragma glslify: adjustRatio = require(../modules/ratio.glsl)
#pragma glslify: melt = require(../modules/melt.glsl)

const float MAX_SNOISE = 0.708;

vec4 getColor (sampler2D map, float zoom, float progress, vec2 uv) {
  float zoomScale = 1. / zoom;
  uv = uv * zoomScale + (1. - zoomScale) / 2.;

  float noise = length(melt(uv, progress));
  noise = mix((1. - noise) * noiseK, 0., progress);

  uv = uv + noise * uvNoiseK;

  vec4 color;
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) {
    color = vec4(0.);
  } else {
    color = texture2D(map, uv);
  }

  color.rgb += abs(noise) * colorNoiseK;

  return onlyNoiseStrength ? vec4(vec3(noise), 1.) : color;
}

void main(){
  vec2 cUv = adjustRatio(vUv, imageResolution, resolution);
  // float cProgress = uProgress * speed;
  float cProgress = uProgress;
  // cProgress = min(cProgress, 1.);
  // cProgress = ease(cProgress);

  vec2 fadeUv = adjustRatio(vUv, vec2(1.), resolution);
  vec2 p = fadeUv * 2. - 1.;
  float fade = min(cProgress * 2.5 - length(p * 1.), 1.);

  float inZoom = mix(minZoom, 1., cProgress);
  vec4 inColor = getColor(inMap, inZoom, cProgress, cUv);
  inColor.a *= fade;

  float outZoom = mix(1., maxZoom, cProgress);
  vec4 outColor = getColor(outMap, outZoom, cProgress, cUv);
  outColor.a *= 1. - fade;

  gl_FragColor = inColor * cProgress + outColor * (1. - cProgress);
  // gl_FragColor = vec4(vec3(fade), 1.);
}
