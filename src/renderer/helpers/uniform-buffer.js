import { getContext } from '../../session';

class UniformBuffer {
    constructor(data) {
        const gl = getContext();

        this.data = new Float32Array(data);
        this.buffer = gl.createBuffer();

        gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer);
        gl.bufferData(gl.UNIFORM_BUFFER, this.data, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }

    update(data, index = 0) {
        const gl = getContext();

        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this.buffer);
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer);

        this.data.set(data, index);

        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.data);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
}

export default UniformBuffer;
