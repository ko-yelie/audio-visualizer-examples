// scale
transformed.xy *= scale;

// rotate
transformed = rotateVector(quatFromAxisAngle(axis, angle), transformed);

// position
// transformed.x += aPosition.x;
// transformed.x += aPosition.x * 0.3 + random * resolution.x * 0.02 + mix(startingPoint.x, endingPoint.x, nProgress) - sin(nProgress * PI2) * resolution.xy * 0.05;
// transformed.x += aPosition.x * spreadX + plusMinusRandom * maxOffset;
transformed.x += aPosition.x * spreadX;

// transformed.y += aPosition.y * spreadY + aRandom.y * 2. - 1. * maxOffset;
transformed.y += aPosition.y * spreadY;
// transformed.y += aPosition.y + random * resolution.y * 0.02 + mix(startingPoint.y, endingPoint.y, nProgress);

transformed.xy += random * resolution.xy * 0.02 + mix(startingPoint.xy, endingPoint.xy, nProgress) - sin(nProgress * PI2) * resolution.xy * 0.05;

// transformed.z += aPosition.z + mix(startingPoint.z, endingPoint.z, nProgress) + sin(nProgress * PI2) * resolution.x * 0.01;
transformed.z += aPosition.z;
