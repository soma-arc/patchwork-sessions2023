import Vec2 from '../vector2d.js';

export default class Line {
    /**
     * @param {Vec2} p1
     * @param {Vec2} p2
     */
    constructor(p1, p2) {
        const xDiff = p2.x - p1.x;
        const yDiff = p2.y - p1.y;
        if (Math.abs(xDiff) < 0.) {
            //x = c
            this.x = 1;
            this.y = 0;
            this.z = p1.x;
        } else if (Math.abs(yDiff) < 0.) {
            //y = c
            this.x = 0;
            this.y = 1;
            this.z = p1.y;
        } else {
            //y = ax + b
            this.x = yDiff / xDiff;
            this.y = p1.y - p1.x * (yDiff / xDiff);
            this.z = 0;
        }
    }

    computeX(y) {
        if (this.z == 0.) {
            return (y - this.y) / this.x;
        } else {
            return this.z;
        }
    }

    computeY(x) {
        if(this.z == 0.){
            return this.x * x + this.y;
        } else {
            return this.z;
        }
    }

    static computeIntersection(line1, line2) {
        if (line1.z == 0. && line2.z == 0.) {
            const x1 = 1.;
            const x2 = 5.;
            const y1 = line1.computeY(x1);
            const y2 = line1.computeY(x2);
            
            const x3 = 4.;
            const x4 = 8.;
            const y3 = line2.computeY(x3);
            const y4 = line2.computeY(x4);
            
            const ksi = (y4 - y3) * (x4 - x1) - (x4 - x3) * (y4 - y1);
            // const eta = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
            const delta = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);
            
            const lambda = ksi / delta;
            // const mu = eta / delta;
            return new Vec2(x1 + lambda * (x2 - x1), y1 + lambda * (y2 - y1));
        } else {
            if (line1.x == 1.) {
                return new Vec2(line1.z, line2.computeY(line1.z));
            } else if (line1.y == 1.) {
                return new Vec2(line2.computeX(line1.z), line1.z);
            } else if (line2.x == 1.) {
                return new Vec2(line2.z, line1.computeY(line2.z));
            }
            return new Vec2(line1.computeX(line2.z), line2.z);
        }
    }
}
