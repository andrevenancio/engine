import Vector3 from './vector3';

let uuid = 0;

class Object3 {

    constructor() {
        this.uid = uuid++;

        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);
    }

    updateMatrices() {
        // update matrices
    }

}

export default Object3;
