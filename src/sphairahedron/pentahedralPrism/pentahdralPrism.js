import Sphairahedron from '../sphairahedron.js';
import Sphere from '../../geometry/sphere.js';

export default class PentahedralPrism extends Sphairahedron {
    constructor(tb, tc) {
        super(tb, tc);

        this.numFaces = 5;
        this.numSpheres = 2;
        this.numPlanes = 3;
        this.vertexIndexes = [[0, 1, 2], [2, 3, 4], [0, 3, 4],
                              [1, 2, 3], [0, 1, 3], [0, 2, 4]];
        this.numVertexes = this.vertexIndexes.length;

        this.inversionSphere = new Sphere(0.1, 4, -0.1, 0.5);
    }

    computeGenSpheres() {
        this.gSpheres = new Array(5);
        this.gSpheres[0] = this.inversionSphere.invertOnPlane(this.prismPlanes[0]);
        this.gSpheres[1] = this.inversionSphere.invertOnSphere(this.prismSpheres[0]);
        this.gSpheres[2] = this.inversionSphere.invertOnPlane(this.prismPlanes[1]);
        this.gSpheres[3] = this.inversionSphere.invertOnSphere(this.prismSpheres[1]);
        this.gSpheres[4] = this.inversionSphere.invertOnPlane(this.prismPlanes[2]);
    }
}
