import Curve from './curve.js';

export class EaseInQuad extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (x * x);
    }
}

export class EaseOutQuad extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (1 - (1 - x) * (1 - x));
    }
}

export class EaseInOutQuad extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
    }
}
