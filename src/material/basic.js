import { BASIC_MATERIAL, MAX_DIRECTIONAL } from '../constants';
import { color } from '../utils';
import Material from '../core/material';
import Texture from '../core/texture';
import { linear } from '../renderer/chunks/fog';
import { directional } from '../renderer/chunks/light';

class Basic extends Material {

    constructor(props = {}) {
        super();
        this.type = BASIC_MATERIAL;

        this.map = new Texture();
        if (props.map) {
            this.map.fromImage(props.map);
        }

        Object.assign(this.uniforms, {
            color: {
                type: 'vec3',
                value: color.convert(props && props.color || 0xffffff),
            },
            map: {
                type: 'sampler2D',
                value: this.map.texture,
            },
        });

        this.vertex = `#version 300 es
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
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(a_position, 1.0);
    v_uv = a_uv;
    v_normal = normalize(mat3(normalMatrix) * a_normal);
}
`;

        this.fragment = `#version 300 es

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

uniform vec3 color;
uniform sampler2D map;

in vec2 v_uv;
in vec3 v_normal;

out vec4 outColor;

float whenGreaterThan(float x, float y) {
    return max(sign(x - y), 0.0);
}

void main() {
    vec4 base = vec4(0.0, 0.0, 0.0, 1.0);
    base += texture(map, v_uv);
    base += vec4(color, 1.0); // color
    ${directional()}
    ${linear()}
    outColor = base;
}`;
    }

}

export default Basic;
