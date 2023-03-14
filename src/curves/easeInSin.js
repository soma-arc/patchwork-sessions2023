import Curve from './curve.js';

export default class EaseInSin extends Curve {
    value(timeMillis) {
        const x = this.normalizeValue(timeMillis);
        return this.startValue + this.diff * (1 - Math.cos((x * Math.PI) / 2));
    }
}
