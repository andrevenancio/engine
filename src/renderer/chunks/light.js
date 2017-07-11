const DIRECTIONAL = {
    before: () => {
        return `
        struct Directional {
            vec4 dlPosition;
            vec4 dlColor;
            float flIntensity;
        };

        uniform directional {
            Directional directionalLights[MAX_DIRECTIONAL];
        };
        `;
    },

    main: () => {
        return `
        for (int i = 0; i < MAX_DIRECTIONAL; i++) {
            vec3 lightDirection = normalize(directionalLights[i].dlPosition.xyz);

            vec3 light = vec3(dot(v_normal, lightDirection));
            vec3 directionalColor = directionalLights[i].dlColor.rgb * light;
            base.rgb += mix(base.rgb, directionalColor, directionalLights[i].flIntensity);
        }
        `;
    },
};

export {
    DIRECTIONAL,
};
