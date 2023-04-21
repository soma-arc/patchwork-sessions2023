import Music from './music.js';
import Scene from './scene.js';
import TimeLine from './timeLine.js';
import {EaseInCubic, EaseOutCubic, EaseInOutCubic} from './curves/cubic.js';
import Linear from './curves/linear.js';

import Circle from './geometry/circle.js';

import Camera from './camera.js';
import Vec3 from './vector3d';
import FourCirclesChain from './fourCirclesChain/fourCirclesChain.js';

import Cube from './sphairahedron/cube/implementations.js';
import Vec2 from './vector2d';

import SCENE2_FRAG_TMPL from './shaders/scene2.njk.frag';
import CIRCLES_FRAG_TMPL from './shaders/sceneCircles.njk.frag';
import CHAIN_TMPL from './shaders/chain.njk.frag';
import MASKIT_TMPL from './shaders/maskit.njk.frag';
import BLACK_TMPL from './shaders/black.njk.frag';

export default class SceneBuilder {
    constructor(canvas) {
        this.canvas = canvas;
    }

    genBlack() {
        const scene = new Scene(this.canvas, BLACK_TMPL);
        scene.build();
        return scene;
    }

    genScene1() {
        const scene = new Scene(this.canvas, MASKIT_TMPL);
        const uniLocations = [];

        const sceneContext = {
        };
        scene.setSceneContext(sceneContext);

        const translation = [0, 1];
        let scale = 1.;
        const paramPoint = new Vec2(6, 0);
        let rotationRad = 0;

        const timeLine = new TimeLine(6);

        const scaleTimeLine = new TimeLine(1);
        let ini = Music.measureIntervalMillis * 18 + Music.quarterIntervalMillis;
        timeLine.addCurve(new EaseOutCubic(ini, ini + 200, 2));

        ini = Music.measureIntervalMillis * 18 + 3 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, 2.5));
        
        const timeLine2 = new TimeLine(0);
        ini = Music.measureIntervalMillis * 18 + 5 * Music.quarterIntervalMillis;
        timeLine2.addCurve(new EaseOutCubic(ini, ini + 1 * Music.quarterIntervalMillis, 3.));

        ini = Music.measureIntervalMillis * 18 + 7 * Music.quarterIntervalMillis;
        timeLine2.addCurve(new EaseOutCubic(ini, ini + 1 * Music.quarterIntervalMillis, -3.));
        ini = Music.measureIntervalMillis * 18 + 9 * Music.quarterIntervalMillis;
        timeLine2.addCurve(new EaseOutCubic(ini, ini + 1 * Music.quarterIntervalMillis, 0));

        ini = Music.measureIntervalMillis * 18 + 11 * Music.quarterIntervalMillis;
        timeLine.addCurve(new EaseOutCubic(ini, ini + 2 * Music.quarterIntervalMillis, 2.0 - 0.29 * Math.abs(Math.sin(Math.PI/2))));
        timeLine2.addCurve(new EaseOutCubic(ini, ini + 2 * Music.quarterIntervalMillis, 0.31 * Math.sin(Math.PI/2)));

        ini = Music.measureIntervalMillis * 18 + 13 * Music.quarterIntervalMillis;
        timeLine.addCurve(new EaseOutCubic(ini, ini + 2 * Music.quarterIntervalMillis, 2.0));
        timeLine2.addCurve(new EaseOutCubic(ini, ini + 2 * Music.quarterIntervalMillis, 0));

        const translateYTimeLine = new TimeLine(1);
        ini = Music.measureIntervalMillis * 18 + 15 * Music.quarterIntervalMillis;
        translateYTimeLine.addCurve(new EaseInOutCubic(ini, ini + Music.quarterIntervalMillis, 0));
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, 0.5));

        ini = Music.measureIntervalMillis * 18 + 17 * Music.quarterIntervalMillis;
        timeLine.addCurve(new EaseOutCubic(ini, ini + 2 * Music.quarterIntervalMillis, 2.0 - 0.29 * Math.abs(Math.sin(Math.PI/2))));
        timeLine2.addCurve(new EaseOutCubic(ini, ini + 2 * Music.quarterIntervalMillis, -0.325 * Math.sin(Math.PI/2)));

        ini = Music.measureIntervalMillis * 23 - 2.0 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, Music.measureIntervalMillis * 23 + 1 * Music.measureIntervalMillis, 0.001));
        
        const rotationTimeLine = new TimeLine(0);
        ini = Music.measureIntervalMillis * 23;
        //scaleTimeLine.addCurve(new EaseInOutCubic(ini, ini + 1 * Music.measureIntervalMillis, 0.001));
        rotationTimeLine.addCurve(new EaseInOutCubic(ini, ini + 1 * Music.measureIntervalMillis, Math.PI * 4));

        scaleTimeLine.bindField(this, '', (value) => {
            scale = value;
        });
        timeLine.bindField(this, '', (value) => {
            paramPoint.x = value;
        });
        timeLine2.bindField(this, '', (value) => {
            paramPoint.y = value;
        });
        translateYTimeLine.bindField(this, '', (value) => {
            translation[1] = value;
        });
        rotationTimeLine.bindField(this, '', (value) => {
            rotationRad = value;
        });
        scene.addTimeLine(timeLine);
        scene.addTimeLine(timeLine2);
        scene.addTimeLine(scaleTimeLine);
        scene.addTimeLine(translateYTimeLine);
        scene.addTimeLine(rotationTimeLine);
        
        const setUnformLocations = (gl, program) => {
            uniLocations.push(gl.getUniformLocation(program, 'u_translation'));
            uniLocations.push(gl.getUniformLocation(program, 'u_scale'));
            uniLocations.push(gl.getUniformLocation(program, 'u_paramPoints'));
            uniLocations.push(gl.getUniformLocation(program, 'u_rotationRad'));
        };
        scene.addUniLocationsSetter(setUnformLocations);

        const setUniformValues = (gl) => {
            let index = 0;
            gl.uniform2f(uniLocations[index++], translation[0], translation[1]);
            gl.uniform1f(uniLocations[index++], scale);
            gl.uniform2f(uniLocations[index++], paramPoint.x, paramPoint.y);
            gl.uniform1f(uniLocations[index++], rotationRad);
        };
        scene.addUniformValuesSetter(setUniformValues);

        scene.build();
        return scene;
    }

    genScene2() {
        const scene = new Scene(this.canvas, CIRCLES_FRAG_TMPL);

        const circles = [
            new Circle(1, 1, 0),
            new Circle(-1, 1, 0),
            new Circle(-1, -1, 0),
            new Circle(1, -1, 0),
            new Circle(0, 0, 0),
            new Circle(0.522734315, 0, 0),
            new Circle(0, 0.522734315, 0),
            new Circle(-0.522734315, 0, 0),
            new Circle(0, -0.522734315, 0),
        ];
        const numCircles = circles.length;
        const sceneContext = {
            numCircles: numCircles
        };
        scene.setSceneContext(sceneContext);

        const uniLocations = [];
        const setUnformLocations = (gl, program) => {
            uniLocations.splice(0);
            uniLocations.push(gl.getUniformLocation(program, 'u_translate'));
            uniLocations.push(gl.getUniformLocation(program, 'u_scale'));
            uniLocations.push(gl.getUniformLocation(program, 'u_rotationDegrees'));
            for (let i = 0; i < numCircles; i++) {
                uniLocations.push(gl.getUniformLocation(program, `u_circles[${i}]`));
            }
        };
        scene.addUniLocationsSetter(setUnformLocations);

        const c1TimeLine = new TimeLine(0);
        c1TimeLine.addCurve(new EaseOutCubic(Music.measureIntervalMillis * 8,
                                             Music.measureIntervalMillis * 8 + 200, 1));
        c1TimeLine.bindField(circles[0], 'r');
        scene.addTimeLine(c1TimeLine);

        const c2TimeLine = new TimeLine(0);
        let ini = Music.measureIntervalMillis * 8 + Music.quarterIntervalMillis;
        c2TimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 1));
        c2TimeLine.bindField(circles[1], 'r');
        scene.addTimeLine(c2TimeLine);

        const c3TimeLine = new TimeLine(0);
        ini = Music.measureIntervalMillis * 8 + 2 * Music.quarterIntervalMillis;
        c3TimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 1));
        c3TimeLine.bindField(circles[2], 'r');
        scene.addTimeLine(c3TimeLine);

        const c4TimeLine = new TimeLine(0);
        ini = Music.measureIntervalMillis * 8 + 3 * Music.quarterIntervalMillis;
        c4TimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 1));
        c4TimeLine.bindField(circles[3], 'r');
        scene.addTimeLine(c4TimeLine);

        // center
        const c5TimeLine = new TimeLine(0);
        ini = Music.measureIntervalMillis * 8 + 4 * Music.quarterIntervalMillis;
        c5TimeLine.addCurve(new EaseOutCubic(ini, ini + 200, Math.sqrt(2) - 1));
        c5TimeLine.bindField(circles[4], 'r');
        scene.addTimeLine(c5TimeLine);

        //
        const c6TimeLine = new TimeLine(0);
        ini = Music.measureIntervalMillis * 8 + 6 * Music.quarterIntervalMillis;
        c6TimeLine.addCurve(new EaseOutCubic(ini, ini + 200, Math.sqrt(0.0116837)));
        c6TimeLine.bindField(circles[5], 'r');
        scene.addTimeLine(c6TimeLine);

        const c7TimeLine = new TimeLine(0);
        ini = Music.measureIntervalMillis * 8 + 7 * Music.quarterIntervalMillis;
        c7TimeLine.addCurve(new EaseOutCubic(ini, ini + 200, Math.sqrt(0.0116837)));
        c7TimeLine.bindField(circles[6], 'r');
        scene.addTimeLine(c7TimeLine);

        const c8TimeLine = new TimeLine(0);
        ini = Music.measureIntervalMillis * 8 + 8 * Music.quarterIntervalMillis;
        c8TimeLine.addCurve(new EaseOutCubic(ini, ini + 200, Math.sqrt(0.0116837)));
        c8TimeLine.bindField(circles[7], 'r');
        scene.addTimeLine(c8TimeLine);

        const c9TimeLine = new TimeLine(0);
        ini = Music.measureIntervalMillis * 8 + 9 * Music.quarterIntervalMillis;
        c9TimeLine.addCurve(new EaseOutCubic(ini, ini + 200, Math.sqrt(0.0116837)));
        c9TimeLine.bindField(circles[8], 'r');
        scene.addTimeLine(c9TimeLine);

        this.rotationRad = 0;
        const rotationTimeLine = new TimeLine(0);
        ini = Music.measureIntervalMillis * 8 + 5 * Music.quarterIntervalMillis;
        rotationTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, Math.PI * 2));
        rotationTimeLine.bindField(this, 'rotationRad');
        scene.addTimeLine(rotationTimeLine);

        let scale = 5.0;
        const scaleTimeLine = new TimeLine(5);
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 2));
        scaleTimeLine.bindField(this, '', (value) => {
            scale = value;
        });
        scene.addTimeLine(scaleTimeLine);

        ini = Music.measureIntervalMillis * 8 + 10 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 0.83));

        rotationTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 0));

        ini = Music.measureIntervalMillis * 8 + 11 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 0.83 * 0.8));

        ini = Music.measureIntervalMillis * 8 + 12 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 0.83 * 0.8 * 0.8));

        ini = Music.measureIntervalMillis * 8 + 13 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 0.83 * 0.8 * 0.8 * 0.8));

        ini = Music.measureIntervalMillis * 8 + 14 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 0.83 * 0.8 * 0.8 * 0.8 * 0.8));

        ini = Music.measureIntervalMillis * 8 + 15 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 0.01));

        
        const translation = [0, 0];
        
        const setUniformValues = (gl) => {
            let index = 0;
            gl.uniform2f(uniLocations[index++], translation[0], translation[1]);
            gl.uniform1f(uniLocations[index++], scale);
            gl.uniform1f(uniLocations[index++], this.rotationRad);
            // gl.uniform3f(uniLocations[index++],
            //              c1.center.x,
            //              c1.center.y,
            //              c1.r);
            for (let i = 0; i < numCircles; i++) {
                gl.uniform3f(uniLocations[index++],
                             circles[i].center.x,
                             circles[i].center.y,
                             circles[i].r);
            }
        };
        scene.addUniformValuesSetter(setUniformValues);

        scene.build();
        return scene;
    }

    genFourCirclesChain() {
        const scene = new Scene(this.canvas, CHAIN_TMPL);

        const chain = new FourCirclesChain(0, 0, 1, 12.5);
        const circlesArray = chain.DFS();
        const circles = circlesArray[circlesArray.length - 1];
        
        const split = (v1, v2, values) => {
            const threshold = 0.01;
            const d = Vec2.distance(v1, v2);
            if (Math.abs(d) > threshold) {
                const m = v1.add(v2).scale(0.5);
                split(v1, m, values);
                split(m, v2, values);
            } else {
                values.push(v1);
                values.push(v2);
            }
        };
        const values = [];
        for(let i = 1; i < circles.length; i++) {
            split(circles[i - 1].center, circles[i].center, values);
        }

        const numCircles = 4;
        const sceneContext = {
            numCircles: numCircles
        };
        scene.setSceneContext(sceneContext);

        const uniLocations = [];
        const setUnformLocations = (gl, program) => {
            uniLocations.splice(0);
            uniLocations.push(gl.getUniformLocation(program, 'u_translate'));
            uniLocations.push(gl.getUniformLocation(program, 'u_scale'));
            uniLocations.push(gl.getUniformLocation(program, 'u_rotationRad'));
            for (let i = 0; i < numCircles; i++) {
                uniLocations.push(gl.getUniformLocation(program, `u_circles[${i}]`));
            }
        };
        scene.addUniLocationsSetter(setUnformLocations);

        const translation = [0, 0];
        let scale = 0.01;
        let rotationRad = 0;
        const scaleTimeLine = new TimeLine(0.01);
        let ini = Music.measureIntervalMillis * 12 + Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 0.2));

        ini = Music.measureIntervalMillis * 12 + 3 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 0.75));

        ini = Music.measureIntervalMillis * 12 + 5 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 1.0));

        ini = Music.measureIntervalMillis * 12 + 7 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 1.5));
        
        scaleTimeLine.bindField(this, '', (value) => {
            scale = value;
        });
        scene.addTimeLine(scaleTimeLine);

        const bassTimeLine = new TimeLine(12.5);

        //for (let i = 0; i < 4; i++) {
        ini = Music.measureIntervalMillis * 13;
        //bassTimeLine.addCurve(new EaseOutCubic(ini, ini + 2. * Music.measureIntervalMillis, 12));
        // bassTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 3.5));
        // ini = Music.measureIntervalMillis * 13 + Music.quarterIntervalMillis;
        // bassTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 4.5));
        // ini = Music.measureIntervalMillis * 13 + 2 * Music.quarterIntervalMillis;
        // bassTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 5.5));
        // ini = Music.measureIntervalMillis * 13 + 3 * Music.quarterIntervalMillis;
        // bassTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 6.5));

        // ini = Music.measureIntervalMillis * 14;
        // bassTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 7.5));
        // ini = Music.measureIntervalMillis * 14 + Music.quarterIntervalMillis;
        // bassTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 8.5));
        // ini = Music.measureIntervalMillis * 14 + 2 * Music.quarterIntervalMillis;
        // bassTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 9.5));
        // ini = Music.measureIntervalMillis * 14 + 3 * Music.quarterIntervalMillis;
        // bassTimeLine.addCurve(new EaseOutCubic(ini, ini + 200, 12));
        // //}
            
        bassTimeLine.bindField(chain, 'param', () => {
            chain.update();
        });

        scene.addTimeLine(bassTimeLine);

        const rotationTimeLine = new TimeLine(0);
        ini = Music.measureIntervalMillis * 12 + 9 * Music.quarterIntervalMillis;
        rotationTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, Math.PI));
        ini = Music.measureIntervalMillis * 12 + 11 * Music.quarterIntervalMillis;
        rotationTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, Math.PI * 2));
        rotationTimeLine.bindField(this, '', (value) => {
            rotationRad = value;
        });
        scene.addTimeLine(rotationTimeLine);

        const translationXTimeLine = new TimeLine(0);
        translationXTimeLine.bindField(this, '', (value) => {
            translation[0] = value;
        });
        scene.addTimeLine(translationXTimeLine);

        const translationYTimeLine = new TimeLine(0);

        ini = Music.measureIntervalMillis * 12 + 13 * Music.quarterIntervalMillis;
        translationXTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, -2.8));
        translationYTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, 2.7));
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, 0.5));


        ini = Music.measureIntervalMillis * 12 + 15 * Music.quarterIntervalMillis;
        translationXTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, 2.603));
        translationYTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, -2.4));
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, 0.2));

        ini = Music.measureIntervalMillis * 16 + Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, 0.1));

        ini = Music.measureIntervalMillis * 16 + 3 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, 0.05));

        ini = Music.measureIntervalMillis * 16 + 5 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, 0.01));

        ini = Music.measureIntervalMillis * 16 + 7 * Music.quarterIntervalMillis;
        scaleTimeLine.addCurve(new EaseOutCubic(ini, ini + Music.quarterIntervalMillis, 0.001));

        translationYTimeLine.bindField(this, '', (value) => {
            translation[1] = value;
        });
        scene.addTimeLine(translationYTimeLine);
        
        const setUniformValues = (gl) => {
            let index = 0;
            gl.uniform2f(uniLocations[index++], translation[0], translation[1]);
            gl.uniform1f(uniLocations[index++], scale);
            gl.uniform1f(uniLocations[index++], rotationRad);
            gl.uniform3f(uniLocations[index++],
                         chain.c1.center.x,
                         chain.c1.center.y,
                         chain.c1.r);
            gl.uniform3f(uniLocations[index++],
                         chain.c2.center.x,
                         chain.c2.center.y,
                         chain.c2.r);
            gl.uniform3f(uniLocations[index++],
                         chain.c3.center.x,
                         chain.c3.center.y,
                         chain.c3.r);
            gl.uniform3f(uniLocations[index++],
                         chain.c4.center.x,
                         chain.c4.center.y,
                         chain.c4.r);
        };
        scene.addUniformValuesSetter(setUniformValues);

        // const timeLine = new TimeLine(2.0);
        // timeLine.bindField(chain, 'param', () => {
        //     chain.update();
        // });
        // timeLine.addCurve(new EaseInCubic(1000, 4000, 4));
        // //scene.addTimeLine(timeLine);

        // const indexTimeLine = new TimeLine(0);
        // indexTimeLine.bindField(chain, 'index', () => {
        //     chain.index = Math.floor(chain.index);
        // });
        // indexTimeLine.addCurve(new Linear(1000, 30000, values.length - 1));
        // //scene.addTimeLine(indexTimeLine);
        
        scene.build();
        return scene;
    }

    genSphairahedronScene() {
        const scene = new Scene(this.canvas, SCENE2_FRAG_TMPL);

        //const sphairahedron = new HexahedralCake2[0](0, 0);
        const sphairahedron = new Cube[0](0.00001, 0);
        sphairahedron.update();

        const camera = new Camera(new Vec3(0, 2, 0.5),
                                  sphairahedron.boundingSphere.center,
                                  60, new Vec3(0, 1, 0));

        const cameraTimeLine = new TimeLine(0);
        cameraTimeLine.addCurve(new Linear(0, Music.measureIntervalMillis * 7 + 200, 7.0));
        cameraTimeLine.bindField(camera, '', (value) => {
            camera.pos = new Vec3(0.8 * Math.cos(value), 2, 0.8 * Math.sin(value));
        });
        
        scene.addTimeLine(cameraTimeLine);
        
        const indexTimeLine = new TimeLine(0.000001);

        indexTimeLine.bindField(sphairahedron, 'zb', () => {
            sphairahedron.update();
            camera.target = sphairahedron.boundingSphere.center;
        });
        //indexTimeLine.addCurve(new Linear(Music.measureIntervalMillis * 3,
        //Music.measureIntervalMillis * 7, 1));
        const ini = Music.measureIntervalMillis * 3;
        indexTimeLine.addCurve(new EaseInCubic(ini, ini + 200, 0.15 ));
        let startMillis2;
        for(let i = 0; i < 16; i++) {
            const startMillis = ini + i * Music.quarterIntervalMillis;
            indexTimeLine.addCurve(new EaseOutCubic(startMillis + 200, startMillis + 400, -0.18 * (Math.floor(i / 4) + 1)));
            if(i === 15) break;
            startMillis2 = ini + (i + 1) * Music.quarterIntervalMillis;
            indexTimeLine.addCurve(new EaseOutCubic(startMillis2, startMillis2 + 200, 0.18 * (Math.floor((i + 1) / 4) + 1)));
        }
        startMillis2 = ini + (16) * Music.quarterIntervalMillis;
        indexTimeLine.addCurve(new EaseOutCubic(startMillis2, startMillis2 + 200, 0.5));
        startMillis2 = ini + (16) * Music.quarterIntervalMillis + Music.eighthIntervalMillis;
        indexTimeLine.addCurve(new EaseOutCubic(startMillis2, startMillis2 + 200, 0.18 * (Math.floor(16 / 4) + 1)));
            
        // indexTimeLine.addCurve(new EaseOutCubic(ini + 16 * Music.quarterIntervalMillis-200,
        //                                         ini + 16 * Music.quarterIntervalMillis + 200,
        //                                         -0.6157635467980292));


        const zcTimeLine = new TimeLine(0);
        zcTimeLine.bindField(sphairahedron, 'zc', () => {
            sphairahedron.update();
            camera.target = sphairahedron.boundingSphere.center;
        });
        zcTimeLine.addCurve(new EaseOutCubic(startMillis2, startMillis2 + 200,
                                             -1.2179686988505751));

        scene.addTimeLine(indexTimeLine);
        // scene.addTimeLine(zcTimeLine);

        // const cameraTimeLine2 = new TimeLine(0.5);
        // cameraTimeLine2.addCurve(new EaseOutCubic(startMillis2 + 200,
        //                                           startMillis2 + Music.quarterIntervalMillis * 3,
        //                                           3.0));
        // cameraTimeLine2.bindField(camera, '', (value) => {
        //     camera.pos = new Vec3(value * Math.cos(7.0), 2, value * Math.sin(7.0));
        // });
        // scene.addTimeLine(cameraTimeLine2);

        const uniLocations = [];

        scene.setSceneContext(sphairahedron.getContext());

        const setUnformLocations = (gl, program) => {
            uniLocations.splice(0);
            sphairahedron.getUniformLocations(gl, program);
            camera.setUniformLocations(gl, program);
        };
        scene.addUniLocationsSetter(setUnformLocations);

        const setUniformValues = (gl) => {
            sphairahedron.setUniformValues(gl);
            camera.setUniformValues(gl);
        };
        scene.addUniformValuesSetter(setUniformValues);
        
        scene.build();
        return scene;
    }
}
