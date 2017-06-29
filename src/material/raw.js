import { RAW_MATERIAL, MAX_DIRECTIONAL } from '../constants';
import Material from '../core/material';

class Raw extends Material {

    constructor(props = {}) {
        super();
        this.type = RAW_MATERIAL;

        Object.assign(this.uniforms, props.uniforms);

        this.vertex = props.vertex || `#version 300 es

uniform perScene {
    mat4 projectionMatrix;
    mat4 viewMatrix;
    vec4 fogSettings;
    vec4 fogColor;
    float currentDirectionalLight;
    float currentPointLight;
    float iGlobalTime;
};

uniform perModel {
    mat4 modelMatrix;
    mat4 normalMatrix;
};

in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;

out vec2 v_uv;
out vec3 v_normal;

void main() {
    vec4 position = viewMatrix * modelMatrix * vec4(a_position, 1.0);
    gl_Position = projectionMatrix * position;
    v_uv = a_uv;
    v_normal = normalize(mat3(normalMatrix) * a_normal);
}
        `;

        this.fragment = props.fragment || `#version 300 es

#define MAX_DIRECTIONAL ${MAX_DIRECTIONAL}

precision highp float;
precision highp int;

uniform perScene {
    mat4 projectionMatrix;
    mat4 viewMatrix;
    vec4 fogSettings;
    vec4 fogColor;
    float currentDirectionalLight;
    float currentPointLight;
    float iGlobalTime;
};

uniform perModel {
    mat4 modelMatrix;
    mat4 normalMatrix;
};

struct Directional {
    vec4 dlPosition;
    vec4 dlColor;
    float flIntensity;
};

uniform directional {
    Directional directionalLights[MAX_DIRECTIONAL];
};

in vec2 v_uv;
in vec3 v_normal;

out vec4 outColor;

void main() {
    outColor = vec4(1.0, 1.0, 0.0, 1.0);
}
        `;
    }

}

export default Raw;
