// import { vec3 } from 'gl-matrix';
import Object3 from './object3';
import { getContext } from '../session';

class Model extends Object3 {

    constructor(geometry, material) {
        super();

        this.geometry = {
            positions: new Float32Array(geometry.positions),
            indices: new Uint16Array(geometry.indices),
            normals: new Float32Array(geometry.normals || []),
            uvs: new Float32Array(geometry.uvs || [1, 1]),
        };
        this.material = material;

        // assign attributes
        Object.assign(this.material.attributes, {
            a_position: {
                type: 'vec3',
                value: this.geometry.positions,
            },
            a_normal: {
                type: 'vec3',
                value: this.geometry.normals,
            },
            a_uv: {
                type: 'vec2',
                value: this.geometry.uvs,
            },
        });

        // assign uniforms
        Object.assign(this.material.uniforms, {

        });

        // pass indices to material so we can bind buffers
        Object.assign(this.material, { indices: this.geometry.indices });
    }

    init() {
        this.material.init();
    }

    bind() {
        this.material.bind();
    }

    update() {
        const gl = getContext();

        // everything is bind
        // update material attributes or uniforms
        this.material.update();

        // draw
        gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    unbind() {
        this.material.unbind();
    }

    destroy() {
        // destroys buffers
        this.material.destroy();
    }

}

export default Model;
