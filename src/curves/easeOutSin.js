import Curve from './curve.js';

export default class EaseOutSin extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * Math.sin((x * Math.PI) / 2);
    }
}
