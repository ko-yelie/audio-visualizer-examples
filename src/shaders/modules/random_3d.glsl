float random3(vec3 scale) {
  /* use the fragment position for a different seed per-pixel */
  return fract(sin(dot(gl_FragCoord.xyz, scale)) * 43758.5453);
}

#pragma glslify: export(random3)
