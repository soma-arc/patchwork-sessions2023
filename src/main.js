import Music from './music';
import RenderManager from './renderManager.js';

window.addEventListener('load', () => {
    document.getElementById('startFullscreenButton').addEventListener('click', () => {
        start(true);
    });

    document.getElementById('startButton').addEventListener('click', () => {
        start(false);
    });

    document.getElementById('renderProductButton').addEventListener('click', () => {
        renderProduct();
    });
});

async function start(fullscreen) {
    let stop = false;
    const fps = 30;
    const intervalMillis = 1000 / fps;

    const renderManager = new RenderManager('canvas');
    const music = new Music();
    if(fullscreen) {
        await renderManager.canvas.canvas.requestFullscreen();
    }
    await music.setup();
    renderManager.init();
    const startMillis = Date.now();
    let prevTimeMillis = 0;
    const loop = () => {
        if(stop) {
            music.stop();
            return;
        }
        const timeMillis = Date.now() - startMillis;
        //if (timeMillis >= prevTimeMillis + intervalMillis) {
        const t = prevTimeMillis + intervalMillis;
        renderManager.progress(timeMillis);
        renderManager.render();
        prevTimeMillis += intervalMillis;
    //}
        requestAnimationFrame(loop);
    };

    function fullscreenchanged(event) {
        if (!document.fullscreenElement) {
            stop = true;
            console.log('Leaving fullscreen mode.');
        }
    }

    document.addEventListener('fullscreenchange', fullscreenchanged);

    renderManager.progress(0);
    renderManager.render();
    music.start();
    loop();
}

async function renderProduct() {
    const fps = 30;
    const intervalMillis = 1000 / fps;

    const renderManager = new RenderManager('canvas');
    renderManager.init();

    const t = 0;
    for(let i = 0; i < 1; i++) {
        renderManager.progress(t);
        await renderManager.renderAndSave('test.png');
    }
}
