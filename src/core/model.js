import Object3 from './object3';

class Model extends Object3 {

    constructor(props) {
        super();

        this.geometry = {
            positions: new Float32Array(props.positions),
            indices: new Uint16Array(props.indices),
            normals: new Float32Array(props.normals),
            uvs: new Float32Array(props.uvs),
        };

        this.material = props.material;
    }

    destroy() {
        // destroys buffers
    }

}

export default Model;
