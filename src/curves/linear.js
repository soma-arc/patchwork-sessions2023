import Curve from './curve.js';

export default class Linear extends Curve {
    /**
     * @param {number} startMillis
     * @param {number} endMillis
     * @param {number} targetValue
     */
    constructor(startMillis, endMillis, targetValue) {
        super(startMillis, endMillis);
        this.targetValue = targetValue;
        this.startValue = 0;
        this.diff = this.targetValue - this.startValue;
    }

    /**
     * @param {number} timeMillis
     */
    value(timeMillis) {
        const v = this.normalizeValue(timeMillis);
        return this.startValue + v * this.diff;
    }
}
