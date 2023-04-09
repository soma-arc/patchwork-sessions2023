import TimeLine from './timeLine.js';
import Circle from './geometry/circle.js';
import Linear from './curves/linear.js';
import Step from './curves/step.js';
import {EaseInSin, EaseOutSin, EaseInOutSin} from './curves/sin.js';
import {EaseInQuad, EaseOutQuad, EaseInOutQuad} from './curves/quad.js';
import {EaseInCubic, EaseOutCubic, EaseInOutCubic} from './curves/cubic.js';
import {EaseInQuart, EaseOutQuart, EaseInOutQuart} from './curves/quart.js';
import {EaseInQuint, EaseOutQuint, EaseInOutQuint} from './curves/quint.js';
import {EaseInExp, EaseOutExp, EaseInOutExp} from './curves/exp.js';
import {EaseInCirc, EaseOutCirc, EaseInOutCirc} from './curves/circ.js';

import Camera from './camera.js';

import Vec3 from './vector3d.js';

import RENDER_VERTEX from './shaders/render.vert';
import RENDER_FRAGMENT_TMPL from './shaders/scene1.njk.frag';
import RENDER_SPHAIRAHEDRON_TMPL from './shaders/scene2.njk.frag';

import GLUtils from './glUtils.js';

import cubeSphairahedron from './sphairahedron/cube/implementations.js';

export default class Scene {
    /** @type{Array.<TimeLine>} */
    #timeLines = [];
    #objects = [];
    constructor(canvas) {
        this.canvas = canvas;
        const circle = new Circle(0, 0, 10);
        this.#objects.push(circle);
        const timeLine = new TimeLine(0);
        const timeLine2 = new TimeLine(0);
        const timeLine3 = new TimeLine(0);
        const linear = new Linear(2000, 3000, 100);
        const linear2 = new Linear(3000, 4000, 50);
        const step = new Step(3000, 50);
        const inSin = new EaseInSin(1000, 3000, 100);
        const outSin = new EaseOutSin(3500, 4500, 200);
        const inOutSin = new EaseInOutSin(1000, 3000, 100);

        const inQuad = new EaseInQuad(1000, 3000, 100);
        const outQuad = new EaseOutQuad(1000, 3000, 100);
        const inOutQuad = new EaseInOutQuad(1000, 3000, 100);

        const inCubic = new EaseInCubic(1000, 3000, 100);
        const outCubic = new EaseOutCubic(1000, 3000, 100);
        const inOutCubic = new EaseInOutCubic(1000, 3000, 100);

        const inQuart = new EaseInQuart(1000, 3000, 100);
        const outQuart = new EaseOutQuart(1000, 3000, 100);
        const inOutQuart = new EaseInOutQuart(1000, 3000, 100);

        const inQuint = new EaseInQuint(1000, 3000, 100);
        const outQuint = new EaseOutQuint(1000, 3000, 100);
        const inOutQuint = new EaseInOutQuint(1000, 3000, 100);

        const inExp = new EaseInExp(1000, 3000, 100);
        const outExp = new EaseOutExp(1000, 3000, 100);
        const inOutExp = new EaseInOutExp(1000, 3000, 100);


        const inCirc = new EaseInCirc(1000, 3000, 100);
        const outCirc = new EaseOutCirc(1000, 3000, 100);
        const inOutCirc = new EaseInOutCirc(1000, 3000, 100);
        // Curveの追加は早いものから順に加える
        // 途中で挿入したい場合はソートを実装する必要がある
        timeLine.addCurve(linear);

        timeLine2.addCurve(step);

        timeLine3.addCurve(inOutCirc);
        timeLine3.addCurve(step);
        timeLine3.addCurve(outSin);

        // タイムラインで取得される値にオブジェクトのフィールドなどが紐付けられる
        //timeLine.bindField(circle.center, 'x');
        timeLine2.bindField(circle.center, 'y');
        timeLine3.bindField(circle.center, 'x');
        this.#timeLines.push(timeLine);
        this.#timeLines.push(timeLine2);
        this.#timeLines.push(timeLine3);

        this.sphairahedron = new cubeSphairahedron[0](0.21, 0.2);
        this.sphairahedron.update();

        this.camera = new Camera(new Vec3(0, 10, 10),
                                 new Vec3(0, 0, 0),
                                 60, new Vec3(0, 1, 0));

        this.gl = this.canvas.gl;
        this.vertexBuffer = GLUtils.CreateSquareVbo(this.gl);
        this.renderProgram = this.gl.createProgram();

        GLUtils.AttachShader(this.gl, RENDER_VERTEX,
                             this.renderProgram, this.gl.VERTEX_SHADER);

        //GLUtils.AttachShader(this.gl, RENDER_FRAGMENT_TMPL.render(this.getRenderContext()),
        //this.renderProgram, this.gl.FRAGMENT_SHADER);
        const context = this.sphairahedron.getContext();
        console.log(context);
        console.log(RENDER_SPHAIRAHEDRON_TMPL.render(context));
        GLUtils.AttachShader(this.gl, RENDER_SPHAIRAHEDRON_TMPL.render(context),
                             this.renderProgram, this.gl.FRAGMENT_SHADER);

        GLUtils.LinkProgram(this.gl, this.renderProgram);
        this.renderVAttrib = this.gl.getAttribLocation(this.renderProgram,
                                                       'a_vertex');

        this.textureFrameBuffer = this.gl.createFramebuffer();
        this.outputTexture = GLUtils.CreateRGBAFloatTexture(this.gl, this.canvas.width, this.canvas.height);

        this.sphairahedron.getUniformLocations(this.canvas.gl, this.renderProgram);
        this.sphairahedron.setUniformValues(this.canvas.gl);
        this.getUniformLocations();
    }

    getUniformLocations() {
        this.uniLocations = [];
        this.uniLocations.push(this.gl.getUniformLocation(this.renderProgram, 'u_resolution'));

        this.camera.setUniformLocations(this.gl, this.uniLocations, this.renderProgram);
    }

    setUniformValues() {
        let i = 0;
        this.gl.uniform2f(this.uniLocations[i++], this.canvas.width, this.canvas.height);

        i = this.camera.setUniformValues(this.gl, this.uniLocations, i);
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
        return {};
    }

    // getUniformLocations() {
    //     this.uniLocations = [];
    //     this.uniLocations.push(this.canvas.gl.getUniformLocation(this.renderProgram, 'u_resolution'));
    //     this.camera.setUniformLocations(this.canvas.gl, this.uniLocations, this.renderProgram);
    //     for(const obj of this.#objects) {
    //         obj.setUniformLocations(this.canvas.gl, this.uniLocations, this.renderProgram);
    //     }
    // }

    // setUniformValues() {
    //     let index = 0;
    //     this.canvas.gl.uniform2f(this.uniLocations[index++], this.canvas.width, this.canvas.height);
    //     this.camera.setUniformValues(this.canvas.gl, this.uniLocations, index++);
    //     for(const obj of this.#objects) {
    //         obj.setUniformVelues(this.canvas.gl, this.uniLocations, index++);
    //     }
    // }

    /**
     * @param {number} timeMillis
     */
    progress(timeMillis) {
        for(const timeLine of this.#timeLines) {
            timeLine.progress(timeMillis);
        }
    }

    render(ctx) {
        for(const obj of this.#objects) {
            obj.render(ctx);
        }
    }

    drawGraph(ctx) {
        this.#timeLines[2].drawGraph(ctx);
    }
}
