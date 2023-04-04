import Vec3 from './vector3d.js';

export default class Camera {
    /**
     *
     * @param {Vec3} pos
     * @param {Vec3} target
     * @param {number} fovDegrees
     * @param {Vec3} up
     */
    constructor(pos, target, fovDegrees, up) {
        this.pos = pos;
        this.target = target;
        this.prevTarget = target;
        this.fovDegrees = fovDegrees;
        this.up = up;
    }

    setUniformLocations(gl, uniLocations, program) {
        uniLocations.push(gl.getUniformLocation(program, 'u_camera.pos'));
        uniLocations.push(gl.getUniformLocation(program, 'u_camera.target'));
        uniLocations.push(gl.getUniformLocation(program, 'u_camera.fovRad'));
        uniLocations.push(gl.getUniformLocation(program, 'u_camera.up'));
    }

    setUniformValues(gl, uniLocations, uniI) {
        gl.uniform3f(uniLocations[uniI++],
                     this.pos.x, this.pos.y, this.pos.z);
        gl.uniform3f(uniLocations[uniI++],
                     this.target.x, this.target.y, this.target.z);
        gl.uniform1f(uniLocations[uniI++],
                     this.fovDegrees / 180.0);
        gl.uniform3f(uniLocations[uniI++],
                     this.up.x, this.up.y, this.up.z);
        return uniI;
    }
}
