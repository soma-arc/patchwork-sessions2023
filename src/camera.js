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
        this.uniLocations = [];
    }

    setUniformLocations(gl, program) {
        this.uniLocations.splice(0);
        this.uniLocations.push(gl.getUniformLocation(program, 'u_camera.pos'));
        this.uniLocations.push(gl.getUniformLocation(program, 'u_camera.target'));
        this.uniLocations.push(gl.getUniformLocation(program, 'u_camera.fovRad'));
        this.uniLocations.push(gl.getUniformLocation(program, 'u_camera.up'));
    }

    setUniformValues(gl) {
        let index = 0;
        gl.uniform3f(this.uniLocations[index++],
                     this.pos.x, this.pos.y, this.pos.z);
        gl.uniform3f(this.uniLocations[index++],
                     this.target.x, this.target.y, this.target.z);
        gl.uniform1f(this.uniLocations[index++],
                     this.fovDegrees / 180.0);
        gl.uniform3f(this.uniLocations[index++],
                     this.up.x, this.up.y, this.up.z);
    }
}
