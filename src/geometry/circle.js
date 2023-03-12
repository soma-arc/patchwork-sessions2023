import Vec2 from '../vector2d.js';

export default class Circle {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} r
     */
    constructor(x, y, r) {
        this.center = new Vec2(x, y);
        this.r = r;
    }

    createOnUpdated() {
        return (timeLine) => {
            this.center.x = timeLine.v;
        };
    }

    render(ctx) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
