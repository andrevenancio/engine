import { vec3 } from 'gl-matrix';
import Model from '../core/model';
import Basic from '../material/basic';
import { GL_LINES } from '../session';

class NormalHelper extends Model {
    constructor(props) {
        const geometry = {
            positions: [],
            indices: [],
        };

        // extract geometry
        const sx = props.model.scale.x;
        const sy = props.model.scale.y;
        const sz = props.model.scale.z;

        const length = props.model.geometry.normals.length / 3;
        for (let i = 0; i < length; i++) {
            const i3 = i * 3;
            const v0x = sx * props.model.geometry.positions[i3 + 0];
            const v0y = sy * props.model.geometry.positions[i3 + 1];
            const v0z = sz * props.model.geometry.positions[i3 + 2];
            const nx = props.model.geometry.normals[i3 + 0];
            const ny = props.model.geometry.normals[i3 + 1];
            const nz = props.model.geometry.normals[i3 + 2];
            const v1x = v0x + (props.size * nx);
            const v1y = v0y + (props.size * ny);
            const v1z = v0z + (props.size * nz);
            geometry.positions = geometry.positions.concat([v0x, v0y, v0z, v1x, v1y, v1z]);
        }

        const material = new Basic({ color: (props && props.color) || 0xffffff });
        super(geometry, material);
        this.reference = props.model;
        this.material.glMode = GL_LINES;
    }

    update() {
        super.update();

        vec3.copy(this.position.data, this.reference.position.data);
        vec3.copy(this.rotation.data, this.reference.rotation.data);
        this.lookToTarget = this.reference.lookToTarget;
    }
}

export default NormalHelper;
