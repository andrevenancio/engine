import { mat4 } from 'gl-matrix';
import { library, version, getContext, setContext } from '../session';
import UniformBuffer from './helpers/uniform-buffer';

let supported = false;
let child;

let lastProgram;

let modelViewMatrix = mat4.create();
let invertedModelViewMatrix = mat4.create();
let normalMatrix = mat4.create();

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
                    `%c${library}\n%cversion: %c${version} %crunning: %cwebgl 2.0`,
                    lib, parameters, values, parameters, values,
                ];

                console.log(...args);
            }

            setContext(gl);

            this.matrices = new UniformBuffer([
                ...mat4.create(), // projection matrix
                ...mat4.create(), // view matrix
                ...mat4.create(), // model matrix
                ...mat4.create(), // normal matrix
            ]);

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

    render(scene, camera, clear = true) {
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
            mat4.identity(modelViewMatrix);
            mat4.lookAt(modelViewMatrix, camera.position.data, camera.target, camera.up);

            mat4.identity(invertedModelViewMatrix);
            mat4.invert(invertedModelViewMatrix, modelViewMatrix);

            scene.traverse();

            this.matrices.update([
                ...camera.projectionMatrix,
                ...modelViewMatrix,
            ], 0);

            // TODO: sort by program?
            // TODO: sort opaque and transparent objects

            // render transparent objects (sorted by z);
            // TODO

            // render opaque objects
            // TODO

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
                }

                // update matrices per model
                mat4.identity(normalMatrix);
                mat4.copy(normalMatrix, invertedModelViewMatrix);
                mat4.transpose(normalMatrix, normalMatrix);

                this.matrices.update([
                    ...child.modelMatrix, // update model matrix
                    ...normalMatrix, // update normal matrix
                ], 32);

                // render child
                child.bind();
                child.update();
                child.unbind();
                child = null;
            }
        }
    }

}

export default Renderer;
