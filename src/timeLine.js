export default class TimeLine {
    /**
     * @type {number}
     */
    #initialValue = 0;
    /**
     * @type {number}
     */
    #value = 0;
    /**
     * @type {Array.<Curve>}
     */
    #curves = [];
    /**
     * @type {Array.<function()>}
     */
    #boundFieldUpdaters = [];
    constructor(initialValue) {
        this.#value = initialValue;
        this.#initialValue = initialValue;
    }

    progress(timeMillis) {
        // 各種のイージングオブジェクトなどを通した後の値を設定する
        for(const curve of this.#curves) {
            this.#value = curve.value(timeMillis);
        }

        for(const updater of this.#boundFieldUpdaters) {
            updater();
        }
    }

    addCurve(curve) {
        if(this.#curves.length === 0) {
            curve.startValue = this.#initialValue;
        } else {
            curve.startValue = this.#curves[this.#curves.length - 1].targetValue;
        }
        this.#curves.push(curve);
    }

    bindField(obj, prop) {
        this.#boundFieldUpdaters.push(() => {
            obj[prop] = this.#value;
        });
    }
}
