import Sphairahedron from '../sphairahedron.js';
import Sphere from '../../geometry/sphere.js';

export default class Tetrahedron extends Sphairahedron {
    constructor(tb, tc) {
        super(tb, tc);

        this.numFaces = 4;
        this.numSpheres = 1;
        this.numPlanes = 3;
        this.vertexIndexes = [[0, 1, 3], [0, 2, 3], [1, 2, 3],
                              [0, 1, 2]];
        this.numVertexes = this.vertexIndexes.length;

        this.prismSpheres = [new Sphere(0, 0, 0, 1)];
        this.inversionSphere = new Sphere(0.5, 3, 0, 1.3);
    }

    computeGenSpheres() {
        this.gSpheres = new Array(4);
        this.gSpheres[0] = this.inversionSphere.invertOnPlane(this.prismPlanes[0]);
        this.gSpheres[1] = this.inversionSphere.invertOnPlane(this.prismPlanes[1]);
        this.gSpheres[2] = this.inversionSphere.invertOnPlane(this.prismPlanes[2]);
        this.gSpheres[3] = this.inversionSphere.invertOnSphere(this.prismSpheres[0]);
    }
}
