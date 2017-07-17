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
            vec3 dcolor = vec3(0.0);
            for (int i = 0; i < MAX_DIRECTIONAL; i++) {
                vec3 inverseLightDirection = normalize(directionalLights[i].dlPosition.xyz * vec3(-1.0, -1.0, 1.0));

                vec3 light = vec3(max(dot(v_normal, inverseLightDirection), 0.0));
                vec3 directionalColor = directionalLights[i].dlColor.rgb * light;
                dcolor += mix(dcolor, directionalColor, directionalLights[i].flIntensity);
            }
            dcolor /= float(MAX_DIRECTIONAL);
            base.rgb *= dcolor;
        `;
    },
};

const POINT = {
    before: () => {
        return '';
    },

    main: () => {
        return '';
    },
};

export {
    DIRECTIONAL,
    POINT,
};
