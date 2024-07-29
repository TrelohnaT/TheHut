import Calculations from "../common/Calculations.js";




export default class EntityStrategies {

    static strategyPointsByRotationVector = "generatePointsByRotationVector";
    static strategySquare = "strategySquare";

    constructor() {
    }

    static use(strategyName) {
        if (strategyName == EntityStrategies.strategySquare) {
            
        } else if(strategyName == EntityStrategies.strategyPointsByRotationVector) {
            return EntityStrategies.gene
        }
    }

    static generatePointsByRotationVector(
        id,
        distanceFromCenter,
        centerPoint,
        offsetAngle,
        baseRotation,
        sizeScale
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
                )
            );
        }
        return map;
    }



}




