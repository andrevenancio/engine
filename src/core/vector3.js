import { vec3 } from 'gl-matrix';

class Vector3 {

    constructor(x = 0, y = 0, z = 0) {
        this.data = vec3.fromValues(x, y, z);
    }

    set x(value) {
        vec3.set(this.data, value, this.data[1], this.data[2]);
    }

    get x() {
        return this.data[0];
    }

    set y(value) {
        vec3.set(this.data, this.data[0], value, this.data[2]);
    }

    get y() {
        return this.data[1];
    }

    set z(value) {
        vec3.set(this.data, this.data[0], this.data[1], value);
    }

    get z() {
        return this.data[2];
    }

}

export default Vector3;
