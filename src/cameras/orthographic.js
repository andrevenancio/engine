import { vec3, mat4 } from 'gl-matrix';
import Object3 from '../core/object3';

class OrthographicCamera extends Object3 {

    constructor(options) {
        super();

        Object.assign(this, {
            near: 0.1,
            far: 100,
            z: 99,
        }, options);

        this.target = vec3.create();
        this.up = vec3.fromValues(0, 1, 0);
        this.projectionMatrix = mat4.create();
    }

    lookAt(v) {
        vec3.copy(this.target, v);
    }

    updateCameraMatrix() {
        mat4.ortho(
            this.projectionMatrix,
            -1.0,
            1.0,
            -1.0,
            1.0,
            this.near,
            this.far,
        );
    }

}

export default OrthographicCamera;
