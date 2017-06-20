import { BASIC_MATERIAL } from '../constants';
import Material from '../core/material';

import { color } from '../utils';

class Basic extends Material {

    constructor(props) {
        super({
            uniforms: {
                color: {
                    type: 'vec3',
                    value: color.convert(props && props.color || 0xffffff),
                },
            },
        });
        this.type = BASIC_MATERIAL;

        this.vertex = `#version 300 es

            uniform perScene {
                mat4 projection;
                mat4 view;
            };

            uniform perModel {
                mat4 model;
                mat4 normal;
            };

            in vec3 a_position;
            in vec3 a_normal;

            out vec3 v_color;

            void main() {
                gl_Position = projection * view * model * vec4(a_position, 1.0);

                vec3 normal = normalize(mat3(normal) * a_normal);

                // directional light
                float weight = max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0);
                v_color = vec3(0.2) + vec3(0.8) * weight; // ambient * directional color
            }
        `;

        this.fragment = `#version 300 es
            precision highp float;
            precision highp int;

            uniform perModel {
                mat4 model;
                mat4 normal;
            };

            uniform vec3 color;

            in vec3 v_color;

            out vec4 outColor;

            void main() {
                outColor = vec4(color * v_color, 1.0);
            }
        `;
    }

}

export default Basic;
