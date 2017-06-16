import { BASIC_MATERIAL } from '../constants';
import Material from '../core/material';

class Basic extends Material {

    constructor() {
        super();
        this.type = BASIC_MATERIAL;
    }

}

export default Basic;
