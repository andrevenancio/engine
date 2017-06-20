import Object3 from './object3';

class Scene extends Object3 {

    constructor() {
        super();
        this.lights = [];
    }

    traverse(object) {
        if (object === undefined) {
            object = this;
        }

        for (let i = 0; i < object.children.length; i += 1) {
            this.traverse(object.children[i]);
        }

        if (object.parent === null) {
            return;
        }

        object.updateMatrices();
    };

}

export default Scene;
