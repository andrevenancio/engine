import { vec3, mat3, mat4, quat } from 'gl-matrix';
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

        this.parent = null;
        this.children = [];

        this.localMatrix = mat4.create();
        this.modelMatrix = mat4.create();

        this.normalMatrix = mat3.create();
        this.inversedViewMatrix = mat4.create();
        this.inversedModelViewMatrix = mat4.create();
    }

    updateMatrices() {
        mat4.identity(this.localMatrix);
        mat4.identity(this.modelMatrix);
        quat.identity(this.quaternion);

        if (this.parent) {
            mat4.copy(this.localMatrix, this.parent.modelMatrix);
            mat4.multiply(this.modelMatrix, this.modelMatrix, this.localMatrix);
        }

        mat4.translate(this.modelMatrix, this.modelMatrix, this.position.data);
        quat.rotateX(this.quaternion, this.quaternion, this.rotation.x);
        quat.rotateY(this.quaternion, this.quaternion, this.rotation.y);
        quat.rotateZ(this.quaternion, this.quaternion, this.rotation.z);
        axisAngle = quat.getAxisAngle(quaternionAxisAngle, this.quaternion);
        mat4.rotate(this.modelMatrix, this.modelMatrix, axisAngle, quaternionAxisAngle);
        mat4.scale(this.modelMatrix, this.modelMatrix, this.scale.data);
    }

}

export default Object3;
