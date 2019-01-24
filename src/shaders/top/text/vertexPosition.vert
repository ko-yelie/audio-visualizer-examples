// rotate
transformed = rotateVector(quatFromAxisAngle(axis, angle), transformed);

// scale
transformed.xyz *= 1. - nOffset * mix(1. - maxScale, 1. - minScale, aRandom);

// position
transformed.x += aPosition.x - nOffset * mix(minOffsetX, maxOffsetX, texelCoord.x);
transformed.y += aPosition.y + nOffset * mix(-maxOffsetY, maxOffsetY, aRandom);
transformed.z += aPosition.z + nOffset * mix(minOffsetZ, maxOffsetZ, aRandom);
