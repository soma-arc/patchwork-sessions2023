import RenderManager from './renderManager.js';
import * as Tone from 'tone';

window.addEventListener('load', () => {
    const fps = 60;
    const intervalMillis = 1000 / fps;

    const renderManager = new RenderManager('canvas');

    const graphCanvas = document.getElementById('graphCanvas');
    const c = graphCanvas.getContext('2d');
    c.translate(0, graphCanvas.height * 0.5);
    c.scale(1, -1);
    c.scale(0.1, 1);
    c.fillStyle = 'red';
    c.fillRect(0, 0, graphCanvas.width, graphCanvas.height * 0.5);
    renderManager.scene.drawGraph(c);

    document.getElementById('startButton').addEventListener('click', () => {
        const startMillis = Date.now();
        let prevTimeMillis = 0;
        const loop = () => {
            const timeMillis = Date.now() - startMillis;
            if (timeMillis >= prevTimeMillis + intervalMillis) {
                const t = prevTimeMillis + intervalMillis;
                renderManager.progress(t);
                renderManager.render();
                prevTimeMillis += intervalMillis;
            }
            requestAnimationFrame(loop);
        };

        renderManager.progress(0);
        renderManager.render();
        loop();
    });
});
