import { BASIC_MATERIAL } from '../constants';
import Material from '../core/material';
import Texture from '../core/texture';

class Sem extends Material {

    constructor(props) {
        super();
        this.type = BASIC_MATERIAL;

        this.map = new Texture();
        if (props.map) {
            this.map.fromImage(props.map);
        }

        Object.assign(this.uniforms, {
            map: {
                type: 'sampler2D',
                value: this.map.texture,
            },
        });

        this.vertex = `#version 300 es

            uniform perScene {
                mat4 projectionMatrix;
                mat4 viewMatrix;
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

                vec3 v_e = vec3(position);
                vec3 v_n = mat3(normalMatrix) * a_normal;
                vec3 r = reflect(normalize(v_e), normalize(v_n));
                float m = 2.0 * sqrt(pow(r.x, 2.0) + pow(r.y, 2.0) + pow(r.z + 1.0, 2.0));
                v_uv = r.xy / m + 0.5;
            }
        `;

        this.fragment = `#version 300 es
            precision highp float;
            precision highp int;

            uniform perModel {
                mat4 modelMatrix;
                mat4 normalMatrix;
            };

            uniform sampler2D map;

            in vec2 v_uv;

            out vec4 outColor;

            void main() {
                vec4 base = vec4(0.0, 0.0, 0.0, 1.0);
                base += texture(map, v_uv);
                outColor = base;
            }
        `;
    }

}

export default Sem;
