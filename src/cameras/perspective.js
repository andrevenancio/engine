import { vec3, mat4 } from 'gl-matrix';
import Object3 from '../core/object3';

class PerspectiveCamera extends Object3 {
    constructor(options = {}) {
        super();

        Object.assign(this, {
            near: 1,
            far: 1000,
            fov: 35,
        });

        Object.assign(this.position, {
            x: 0,
            y: 100,
            z: 500,
            ...options.position,
        });

        this.target = vec3.create();
        this.up = vec3.fromValues(0, 1, 0);
        this.projectionMatrix = mat4.create();
    }

    lookAt(v) {
        vec3.copy(this.target, v);
    }

    updateCameraMatrix(width, height) {
        mat4.perspective(
            this.projectionMatrix,
            this.fov * (Math.PI / 180),
            width / height,
            this.near,
            this.far,
        );
    }
}

export default PerspectiveCamera;
