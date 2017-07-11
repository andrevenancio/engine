import { RAW_MATERIAL, MAX_DIRECTIONAL } from '../constants';
import Material from '../core/material';
import { UBO, DIRECTIONAL } from '../renderer/chunks';

class Raw extends Material {

    constructor(props = {}) {
        super();
        this.type = RAW_MATERIAL;

        Object.assign(this.uniforms, props.uniforms);

        this.vertex = props.vertex || `#version 300 es
${UBO.scene()}
${UBO.model()}

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

${UBO.scene()}
${UBO.model()}

${DIRECTIONAL.before()}

in vec2 v_uv;
in vec3 v_normal;

out vec4 outColor;

void main() {
    outColor = vec4(v_normal, 1.0);
}
        `;
    }

}

export default Raw;
