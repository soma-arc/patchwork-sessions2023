export default class Curve {
    /**
     * 動作を始める時間
     * @type {number}
     */
    startMillis;
    /**
     * 動作が完了する時間
     * @type {number}
     */
    endMillis;
    /**
     * 何ミリ秒かけて動作をおこなうか
     * @type {number}
     */
    durationMillis;
    /**
     *
     * @type {number}
     */
    startValue;
    /**
     *
     * @type {number}
     */
    targetValue;
    /**
     * @param {number} startMillis
     * @param {number} endMillis
     * @param {number} targetValue
     */
    constructor(startMillis, endMillis, targetValue) {
        this.startMillis = startMillis;
        this.endMillis = endMillis;
        this.targetValue = targetValue;
        this.durationMillis = endMillis - startMillis;
    }

    clamp(x, minVal, maxVal) {
        return Math.min(Math.max(x, minVal), maxVal);
    }

    normalizeValue(timeMillis) {
        // normalize value [0, 1]
        return this.clamp(timeMillis - this.startMillis, 0, this.durationMillis) / this.durationMillis;
    }

    setStartValue(startValue) {
        this.startValue = startValue;
        this.diff = this.targetValue - this.startValue;
    }
}
