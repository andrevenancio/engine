function base() {
    return `
    float fogStart = fogSettings.x;
    float fogEnd = fogSettings.y;
    float fogDensity = fogSettings.z;

    float dist = 0.0;
    float fogFactor = 0.0;
    dist = gl_FragCoord.z / gl_FragCoord.w;`;
};

export function linear() {
    return `${base()}

    fogFactor = (fogEnd - dist) / (fogEnd - fogStart);
    fogFactor = clamp(fogFactor, 0.0, 1.0);
    outColor = mix(fogColor, outColor, fogFactor);`;
};

export function exponential() {
    return `${base()}
    fogFactor = 1.0 / exp(dist * fogDensity);
    fogFactor = clamp(fogFactor, 0.0, 1.0);
    outColor = mix(fogColor, outColor, fogFactor);`;
};

export function exponential2() {
    return `${base()}
    fogFactor = 1.0 /exp( (dist * fogDensity) * (dist * fogDensity) );
    fogFactor = clamp(fogFactor, 0.0, 1.0);
    outColor = mix(fogColor, outColor, fogFactor);`;
};
