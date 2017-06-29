import Object3 from '../core/object3';
import { DIRECTIONAL_LIGHT } from '../constants';

class DirectionalLight extends Object3 {
    constructor(props = {}) {
        super();

        this.type = DIRECTIONAL_LIGHT;
        console.log('directional', props);
    }

    destroy() {
        // TODO
    }
}

export default DirectionalLight;
