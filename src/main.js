import Scene from './scene.js';

const scene = new Scene();
let ctx = undefined;
window.addEventListener('load', () => {
    const fps = 60;
    const intervalMillis = 1000 / fps;

    const canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    const startMillis = Date.now();
    let prevTimeMillis = 0;
    const loop = () => {
        const timeMillis = Date.now() - startMillis;
        if(timeMillis >= prevTimeMillis + intervalMillis) {
            const t = prevTimeMillis + intervalMillis;
            progress(t);
            render(ctx);
            prevTimeMillis += intervalMillis;
        }
        requestAnimationFrame(loop);
    };

    function progress(timeMillis) {
        scene.progress(timeMillis);
    }

    function render(ctx) {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
        scene.render(ctx);
        ctx.restore();
    }

    progress(0);
    render(ctx);
    loop();

    const graphCanvas = document.getElementById('graphCanvas');
    const c = graphCanvas.getContext('2d');
    c.translate(0, graphCanvas.height * 0.5);
    c.scale(1, -1);
    c.scale(0.1, 1);
    c.fillStyle = 'red';
    c.fillRect(0, 0, graphCanvas.width, graphCanvas.height * 0.5);
    scene.drawGraph(c);
});
