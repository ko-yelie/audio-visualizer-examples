vec2 texelCoord = (aPosition.xy + uSize / 2.) / uSize;
// vec4 texel = texture2D(map, texelCoord);

float random = aRandom.x;
float plusMinusRandom = random * 2. - 1.;
// float noise = mix(0.8, 1., snoise(texelCoord));
float noise = 1.;

float time = uTime * speed + aRandom.y * maxSpeed;
float progress = min(max(time - maxDelay * random, 0.), duration);
float nProgress = progress / duration;
nProgress = easeBackInOut(nProgress);

// offset
float nOffset = nProgress;

float posRandom = mix(0.7, 1., random);
vec3 startingPoint = vec3(-resolution.x * 0.3 * posRandom, resolution.y * 0.3 * posRandom, 0.);
vec3 endingPoint = vec3(resolution.x * 0.3 * posRandom, -resolution.y * 0.3 * posRandom, 0.);

// rotate
vec3 axis = normalize(aRandom * 2. - 1.);
float angle = uTime * rotateSpeed * mix(0.5, 1., random);

// scale
float scale = mix(minScale, maxScale, random);
