const UBO = {
    scene: () => {
        return `
        uniform perScene {
            mat4 projectionMatrix;
            mat4 viewMatrix;
            vec4 fogSettings;
            vec4 fogColor;
            float iGlobalTime;
        };`;
    },
    model: () => {
        return `
        uniform perModel {
            mat4 modelMatrix;
            mat4 normalMatrix;
        };`;
    },
};

export {
    UBO,
};
