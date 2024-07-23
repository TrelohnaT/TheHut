import Point2 from "../geometry/Point2.js";
import TerrainStrip from "./TerrainStrip.js";


export default class Terrain {

    constructor(id, distanceBetweenPoints = 20) {
        this.id = id;

        this.bodyPointMap = new Array();

        this.distanceBetweenPoints = distanceBetweenPoints;

        /**@type {Map<Number, TerrainStrip>} */
        this.mapOfStrips = new Map();



    }

    /**
     * 
     * @param {Array<Number>} listOfStripLength 
     */
    setUp(listOfStripLength, distance) {

        for(let i = 0; i < listOfStripLength.length; i++) {

            this.mapOfStrips.set(i, new TerrainStrip(this.id + "_" + i, 20, (i * distance)).setUp());

        }

        return this.mapOfStrips;
    }


    generateTerrain(maxWidth, maxHeight, yOffest = 0, xOffest = 0) {

        for(let i = 0; i < maxWidth; i = i + this.distanceBetweenPoints) {

            let tempArr = new Array();

            for(let j = 0; j < maxHeight; j = j + this.distanceBetweenPoints) {

                tempArr.push(new Point2("terrain_" + i + "_" + j, xOffest + i, yOffest + j));

            }
            this.bodyPointMap.push(tempArr);
        }

        return this;

    }

    update(canvasWidth, canvasHeight) {

    }

    drawMe(ctx) {

        for(const [key, value] of this.mapOfStrips) {
            value.drawMe(ctx);
        }

    }


}

