import Curve from './curve.js';

export class EaseInCirc extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (1 - Math.sqrt(1 - Math.pow(x, 2)));
    }
}


export class EaseOutCirc extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (Math.sqrt(1 - Math.pow(x - 1, 2)));
    }
}

export class EaseInOutCirc extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        const v = x === 0 ? 0 : x === 1 ? 1
              : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
              : (2 - Math.pow(2, -20 * x + 10)) / 2;
        return this.startValue + this.diff * v;
    }
}
