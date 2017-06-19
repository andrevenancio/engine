import { BASIC_MATERIAL } from '../constants';
import Material from '../core/material';

import { color } from '../utils';

class Basic extends Material {

    constructor(props) {
        super();
        this.type = BASIC_MATERIAL;

        this.color = color.convert(props.color || 0xffffff);
    }

}

export default Basic;
