import { mat4 } from 'gl-matrix';
import Object3 from './object3';

class Scene extends Object3 {

    constructor() {
        super();
        this.lights = [];

        this.modelViewMatrix = mat4.create();
        this.inversedViewMatrix = mat4.create();
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
