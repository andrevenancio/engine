import { color } from '../utils';
import { FLATSHADING_MATERIAL } from '../constants';
import Material from '../core/material';
import Texture from '../core/texture';

class FlatShading extends Material {

    constructor(props = {}) {
        super();
        this.type = FLATSHADING_MATERIAL;

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
                float iGlobalTime;
            };

            uniform perModel {
                mat4 modelMatrix;
                mat4 normalMatrix;
            };

            in vec3 a_position;
            in vec3 a_normal;
            in vec2 a_uv;

            out vec3 fragVertexEc;
            out vec2 v_uv;

            void main() {
                vec4 position = projectionMatrix * viewMatrix * modelMatrix * vec4(a_position, 1.0);
                gl_Position = position;

                fragVertexEc = position.xyz;
                v_uv = a_uv;
            }
        `;

        this.fragment = `#version 300 es
            precision highp float;
            precision highp int;

            uniform perModel {
                mat4 modelMatrix;
                mat4 normalMatrix;
            };

            uniform vec3 color;
            uniform sampler2D map;

            in vec3 fragVertexEc;
            in vec2 v_uv;

            out vec4 outColor;

            void main() {
                vec3 normal = normalize(cross(dFdx(fragVertexEc), dFdy(fragVertexEc)));

                vec4 base = vec4(0.0, 0.0, 0.0, 1.0);
                base += texture(map, v_uv);

                outColor = base;
            }
        `;
    }

}

export default FlatShading;