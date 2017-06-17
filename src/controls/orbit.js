import { vec3 } from 'gl-matrix';
import { clamp } from '../utils/math';
import { getContext } from '../session';

const offset = -Math.PI * 0.5;

class OrbitControls {

    constructor(camera) {
        const gl = getContext();

        this.camera = camera;
        this.domElement = gl.canvas;

        this.radius = Math.max(camera.position.x, camera.position.z);

        this.rx = Math.atan2(camera.position.y, this.radius);
        this.ry = Math.atan2(camera.position.z, camera.position.x) + offset;

        this.ox = 0;
        this.oy = 0;

        this.width = global.innerWidth;
        this.height = global.innerHeight;

        // rotation
        this.rotationSpeed = 5 * global.devicePixelRatio;

        // zoom
        this.zoomMin = 0.1;
        this.zoomMax = Infinity;
        this.zoomSpeed = 100;

        this.isDown = false;

        this.enable();
    }

    enable() {
        this.domElement.addEventListener('mousedown', this.onStart, false);
        this.domElement.addEventListener('mousemove', this.onMove, false);
        this.domElement.addEventListener('mouseup', this.onEnd, false);
        this.domElement.addEventListener('touchstart', this.onStart, false);
        this.domElement.addEventListener('touchmove', this.onMove, false);
        this.domElement.addEventListener('touchend', this.onEnd, false);
        global.addEventListener('mousewheel', this.onWheel, false);
    }

    disable() {
        this.domElement.removeEventListener('mousedown', this.onStart, false);
        this.domElement.removeEventListener('mousemove', this.onMove, false);
        this.domElement.removeEventListener('mouseup', this.onEnd, false);
        this.domElement.removeEventListener('touchstart', this.onStart, false);
        this.domElement.removeEventListener('touchmove', this.onMove, false);
        this.domElement.removeEventListener('touchend', this.onEnd, false);
        global.removeEventListener('mousewheel', this.onWheel, false);

    }

    onStart = (event) => {
        event.preventDefault();

        this.oy = this.ry;
        this.ox = this.rx;

        this._startY = event.pageX / this.width;
        this._startX = event.pageY / this.height;

        this.isDown = true;
    }

    onMove = (event) => {
        if (this.isDown) {
            const y = event.pageX / this.width;
            const x = event.pageY / this.height;
            this.rx = this.ox + -(this._startX - x) * this.rotationSpeed;
            this.ry = this.oy + (this._startY - y) * this.rotationSpeed;
            this.rx = clamp(this.rx, -Math.PI * 0.5, Math.PI * 0.5);
        }
    }

    onEnd = () => {
        this.isDown = false;
    }

    onWheel = (event) => {
        event.preventDefault();
        let delta = 0;

        if (event.wheelDelta) {
            delta = event.wheelDelta;
        } else if (event.detail) {
            delta = event.detail;
        }

        this.zoom(-delta);
    }

    zoom(delta) {
        this.radius += (delta / 1000) * this.zoomSpeed;
        this.radius = clamp(this.radius, this.zoomMin, this.zoomMax);
    }

    update() {
        const y = this.radius * Math.sin(this.rx);
        const r = this.radius * Math.cos(this.rx);
        const x = Math.sin(this.ry) * r;
        const z = Math.cos(this.ry) * r;
        vec3.set(this.camera.position.data, x, y, z);
    }

}

export default OrbitControls;
