uniform vec3 color;
uniform vec3 colorUnder;

varying float vColor;
varying float vAlpha;
varying vec3 vPosition;

float fill(float l, float d) {
  return smoothstep(0., 0.01, d - l);
}

void main() {
  vec2 p = gl_PointCoord - vec2(0.5, 0.5);

  if (length(p) > 0.475) discard;

  vec3 shadow;
  vec2 p2 = vec2(p.x, -p.y);
  float l = 0.;
  l += fill(length(p2), 1.) * (1.2 - length(p2 - vec2(0.2, 1.)) * .5);
  shadow = vec3(l);

  gl_FragColor = vec4((vPosition.y >= 0. ? color : colorUnder) * vColor * shadow, vAlpha);
}
