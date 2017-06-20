// import { vec3 } from 'gl-matrix';
import Object3 from './object3';
import { getContext } from '../session';

class Model extends Object3 {

    constructor(geometry, material) {
        super();

        this.geometry = {
            positions: new Float32Array(geometry.positions),
            indices: new Uint16Array(geometry.indices),
            normals: new Float32Array(geometry.normals),
            uvs: new Float32Array(geometry.uvs || geometry.positions.length / 1.5),
        };

        this.material = material;

        // assign attributes and indices
        this.material.attributes.a_position.value = this.geometry.positions;
        this.material.attributes.a_normal.value = this.geometry.normals;
        this.material.attributes.a_uv.value = this.geometry.uvs;
        this.material.indices = this.geometry.indices;
    }

    init() {
        this.material.init();
    }

    bind() {
        this.material.bind();
    }

    update() {
        this.material.update();
        this.draw();
    }

    unbind() {
        this.material.unbind();
    }

    draw() {
        const gl = getContext();
        gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    destroy() {
        this.material.destroy();
    }

}

export default Model;
