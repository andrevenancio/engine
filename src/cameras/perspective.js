import { vec3, mat4 } from 'gl-matrix';
import Object3 from '../core/object3';
import { getContext } from '../renderer/utils';

class PerspectiveCamera extends Object3 {

    constructor(options) {
        super();

        Object.assign(this, {
            near: 0.1,
            far: 1000,
            fov: 35,
        }, options);

        this.target = vec3.create();
        this.up = vec3.fromValues(0, 1, 0);
        this.projectionMatrix = mat4.create();
    }

    lookAt(v) {
        vec3.copy(this.target, v);
    }

    updateCameraMatrix() {
        const gl = getContext();
        mat4.perspective(
            this.projectionMatrix,
            this.fov * Math.PI / 180,
            gl.canvas.width / gl.canvas.height,
            this.near,
            this.far,
        );
    }

    get ratio() {
        const gl = getContext();
        return gl.canvas.width / gl.canvas.height;
    }
}

export default PerspectiveCamera;
