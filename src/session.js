/* global __LIBRARY__, __VERSION__, __ENV__ */

export const library = __LIBRARY__;
export const version = __VERSION__;
export const env = __ENV__;

let gl;

export const setContext = (context) => {
    gl = context;
};

export const getContext = () => {
    return gl;
};
