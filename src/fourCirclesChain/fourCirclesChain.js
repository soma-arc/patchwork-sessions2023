import Vec2 from '../vector2d';
import Line from '../geometry/line.js';
import Circle from '../geometry/circle.js';

export default class FourCirclesChain {
    constructor(x, y, radius, param) {
        // center and radois of the common circle
        this.center = new Vec2(x, y);
        this.radius = radius;

        this.p = this.center.add(new Vec2(0, this.radius));
        this.q = this.center.add(new Vec2(-this.radius, 0));
        this.r = this.center.add(new Vec2(0, -this.radius));
        this.s = this.center.add(new Vec2(this.radius, 0));

        this.param = param;
        this.update();
    }

    update() {
        const pqMid = this.p.add(this.q).scale(0.5);
        const u = pqMid.sub(this.center).scale(1.0 / Vec2.distance(this.center, pqMid));
        const a = u.scale(this.radius * Math.sin(this.param) * 6. + 6.72).add(this.center);
        this.c1 = new Circle(a.x, a.y, Vec2.distance(a, this.p));
        
        const aq = new Line(a, this.q);
        const qrMidPer = new Line(this.center, this.q.add(this.r).scale(0.5));
        const b = Line.computeIntersection(aq, qrMidPer);
        this.c2 = new Circle(b.x, b.y, Vec2.distance(b, this.q));

        const br = new Line(b, this.r);
        const rsMidPer = new Line(this.center, this.r.add(this.s).scale(0.5));
        const c = Line.computeIntersection(br, rsMidPer);
        this.c3 = new Circle(c.x, c.y, Vec2.distance(c, this.r));

        const cs = new Line(c, this.s);
        const spMidPer = new Line(this.center, this.s.add(this.p).scale(0.5));
        const d = Line.computeIntersection(cs, spMidPer);
        this.c4 = new Circle(d.x, d.y, Vec2.distance(d, this.s));
    }

    DFS() {
        const generators = [this.c1, this.c2, this.c3, this.c4];
        const circles = [generators];
        const tags = [[0, 1, 2, 3]];
        const maxLevel = 3;
        for (let level = 1; level < maxLevel; level++) {
            circles.push([]);
            tags.push([]);
            for (let circleIndex = 0; circleIndex < circles[level - 1].length; circleIndex++) {
                for (let i = 0; i < 4; i++) {
                    if (tags[level - 1][circleIndex] === i) continue;
                    circles[level].push(generators[i].invertOnCircle(circles[level - 1][circleIndex]));
                    tags[level].push(i);
                }
            }
        }
        return circles;
    }
}
