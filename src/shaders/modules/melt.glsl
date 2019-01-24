const float PI = 3.14159;

// const int loop = 50;
const int loop = 10;

float sinApprox(float x) {
    x = PI + (2.0 * PI) * floor(x / (2.0 * PI)) - x;
    return (4.0 / PI) * x - (4.0 / PI / PI) * x * abs(x);
}

float cosApprox(float x) {
    return sinApprox(x + 0.5 * PI);
}

vec3 melt(vec2 uv, float time) {
  for (int i = 1; i < loop; i++) {
    vec2 newp = uv;
    newp.x += 0.6 / float(i) * sin(float(i) * uv.y + time + 0.3 * float(i)) + 1.0;
    newp.y += 0.6 / float(i) * sin(float(i) * uv.x + time + 0.3 * float(i + 10)) - 1.4;
    uv = newp;
  }
  return vec3(0.5 * sin(3.0 * uv.x) + 0.5, 0.5 * sin(3.0 * uv.y) + 0.5, sin(uv.x + uv.y));
}

#pragma glslify: export(melt)
