import Entity from "./Entity.js";



export default class EntityBuilder {

    constructor(
        id,
        centerPoint,
        distanceFromCenter = [10, 10, 10, 10]
    ) {
        this.id = id;
        this.centerPoint = centerPoint;
        this.distanceFromCenter = distanceFromCenter;
        // default
        this.offsetAngle = 0;
        this.baseRotation = 0;
        this.sizeScale = 1;
        this.moveAble = true;
        this.fillInCollor = "";

    }
    /**
     * 
     * @param {Number} value 
     * @returns {EntityBuilder}
     */
    setOffsetAngle(value) {
        this.offsetAngle = value;
        return this;
    }

    /**
     * 
     * @param {Number} value 
     * @returns {EntityBuilder}
     */
    setBaseRotation(value) {
        this.baseRotation = value;
        return this;
    }

    /**
     * 
     * @param {Number} value 
     * @returns {EntityBuilder}
     */
    setSizeScale(value) {
        this.sizeScale = value;
        return this;
    }

    /**
     * 
     * @param {boolean} value 
     * @returns {EntityBuilder}
     */
    setMoveAble(value) {
        this.moveAble = value;
        return this;
    }

    /**
     * 
     * @param {String} value 
     * @returns {EntityBuilder}
     */
    setFillInColor(value) {
        this.fillInCollor = value;
        return this;
    }

    /**
     * 
     * @returns {Entity}
     */
    build() {
        return new Entity(
            this.id,
            this.centerPoint,
            this.distanceFromCenter,
            this.offsetAngle,
            this.baseRotation,
            this.sizeScale,
            this.moveAble
        );
    }





}



