import Point2 from "../geometry/Point2.js";
import Entity from "./Entity.js";
import EntityStrategies from "./EntityStrategies.js";


export default class EntityBuilder2 {

    /**
     * 
     * @param {String} id 
     * @param {Point2} centerPoint 
     */
    constructor(
        id,
        centerPoint
    ) {
        this.id = id;
        this.centerPoint = centerPoint;

        this.bodyPointMap = new Map;

        this.moveAble = false;
        this.fillInColor = "#00ff00";


    }

    setMoveAble(value) {
        this.moveAble = value;
        return this;
    }

    setFillInColor(value) {
        this.fillInColor = value;
        return this;
    }

    /**
     * 
     * @param {Array<Number>} distanceFromCenter 
     * @param {Number} offsetAngle 
     * @param {Number} baseRotation 
     * @param {Number} sizeScale 
     * @returns {EntityBuilder2}
     */
    getPointByRotatingVector(
        distanceFromCenter,
        offsetAngle,
        baseRotation,
        sizeScale
    ) {
        this.bodyPointMap = EntityStrategies.generatePointsByRotationVector(
            this.id,
            distanceFromCenter,
            this.centerPoint,
            offsetAngle,
            baseRotation,
            sizeScale
        );
        return this;
    }



    build() {

        return new Entity(
            this.id,
            this.centerPoint,
            this.bodyPointMap,
            this.moveAble,
            this.fillInColor
        );

    }


}

