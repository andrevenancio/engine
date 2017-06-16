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
        // 1) create shaders dynamicly
        this.vertex = this.generateVertexShader();
        this.fragment = this.generateFragmentShader();

        // 2) create program
        const key = `shader-${this.type}`;
        if (programs[key] === undefined) {
            const gl = getContext();
            const program = createProgram(gl, this.vertex, this.fragment);
            programs[key] = program;
        }
        this.program = programs[key];

        // const key = `shader-${material.type}`;
        // if (programs[key] === undefined) {
        //     const gl = getContext();
        //     programs[key] = createProgram(gl, material.vertex, material.fragment);
        // }
        // return programs[key];
        // this.program = program;

        // 2) bind attributes, uniforms

        // for (let prop in this.attributes) {
        //     console.log(prop);
        // }

        // // 3) bind vao
        // this.vao.bind();
        //
        // // 4) bind attributes
        //
        // // 5) unbind vao
        // this.vao.unbind();
        //
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
        // binds
    }

    update() {
        // update uniforms
    }

    unbind() {
        // unbind
    }

}

export default Material;
