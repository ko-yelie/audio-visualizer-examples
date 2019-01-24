float cubicBezier(float p1x, float p1y, float p2x, float p2y, float t) {
  vec2 p0 = vec2(0.);
  vec2 p1 = vec2(p1x, p1y);
  vec2 p2 = vec2(p2x, p2y);
  vec2 p3 = vec2(1.);

  vec2 q0 = mix(p0, p1, t);
  vec2 q1 = mix(p1, p2, t);
  vec2 q2 = mix(p2, p3, t);

  vec2 r0 = mix(q0, q1, t);
  vec2 r1 = mix(q1, q2, t);

  return mix(r0, r1, t).y;
}

#pragma glslify: export(cubicBezier)
