import { mat4, vec4 } from 'gl-matrix';
import { library, version, getContext, setContext } from '../session';
import UniformBuffer from './helpers/ubo';

let supported = false;
let child;

let lastProgram;

let viewMatrix = mat4.create();
let invertedViewMatrix = mat4.create();
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
                    `%c${library}\n%cversion: %c${version} %crunning: %c${gl.getParameter(gl.VERSION)}`,
                    lib, parameters, values, parameters, values,
                ];

                console.log(...args);
            }

            setContext(gl);

            this.perScene = new UniformBuffer([
                ...mat4.create(),
                ...mat4.create(),
            ], 20);

            this.perModel = new UniformBuffer([
                ...mat4.create(),
                ...mat4.create(),
                ...vec4.create(),
            ], 1);

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
            mat4.identity(viewMatrix);
            mat4.lookAt(viewMatrix, camera.position.data, camera.target, camera.up);

            mat4.identity(invertedViewMatrix);
            mat4.invert(invertedViewMatrix, viewMatrix);

            scene.traverse();

            this.perScene.update([
                ...camera.projectionMatrix,
                ...viewMatrix,
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
                    console.log('change program', sceneLocation, modelLocation);
                    // https://jsfiddle.net/andrevenancio/m9qchtdb/14/
                }

                // update matrices per model
                mat4.identity(normalMatrix);
                mat4.copy(normalMatrix, invertedViewMatrix);
                mat4.transpose(normalMatrix, normalMatrix);

                // render child
                child.bind();

                // this.UB_matrices.update([
                //     ...camera.projectionMatrix,
                //     ...viewMatrix,
                //     ...child.modelMatrix,
                //     ...normalMatrix,
                // ], 0);

                this.perModel.update([
                    ...child.modelMatrix,
                    ...normalMatrix,
                    ...child.material.color,
                ]);

                child.update();
                child.unbind();
                child = null;
            }
        }
    }
}

export default Renderer;
