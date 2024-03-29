import Vec3 from '../vector3d.js';
import Sphere from '../geometry/sphere.js';
import Plane from '../geometry/plane.js';

const RT_3 = Math.sqrt(3);
const RT_3_INV = 1.0 / Math.sqrt(3);

export default class Sphairahedron {
    /**
     * @param {number} zb
     * @param {number} zc
     */
    constructor(zb, zc) {
        this.zb = zb;
        this.zc = zc;

        this.numFaces = 0;
        this.numSpheres = 0;
        this.numPlanes = 0;
        this.vertexIndexes = [];
        this.numVertexes = this.vertexIndexes.length;
        this.numDividePlanes = 1;
        this.numExcavationSpheres = 0;
        this.maxSlicePlanes = 12;

        this.prismSpheres = new Array(3);
        this.prismPlanes = [];
        this.boundingPlanes = [];

        this.inversionSphere = new Sphere(0, 0, 0, 1);

        this.bboxMin = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
        this.bboxMax = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE];

        this.maxIterations = 80;
        this.fudgeFactor = 0.2;

        this.inversionSphereScale = 1.0;
    }

    update() {
        this.computeSpheres();
        this.computeInversionSphere();
        this.inversionSphere.r *= this.inversionSphereScale;
        this.computeGenSpheres();
        this.computeVertexes();
        this.computeDividePlanes();
        this.computeExcavationSpheres();
        this.computeSeedSpheres();
        this.computeConvexSphere();
        this.computeBoundingVolume();
    }

    getContext() {
        return {
            numPrismSpheres: this.prismSpheres.length,
            numPrismPlanes: this.prismPlanes.length,
            numDividePlanes: this.dividePlanes.length,
            numFiniteSpheres: this.gSpheres.length,
            numConvexSpheres: this.convexSpheres.length,
        };
    }

    /**
     *
     */
    getUniformLocations(gl, program) {
        this.uniLocations = [];
        this.uniLocations.push(gl.getUniformLocation(program, 'u_sphairahedron.zbzc'));
        for(let i = 0; i < this.prismSpheres.length; i++) {
            this.uniLocations.push(gl.getUniformLocation(program, `u_sphairahedron.prismSpheres[${i}]`));
        }
        for(let i = 0; i < this.prismPlanes.length; i++) {
            this.uniLocations.push(gl.getUniformLocation(program, `u_sphairahedron.prismPlanes[${i}].normal`));
            this.uniLocations.push(gl.getUniformLocation(program, `u_sphairahedron.prismPlanes[${i}].origin`));
        }
        for(let i = 0; i < this.dividePlanes.length; i++) {
            this.uniLocations.push(gl.getUniformLocation(program, `u_sphairahedron.dividePlanes[${i}].normal`));
            this.uniLocations.push(gl.getUniformLocation(program, `u_sphairahedron.dividePlanes[${i}].origin`));
        }

        for(let i = 0; i < this.gSpheres.length; i++) {
            this.uniLocations.push(gl.getUniformLocation(program, `u_sphairahedron.finiteSpheres[${i}]`));
        }
        for(let i = 0; i < this.convexSpheres.length; i++) {
            this.uniLocations.push(gl.getUniformLocation(program, `u_sphairahedron.convexSpheres[${i}]`));
        }
        this.uniLocations.push(gl.getUniformLocation(program, 'u_sphairahedron.boundingSphere'));

        this.uniLocations.push(gl.getUniformLocation(program, 'u_sphairahedron.boundingPlaneY'));

        this.uniLocations.push(gl.getUniformLocation(program, 'u_sphairahedron.maxIterations'));
        this.uniLocations.push(gl.getUniformLocation(program, 'u_sphairahedron.fudgeFactor'));
    }

    setUniformValues(gl) {
        let index = 0;
        gl.uniform2f(this.uniLocations[index++], this.zb, this.zc);
        for(let i  = 0; i < this.prismSpheres.length; i++) {
            gl.uniform4f(this.uniLocations[index++],
                         this.prismSpheres[i].center.x,
                         this.prismSpheres[i].center.y,
                         this.prismSpheres[i].center.z, this.prismSpheres[i].r);
        }

        for(let i  = 0; i < this.prismPlanes.length; i++) {
            gl.uniform3f(this.uniLocations[index++],
                         this.prismPlanes[i].normal.x,
                         this.prismPlanes[i].normal.y,
                         this.prismPlanes[i].normal.z);
            gl.uniform3f(this.uniLocations[index++],
                         this.prismPlanes[i].p1.x,
                         this.prismPlanes[i].p1.y,
                         this.prismPlanes[i].p1.z);
        }

        for (let i = 0; i < this.dividePlanes.length; i++) {
            gl.uniform3f(this.uniLocations[index++],
                         this.dividePlanes[i].normal.x,
                         this.dividePlanes[i].normal.y,
                         this.dividePlanes[i].normal.z);
            gl.uniform3f(this.uniLocations[index++],
                         this.dividePlanes[i].p1.x,
                         this.dividePlanes[i].p1.y,
                         this.dividePlanes[i].p1.z);
        }

        for(let i  = 0; i < this.gSpheres.length; i++) {
            gl.uniform4f(this.uniLocations[index++],
                         this.gSpheres[i].center.x,
                         this.gSpheres[i].center.y,
                         this.gSpheres[i].center.z,
                         this.gSpheres[i].r);
        }

        for(let i  = 0; i < this.convexSpheres.length; i++) {
            gl.uniform4f(this.uniLocations[index++],
                         this.convexSpheres[i].center.x,
                         this.convexSpheres[i].center.y,
                         this.convexSpheres[i].center.z,
                         this.convexSpheres[i].r);
        }

        gl.uniform4f(this.uniLocations[index++],
                     this.boundingSphere.center.x,
                     this.boundingSphere.center.y,
                     this.boundingSphere.center.z,
                     this.boundingSphere.r);

        gl.uniform1f(this.uniLocations[index++], this.boundingPlaneY);

        gl.uniform1i(this.uniLocations[index++], this.maxIterations);
        gl.uniform1f(this.uniLocations[index++], this.fudgeFactor);
    }

    /**
     * プリズム型Sphairahedronの面を構成している球を反転させてfinite sphairahedronの構成要素にする反転球を求める
     */
    computeInversionSphere() {}

    /**
     * プリズム型Sphairahedronを構成する球を求める
     */
    computeSpheres() {}

    /**
     * finite sphairahedronを構成する球を求める
     */
    computeGenSpheres() {}

    computeVertexes() {
        this.vertexes = [];
        for (const vert of this.vertexIndexes) {
            this.vertexes.push(this.computeIdealVertex(this.gSpheres[vert[0]],
                                                       this.gSpheres[vert[1]],
                                                       this.gSpheres[vert[2]]));
        }
    }

    /**
     *
     * @param {Number} vertexIdx1
     * @param {Number} vertexIdx2
     * @param {Number} vertexIdx3
     * @returns {Plane}
     */
    computePlane(vertexIdx1, vertexIdx2, vertexIdx3) {
        const p1 = this.inversionSphere.invertOnPoint(this.vertexes[vertexIdx1]);
        const p2 = this.inversionSphere.invertOnPoint(this.vertexes[vertexIdx2]);
        const p3 = this.inversionSphere.invertOnPoint(this.vertexes[vertexIdx3]);

        const v1 = p2.sub(p1);
        const v2 = p3.sub(p1);
        let normal = Vec3.cross(v1, v2).normalize();
        if (normal.y < 0) {
            normal = normal.scale(-1);
        }
        return new Plane(p1, p2, p3, normal);
    }

    computeDividePlanes() {
        this.dividePlanes = [];
        this.dividePlanes.push(this.computePlane(0, 1, 2));
    }

    computeExcavationSpheres() {
        this.excavationPrismSpheres = [];
        this.excavationSpheres = [];
    }

    computeSeedSpheres() {
        this.seedSpheres = [];
        for (let i = 0; i < this.numVertexes; i++) {
            this.addSphereIfNotExists(this.seedSpheres,
                                      this.computeMinSeedSphere(this.vertexes[i], this.vertexes,
                                                                this.gSpheres[this.vertexIndexes[i][0]],
                                                                this.gSpheres[this.vertexIndexes[i][1]],
                                                                this.gSpheres[this.vertexIndexes[i][2]]));
        }
    }

    computeConvexSphere() {
        this.convexSpheres = [];
        for (let i = 0; i < this.numDividePlanes; i++) {
            this.convexSpheres.push(this.inversionSphere.invertOnPlane(this.dividePlanes[i]));
        }
    }

    computeBoundingVolume () {
        this.boundingPlaneY = Number.MIN_VALUE;
        let boundingPlaneMinY = Number.MAX_VALUE;
        for (const s of this.prismSpheres) {
            this.boundingPlaneY = Math.max(this.boundingPlaneY, s.center.y);
            boundingPlaneMinY = Math.min(boundingPlaneMinY, s.center.y);
        }
        if (this.inversionSphere.center.y < boundingPlaneMinY) {
            this.boundingSphere = this.inversionSphere.invertOnPlane(new Plane(new Vec3(1, boundingPlaneMinY, -9),
                                                                               new Vec3(-4, boundingPlaneMinY, -4),
                                                                               new Vec3(10, boundingPlaneMinY, 3),
                                                                               new Vec3(0, 1, 0)));
        } else {
            this.boundingSphere = this.inversionSphere.invertOnPlane(new Plane(new Vec3(1, this.boundingPlaneY, -9),
                                                                               new Vec3(-4, this.boundingPlaneY, -4),
                                                                               new Vec3(10, this.boundingPlaneY, 3),
                                                                               new Vec3(0, 1, 0)));
        }
        this.boundingPlaneY *= 1.01;
        this.boundingSphere.r *= 1.01;
    }

    /**
     *
     * @param {Vec3} x
     * @param {Vec3} y
     * @param {Sphere} a
     * @param {Sphere} b
     * @param {Sphere} c
     * @returns {Sphere}
     */
    computeSeedSphere(x, y, a, b, c) {
        const ab = b.center.sub(a.center);
        const ac = c.center.sub(a.center);
        const n = Vec3.cross(ab, ac);
        const k = y.sub(x).lengthSq() / (2 * Vec3.dot(y.sub(x), n));
        const center = x.add(n.scale(k));
        return new Sphere(center.x, center.y, center.z, Math.abs(k) * n.length());
    }

    /**
     * @param {Array.<Sphere>} spheres
     * @param {Sphere} sphere
     */
    addSphereIfNotExists(spheres, sphere) {
        for (const s of spheres) {
            if (Math.abs(s.r, sphere.r) < 0.00001 &&
                Vec3.distance(s.center, sphere.center) < 0.00001) {
                console.log('duplicate');
//                return;
            }
        }
        spheres.push(sphere);
    }

    /**
     *
     * @param {Sphere} a
     * @param {Sphere} b
     * @param {Sphere} c
     * @returns {Vec3}
     */
    computeIdealVertex(a, b, c) {
        const AB = (a.center.lengthSq() - b.center.lengthSq() - a.rSq + b.rSq) * 0.5 -
              a.center.lengthSq() + Vec3.dot(a.center, b.center);
        const AC = (a.center.lengthSq() - c.center.lengthSq() - a.rSq + c.rSq) * 0.5 -
              a.center.lengthSq() + Vec3.dot(a.center, c.center);
        const x = -a.center.lengthSq() - b.center.lengthSq() + 2 * Vec3.dot(a.center, b.center);
        const y = -a.center.lengthSq() - c.center.lengthSq() + 2 * Vec3.dot(a.center, c.center);
        const z = -a.center.lengthSq() + Vec3.dot(a.center, b.center) +
              Vec3.dot(a.center, c.center) - Vec3.dot(b.center, c.center);
        const s = (AB * y - AC * z) / (x * y - z * z);
        const t = (AC * x - AB * z) / (x * y - z * z);
        return a.center.add((b.center.sub(a.center)).scale(s)).add((c.center.sub(a.center)).scale(t));
    }

    /**
     *
     * @param {Vec3} x
     * @param {Array.<Vec3>} vertexes
     * @param {Sphere} a
     * @param {Sphere} b
     * @param {Sphere} c
     * @returns {Sphere}
     */
    computeMinSeedSphere(x, vertexes, a, b, c) {
        let minSphere = new Sphere(0, 0, 0, 99999999999);
        for (const ov of vertexes) {
            if (Vec3.distance(x, ov) < 0.000001) {
                // x === ov
                continue;
            }
            const s = this.computeSeedSphere(x, ov, a, b, c);
            if (s.r < minSphere.r) {
                minSphere = s;
            }
        }
        return minSphere;
    }

    static get PRISM_PLANES_333 () {
        // AB - CA - BC
        return [new Plane(new Vec3(0, 5, RT_3_INV),
                          new Vec3(1, 1, 0),
                          new Vec3(2, 2, -RT_3_INV),
                          new Vec3(RT_3 * 0.5, 0, 1.5).normalize()),
                new Plane(new Vec3(0, 3, -RT_3_INV),
                          new Vec3(1, 3, 0),
                          new Vec3(2, 2, RT_3_INV),
                          new Vec3(RT_3 * 0.5, 0, -1.5).normalize()),
                new Plane(new Vec3(-0.5, 0, 1),
                          new Vec3(-0.5, 1, 0),
                          new Vec3(-0.5, 2, 1),
                          new Vec3(-1, 0, 0))];
    }

    static get PRISM_PLANES_236 () {
        // AB - CA - BC
        return [new Plane(new Vec3(0.5, 5, RT_3 * 0.5),
                          new Vec3(1, 1, 0),
                          new Vec3(0.75, 2, RT_3 * 0.25),
                          new Vec3(1, 0, RT_3_INV).normalize()),
                new Plane(new Vec3(1, 0, 0),
                          new Vec3(0, 5, -RT_3 / 3),
                          new Vec3(-0.5, 2, -RT_3 * 0.5),
                          new Vec3(1, 0, -RT_3).normalize()),
                new Plane(new Vec3(0.5, 3, RT_3 * 0.5),
                          new Vec3(0, -10, 0),
                          new Vec3(-0.5, -3, -RT_3 * 0.5),
                          new Vec3(-1, 0, RT_3_INV).normalize())];
    }

    static get PRISM_PLANES_244 () {
        // AB - CA - BC
        return [new Plane(new Vec3(0, 5, 1),
                          new Vec3(0.5, 1, 0.5),
                          new Vec3(1, 2, 0),
                          new Vec3(0.5, 0, 0.5).normalize()),
                new Plane(new Vec3(0, 3, -1),
                          new Vec3(0.5, 3, -0.5),
                          new Vec3(1, 2, 0),
                          new Vec3(0.5, 0, -0.5).normalize()),
                new Plane(new Vec3(0, -7, 1),
                          new Vec3(0, -4, 0),
                          new Vec3(0, 8, -1),
                          new Vec3(-1, 0, 0))];
    }

    static get PRISM_PLANES_2222_SQUARE () {
        return [new Plane(new Vec3(0, 5, 1),
                          new Vec3(0.5, 1, 0.5),
                          new Vec3(1, 2, 0),
                          new Vec3(0.5, 0, 0.5).normalize()),
                new Plane(new Vec3(0, 5, 1),
                          new Vec3(-0.5, 1, 0.5),
                          new Vec3(-1, 2, 0),
                          new Vec3(-0.5, 0, 0.5).normalize()),
                new Plane(new Vec3(0, 5, -1),
                          new Vec3(-0.5, 1, -0.5),
                          new Vec3(-1, 2, 0),
                          new Vec3(-0.5, 0, -0.5).normalize()),
                new Plane(new Vec3(0, 3, -1),
                          new Vec3(0.5, 3, -0.5),
                          new Vec3(1, 2, 0),
                          new Vec3(0.5, 0, -0.5).normalize())];
    }
}
