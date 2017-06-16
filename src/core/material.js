import Vao from '../renderer/helpers/vao';
import { createProgram } from '../renderer/helpers/program';
import { getContext } from '../session';

const programs = {};

class Material {

    constructor() {
        this.defines = {};
        this.attributes = {};
        this.uniforms = {};

        this.vertex = '';
        this.fragment = '';

        this.vao = new Vao();
        this.program = null;
    }

    init() {
        console.log('first time rendered by Renderer');
        const gl = getContext();

        // 1) create shaders dynamically
        this.vertex = this.generateVertexShader();
        this.fragment = this.generateFragmentShader();

        // 2) create program
        const key = `shader-${this.type}`;
        if (programs[key] === undefined) {
            const program = createProgram(gl, this.vertex, this.fragment);
            programs[key] = program;
        }
        this.program = programs[key];

        // 2) binds buffers
        for (let prop in this.attributes) {
            const current = this.attributes[prop];

            const location = gl.getAttribLocation(this.program, prop);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, current.value, gl.STATIC_DRAW);
            // unbind?

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
                // value?
            });
        }

        if (this.indices) {
            this.indexBuffer = gl.createBuffer();
        }

        // 3) bind vao
        this.vao.bind();

        // 4) bind attributes
        this.bind();

        // 5) unbind vao
        this.vao.unbind();
        // unbind attributes?
    }

    destroy() {
        // destroy buffers
    }

    generateVertexShader() {
        return `#version 300 es
            in vec3 a_position;

            void main() {
                gl_Position = vec4(a_position, 1.0);
            }
        `;
    }

    generateFragmentShader() {
        return `#version 300 es
            precision highp float;
            precision highp int;

            out vec4 outColor;

            void main() {
                outColor = vec4(1.0, 0.0, 1.0, 1.0);
            }
        `;
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

    update() {
        // update uniforms / buffers
    }

    unbind() {
        const gl = getContext();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

}

export default Material;
