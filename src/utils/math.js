export function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

export function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

export function randomRange(min, max) {
    return (Math.random() * (max - min)) + min;
}
