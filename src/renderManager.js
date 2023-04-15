import Canvas from './canvas.js';
import SceneBuilder from './sceneBuilder.js';

export default class RenderManager {
    constructor(canvasId) {
        this.canvas = new Canvas(canvasId);
    }

    init() {
        const sceneBuilder = new SceneBuilder(this.canvas);
        this.scene1 = sceneBuilder.genScene1();

        this.renderGraph();
    }
    
    progress(timeMillis) {
        this.scene1.progress(timeMillis);
    }

    render() {
        this.scene1.renderToTexture();
        this.canvas.renderTextureToCanvas(this.scene1.outputTexture);
    }

    renderGraph() {
        const graphCanvas = document.getElementById('graphCanvas');
        const ctx = graphCanvas.getContext('2d');
        ctx.translate(0, graphCanvas.height * 0.5);
        ctx.scale(1, -1);
        ctx.scale(0.1, 10);

        this.scene1.renderGraph(ctx);
    }
}
