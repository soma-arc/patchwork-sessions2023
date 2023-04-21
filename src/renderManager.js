import Canvas from './canvas.js';
import SceneBuilder from './sceneBuilder.js';
import Music from './music.js';

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
        this.scene0 = sceneBuilder.genBlack();
        this.currentScene = this.initialScene;
        this.renderGraph();
    }
    
    progress(timeMillis) {
        if(timeMillis > Music.measureIntervalMillis * 24) {
            this.currentScene = this.scene0;
        } else if(timeMillis > Music.measureIntervalMillis * 18 - 200) {
            this.currentScene = this.scene1;
        } else if(timeMillis > Music.measureIntervalMillis * 12 - 200) {
            this.currentScene = this.chainScene;
        } else if(timeMillis > Music.measureIntervalMillis * 8 - Music.quarterIntervalMillis) {
            this.currentScene = this.circlesScene;
        }

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
