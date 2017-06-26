/* eslint-disable */
import { mat4, vec4 } from 'gl-matrix';
import { library, version, getContext, setContext } from '../session';
import UniformBuffer from './helpers/ubo';
// import Texture from '../core/texture';

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
                ...mat4.create(),
                ...mat4.create(),
                ...vec4.create(),
            ], 0);

            this.perModel = new UniformBuffer([
                ...mat4.create(),
                ...mat4.create(),
            ], 1);

            // rtt
            this.updateRTT(global.innerWidth, global.innerHeight);

            supported = true;
        } else {
            alert('webgl2 not supported');
        }
    }

    updateRTT(width, height) {
        const gl = getContext();

        this.rttwidth = width;
        this.rttheight = height;
        console.log('update RTT', this.rttwidth, this.rttheight);

        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.rttwidth * this.ratio, this.rttheight * this.ratio, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        this.renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.rttwidth * this.ratio, this.rttheight * this.ratio);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
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
                ...[(Date.now() - startTime) / 1000, 0, 0, 0],
            ]);

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
                    gl.uniformBlockBinding(lastProgram, sceneLocation, this.perScene.boundLocation);
                    gl.uniformBlockBinding(lastProgram, modelLocation, this.perModel.boundLocation);
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

    render(scene, camera, clear) {
        this.draw(scene, camera, clear);
    }

    rtt(scene, camera, clear, width, height) {
        const gl = getContext();

        if (width !== this.rttwidth || height !== this.rttheight) {
            // TODO: is there a better way?
            this.updateRTT(width, height);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

        this.draw(scene, camera, clear);

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
