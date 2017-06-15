class Renderer {

    constructor(props = {}) {
        this.width = props.width || global.innerWidth;
        this.height = props.height || global.innerHeight;
        this.ratio = props.ratio || global.devicePixelRatio;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    setRatio(ratio) {
        this.ratio = ratio;
    }

}

export default Renderer;
