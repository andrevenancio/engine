import { getContext } from '../../session';

class Vao {

    constructor() {
        const gl = getContext();
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
    }

    bind() {
        const gl = getContext();
        gl.bindVertexArray(this.vao);
    }

    unbind() {
        const gl = getContext();
        gl.bindVertexArray(null);
    }

    destroy() {
        const gl = getContext();
        gl.deleteVertexArray(this.vao);
        this.vao = null;
    }

}

export default Vao;
