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

    /**
     * @param {number} initialValue
     */
    constructor(initialValue) {
        this.#value = initialValue;
        this.#initialValue = initialValue;
    }

    progress(timeMillis) {
        // 各種のイージングオブジェクトなどを通した後の値を設定する
        for(const curve of this.#curves) {
            if(curve.startMillis <= timeMillis && timeMillis <= curve.endMillis) {
                this.#value = curve.value(timeMillis);
            }
        }

        for (const updater of this.#boundFieldUpdaters) {
            updater();
        }
    }

    addCurve(curve) {
        // 現状, Curveの追加は早いものから順に加えなければならない
        // 途中で挿入したい場合はソートを実装する必要がある
        if(this.#curves.length === 0) {
            curve.setStartValue(this.#initialValue);
        } else {
            curve.setStartValue(this.#curves[this.#curves.length - 1].targetValue);
        }
        this.#curves.push(curve);
    }

    bindField(obj, prop, onUpdated) {
        this.#boundFieldUpdaters.push(() => {
            obj[prop] = this.#value;
            if(onUpdated !== undefined) {
                onUpdated();
            }
        });
    }

    drawGraph(ctx) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const timeSplitMillis = 10;
        let v = this.#initialValue;
        for(let x = 0; x < 5000; x += timeSplitMillis) {
            for(const curve of this.#curves) {
                if(curve.startMillis <= x && x <= curve.endMillis) {
                    v = curve.value(x);
                }
            }
            ctx.lineTo(x, v);
        }
        ctx.stroke();
    }
}
