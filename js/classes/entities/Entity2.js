import Calculations from "../common/Calculations.js";
import Point2 from "../geometry/Point2.js";



export default class Entity2 {

    /**
     * 
     * @param {String} id 
     * @param {Point2} centerPoint 
     */
    constructor(
        id,
        centerPoint,
        distanceFromCenter,
        offsetAngle,
        baseRotation,
        sizeScale,
        moveAble,
        fillInCollor
    ) {
        this.id = id;
        this.centerPoint = centerPoint;
        this.distanceFromCenter = distanceFromCenter;
        this.offsetAngle = offsetAngle;
        this.baseRotation = baseRotation;
        this.sizeScale = sizeScale;
        this.moveAble = moveAble;
        this.fillInCollor = fillInCollor;

        // generated
        this.kind = "Entity2";
        this.bodyPointMap = new Map();
        this.isDoomed = false;
    }

    setUp() {

        return this;
    }

    update(maxX, maxY) {

        if (this.moveAble) {
            this.centerPoint.moveMeX();
            this.centerPoint.moveMeY();
        }

        if (this.centerPoint.changed) {
            //console.log(this.centerPoint.id + " changed");
            this.bodyPointMap = this.generatePoints();

            this.centerPoint.handleOutOfBorder(maxX, maxY);

            this.centerPoint.resetChangedFlag();
        }
        return this;
    }

    destroy() {
        this.isDoomed = true;
        return this.id; 
    }

    /**
     * 
     * @param {Number} pointCount 
     * @param {Array<Number>} distanceFromCenter 
     * @returns {Map<String, Point2>}
     */
    generatePoints() {
        let map = new Map();
        let chunckAngle = 360 / this.distanceFromCenter.length;
        let maxAngle = 360;
        for (let i = 1; (chunckAngle * i) <= maxAngle; i++) {
            map.set(
                this.id + "_bodyPoint_" + i,
                Calculations.point_B_angle_B_length_c_get_point2_A(
                    this.centerPoint,
                    // offset of start + rotation of model + angle of point to center * point number
                    ((this.offsetAngle + this.baseRotation) + (chunckAngle * i)) * 1,
                    // distace of point to center * scale
                    this.distanceFromCenter[i - 1] * this.sizeScale,
                    // id of point
                    this.id + "_bodyPoint_" + i
                )
            );
        }

        return map;

    }

    drawMe(ctx) {
        this.centerPoint.drawMe(ctx);

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

