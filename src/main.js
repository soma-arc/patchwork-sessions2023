window.addEventListener('load', () => {
    const fps = 60;
    const intervalMillis = 1000 / fps;

    const startMillis = Date.now();
    let prevTimeMillis = 0;
    const loop = () => {
        const timeMillis = Date.now() - startMillis;
        if(timeMillis >= prevTimeMillis + intervalMillis) {
            update(prevTimeMillis + intervalMillis);
            render();
            prevTimeMillis += intervalMillis;
        }
        requestAnimationFrame(loop);
    };

    update(0);
    render();
    loop();
});

function update(timeMillis) {
    //console.log(timeMillis);
}

function render() {
    
}
