import TimeLine from './timeLine.js';
import Circle from './geometry/circle.js';
import Linear from './curves/linear.js';
import Step from './curves/step.js';
import EaseInSin from './curves/easeInSin.js';
import EaseOutSin from './curves/easeOutSin.js';

export default class Scene {
    /** @type{Array.<TimeLine>} */
    #timeLines = [];
    #objects = [];
    constructor() {
        const circle = new Circle(0, 0, 10);
        this.#objects.push(circle);
        const timeLine = new TimeLine(0);
        const timeLine2 = new TimeLine(0);
        const timeLine3 = new TimeLine(0);
        const linear = new Linear(2000, 3000, 100);
        const linear2 = new Linear(3000, 4000, 50);
        const step = new Step(3000, 50);
        const inSin = new EaseInSin(1000, 3000, 100);
        const outSin = new EaseOutSin(3500, 4500, 200);
        // Curveの追加は早いものから順に加える
        // 途中で挿入したい場合はソートを実装する必要がある
        timeLine.addCurve(linear);
        timeLine2.addCurve(step);
        timeLine3.addCurve(inSin);
        timeLine3.addCurve(step);
        timeLine3.addCurve(outSin);
        // タイムラインで取得される値にオブジェクトのフィールドなどが紐付けられる
        //timeLine.bindField(circle.center, 'x');
        timeLine2.bindField(circle.center, 'y');
        timeLine3.bindField(circle.center, 'x');
        this.#timeLines.push(timeLine);
        this.#timeLines.push(timeLine2);
        this.#timeLines.push(timeLine3);
    }

    /**
     * @param {number} timeMillis
     */
    progress(timeMillis) {
        for(const timeLine of this.#timeLines) {
            timeLine.progress(timeMillis);
        }
    }

    render(ctx) {
        for(const obj of this.#objects) {
            obj.render(ctx);
        }
    }

    drawGraph(ctx) {
        this.#timeLines[2].drawGraph(ctx);
    }
}
