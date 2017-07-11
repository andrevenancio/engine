/* eslint-disable */
import { mat4, vec4 } from 'gl-matrix';
import { library, version, getContext, setContext } from '../session';
import UniformBuffer from './helpers/ubo';
import { MAX_DIRECTIONAL } from '../constants';

let supported = false;
let child;

let lastProgram;

let viewMatrix = mat4.create();
let invertedViewMatrix = mat4.create();
let normalMatrix = mat4.create();

const startTime = Date.now();

class Renderer {

    constructor(props = {}) {
        this.ratio = global.devicePixelRatio;

        this.fog = {
            start: 500,
            end: 1000,
            color: vec4.fromValues(0, 0, 0, 1),
            density: 0.002,
        };

        const canvas = props.canvas || this.createCanvas();

        const gl = canvas.getContext('webgl2', {
            antialias: false,
        });

        if (gl) {
            if (props.greeting !== false) {
                const lib = 'color:#666;font-size:x-small;font-weight:bold;';
                const parameters = 'color:#777;font-size:x-small';
                const values = 'color:#f33;font-size:x-small';
                const args = [
                    `%c${library}\n%cversion: %c${version} %crunning: %c${gl.getParameter(gl.VERSION)}`,
                    lib, parameters, values, parameters, values,
                ];

                console.log(...args);
            }

            setContext(gl);

            this.perScene = new UniformBuffer([
                ...mat4.create(), // projectionMatrix
                ...mat4.create(), // viewMatrix
                ...vec4.create(), // fog start, fog end, fog density, 0
                ...vec4.create(), // fog color
                ...vec4.create(), // currently used directional light legth
                ...vec4.create(), // currently used point light legth
                ...vec4.create(), // iGlobalTime, 0, 0, 0
            ], 0);

            this.perModel = new UniformBuffer([
                ...mat4.create(),
                ...mat4.create(),
            ], 1);

            this.directional = new UniformBuffer(new Float32Array(MAX_DIRECTIONAL * 12), 2);

            this.frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            this.renderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 256, 256);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            supported = true;
        } else {
            alert('webgl2 not supported');
        }
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.boxSizing = 'border-box';
        canvas.style.width = global.innerWidth * global.devicePixelRatio;
        canvas.style.height = global.innerHeight * global.devicePixelRatio;
        document.body.appendChild(canvas);

        return canvas;
    }

    setSize(width, height) {
        const w = width * this.ratio;
        const h = height * this.ratio;

        const gl = getContext();
        gl.canvas.width = w;
        gl.canvas.height = h;
        gl.canvas.style.width = `${w / this.ratio}px`;
        gl.canvas.style.height = `${h / this.ratio}px`;
    }

    setRatio(ratio) {
        this.ratio = ratio;
    }

    draw(scene, camera, clear = true) {
        if (supported) {
            const gl = getContext();
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            if (clear) {
                gl.clearColor(0, 0, 0, 1);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            }

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            camera.updateCameraMatrix(gl.canvas.width, gl.canvas.height);

            // common matrices
            mat4.identity(viewMatrix);
            mat4.lookAt(viewMatrix, camera.position.data, camera.target, camera.up);

            mat4.identity(invertedViewMatrix);
            mat4.invert(invertedViewMatrix, viewMatrix);

            scene.traverse();

            this.perScene.update([
                ...camera.projectionMatrix,
                ...viewMatrix,
                ...[this.fog.start, this.fog.end, this.fog.density, 0],
                ...this.fog.color,
                ...[scene.directional.length, 0, 0, 0],
                ...[scene.point.length, 0, 0, 0],
                ...[(Date.now() - startTime) / 1000, 0, 0, 0],
            ]);

            for (let i = 0; i < scene.directional.length; i++) {
                this.directional.update([
                    ...[...scene.directional[i].position.data, 0],
                    ...[...scene.directional[i].color, 0],
                    ...[scene.directional[i].intensity, 0, 0, 0],
                ], i * 12);
            }

            // console.log(this.directional.data);

            // TODO: sort opaque and transparent objects
            // temporary render until I sort the "sort" :p
            for (let i = 0, len = scene.children.length; i < len; i++) {
                child = scene.children[i];

                // first time
                if (!child.material.program) {
                    child.init();
                    return;
                }

                // change program
                if (lastProgram !== child.material.program) {
                    lastProgram = child.material.program;
                    gl.useProgram(lastProgram);

                    // change progam, so bind UBO
                    const sceneLocation = gl.getUniformBlockIndex(lastProgram, 'perScene');
                    const modelLocation = gl.getUniformBlockIndex(lastProgram, 'perModel');
                    const directionalLocation = gl.getUniformBlockIndex(lastProgram, 'directional');
                    gl.uniformBlockBinding(lastProgram, sceneLocation, this.perScene.boundLocation);
                    gl.uniformBlockBinding(lastProgram, modelLocation, this.perModel.boundLocation);
                    gl.uniformBlockBinding(lastProgram, directionalLocation, this.directional.boundLocation);
                    // TODO: we need this?
                    gl.bindBufferBase(gl.UNIFORM_BUFFER, directionalLocation, this.directional.buffer);

                    // console.log('change program', child.material.type);
                    // https://jsfiddle.net/andrevenancio/m9qchtdb/14/
                }

                // update matrices per model
                mat4.identity(normalMatrix);
                mat4.copy(normalMatrix, invertedViewMatrix);
                mat4.transpose(normalMatrix, normalMatrix);

                // render child
                child.bind();

                this.perModel.update([
                    ...child.modelMatrix,
                    ...normalMatrix,
                ]);

                child.update();
                child.unbind();
                child = null;
            }
        }
    }

    render(scene, camera) {
        this.draw(scene, camera);
    }

    rtt(scene, camera, width, height) {
        const gl = getContext();

        if (width !== this.rttwidth || height !== this.rttheight) {
            const w = width * this.ratio;
            const h = height * this.ratio;
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.bindTexture(gl.TEXTURE_2D, null);

            // resize depth attachment
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width * this.ratio, height * this.ratio);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);

            this.rttwidth = width;
            this.rttheight = height;
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

        this.draw(scene, camera);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return this.texture;
    }
}

export default Renderer;
