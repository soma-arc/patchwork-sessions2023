import Canvas from './canvas.js';
import SceneBuilder from './sceneBuilder.js';

export default class RenderManager {
    constructor(canvasId) {
        this.canvas = new Canvas(canvasId);
    }

    init() {
        const sceneBuilder = new SceneBuilder(this.canvas);
        this.scene1 = sceneBuilder.genScene1();
        this.circlesScene = sceneBuilder.genScene2();
        this.chainScene = sceneBuilder.genFourCirclesChain();
        this.initialScene = sceneBuilder.genSphairahedronScene();

        this.currentScene = this.initialScene;
        this.renderGraph();
    }
    
    progress(timeMillis) {
        this.currentScene.progress(timeMillis);
    }

    render() {
        this.currentScene.renderToTexture();
        this.canvas.renderTextureToCanvas(this.currentScene.outputTexture);
    }

    renderGraph() {
        const graphCanvas = document.getElementById('graphCanvas');
        const ctx = graphCanvas.getContext('2d');
        ctx.translate(0, graphCanvas.height * 0.5);
        ctx.scale(1, -1);
        ctx.scale(0.1, 10);

        this.currentScene.renderGraph(ctx);
    }
}
