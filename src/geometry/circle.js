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

    invertOnPoint(p) {
        const d = p.sub(this.center);
        const len = d.length();
        return d.scale(this.rSq / (len * len)).add(this.center);
    }

    /**
     * Apply inversion to a given circle
     * @param {Circle} c
     * @returns {Circle}
     */
    invertOnCircle (c) {
        const coeffR = c.r * Math.sqrt(2) / 2;
        const p1 = this.invertOnPoint(c.center.add(new Vec2(coeffR, coeffR)));
        const p2 = this.invertOnPoint(c.center.add(new Vec2(-coeffR, -coeffR)));
        const p3 = this.invertOnPoint(c.center.add(new Vec2(coeffR, -coeffR)));
        return Circle.fromPoints(p1, p2, p3);
    }

    /**
     * Compute a circle passing through three points
     * @param {Vec2} a
     * @param {Vec2} b
     * @param {Vec2} c
     * @returns {Circle}
     */
    static fromPoints (a, b, c) {
        const lA = Vec2.distance(b, c);
        const lB = Vec2.distance(a, c);
        const lC = Vec2.distance(a, b);
        const coefA = lA * lA * (lB * lB + lC * lC - lA * lA);
        const coefB = lB * lB * (lA * lA + lC * lC - lB * lB);
        const coefC = lC * lC * (lA * lA + lB * lB - lC * lC);
        const denom = coefA + coefB + coefC;
        const center = new Vec2((coefA * a.x + coefB * b.x + coefC * c.x) / denom,
                                (coefA * a.y + coefB * b.y + coefC * c.y) / denom);
        return new Circle(center.x, center.y, Vec2.distance(center, a));
    }

    get rSq() {
        return this.r * this.r;
    }
}
