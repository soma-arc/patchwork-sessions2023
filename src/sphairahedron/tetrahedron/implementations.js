import Sphairahedron from '../sphairahedron';
import Tetrahedron from './tetrahedron.js';

class TetrahedronA extends Tetrahedron {
    constructor() {
        super(0, 0);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_333;
    }
}

class TetrahedronB extends Tetrahedron {
    constructor() {
        super(0, 0);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_236;
    }
}

class TetrahedronC extends Tetrahedron {
    constructor() {
        super(0, 0);
        this.prismPlanes = Sphairahedron.PRISM_PLANES_244;
    }
}

export default [TetrahedronA, TetrahedronB, TetrahedronC];
