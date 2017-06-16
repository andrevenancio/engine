function createShader(gl, str, type) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!compiled) {
        const error = gl.getShaderInfoLog(shader);

        console.error('Error compiling shader', error);
        gl.deleteShader(shader);
    }

    return shader;
};

export const createProgram = (gl, vertex, fragment) => {
    const vs = createShader(gl, vertex, gl.VERTEX_SHADER);
    const fs = createShader(gl, fragment, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    return program;
};
