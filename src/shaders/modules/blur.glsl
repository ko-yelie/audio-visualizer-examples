#pragma glslify: random3 = require(./random_3d.glsl)

// const float blurPrecision = 30.;
const float blurPrecision = 8.;

vec4 triangleBlur(sampler2D texture, vec2 uv, vec2 delta) {
  vec4 color = vec4(0.0);
  float total = 0.0;

  /* randomize the lookup values to hide the fixed number of samples */
  float offset = random3(vec3(12.9898, 78.233, 151.7182));

  for (float t = -blurPrecision; t <= blurPrecision; t++) {
    float percent = (t + offset - 0.5) / blurPrecision;
    float weight = 1.0 - abs(percent);
    vec4 sample = texture2D(texture, uv + delta * percent);

    /* switch to pre-multiplied alpha to correctly blur transparent images */
    sample.rgb *= sample.a;

    color += sample * weight;
    total += weight;
  }

  color = color / total;

  /* switch back from pre-multiplied alpha */
  color.rgb /= color.a + 0.00001;

  return color;
}

#pragma glslify: export(blur)
