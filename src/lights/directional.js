import Object3 from '../core/object3';
import { color } from '../utils';
import { DIRECTIONAL_LIGHT } from '../constants';

class DirectionalLight extends Object3 {
    constructor(props = {}) {
        super();

        this.type = DIRECTIONAL_LIGHT;

        this.guiColor = (props && props.color) || 0xdedede;
        this._color = color.convert(this.guiColor);

        this.intensity = props.intensity || 0.5;
    }

    set color(value) {
        this._color = color.convert(value);
    }

    get color() {
        return this._color;
    }

    destroy() {
        // TODO
    }
}

export default DirectionalLight;
