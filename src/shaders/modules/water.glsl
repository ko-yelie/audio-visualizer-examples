const float MAX_ITER = 4.;
const float INTEN = 0.05;

float water(vec2 uv, float time) {
  vec2 p = uv * 8. - vec2(20.);
  vec2 i;
  float t;
  vec2 bc;
  float c = 1.;

  for (float n = 0.; n < MAX_ITER; n++) {
    t = time * 0.5 * (2. - (3. / (n + 1.)));

    i = p + vec2(
      cos(t - i.x) + sin(t + i.y),
      sin(t - i.y) + cos(t + i.x)
    );

    bc = vec2(
      (sin(i.x + t) / INTEN),
      (cos(i.y + t) / INTEN)
    );

    c += 1.0 / length(p / bc);
  }

  c /= float(MAX_ITER);
  c = 1.5 - sqrt(c);

  return c;
}

#pragma glslify: export(water)
