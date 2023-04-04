import Scene from './scene.js';
import Canvas from './canvas.js';

export default class RenderManager {
    constructor(canvasId) {
        this.canvas = new Canvas(canvasId);
        this.scene = new Scene(this.canvas);
    }

    progress(timeMillis) {
        this.scene.progress(timeMillis);
    }

    render() {
        this.scene.renderToTexture();
        this.canvas.renderTextureToCanvas(this.scene.outputTexture);
    }
}
