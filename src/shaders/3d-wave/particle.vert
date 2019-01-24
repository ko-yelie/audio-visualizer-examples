attribute float scale;

uniform float cameraZ;

varying float vColor;
varying float vAlpha;
varying vec3 vPosition;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // mvPosition.y = pow(mvPosition.y, 2.);
  float cScale = mix(0.2, 1., scale);

  vAlpha = pow(position.z / cameraZ, 1.5);
  vColor = mix(1., 1.8, pow(cScale, 2.));
  vPosition = position;

  gl_PointSize = mix(0.35, 14., pow(cScale, 7.)) * mix(0., 1., vAlpha) * ( 300.0 / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}
