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
        console.log(chain.DFS());
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
        const scale = 5.0;
        
        const setUniformValues = (gl) => {
            let index = 0;
            gl.uniform2f(uniLocations[index++], translation[0], translation[1]);
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
        timeLine.bindField(chain, 'param', chain.update.bind(chain));
        timeLine.addCurve(new EaseInCubic(1000, 3000, 4));
        scene.addTimeLine(timeLine);
        
        scene.build();
        return scene;
    }

    genSphairahedronScene() {
        const scene = new Scene(this.canvas, SCENE2_FRAG_TMPL);
        const timeLine = new TimeLine(1.0);
        //timeLine.addCurve(new Linear(1000, 2000, 2.0));
        // 1小節待った後
        const init = Music.measureIntervalMillis;
        // 四分音符8回 = 2小節
        for(let i = 0; i < 8; i++) {
            const startMillis = init + i * Music.quarterIntervalMillis;
            timeLine.addCurve(new EaseInCubic(startMillis, startMillis + 100, 1.5));
            timeLine.addCurve(new EaseOutCubic(startMillis + 100, startMillis + 200, 1));
        }

        const sphairahedron = new HexahedralCake2[0](0, 0);
        sphairahedron.update();
        console.log(sphairahedron);

        const camera = new Camera(new Vec3(0, 2, 2),
                                  sphairahedron.boundingSphere.center,
                                  60, new Vec3(0, 1, 0));
        timeLine.bindField(sphairahedron, 'inversionSphereScale', () => {
            sphairahedron.update();
            camera.target = sphairahedron.boundingSphere.center;
        });
        scene.addTimeLine(timeLine);

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
