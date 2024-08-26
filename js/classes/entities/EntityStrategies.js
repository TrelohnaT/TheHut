import Calculations from "../common/Calculations.js";
import Point2 from "../geometry/Point2.js";




export default class EntityStrategies {

    static strategyPointsByRotationVector = "generatePointsByRotationVector";
    static strategySquare = "strategySquare";

    static kindRectangle = "rectangle";
    static kindSymetric = "symetric";

    constructor() {
    }

    /**
     * 
     * @param {String} id 
     * @param {Point2} centerPoint 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} pointsOnX 
     * @param {Number} pointsOnY
     * @param {Map<String, boolean>} hitAbleSides controls which side of the square will have collisions
     * @returns {Map<String, Point2>}
     */
    static generatePointsForSquare(
        id,
        centerPoint,
        width,
        height,
        pointsOnX,
        pointsOnY,
        hitAbleSides
    ) {
        let map = new Map();

        let startX = centerPoint.x - width / 2;
        let startY = centerPoint.y - height / 2;

        let stepOnX = width / pointsOnX;
        let stepOnY = height / pointsOnY;


        for (let y = 0; y < pointsOnY; y++) {
            for (let x = 0; x < pointsOnX; x++) {
                let pointID = id + "_bodyPoint_" + y + "_" + x;
                // points in middle are NOT created, only those on sides

                // first and last line
                if (y == 0 || y == (pointsOnY - 1)) {

                    let point = new Point2(
                        pointID,
                        startX + (x * stepOnX),
                        startY + (y * stepOnY)
                    );

                    if (y == 0) {
                        point.setCollision(hitAbleSides.get("top"));
                    } else if (y == (pointsOnY - 1)) {
                        point.setCollision(hitAbleSides.get("bottom"));
                    }
                    map.set(pointID, point);

                }
                // left and right line
                if (x == 0 || x == (pointsOnX - 1)) {
                    let point;
                    // for corner points (like x=0 y=0)
                    if (map.has(pointID)) {
                        point = map.get(pointID)
                    } else {
                        point = new Point2(
                            pointID,
                            startX + (x * stepOnX),
                            startY + (y * stepOnY)
                        );
                    }

                    if (x == 0) {
                        point.setCollision(hitAbleSides.get("left"), true);
                    } else if (x == (pointsOnX - 1)) {
                        point.setCollision(hitAbleSides.get("right"), true);
                    }
                    map.set(pointID, point);

                }
            }
        }

        console.log("points in map: " + map.size);
        return map;
    }

    /**
     * 
     * @param {String} id 
     * @param {Array<String>} distanceFromCenter 
     * @param {Point2} centerPoint 
     * @param {Number} offsetAngle 
     * @param {Number} baseRotation 
     * @param {Number} sizeScale 
     * @returns {Map<String, Point2>}
     */
    static generatePointsByRotationVector(
        id,
        distanceFromCenter,
        centerPoint,
        offsetAngle,
        baseRotation,
        sizeScale,
        colision
    ) {
        let map = new Map();
        let chunckAngle = 360 / distanceFromCenter.length;
        let maxAngle = 360;
        for (let i = 1; (chunckAngle * i) <= maxAngle; i++) {
            map.set(
                id + "_bodyPoint_" + i,
                Calculations.point_B_angle_B_length_c_get_point2_A(
                    centerPoint,
                    // offset of start + rotation of model + angle of point to center * point number
                    ((offsetAngle + baseRotation) + (chunckAngle * i)) * 1,
                    // distace of point to center * scale
                    distanceFromCenter[i - 1] * sizeScale,
                    // id of point
                    id + "_bodyPoint_" + i
                ).setCollision(colision)
            );
        }
        return map;
    }



}




