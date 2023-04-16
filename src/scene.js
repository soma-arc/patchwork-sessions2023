import GLUtils from './glUtils.js';

import RENDER_VERTEX from './shaders/render.vert';

export default class Scene {
    /** @type{Array.<TimeLine>} */
    #timeLines = [];
    constructor(canvas, fragmentTemplate) {
        this.canvas = canvas;
        this.fragmentTemplate = fragmentTemplate;

        this.gl = this.canvas.gl;
        this.vertexBuffer = GLUtils.CreateSquareVbo(this.gl);
        this.renderProgram = this.gl.createProgram();

        this.textureFrameBuffer = this.gl.createFramebuffer();
        this.outputTexture = GLUtils.CreateRGBAFloatTexture(this.gl, this.canvas.width, this.canvas.height);

        this.uniLocationsSetter = [];
        this.uniformValuesSetter = [];
        this.sceneContext = {};
    }

    build() {
        GLUtils.AttachShader(this.gl, RENDER_VERTEX,
                             this.renderProgram, this.gl.VERTEX_SHADER);

        GLUtils.AttachShader(this.gl, this.fragmentTemplate.render(this.getRenderContext()),
                             this.renderProgram, this.gl.FRAGMENT_SHADER);

        GLUtils.LinkProgram(this.gl, this.renderProgram);
        this.renderVAttrib = this.gl.getAttribLocation(this.renderProgram,
                                                       'a_vertex');

        this.getUniformLocations();
    }
    
    addTimeLine(timeLine) {
        this.#timeLines.push(timeLine);
    }

    addUniLocationsSetter(setter) {
        this.uniLocationsSetter.push(setter);
    }

    addUniformValuesSetter(setter) {
        this.uniformValuesSetter.push(setter);
    }

    setSceneContext(sceneContext) {
        this.sceneContext = sceneContext;
    }

    getUniformLocations() {
        this.uniLocations = [];
        this.uniLocations.push(this.gl.getUniformLocation(this.renderProgram, 'u_resolution'));

        for(const setter of this.uniLocationsSetter) {
            setter(this.gl, this.renderProgram);
        }
    }

    setUniformValues() {
        let i = 0;
        this.gl.uniform2f(this.uniLocations[i++], this.canvas.width, this.canvas.height);

        for(const setter of this.uniformValuesSetter) {
            setter(this.gl);
        }
    }

    renderToTexture() {
        this.gl.getExtension('EXT_color_buffer_float');
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.textureFrameBuffer);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.useProgram(this.renderProgram);

        this.setUniformValues();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0,
                                     this.gl.TEXTURE_2D, this.outputTexture, 0);
        this.gl.enableVertexAttribArray(this.renderVAttrib);
        this.gl.vertexAttribPointer(this.renderVAttrib, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    getRenderContext() {
        const renderContext = {};
        return Object.assign(renderContext, this.sceneContext);
    }

    /**
     * @param {number} timeMillis
     */
    progress(timeMillis) {
        for(const timeLine of this.#timeLines) {
            timeLine.progress(timeMillis);
        }
    }

    renderGraph(ctx) {
        //this.#timeLines[0].drawGraph(ctx);
    }
}
