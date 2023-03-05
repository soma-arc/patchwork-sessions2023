import GLUtils from './glUtils.js';

export default class Canvas {
    /**
     * @type {string} canvasId
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.gl = GLUtils.GetWebGL2Context(this.canvas);
    }

    render() {
    }
}
