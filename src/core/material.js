import { vec2, vec3 } from 'gl-matrix';
import Vao from '../renderer/helpers/vao';
import { createProgram } from '../renderer/helpers/program';
import { getContext } from '../session';

const programs = {};

class Material {

    constructor(props = {}) {
        this.defines = Object.assign({}, props.defines);
        this.attributes = Object.assign({
            a_position: {
                type: 'vec3',
                value: vec3.create(),
            },
            a_normal: {
                type: 'vec3',
                value: vec3.create(),
            },
            a_uv: {
                type: 'vec2',
                value: vec2.create(),
            },
        }, props.attributes);
        this.uniforms = Object.assign({}, props.uniforms);

        this.vertex = '';
        this.fragment = '';

        this.vao = new Vao();
        this.program = null;
        this.indices = null;
    }

    createProgram() {
        const gl = getContext();
        const key = `shader-${this.type}`;
        if (programs[key] === undefined) {
            const program = createProgram(gl, this.vertex, this.fragment);
            programs[key] = program;
        }
        this.program = programs[key];
    }

    initAttributes() {
        const gl = getContext();
        for (let prop in this.attributes) {
            const current = this.attributes[prop];
            const location = gl.getAttribLocation(this.program, prop);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, current.value, gl.STATIC_DRAW);

            let size;
            switch (current.type) {
                case 'vec3':
                    size = 3;
                    break;
                case 'vec2':
                    size = 3;
                    break;
                default:
                    size = 1;
            }

            Object.assign(current, {
                location,
                buffer,
                size,
            });
        }

        if (this.indices) {
            this.indexBuffer = gl.createBuffer();
        }
    }

    initUniforms() {
        const gl = getContext();

        const textureIndices = [gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2, gl.TEXTURE3, gl.TEXTURE4, gl.TEXTURE5];
        Object.keys(this.uniforms).forEach((prop, i) => {
            const current = this.uniforms[prop];
            const location = gl.getUniformLocation(this.program, prop);

            if (current.type === 'sampler2D') {
                current.textureIndex = i;
                current.activeTexture = textureIndices[i];
            }

            current.location = location;
        });
    }

    init() {
        this.createProgram();
        this.initAttributes();
        this.initUniforms();

        this.vao.bind();

        this.bind();

        this.vao.unbind();
        this.unbind();
    }

    destroy() {
        // destroy buffers
    }

    bind() {
        const gl = getContext();
        Object.keys(this.attributes).forEach(key => {
            const { location, buffer, size } = this.attributes[key];
            if (location !== -1) {
                gl.enableVertexAttribArray(location);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
            }
        });

        if (this.indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        }
    }

    unbind() {
        const gl = getContext();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    update() {
        // update uniforms / buffers
        const gl = getContext();

        Object.keys(this.uniforms).forEach((key) => {
            const uniform = this.uniforms[key];

            switch(uniform.type) {
                case 'mat4':
                    gl.uniformMatrix4fv(uniform.location, false, uniform.value);
                    break;
                case 'mat3':
                    gl.uniformMatrix3fv(uniform.location, false, uniform.value);
                    break;
                case 'vec4':
                    gl.uniform4fv(uniform.location, uniform.value);
                    break;
                case 'vec3':
                    gl.uniform3fv(uniform.location, uniform.value);
                    break;
                case 'vec2':
                    gl.uniform2fv(uniform.location, uniform.value);
                    break;
                case 'float':
                    gl.uniform1f(uniform.location, uniform.value);
                    break;
                case 'sampler2D':
                    gl.uniform1i(uniform.location, uniform.textureIndex);
                    gl.activeTexture(uniform.activeTexture);
                    gl.bindTexture(gl.TEXTURE_2D, uniform.value);
                    break;
                default:
                    console.warn('unknown', uniform.type);
            }
        });
    }

}

export default Material;
