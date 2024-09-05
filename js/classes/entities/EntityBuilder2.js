import Point2 from "../geometry/Point2.js";
import Entity from "./Entity.js";
import EntityShapeGenerator from "./parts/EntityShapeGenerator.js";
import EntityParameters from "./parts/EntityParameters.js";

export default class EntityBuilder2 {

    static kindPlayer = "player";
    static kindMouse = "mouse";
    static kindTerrain = "terrain";

    /**
     * 
     * @param {String} id 
     * @param {Point2} centerPoint 
     */
    constructor(
        id,
        kind,
        centerPoint
    ) {
        this.id = id;
        this.kind = kind;
        this.centerPoint = centerPoint;

        //this.kind = "unknown";
        this.bodyPointMap = new Map;

        this.fillInColor = "#00ff00";
        this.parameters = new EntityParameters();

    }

    /**
     * 
     * @param {boolean} value 
     * @returns {EntityBuilder2}
     */
    setPointLifeTimeAutonomy(value) {
        this.parameters.setPointLifeTimeAutonomy(value);
        return this;
    }
    /**
     * 
     * @param {boolean} value 
     * @returns {EntityBuilder2}
     */
    setSeeBodyPoints(value) {
        this.parameters.setSeeBodyPoints(value);
        return this;
    }

    /**
     * 
     * @param {boolean} value 
     * @returns {EntityBuilder2}
     */
    setSeeCenterPoint(value) {
        this.parameters.setSeeCenterPoints(value);
        return this;
    }

    /**
     * 
     * @param {boolean} value 
     * @returns {EntityBuilder2}
     */
    setMoveAble(value) {
        this.parameters.setMoveAble(value);
        return this;
    }

    /**
     * 
     * @param {String} value 
     * @returns {EntityBuilder2}
     */
    setFillInColor(value) {
        this.fillInColor = value;
        return this;
    }

    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} pointsOnX 
     * @param {Number} pointsOnY 
     * @param {Map<String, boolean>} hitAbleSides
     * @returns {EntityBuilder2}
     */
    getPointsByGenerationSquare(
        width,
        height,
        pointsOnX,
        pointsOnY,
        hitAbleSides
    ) {
        //this.kind = EntityStrategies.kindRectangle;
        this.bodyPointMap = EntityShapeGenerator.generatePointsForSquare(
            this.id,
            this.centerPoint,
            width,
            height,
            pointsOnX,
            pointsOnY,
            hitAbleSides
        );

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
        sizeScale,
        collision = true
    ) {
        //this.kind = EntityStrategies.kindSymetric;
        this.bodyPointMap = EntityShapeGenerator.generatePointsByRotationVector(
            this.id,
            distanceFromCenter,
            this.centerPoint,
            offsetAngle,
            baseRotation,
            sizeScale,
            collision
        );
        return this;
    }

    /**
     * 
     * @returns {Entity}
     */
    build() {

        return new Entity(
            this.id,
            this.kind,
            this.centerPoint,
            this.bodyPointMap,
            this.parameters
        );

    }


}

