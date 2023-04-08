import Sphairahedron from '../sphairahedron.js';
import Cake from './hexahedralCake3.js';
import Plane from '../../geometry/plane.js';
import Sphere from '../../geometry/sphere.js';
import Vec3 from '../../vector3d.js';

const RT_2 = Math.sqrt(2);
const RT_6 = Math.sqrt(6);
const SIN_PI_12 = (RT_6 - RT_2) * 0.25;
const COS_PI_12 = (RT_6 + RT_2) * 0.25;
const COS_5_PI_12 = SIN_PI_12;
const SIN_5_PI_12 = COS_PI_12;

class CakeA extends Cake {
    constructor(tb) {
        super(tb);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_2222_SQUARE;
    }

    computeSpheres() {
        const bc = RT_6 / 3;
        const r5 = bc;
        const r6 = this.zb * this.zb / RT_2;
        const s5 = new Sphere(1 - r5 * COS_PI_12, 0, r5 * SIN_PI_12, r5);

        const dx = (1 - bc / RT_2);
        const dy = -bc / RT_2;
        const s6 = new Sphere(dx + r6 * COS_5_PI_12, this.zb, dy + r6 * SIN_5_PI_12,
                              r6);
        this.prismSpheres = [s5, s6];
        const cx = -bc / RT_2;
        const cy = 1 - bc / RT_2;
        this.prismPlanes[2] = new Plane(new Vec3(cx, 4, cy),
                                   new Vec3((cx + dx) * 0.5, 6, (cy + dy) * 0.5),
                                   new Vec3(dx, -3, dy),
                                   this.prismPlanes[2].normal);
        this.slicePlanes[0][2] = this.prismPlanes[2];

        this.slicePlanes[1][2] = this.prismPlanes[2].invertOnPlane(this.prismPlanes[0]);

        this.slicePlanes[2][2] = this.prismPlanes[2].invertOnPlane(this.prismPlanes[0]);
        this.slicePlanes[2][3] = this.prismPlanes[3].invertOnPlane(this.prismPlanes[1]);

        this.slicePlanes[3][2] = this.prismPlanes[2].invertOnPlane(this.prismPlanes[0]);
        this.slicePlanes[3][1] = this.prismPlanes[1].invertOnPlane(this.prismPlanes[3]);
    }

    computeInversionSphere() {
        this.inversionSphere = new Sphere(this.prismSpheres[0].center.x,
                                          this.prismSpheres[0].center.y + 1.2,
                                          this.prismSpheres[0].center.z,
                                          0.5);
    }
}

class CakeB extends Cake {
    constructor(tb) {
        super(tb);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_2222_SQUARE;
    }

    computeSpheres() {
        const r5 = 1;
        const r6 = this.zb * this.zb * 0.5;
        const s5 = new Sphere(0, 0, 0, r5);
        const s6 = new Sphere(0, this.zb, -1 + r6, r6);

        this.prismSpheres = [s5, s6];

        this.slicePlanes[0][2] = this.prismPlanes[2];

        this.slicePlanes[1][2] = this.prismPlanes[2].invertOnPlane(this.prismPlanes[0]);

        this.slicePlanes[2][2] = this.prismPlanes[2].invertOnPlane(this.prismPlanes[0]);
        this.slicePlanes[2][3] = this.prismPlanes[3].invertOnPlane(this.prismPlanes[1]);

        this.slicePlanes[3][2] = this.prismPlanes[2].invertOnPlane(this.prismPlanes[0]);
        this.slicePlanes[3][1] = this.prismPlanes[1].invertOnPlane(this.prismPlanes[3]);
    }

    computeInversionSphere() {
        this.inversionSphere = new Sphere(this.prismSpheres[0].center.x,
                                          this.prismSpheres[0].center.y + 1.5,
                                          this.prismSpheres[0].center.z,
                                          0.8);
    }
}

export default [CakeA, CakeB];
