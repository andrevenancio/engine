import Object3 from './object3';

class Model extends Object3 {

    constructor(geometry, material) {
        super();

        this.geometry = {
            positions: new Float32Array(geometry.positions),
            indices: new Uint16Array(geometry.indices),
            normals: new Float32Array(geometry.normals),
            uvs: new Float32Array(geometry.uvs),
        };
        this.material = material;

        // merge geometry to material attributes
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
    }

    destroy() {
        // destroys buffers
        this.material.destroy();
    }

    update() {
        // everything is bind
        // update material attributes or uniforms
        this.material.update();
    }

}

export default Model;
