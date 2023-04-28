import GLUtils from './glUtils.js';

import RENDER_VERTEX from './shaders/render.vert';
import RENDER_FRAGMENT from './shaders/render.frag';
import RENDER_FLIPPED_VERTEX from './shaders/renderFlipped.vert';
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

        this.renderProductProgram = this.gl.createProgram();
        GLUtils.AttachShader(this.gl, RENDER_FLIPPED_VERTEX,
                             this.renderProductProgram, this.gl.VERTEX_SHADER);
        GLUtils.AttachShader(this.gl, RENDER_FRAGMENT,
                             this.renderProductProgram, this.gl.FRAGMENT_SHADER);
        GLUtils.LinkProgram(this.gl, this.renderProductProgram);
        this.renderVAttrib = this.gl.getAttribLocation(this.renderProductProgram,
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

    renderTextureToCanvasFlipped(texture) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.useProgram(this.renderProductProgram);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        const tex = this.gl.getUniformLocation(this.renderProductProgram, 'u_texture');
        this.gl.uniform1i(tex, texture);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.enableVertexAttribArray(this.renderVAttrib);
        this.gl.vertexAttribPointer(this.renderVAttrib, 2,
                                    this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.flush();
    }

    async save (filename) {
        const gl = this.gl;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const data = new Uint8Array(width * height * 4);
        const type = gl.UNSIGNED_BYTE;
        gl.readPixels(0, 0, width, height, gl.RGBA, type, data);

        const saveCanvas = document.createElement('canvas');
        saveCanvas.width = width;
        saveCanvas.height = height;
        const context = saveCanvas.getContext('2d');

        const imageData = context.createImageData(width, height);
        imageData.data.set(data);
        context.putImageData(imageData, 0, 0);
        const a = document.createElement('a');
        const promise = new Promise(resolve => {
            saveCanvas.toBlob(blob => {
                resolve(blob);
            });
        });
        const blob = await promise;

        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }
}
