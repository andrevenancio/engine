export const library = __LIBRARY__;
export const version = __VERSION__;

let gl;
let triangles;
let lines;
let points;

export const setContext = (context) => {
    gl = context;
    triangles = context.TRIANGLES;
    lines = context.LINES;
    points = context.POINTS;
};

export const getContext = () => {
    return gl;
};

export const GL_TRIANGLES = () => triangles;
export const GL_LINES = () => lines;
export const GL_POINTS = () => points;
