/* eslint-disable */
import { color } from '../utils';
import { DEFAULT_MATERIAL, MAX_DIRECTIONAL } from '../constants';
import Material from '../core/material';
import Texture from '../core/texture';
import { UBO, DIRECTIONAL, FOG } from '../renderer/chunks';

class Default extends Material {

    constructor(props = {}) {
        super();
        this.type = DEFAULT_MATERIAL;

        this.map = new Texture();
        if (props.map) {
            this.map.fromImage(props.map);
        }

        Object.assign(this.uniforms, {
            color: {
                type: 'vec3',
                value: color.convert((props && props.color) || 0xffffff),
            },
            map: {
                type: 'sampler2D',
                value: this.map.texture,
            },
        });

        this.vertex = `#version 300 es
${UBO.scene()}
${UBO.model()}

in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;

out vec2 v_uv;
out vec3 v_normal;

void main() {
    vec4 position = projectionMatrix * viewMatrix * modelMatrix * vec4(a_position, 1.0);
    gl_Position = position;

    v_uv = a_uv;
    v_normal = normalize(mat3(normalMatrix) * a_normal);
}
        `;

        this.fragment = `#version 300 es

#define MAX_DIRECTIONAL ${MAX_DIRECTIONAL}

precision highp float;
precision highp int;

${UBO.scene()}
${UBO.model()}

${DIRECTIONAL.before()}

uniform vec3 color;
uniform sampler2D map;

in vec2 v_uv;
in vec3 v_normal;

out vec4 outColor;

void main() {
    vec4 base = vec4(0.0, 0.0, 0.0, 1.0);
    base += texture(map, v_uv);
    base += vec4(color, 1.0);

    ${DIRECTIONAL.main()}
    ${FOG.linear()}

    outColor = base;
}
        `;
    }
}

export default Default;
