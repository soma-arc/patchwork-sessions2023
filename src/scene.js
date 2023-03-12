import TimeLine from './timeLine.js';
import Circle from './geometry/circle.js';
import Linear from './curves/linear.js';
import Step from './curves/step.js';

export default class Scene {
    /** @type{Array.<TimeLine>} */
    #timeLines = [];
    #objects = [];
    constructor() {
        const circle = new Circle(0, 0, 10);
        this.#objects.push(circle);
        const timeLine = new TimeLine(0);
        const timeLine2 = new TimeLine(0);
        const linear = new Linear(2000, 3000, 100);
        const step = new Step(3000, 50);
        timeLine.addCurve(linear);
        timeLine2.addCurve(step);
        // タイムラインで取得される値にオブジェクトのフィールドなどが紐付けられる
        timeLine.bindField(circle.center, 'x');
        timeLine2.bindField(circle.center, 'y');
        this.#timeLines.push(timeLine);
        this.#timeLines.push(timeLine2);
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
}
