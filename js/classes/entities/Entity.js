import Calculations from "../common/Calculations.js";
import Point2 from "../geometry/Point2.js";
import EntityStrategies from "./EntityStrategies.js";

export default class Entity {

    /**
     * 
     * @param {String} id 
     * @param {Point2} centerPoint 
     * @param {Map<String, Point2>} bodyPointMap 
     * @param {boolean} moveAble 
     * @param {String} fillInCollor 
     */
    constructor(
        id,
        centerPoint,
        bodyPointMap,
        moveAble,
        fillInCollor
    ) {
        this.id = id;
        this.centerPoint = centerPoint;
        this.moveAble = moveAble;
        this.fillInCollor = fillInCollor;

        // generated
        this.kind = "Entity2";
        this.bodyPointMap = bodyPointMap;
        this.isDoomed = false;

        /**@type {Number} */
        this.stepX = 0;
        /**@type {Number} */
        this.stepY = 0;

    }

    setUp() {
        return this;
    }

    update(maxX, maxY) {

        if (this.moveAble) {
            this.centerPoint.moveMeX();
            this.centerPoint.moveMeY();

            for (const [key, value] of this.bodyPointMap) {
                value.moveMeX();
                value.moveMeY();
            }


            if (this.centerPoint.changed) {
                this.centerPoint.handleOutOfBorder(maxX, maxY);
                this.centerPoint.resetChangedFlag();
            }

            for (const [key, value] of this.bodyPointMap) {
                value.handleOutOfBorder(maxX, maxY);
                value.resetChangedFlag();
            }

        } else {
        }

        return this;
    }

    /**
     * 
     * @param {Number} futureX 
     * @param {Number} futureY
     */
    moveMeTo(futureX, futureY) {
        this.stepX = futureX - this.centerPoint.x;
        this.stepY = futureY - this.centerPoint.y;
        this.moveMeBy(this.stepX, this.stepY);

    }

    moveMeBy(stepX, stepY) {
        this.centerPoint.setVectorByStep(stepX, stepY);
        this.centerPoint.changed = true;

        for (const [key, value] of this.bodyPointMap) {
            value.setVectorByStep(stepX, stepY);
            value.changed = true;
        }

    }

    destroy() {
        this.isDoomed = true;
        return this.id;
    }


    drawMe(ctx) {
        //this.centerPoint.drawMe(ctx);

        for (const [key, value] of this.bodyPointMap) {
            value.drawMe(ctx);
        }

    }

    /**
     * 
     * @param {Boolean} value 
     * @returns {ThisType}
     */
    setMoveAble(value) {
        this.moveAble = value;
        return this;
    }


}

