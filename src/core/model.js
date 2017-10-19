import Object3 from './object3';
import { getContext } from '../session';

class Model extends Object3 {
    constructor(geometry, material) {
        super();

        this.geometry = {
            positions: new Float32Array(geometry.positions),
            indices: new Uint16Array(geometry.indices),
            normals: new Float32Array(geometry.normals || geometry.positions.length),
            uvs: new Float32Array(geometry.uvs || geometry.positions.length / 1.5),
        };

        this.material = material;

        // assign attributes and indices
        this.material.attributes.a_position.value = this.geometry.positions;
        this.material.attributes.a_normal.value = this.geometry.normals;
        this.material.attributes.a_uv.value = this.geometry.uvs;
        this.material.indices = this.geometry.indices;

        this.positionsNeedUpdate = false;
    }

    init() {
        this.material.init();
    }

    bind() {
        this.material.bind();
    }

    update() {
        this.material.update();

        if (this.positionsNeedUpdate === true) {
            const gl = getContext();
            gl.enableVertexAttribArray(this.material.attributes.a_position.location);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.material.attributes.a_position.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.geometry.positions, gl.DYNAMIC_DRAW);

            // do I need to bind this?
            // if (this.indices) {
            //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            //     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
            // }
        }
        this.draw();
    }

    unbind() {
        this.material.unbind();
    }

    draw() {
        const gl = getContext();

        if (this.polygonOffset) {
            gl.enable(gl.POLYGON_OFFSET_FILL);
            gl.polygonOffset(this.polygonOffsetFactor, this.polygonOffsetUnits);
        } else {
            gl.disable(gl.POLYGON_OFFSET_FILL);
        }

        if (this.geometry.indices.length > 0) {
            gl.drawElements(
                this.material.glMode(),
                this.geometry.indices.length,
                gl.UNSIGNED_SHORT,
                0,
            );
        } else {
            gl.drawArrays(
                this.material.glMode(),
                0,
                this.geometry.positions.length / 3,
            );
        }
    }

    destroy() {
        this.material.destroy();
    }
}

export default Model;
