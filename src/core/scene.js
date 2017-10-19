import Object3 from './object3';
import {
    AMBIENT_LIGHT,
    DIRECTIONAL_LIGHT,
    POINT_LIGHT,
} from '../constants';

class Scene extends Object3 {
    constructor() {
        super();

        this.ambient = [];
        this.directional = [];
        this.point = [];
    }

    traverse(object) {
        if (object === undefined) {
            object = this; // eslint-disable-line
        }

        for (let i = 0; i < object.children.length; i++) {
            this.traverse(object.children[i]);
        }

        if (object.parent === null) {
            return;
        }

        object.updateMatrices();
    }

    addLight(light) {
        switch (light.type) {
        case AMBIENT_LIGHT:
            this.ambient.push(light);
            break;
        case DIRECTIONAL_LIGHT:
            this.directional.push(light);
            break;
        case POINT_LIGHT:
            this.point.push(light);
            break;
        default:
            // nothing
        }
    }

    removeLight(light) {
        let index = this.ambient.indexOf(light);
        if (index !== -1) {
            light.destroy();
            this.ambient.splice(index, 1);
        }

        // directional
        index = this.directional.indexOf(light);
        if (index !== -1) {
            light.destroy();
            this.directional.splice(index, 1);
        }

        // point
        index = this.point.indexOf(light);
        if (index !== -1) {
            light.destroy();
            this.point.splice(index, 1);
        }
    }
}

export default Scene;
