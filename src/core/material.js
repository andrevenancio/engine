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

    generateShaders() {
        this.vertex = this.generateVertexShader();
        this.fragment = this.generateFragmentShader();
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
        for (let prop in this.uniforms) {
            const current = this.uniforms[prop];
            const location = gl.getUniformLocation(this.program, prop);
            Object.assign(current, {
                location,
            });
        }

        // TODO: maybe implement this on previous loop?
        const textureIndices = [gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2, gl.TEXTURE3, gl.TEXTURE4, gl.TEXTURE5];
        Object.keys(this.uniforms).forEach((key, i) => {
            switch (this.uniforms[key].type) {
                case 'sampler2D': {
                    this.uniforms[key].textureIndex = i;
                    this.uniforms[key].activeTexture = textureIndices[i];
                    break;
                }
            }
        });
    }

    init() {
        this.generateShaders();
        this.createProgram();

        this.initAttributes();
        this.initUniforms();

        // 3) bind vao
        this.vao.bind();

        // 4) bind attributes
        this.bind();

        // 5) unbind vao
        this.vao.unbind();
        this.unbind();
    }

    destroy() {
        // destroy buffers
    }

    generateVertexShader() {
        return `#version 300 es

            uniform perScene {
                mat4 projection;
                mat4 view;
            };

            uniform perModel {
                mat4 model;
                mat4 normal;
                vec4 color;
            };

            in vec3 a_position;
            in vec3 a_normal;

            out vec3 v_color;

            void main() {
                gl_Position = projection * view * model * vec4(a_position, 1.0);

                vec3 normal = normalize(mat3(normal) * a_normal);

                // directional light
                float weight = max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0);
                v_color = vec3(0.2) + vec3(0.8) * weight; // ambient * directional color
            }
        `;
    }

    generateFragmentShader() {
        return `#version 300 es
            precision highp float;
            precision highp int;

            uniform perModel {
                mat4 model;
                mat4 normal;
                vec4 color;
            };

            in vec3 v_color;

            out vec4 outColor;

            void main() {
                outColor = color * vec4(v_color, 1.0);
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
