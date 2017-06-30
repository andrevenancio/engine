export function directional() {
    return `
    for (int i = 0; i < MAX_DIRECTIONAL; i++) {
        vec3 lightDirection = normalize(directionalLights[i].dlPosition.xyz);

        vec3 light = vec3(dot(v_normal, lightDirection));
        vec3 directionalColor = directionalLights[i].dlColor.rgb * light;
        base.rgb += mix(base.rgb, directionalColor, directionalLights[i].flIntensity);
    }
    `;
};
