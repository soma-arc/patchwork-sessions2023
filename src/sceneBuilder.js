import Music from './music.js';
import Scene from './scene.js';
import TimeLine from './timeLine.js';
import {EaseInCubic, EaseOutCubic, EaseInOutCubic} from './curves/cubic.js';
import Linear from './curves/linear.js';
import Sphere from './geometry/sphere.js';
import Circle from './geometry/circle.js';
import Plane from './geometry/plane.js';
import Camera from './camera.js';
import Vec3 from './vector3d';
import FourCirclesChain from './fourCirclesChain/fourCirclesChain.js';
import HexahedralCake2 from './sphairahedron/hexahedralCake2/implementations.js';
import Cube from './sphairahedron/cube/implementations.js';
import Vec2 from './vector2d';
import Simplex from 'perlin-simplex';

import SCENE1_FRAG_TMPL from './shaders/scene1.njk.frag';
import SCENE2_FRAG_TMPL from './shaders/scene2.njk.frag';
import CIRCLES_FRAG_TMPL from './shaders/sceneCircles.njk.frag';

export default class SceneBuilder {
    constructor(canvas) {
        this.canvas = canvas;
    }

    genScene1() {
        const scene = new Scene(this.canvas, SCENE1_FRAG_TMPL);
        const timeLine = new TimeLine(1);

        // 1小節待った後
        const init = Music.measureIntervalMillis;
        // 四分音符8回 = 2小節
        for(let i = 0; i < 8; i++) {
            const startMillis = init + i * Music.quarterIntervalMillis;
            timeLine.addCurve(new EaseInCubic(startMillis, startMillis + 100, 2));
            timeLine.addCurve(new EaseOutCubic(startMillis + 100, startMillis + 200, 1));
        }

        const camera = new Camera(new Vec3(0, 10, 10),
                                  new Vec3(0, 0, 0),
                                  60, new Vec3(0, 1, 0));

        const sphere = new Sphere(0, 0, 0, 10);
        timeLine.bindField(sphere, 'r');
        scene.addTimeLine(timeLine);

        const uniLocations = [];
        const numSpheres = 1;

        const sceneContext = {
        };
        scene.setSceneContext(sceneContext);

        const setUnformLocations = (gl, program) => {
            uniLocations.splice(0);
            for (let i = 0; i < numSpheres; i++) {
                uniLocations.push(gl.getUniformLocation(program, `u_spheres[${i}]`));
            }
            camera.setUniformLocations(gl, program);
        };
        scene.addUniLocationsSetter(setUnformLocations);

        const setUniformValues = (gl) => {
            let index = 0;
            gl.uniform4f(uniLocations[index++], sphere.center.x, sphere.center.y, sphere.center.z, sphere.r);
            camera.setUniformValues(gl);
        };
        scene.addUniformValuesSetter(setUniformValues);

        scene.build();
        return scene;
    }

    genScene2() {
        const scene = new Scene(this.canvas, CIRCLES_FRAG_TMPL);

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
            for (let i = 0; i < numCircles; i++) {
                uniLocations.push(gl.getUniformLocation(program, `u_circles[${i}]`));
            }
        };
        scene.addUniLocationsSetter(setUnformLocations);

        const circles = [
            new Circle(1, 1, 1),
            new Circle(-1, 1, 1),
            new Circle(-1, -1, 1),
            new Circle(1, -1, 1)
        ];

        const translation = [0, 0];
        const scale = 5.0;
        
        const setUniformValues = (gl) => {
            let index = 0;
            gl.uniform2f(uniLocations[index++], translation[0], translation[1]);
            gl.uniform1f(uniLocations[index++], scale);
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
        const scene = new Scene(this.canvas, CIRCLES_FRAG_TMPL);

        const chain = new FourCirclesChain(0, 0, 1, 2.0);
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
            for (let i = 0; i < numCircles; i++) {
                uniLocations.push(gl.getUniformLocation(program, `u_circles[${i}]`));
            }
        };
        scene.addUniLocationsSetter(setUnformLocations);

        const translation = [0, 0];
        const scale = 2.0;
        
        const setUniformValues = (gl) => {
            let index = 0;
            gl.uniform2f(uniLocations[index++], values[chain.index].x, values[chain.index].y);
            gl.uniform1f(uniLocations[index++], scale);
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

        const timeLine = new TimeLine(2.0);
        timeLine.bindField(chain, 'param', () => {
            chain.update();
        });
        timeLine.addCurve(new EaseInCubic(1000, 4000, 4));
        //scene.addTimeLine(timeLine);

        const indexTimeLine = new TimeLine(0);
        indexTimeLine.bindField(chain, 'index', () => {
            chain.index = Math.floor(chain.index);
        });
        indexTimeLine.addCurve(new Linear(1000, 30000, values.length - 1));
        scene.addTimeLine(indexTimeLine);
        
        scene.build();
        return scene;
    }

    genSphairahedronScene() {
        const scene = new Scene(this.canvas, SCENE2_FRAG_TMPL);

        //const sphairahedron = new HexahedralCake2[0](0, 0);
        const sphairahedron = new Cube[0](0.00001, 0);
        sphairahedron.update();
        console.log(sphairahedron);

        const camera = new Camera(new Vec3(0, 2, 0.5),
                                  sphairahedron.boundingSphere.center,
                                  60, new Vec3(0, 1, 0));


        const cameraTimeLine = new TimeLine(0);
        cameraTimeLine.addCurve(new Linear(0, Music.measureIntervalMillis * 7 + 2 * Music.eighthIntervalMillis, 7.0));
        cameraTimeLine.bindField(camera, '', (value) => {
            camera.pos = new Vec3(0.5 * Math.cos(value), 2, 0.5 * Math.sin(value));
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
        for(let i = 0; i < 15; i++) {
            const startMillis = ini + i * Music.quarterIntervalMillis;
            indexTimeLine.addCurve(new EaseOutCubic(startMillis + 200, startMillis + 400, -0.18 * (Math.floor(i / 4) + 1)));
            startMillis2 = ini + (i + 1) * Music.quarterIntervalMillis;
            indexTimeLine.addCurve(new EaseOutCubic(startMillis2, startMillis2 + 200, 0.18 * (Math.floor((i + 1) / 4) + 1)));
        }
            
        indexTimeLine.addCurve(new EaseOutCubic(ini + 16 * Music.quarterIntervalMillis-200,
                                                ini + 16 * Music.quarterIntervalMillis + 200,
                                                -0.6157635467980292));
        scene.addTimeLine(indexTimeLine);

        const zcTimeLine = new TimeLine(0);
        zcTimeLine.bindField(sphairahedron, 'zc', () => {
            sphairahedron.update();
            camera.target = sphairahedron.boundingSphere.center;
        });
        zcTimeLine.addCurve(new EaseOutCubic(ini + 16 * Music.quarterIntervalMillis - 200,
                                             ini + 16 * Music.quarterIntervalMillis + 200,
                                             0.6157635467980295));
        scene.addTimeLine(zcTimeLine);

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
