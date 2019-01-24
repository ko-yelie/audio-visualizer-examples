vec2 texelCoord = (aPosition.xy + uSize / 2.) / uSize;

float aRandom = aPosition.w;
// float noise = mix(0.8, 1., snoise(texelCoord));
float noise = 1.;
float weight = mix(minWeight, 1., aRandom) * noise;

float delayRateY = uSize.y / uSize.x * delayAngle / 45.;
float maxDelay = delayK / uDuration;
float total = uProgress + maxDelay; // 3.
float currentDelay = (texelCoord.x + (1. - texelCoord.y) * delayRateY) / (1. + delayRateY); // 0. ~ 1.
float progress = total - (currentDelay * maxDelay) / total;
// progress = uProgress;

// offset
float nOffset = 1. - clamp(progress, 0., 1.);

// rotate
vec3 axis = vec3(nOffset * PI2 * aRandom);
float angle = nOffset * weight;
