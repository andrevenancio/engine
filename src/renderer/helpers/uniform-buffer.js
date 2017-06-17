import { getContext } from '../../session';

class UniformBuffer {

    constructor(data) {
        const gl = getContext();

        this.data = data;
        this.buffer = gl.createBuffer();

        gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer);
        gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(this.data), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }

    setValues(values, offset = 0) {
        this.data.set(values, offset);
    }

}

export default UniformBuffer;
