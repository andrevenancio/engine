import { vec3, mat4, quat } from 'gl-matrix';

import Vector3 from './vector3';

let uuid = 0;
let axisAngle = 0;
let quaternionAxisAngle = vec3.create();

// look at
const xAxis = vec3.create();
const yAxis = vec3.create();
const zAxis = vec3.create();

class Object3 {

    constructor() {
        this.uid = uuid++;

        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);
        this.quaternion = quat.create();
        this.target = vec3.create();
        this.up = vec3.fromValues(0, 1, 0);

        this.parent = null;
        this.children = [];

        this.parentMatrix = mat4.create();
        this.modelMatrix = mat4.create();
        this.lookAtMatrix = mat4.create();

        this.lookToTarget = false; // use lookAt rotation when set to true
    }

    addModel(model) {
        model.parent = this;
        this.children.push(model);
    }

    removeModel(model) {
        const index = this.children.indexOf(model);
        if (index !== -1) {
            model.destroy();
            this.children.splice(index, 1);
        }
    }

    lookAt(out, eye, target, up) {
        vec3.subtract(zAxis, target, eye);
        vec3.normalize(zAxis, zAxis);
        vec3.cross(xAxis, up, zAxis);
        vec3.cross(yAxis, zAxis, xAxis);

        out[0] = xAxis[0];
        out[1] = xAxis[1];
        out[2] = xAxis[2];
        out[3] = 0;
        out[4] = yAxis[0];
        out[5] = yAxis[1];
        out[6] = yAxis[2];
        out[7] = 0;
        out[8] = zAxis[0];
        out[9] = zAxis[1];
        out[10] = zAxis[2];
        out[11] = 0;
        out[12] = eye[0];
        out[13] = eye[1];
        out[14] = eye[2];
        out[15] = 1;
        return out;
    }

    updateMatrices() {
        mat4.identity(this.parentMatrix);
        mat4.identity(this.modelMatrix);
        mat4.identity(this.lookAtMatrix);
        quat.identity(this.quaternion);

        if (this.parent) {
            mat4.copy(this.parentMatrix, this.parent.modelMatrix);
            mat4.multiply(this.modelMatrix, this.modelMatrix, this.parentMatrix);
        }

        if (this.lookToTarget) {
            // my version
            this.lookAt(this.lookAtMatrix, this.position.data, this.target, this.up);
            mat4.multiply(this.modelMatrix, this.modelMatrix, this.lookAtMatrix);

            // in theory this should work, but doesnt
            // mat4.lookAt(this.lookAtMatrix, this.position.data, this.target, this.up);
            // mat4.invert(this.lookAtMatrix, this.lookAtMatrix);
            // mat4.multiply(this.modelMatrix, this.modelMatrix, this.lookAtMatrix);
        } else {
            mat4.translate(this.modelMatrix, this.modelMatrix, this.position.data);
            quat.rotateX(this.quaternion, this.quaternion, this.rotation.x);
            quat.rotateY(this.quaternion, this.quaternion, this.rotation.y);
            quat.rotateZ(this.quaternion, this.quaternion, this.rotation.z);
            axisAngle = quat.getAxisAngle(quaternionAxisAngle, this.quaternion);
            mat4.rotate(this.modelMatrix, this.modelMatrix, axisAngle, quaternionAxisAngle);
        }
        mat4.scale(this.modelMatrix, this.modelMatrix, this.scale.data);
    }

}

export default Object3;
