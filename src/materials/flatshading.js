import { FLATSHADING_MATERIAL } from '../constants';
import Material from '../core/material';

import { color } from '../utils';

class FlatShading extends Material {

    constructor(props) {
        super();
        this.type = FLATSHADING_MATERIAL;

        Object.assign(this.uniforms, {
            color: {
                type: 'vec3',
                value: color.convert(props && props.color || 0xffffff),
            },
        });

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

            out vec3 fragVertexEc;

            void main() {
                vec4 position = projection * view * model * vec4(a_position, 1.0);
                gl_Position = position;

                vec3 normal = normalize(mat3(normal) * a_normal);
                fragVertexEc = position.xyz;
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

            in vec3 fragVertexEc;

            out vec4 outColor;

            void main() {
                vec3 normal = normalize(cross(dFdx(fragVertexEc), dFdy(fragVertexEc)));

                float weight = max(pow(dot(normal, vec3(0.0, 0.0, 1.0)), 3.5), 0.0);
                vec3 c = vec3(0.2) + (color * vec3(0.8)) * weight;
                outColor = vec4(c, 1.0);
            }
        `;
    }

}

export default FlatShading;
