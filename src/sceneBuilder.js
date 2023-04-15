import Music from './music.js';
import Scene from './scene.js';
import TimeLine from './timeLine.js';
import {EaseInCubic, EaseOutCubic, EaseInOutCubic} from './curves/cubic.js';
import Sphere from './objects/sphere.js';
import Camera from './camera.js';
import Vec3 from './vector3d';

import SCENE1_FRAG_TMPL from './shaders/scene1.njk.frag';

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
            gl.uniform4f(uniLocations[index++], sphere.x, sphere.y, sphere.z, sphere.r);
            camera.setUniformValues(gl);
        };
        scene.addUniformValuesSetter(setUniformValues);

        scene.build();
        return scene;
    }
}
