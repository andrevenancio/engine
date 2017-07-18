/* eslint-disable */
import { vec3 } from 'gl-matrix';
import Model from '../../core/model';
import Raw from '../../material/raw';
import { getContext } from '../../session';
import { MAX_DIRECTIONAL } from '../../constants';
import { color } from '../../utils';
import { UBO, DIRECTIONAL, FOG } from '../../renderer/chunks';

class DirectionalHelper extends Model {

    constructor(props) {
        const geometry = {
            positions: [],
        };

        const size = 25;

        geometry.positions.push(-size, size, 0); // 0
        geometry.positions.push(size, size, 0); // 1

        geometry.positions.push(size, size, 0); // 1
        geometry.positions.push(size, -size, 0); // 2

        geometry.positions.push(size, -size, 0); // 2
        geometry.positions.push(-size, -size, 0); // 3

        geometry.positions.push(-size, -size, 0); // 3
        geometry.positions.push(-size, size, 0); // 0

        geometry.positions.push(0, 0, 0);
        geometry.positions.push(0, 0, 0);

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
        this.reference = props.light;
    }

    update() {
        super.update();

        vec3.copy(this.position.data, this.reference.position.data);
        vec3.copy(this.rotation.data, this.reference.rotation.data);
        vec3.copy(this.scale.data, this.reference.scale.data);

        // updata origin
        const origin = vec3.subtract(this.position.data, this.position.data, this.target);
        this.geometry.positions[this.geometry.positions.length - 3] = origin[0];
        this.geometry.positions[this.geometry.positions.length - 2] = origin[1];
        this.geometry.positions[this.geometry.positions.length - 1] = -origin[2];

        this.positionsNeedUpdate = true;
    }

    draw() {
        const gl = getContext();
        gl.drawArrays(gl.LINES, 0, this.geometry.positions.length / 3);
    }

}
export default DirectionalHelper;
