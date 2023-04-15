import Music from './music';
import RenderManager from './renderManager.js';

window.addEventListener('load', () => {
    const fps = 60;
    const intervalMillis = 1000 / fps;

    const renderManager = new RenderManager('canvas');
    const music = new Music();

    document.getElementById('startButton').addEventListener('click', async () => {
        await renderManager.canvas.canvas.requestFullscreen();
        await music.setup();
        renderManager.init();
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
        music.start();
        loop();
    });
});
