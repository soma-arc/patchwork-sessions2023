import Curve from './curve.js';

export class EaseInSin extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (1 - Math.cos((x * Math.PI) / 2));
    }
}


export class EaseOutSin extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * Math.sin((x * Math.PI) / 2);
    }
}

export class EaseInOutSin extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (-(Math.cos(Math.PI * x) - 1) / 2);
    }
}
