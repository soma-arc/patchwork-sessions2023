
import Sphere from '../../geometry/sphere.js';
import Sphairahedron from '../sphairahedron.js';
import Cube from './cube.js';

const SQRT_3 = Math.sqrt(3);
const SQRT_2 = Math.sqrt(2);

class CubeA extends Cube {
    constructor(tb, tc) {
        super(tb, tc);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_333;
    }

    computeSpheres() {
        const r2 = 0.5 + (this.zb * this.zc) / 3.0;
        const r4 = 0.5 + (this.zb * this.zb - this.zb * this.zc) / 3.0;
        const r6 = 0.5 + (-this.zb * this.zc + this.zc * this.zc) / 3.0;
        const s2 = new Sphere(1 - r2, 0, 0, r2);
        const s4 = new Sphere(-(1 - r4) * 0.5, this.zb, Math.sqrt(3) * (1 - r4) * 0.5, r4);
        const s6 = new Sphere(-(1 - r6) * 0.5, this.zc, -Math.sqrt(3) * (1 - r6) * 0.5, r6);

        this.prismSpheres = [s2, s4, s6];
    }
}

class CubeB extends Cube {
    constructor(tb, tc) {
        super(tb, tc);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_333;
    }

    computeSpheres() {
        const r2 = (3 * SQRT_3 + 2 * SQRT_3 * this.zb * this.zc) / 9.0;
        const r4 = (3 * this.zb * this.zb - 4 * this.zb * this.zc + 3) / 9.0;
        const r6 = (3 * this.zc * this.zc - 2 * this.zb * this.zc + 6) / 9.0;
        const s2 = new Sphere((2 - SQRT_3 * r2) * 0.5, 0, r2 * 0.5, r2);
        const s4 = new Sphere(-(1 - r4) * 0.5, this.zb, SQRT_3 * (1 - r4) * 0.5, r4);
        const s6 = new Sphere(-(1 - r6) * 0.5, this.zc, -SQRT_3 * (1 - r6) * 0.5, r6);
        this.prismSpheres = [s2, s4, s6];
    }
}

class CubeC extends Cube {
    constructor(tb, tc) {
        super(tb, tc);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_333;
    }

    computeSpheres() {
        const r2 = (this.zb * this.zb + 2 * this.zb * this.zc + 6) / (5 * SQRT_3);
        const r4 = (3 * this.zb * this.zb - 4 * this.zb * this.zc + 3) / (5 * SQRT_3);
        const r6 = (-this.zb * this.zb - 2 * this.zb * this.zc + 5 * this.zc * this.zc + 9) / 15.0;
        const s2 = new Sphere((2 - SQRT_3 * r2) * 0.5, 0, r2 * 0.5, r2);
        const s4 = new Sphere(-0.5, this.zb, SQRT_3 / 2 - r4, r4);
        const s6 = new Sphere(-(1 - r6) * 0.5, this.zc, -SQRT_3 * (1 - r6) * 0.5, r6);

        this.prismSpheres = [s2, s4, s6];
    }
}

class CubeD extends Cube {
    constructor(tb, tc) {
        super(tb, tc);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_236;
    }

    computeSpheres() {
        const r2 = (3 * this.zb * this.zb + this.zc * this.zc + 6 * this.zb * this.zc + 6) / 18;
        const r4 = (15 * this.zb * this.zb - this.zc * this.zc - 6 * this.zb * this.zc + 12) / (18 * SQRT_3);
        const r6 = (-3 * this.zb * this.zb + 5 * this.zc * this.zc - 6 * this.zb * this.zc + 12) / 18.0;
        const s2 = new Sphere(1 - r2, 0, 0, r2);
        const s4 = new Sphere(0.5, this.zb, SQRT_3 / 2 - r4, r4);
        const s6 = new Sphere(-(1 - r6) * 0.5, this.zc, -SQRT_3 * (1 - r6) * 0.5, r6);

        this.prismSpheres = [s2, s4, s6];
    }
}

class CubeE extends Cube {
    constructor(tb, tc) {
        super(tb, tc);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_236;
    }

    computeSpheres() {
        const r2 = (this.zc * this.zc + 6 * this.zb * this.zc + 3) / (7 * SQRT_3);
        const r4 = (7 * this.zb * this.zb - this.zc * this.zc - 6 * this.zb * this.zc + 4) / (14);
        const r6 = (2 * this.zc * this.zc - 2 * this.zb * this.zc + 6) / 7.0;
        const s2 = new Sphere(1 - SQRT_3 * 0.5 * r2, 0, r2 * 0.5, r2);
        const s4 = new Sphere((1 + r4) * 0.5, this.zb, (1 - r4) * SQRT_3 * 0.5, r4);
        const s6 = new Sphere(-(1 - r6) * 0.5, this.zc, -(1 - r6) * SQRT_3 * 0.5, r6);

        this.prismSpheres = [s2, s4, s6];
    }
}

class CubeH extends Cube {
    constructor(tb, tc) {
        super(tb, tc);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_236;
    }

    computeSpheres() {
        const r2 = (3 * this.zb * this.zb + 2 * this.zb * this.zc + 3) / (5 * SQRT_3);
        const r4 = 2 * (this.zb * this.zb - this.zb * this.zc + 1) / (5);
        const r6 = (-3 * this.zb * this.zb - 2 * this.zb * this.zc + 5 * this.zc * this.zc + 12) / (10 * SQRT_3);
        const s2 = new Sphere(1 - SQRT_3 / 2 * r2, 0, r2 / 2, r2);
        const s4 = new Sphere((1 - r4) / 2, this.zb, (1 - r4) * SQRT_3 / 2, r4);
        const s6 = new Sphere(SQRT_3 / 2 * r6 - 0.5, this.zc, (-SQRT_3 + r6) / 2, r6);

        this.prismSpheres = [s2, s4, s6];
    }
}

class CubeI extends Cube {
    constructor(tb, tc) {
        super(tb, tc);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_244;
    }

    computeSpheres() {
        const r2 = (this.zc * this.zc + 2 * this.zb * this.zc + 2) / 6;
        const r4 = SQRT_2 * (-this.zc * this.zc - 2 * this.zb * this.zc + 3 * this.zb * this.zb + 4) / 12;
        const r6 = (this.zc * this.zc - this.zb * this.zc + 2) / (3);
        const s2 = new Sphere(1 - r2, 0, 0, r2);
        const s4 = new Sphere(r4 / SQRT_2, this.zb, 1 - r4 / SQRT_2, r4);
        const s6 = new Sphere(0, this.zc, -1 + r6, r6);

        this.prismSpheres = [s2, s4, s6];
    }

    computeDividePlanes() {
        this.dividePlanes = [];
        this.dividePlanes.push(this.computePlane(0, 3, 5));
    }
}

export default [CubeA, CubeB, CubeC, CubeD, CubeE,
                CubeH, CubeI];
