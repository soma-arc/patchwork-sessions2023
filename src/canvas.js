import GLUtils from './glUtils.js';

import RENDER_VERTEX from './shaders/render.vert';
import RENDER_FRAGMENT from './shaders/render.frag';

export default class Canvas {
    /**
     * @type {string} canvasId
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        
        //this.canvas.width = window.screen.width;
        //this.canvas.height = window.screen.height;
        console.log(this.canvas.width, this.canvas.height);
        this.gl = GLUtils.GetWebGL2Context(this.canvas);

        this.vertexBuffer = GLUtils.CreateSquareVbo(this.gl);
        this.texturesFrameBuffer = this.gl.createFramebuffer();

        this.renderCanvasProgram = this.gl.createProgram();
        GLUtils.AttachShader(this.gl, RENDER_VERTEX,
                             this.renderCanvasProgram, this.gl.VERTEX_SHADER);
        GLUtils.AttachShader(this.gl, RENDER_FRAGMENT,
                             this.renderCanvasProgram, this.gl.FRAGMENT_SHADER);
        GLUtils.LinkProgram(this.gl, this.renderCanvasProgram);
        this.renderVAttrib = this.gl.getAttribLocation(this.renderCanvasProgram,
                                                       'a_vertex');
    }

    renderTextureToCanvas(texture) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.useProgram(this.renderCanvasProgram);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        const tex = this.gl.getUniformLocation(this.renderCanvasProgram, 'u_texture');
        this.gl.uniform1i(tex, texture);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.enableVertexAttribArray(this.renderVAttrib);
        this.gl.vertexAttribPointer(this.renderVAttrib, 2,
                                    this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.flush();
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }
}
