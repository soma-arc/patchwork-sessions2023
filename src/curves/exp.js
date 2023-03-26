import Curve from './curve.js';

export class EaseInExp extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (x === 0 ? 0 : Math.pow(2, 10 * x - 10));
    }
}


export class EaseOutExp extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
    }
}

export class EaseInOutExp extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        const v = x === 0 ? 0 : x === 1 ? 1
              : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
              : (2 - Math.pow(2, -20 * x + 10)) / 2;
        return this.startValue + this.diff * v;
    }
}
