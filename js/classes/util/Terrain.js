import Entity from "../entities/Entity.js";
import EntityBuilder2 from "../entities/EntityBuilder2.js";
import Point2 from "../geometry/Point2.js";
import KeyHandler from "../handlers/KeyHandler.js";



export default class Terrain {

    /**
     * 
     * @param {String} id 
     * @param {Number} canvasWidth 
     * @param {Number} canvasHeight 
     * @param {Number[][]} terrainBlueprint 
     */
    constructor(id, canvasWidth, canvasHeight, terrainBlueprint, blockSize = 50) {
        this.id = id;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.terrainBlueprint = terrainBlueprint;

        this.blockSize = blockSize;
        this.defaultBlockSpacing = 10;

        // offset for terrain generation
        this.startOffsetX = 0;
        this.startOffsetY = 0;

        // increment for all terrain blocks and startOffset in one frame
        this.incrementX = 0;
        this.incrementY = 0;

    }
    /**
     * Sets increment for X axis and add it to the startOffsetX
     * @param {Number} value 
     */
    setIncrementX(value) {
        this.incrementX = value;
        this.startOffsetX = this.startOffsetX + value;
    }
    
    /**
     * Sets increment for Y axis and add it to the startOffsetY
     * @param {Number} value 
     */
    setIncrementY(value) {
        this.incrementY = value;
        this.startOffsetY = this.startOffsetY + value;
    }

    setUp() {

        let map = new Map();

        // generation of terrain block
        for (let y = 0; y < this.terrainBlueprint.length; y++) {
            for (let x = 0; x < this.terrainBlueprint[y].length; x++) {

                if (this.terrainBlueprint[y][x] == 0) {

                } 
                // terrain block
                else if (this.terrainBlueprint[y][x] == 1) {

                    // determinate which sides have some entity next to it and switch on/off collisions
                    let top = false;
                    try {
                        top = ((y - 1) >= 0 && this.terrainBlueprint[y - 1][x] != 1); 
                    } catch (e) {
                        console.log("top:")
                        console.log(e);
                    }
                    let bottom = false; 
                    try {
                        bottom = ((y + 1) <= this.terrainBlueprint.length && this.terrainBlueprint[y + 1][x] != 1)
                    } catch (e) {
                        console.log("bottom:")
                        console.log(e);
                    }
                    let right = false;
                    try {
                        right = ((x + 1) <= this.terrainBlueprint[y].length && this.terrainBlueprint[y][x + 1] != 1);
                    } catch (e) {
                        console.log("right:")
                        console.log(e);
                    }
                    let left = false;
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
                                this.startOffsetX + ((x * this.blockSize) + this.blockSize / 2 + 2.5),
                                this.startOffsetY + ((y * this.blockSize) + this.blockSize / 2 + 2.5)
                            )
                        )
                            .getPointsByGenerationSquare(
                                this.blockSize,
                                this.blockSize,
                                this.blockSize / this.defaultBlockSpacing * 2,
                                this.blockSize / this.defaultBlockSpacing * 2,
                                Entity.getHitAbleMap(top, right, bottom, left)
                            )
                            .setMoveAble(true)
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

    /**
     * 
     * @param {Entity} entity 
     */
    move(entity) {
        // move only if some movement occured
        if (this.incrementX != 0 || this.incrementY != 0) {
            entity.moveMeBy(this.incrementX, this.incrementY);
        }
        return entity;
    }



}



