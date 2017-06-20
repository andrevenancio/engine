import { BASIC_MATERIAL } from '../constants';
import { color } from '../utils';
import Material from '../core/material';
import Texture from '../core/texture';

class Basic extends Material {

    constructor(props) {
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
                mat4 projection;
                mat4 view;
            };

            uniform perModel {
                mat4 model;
                mat4 normal;
            };

            in vec3 a_position;
            in vec3 a_normal;
            in vec2 a_uv;

            out vec3 v_color;
            out vec2 v_uv;

            void main() {
                gl_Position = projection * view * model * vec4(a_position, 1.0);
                v_uv = a_uv;

                vec3 normal = normalize(mat3(normal) * a_normal);

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
            uniform sampler2D map;

            in vec3 v_color;
            in vec2 v_uv;

            out vec4 outColor;

            void main() {
                vec4 base = vec4(0.0, 0.0, 0.0, 1.0);
                base += texture(map, v_uv);
                base *= color * v_color
                outColor = base;
            }
        `;
    }

}

export default Basic;
