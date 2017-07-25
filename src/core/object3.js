import { vec3, mat4, quat } from 'gl-matrix';

import Vector3 from './vector3';

let uuid = 0;
let axisAngle = 0;
let quaternionAxisAngle = vec3.create();

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

        // use mat4.targetTo rotation when set to true
        this.lookToTarget = false; // use lookAt rotation when set to true

        // enable polygonOffset (z-fighting)
        this.polygonOffset = false;
        this.polygonOffsetFactor = 0;
        this.polygonOffsetUnits = 1;
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
            mat4.targetTo(this.lookAtMatrix, this.position.data, this.target, this.up);
            mat4.multiply(this.modelMatrix, this.modelMatrix, this.lookAtMatrix);
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
