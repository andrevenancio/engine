/* eslint-disable */
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
            vec3 dcolor = vec3(0.0); // or object diffuse
            for (int i = 0; i < MAX_DIRECTIONAL; i++) {
                vec3 inverseLightDirection = directionalLights[i].dlPosition.xyz * vec3(-1.0, -1.0, 1.0);

                vec3 light = vec3(dot(v_normal, normalize(inverseLightDirection)));
                vec3 directionalColor = directionalLights[i].dlColor.rgb * light;
                dcolor += mix(dcolor, directionalColor, directionalLights[i].flIntensity);
            }
            dcolor /= float(MAX_DIRECTIONAL);
            base.rgb = dcolor;
        `;
    },
};

export {
    DIRECTIONAL,
};
