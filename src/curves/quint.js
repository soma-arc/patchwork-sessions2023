import Curve from './curve.js';

export class EaseInQuint extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (x * x * x * x * x);
    }
}


export class EaseOutQuint extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (1 - Math.pow(1 - x, 5));
    }
}

export class EaseInOutQuint extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2);
    }
}
