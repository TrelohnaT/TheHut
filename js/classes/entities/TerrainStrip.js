import Point2 from "../geometry/Point2.js";
import Entity2 from "./Entity2.js";



export default class TerrainStrip {
    constructor(id, distance, x, pointCount = 10) {
        this.id = id;
        this.kind = "terrainStrip";
        this.distance = distance;
        this.x = x;
        this.pointCount = pointCount;

        /**@type {Map<String, Point2>} */
        this.bodyPointMap = new Map();

        /**@type {Map<String, Point2>} */
        this.entityMap = new Map();


    }

    setUp(maxHeight) {


        for (let i = 0; i < this.pointCount; i++) {

            //this.bodyPointMap.set(this.id + "_" + i, new Point2(this.id + "_" + i + "_point", this.x, maxHeight - (i * this.distance)));

            this.entityMap.set(
                this.id + "_" + i + "_entity",
                new Entity2("terrainEntity_" + i,
                    new Point2(this.id + "_" + i + "_point", this.x, maxHeight - (i * this.distance)),
                    [5, 5, 5, 5]
                )
            );

        }

        return this;

    }

    update() {


    }

    drawMe(ctx) {
        for (const [key, value] of this.bodyPointMap) {
            value.drawMe(ctx);
        }

        for(const [key, value] of this.entityMap) {
            value.drawMe(ctx, true);
        }

    }

}

