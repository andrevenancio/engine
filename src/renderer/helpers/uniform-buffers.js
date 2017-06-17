import { mat4 } from 'gl-matrix';
import { getContext } from '../../session';
import UniformBuffer from './uniform-buffer';

const uniformBuffers = {};

let projectionView;

export function setup() {

    projectionView = new Float32Array([
        ...mat4.create(),
        ...mat4.create(),
    ]);

    uniformBuffers.projectionView = new UniformBuffer(projectionView);
}

export function updateProjectionView(projectionMatrix, modelViewMatrix) {
    const gl = getContext();

    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uniformBuffers.projectionView.buffer);
    gl.bindBuffer(gl.UNIFORM_BUFFER, uniformBuffers.projectionView.buffer);

    projectionView = [
        ...projectionMatrix,
        ...modelViewMatrix,
    ];

    uniformBuffers.projectionView.setValues(projectionView, 0);

    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, uniformBuffers.projectionView.data);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);
}

export default uniformBuffers;
