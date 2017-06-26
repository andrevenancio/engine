import { RAW_MATERIAL } from '../constants';
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

            void main() {
                vec4 position = viewMatrix * modelMatrix * vec4(a_position, 1.0);
                gl_Position = projectionMatrix * position;
                v_uv = a_uv;
            }
        `;

        this.fragment = props.fragment || `#version 300 es
            precision highp float;
            precision highp int;

            uniform perModel {
                mat4 modelMatrix;
                mat4 normalMatrix;
            };

            in vec2 v_uv;

            out vec4 outColor;

            void main() {
                outColor = vec4(1.0, 1.0, 0.0, 1.0);
            }
        `;
    }

}

export default Raw;
