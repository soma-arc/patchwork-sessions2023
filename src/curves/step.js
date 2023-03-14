import Curve from './curve.js';

export default class Step extends Curve {
    /**
     * @param {number} startMillis
     * @param {number} targetValue
     */
    constructor(startMillis, targetValue) {
        super(startMillis, startMillis, targetValue);
    }

    /**
     * @param {number} timeMillis
     */
    value(timeMillis) {
        if(timeMillis >= this.startMillis)
            return this.targetValue;
        return this.startValue;
    }
}
