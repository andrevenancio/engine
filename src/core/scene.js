class Scene {

    constructor() {
        this.models = [];
        this.lights = [];
    }

    addModel(model) {
        model.parent = this;
        this.models.push(model);
    }

    removeModel(model) {
        const index = this.models.indexOf(model);
        if (index !== -1) {
            model.destroy();
            this.models.splice(index, 1);
        }
    }

    traverse(object) {
        for (let i = 0; i < object.children.length; i += 1) {
            this.traverse(object.children[i]);
        }

        if (object.parent === null) {
            return;
        }

        object.updateMatrices();
    };

}

export default Scene;
