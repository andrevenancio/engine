import { vec3 } from 'gl-matrix';
import Model from '../core/model';
import Raw from '../material/raw';
import { getContext } from '../session';
import { MAX_DIRECTIONAL } from '../constants';
import { color } from '../utils';
import { UBO, DIRECTIONAL, FOG } from '../renderer/chunks';

class NormalHelper extends Model {

    constructor(props) {
        const geometry = {
            positions: [],
        };

        // extract geometry
        const sx = props.model.scale.x;
        const sy = props.model.scale.y;
        const sz = props.model.scale.z;

        const length = props.model.geometry.normals.length / 3;
        for (let i = 0; i < length; i += 1) {
            const i3 = i * 3;
            const v0x = sx * props.model.geometry.positions[i3 + 0];
            const v0y = sy * props.model.geometry.positions[i3 + 1];
            const v0z = sz * props.model.geometry.positions[i3 + 2];
            const nx = props.model.geometry.normals[i3 + 0];
            const ny = props.model.geometry.normals[i3 + 1];
            const nz = props.model.geometry.normals[i3 + 2];
            const v1x = v0x + props.size * nx;
            const v1y = v0y + props.size * ny;
            const v1z = v0z + props.size * nz;
            geometry.positions = geometry.positions.concat([v0x, v0y, v0z, v1x, v1y, v1z]);
        }

        const material = new Raw({
            uniforms: {
                color: {
                    type: 'vec3',
                    value: color.convert(props && props.color || 0xffffff),
                },
            },
            fragment: `#version 300 es
                #define MAX_DIRECTIONAL ${MAX_DIRECTIONAL}

                precision highp float;
                precision highp int;

                ${UBO.scene()}
                ${UBO.model()}

                ${DIRECTIONAL.before()}

                uniform vec3 color;

                in vec2 v_uv;
                in vec3 v_normal;

                out vec4 outColor;

                void main() {
                    vec4 base = vec4(color, 1.0);

                    ${FOG.linear()}

                    outColor = base;
                }`,
        });
        super(geometry, material);
        this.reference = props.model;
    }

    update() {
        super.update();

        vec3.copy(this.position.data, this.reference.position.data);
        vec3.copy(this.rotation.data, this.reference.rotation.data);
        vec3.copy(this.scale.data, this.reference.scale.data);
    }

    draw() {
        const gl = getContext();
        gl.drawArrays(gl.LINES, 0, this.geometry.positions.length / 3);
    }

}
export default NormalHelper;
