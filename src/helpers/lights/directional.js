import { vec3 } from 'gl-matrix';
import Model from '../../core/model';
import Basic from '../../material/basic';
import { GL_LINES } from '../../session';

class DirectionalHelper extends Model {

    constructor(props) {
        const geometry = {
            positions: [],
            indices: [],
        };

        const size = 25;

        geometry.positions.push(-size, size, 0); // 0
        geometry.positions.push(size, size, 0); // 1
        geometry.positions.push(size, -size, 0); // 2
        geometry.positions.push(-size, -size, 0); // 3

        geometry.positions.push(0, 0, 0); // 4
        geometry.positions.push(0, 0, 0); // 5

        geometry.indices.push(0, 1, 1, 2, 2, 3, 3, 0, 4, 5);

        const material = new Basic({ color: 0xffffff });
        super(geometry, material);
        this.reference = props.light;
        this.material.glMode = GL_LINES;
        this.lookToTarget = true;
    }

    update() {
        super.update();

        vec3.copy(this.position.data, this.reference.position.data);
        vec3.copy(this.rotation.data, this.reference.rotation.data);
        vec3.copy(this.scale.data, this.reference.scale.data);

        const origin = vec3.subtract(this.position.data, this.position.data, this.reference.target);
        this.geometry.positions[this.geometry.positions.length - 1] = -vec3.length(origin);

        this.positionsNeedUpdate = true;
    }
}

export default DirectionalHelper;
