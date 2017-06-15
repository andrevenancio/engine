class Scene {

    constructor() {
        this.models = [];
        this.lights = [];
    }

    /**
    * @param {Model} model - adds a model to the scene
    */
    addModel(model) {
        model.parent = this;
        this.models.push(model);
    }

    /**
    * @param {Model} model - removes a model from the scene
    */
    removeModel(model) {
        const index = this.models.indexOf(model);
        if (index !== -1) {
            model.destroy();
            this.models.splice(index, 1);
        }
    }

}

export default Scene;
