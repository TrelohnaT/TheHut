import Calculations from "../common/Calculations.js";
import Point2 from "../geometry/Point2.js";
import EntityShapeGenerator from "./parts/EntityShapeGenerator.js";
import EntityParameters from "./parts/EntityParameters.js";

export default class Entity {

    /**
     * 
     * @param {String} id  
     * @param {String} kind 
     * @param {Point2} centerPoint 
     * @param {Map<String, Point2>} bodyPointMap 
     * @param {EntityParameters} parameters
     */
    constructor(
        id,
        kind,
        centerPoint,
        bodyPointMap,
        parameters
    ) {
        this.id = id;
        this.kind = kind;
        this.centerPoint = centerPoint;

        /**@type {EntityParameters} */
        this.parameters = parameters;

        // generated
        this.bodyPointMap = bodyPointMap;
        this.isDoomed = false;

        /**@type {Number} */
        this.stepX = 0;
        /**@type {Number} */
        this.stepY = 0;

    }

    explode() {

        for (const [key, value] of this.bodyPointMap) {
            let vector = Calculations.getVectorBetweenTwoPoints(this.centerPoint.x, this.centerPoint.y, value.x, value.y);

            let scale = 5;
            // this sets the vector just once
            value.setVectorByStep(vector.vectorX / scale, vector.vectorY / scale);

        }

    }

    setUp() {
        return this;
    }

    update(maxX, maxY) {

        if (this.parameters.moveAble) {
            this.centerPoint.moveMeX();
            this.centerPoint.moveMeY();

            for (const [key, value] of this.bodyPointMap) {
                value.moveMeX();
                value.moveMeY();
            }

            if (this.centerPoint.changed) {
                //this.centerPoint.handleOutOfBorder(maxX, maxY);
                this.centerPoint.resetChangedFlag();
            }

            for (const [key, value] of this.bodyPointMap) {
                //value.handleOutOfBorder(maxX, maxY);
                value.resetChangedFlag();
            }

        } else {
        }

        return this;
    }

    destroy() {
        this.isDoomed = true;
        this.bodyPointMap.clear();
        return this.id;
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

        for (let [key, value] of this.bodyPointMap) {
            value.setVectorByStep(stepX, stepY);
            value.changed = true;
        }
    }

    /**
     * If pointId is in bodyPointMap, its lifetime will be shorten.
     * If lifeTime reach 0, point is "doomed" and removed.
     * @param {String} collisonPointId 
     */
    handlePointColision(collisonPointId) {
        if (this.bodyPointMap.has(collisonPointId)) {
            console.log("lifetimshorten: " + collisonPointId);
            let point = this.bodyPointMap.get(collisonPointId);
            console.log(point);
            point.decreaseLifeTime();
            if (point.doomed) {
                this.bodyPointMap.delete(collisonPointId);
            }
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawMe(ctx) {
        //this.centerPoint.drawMe(ctx);

        for (const [key, value] of this.bodyPointMap) {
            value.drawMe(ctx);
        }

        if (this.kind == EntityShapeGenerator.kindRectangle) {

            ctx.fillStyle = this.parameters.fillInCollor;
            let tmp = [...this.bodyPointMap.values()];


            ctx.fillStyle = this.parameters.fillInCollor;
            //ctx.fillRect(tmp[0].x, tmp[0].y, tmp[tmp.length - 1].x - tmp[0].x, tmp[tmp.length - 1].y - tmp[0].y);
            ctx.restore();
        }

    }

    /**
     * 
     * @param {boolean} top 
     * @param {boolean} right 
     * @param {boolean} bottom 
     * @param {boolean} left 
     * @returns {Map<String, boolean>}
     */
    static getHitAbleMap(top, right, bottom, left) {
        let map = new Map();
        map.set("top", top);
        map.set("right", right);
        map.set("bottom", bottom);
        map.set("left", left);
        return map;
    }

}

