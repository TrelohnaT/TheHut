import Entity from "../entities/Entity.js";
import EntityBuilder2 from "../entities/EntityBuilder2.js";
import Point2 from "../geometry/Point2.js";



export default class Terrain {

    /**
     * 
     * @param {String} id 
     * @param {Number} canvasWidth 
     * @param {Number} canvasHeight 
     * @param {Number[][]} terrainBlueprint 
     */
    constructor(id, canvasWidth, canvasHeight, terrainBlueprint, blockSize = 50, gridLowerLimit = 10) {
        this.id = id;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.terrainBlueprint = terrainBlueprint;
        this.entityMap = new Map();

        this.blockSize = blockSize;
        this.gridLowerLimit = gridLowerLimit;

    }

    setUp() {

        let map = new Map();

        let offsetX = this.gridLowerLimit / 2;
        let offsetY = this.gridLowerLimit / 2;

        // generation of terrain block
        for (let y = 0; y < this.terrainBlueprint.length; y++) {
            for (let x = 0; x < this.terrainBlueprint[y].length; x++) {

                if (this.terrainBlueprint[y][x] == 0) {

                } else if (this.terrainBlueprint[y][x] == 1) {

                    // determinate which sides have some entity next to it and switch on/off collisions
                    let top = false;
                    try {
                        top = ((y - 1) >= 0 && this.terrainBlueprint[y - 1][x] != 1); //false;
                    } catch (e) {
                        console.log("top:")
                        console.log(e);
                    }
                    let bottom = false; //= (this.terrainBlueprint[x][y + 1] == 0);
                    try {
                        bottom = ((y + 1) <= this.terrainBlueprint[y].length && this.terrainBlueprint[y + 1][x] != 1)
                    } catch (e) {
                        console.log("bottom:")
                        console.log(e);
                    }
                    let right = false;
                    try {
                        right = ((x + 1) <= this.terrainBlueprint.length && this.terrainBlueprint[y][x + 1] != 1);
                    } catch (e) {
                        console.log("right:")
                        console.log(e);
                    }
                    let left = false; //= (x == 0 || this.terrainBlueprint[x + 1][y] == 0);
                    try {
                        left = ((x - 1) >= 0 && this.terrainBlueprint[y][x - 1] != 1);
                    } catch (e) {
                        console.log("left:")
                        console.log(e);
                    }

                    map.set("terrain_entity_" + x + "_" + y,
                        new EntityBuilder2(
                            EntityBuilder2.kindTerrain + "_entity_" + x + "_" + y,
                            EntityBuilder2.kindTerrain,
                            new Point2("terrain_centerpoint_" + x + "_" + y,
                                (x * this.blockSize) + this.blockSize / 2 + 2.5,
                                (y * this.blockSize) + this.blockSize / 2 + 2.5
                            )
                        )
                            .getPointsByGenerationSquare(
                                this.blockSize,
                                this.blockSize,
                                this.blockSize / this.gridLowerLimit * 2,
                                this.blockSize / this.gridLowerLimit * 2,
                                Entity.getHitAbleMap(top, right, bottom, left)
                            )
                            .build()
                    );
                }
            }
        }

        return map;


    }

    /**
     * 
     * @param {Set<String>} doomedEntites 
     */
    update(doomedEntites) {

        let updateTerrain = false;

        for (let doomed of doomedEntites) {

            console.log("doomed: " + doomed);
            let parts = doomed.split("_");

            // filter only doomed terrain
            if (parts[0] == EntityBuilder2.kindTerrain) {
                let x = parts[parts.length - 2];
                let y = parts[parts.length - 1];
                console.log("x: " + x);
                console.log("y: " + y);
                this.terrainBlueprint[y][x] = 0;
                updateTerrain = true;
            }
        }

        if (updateTerrain) {
            return this.setUp();
        }

        // nothing doomed, nothing to update
        return new Map();
    }


}



