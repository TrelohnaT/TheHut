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
    constructor(id, canvasWidth, canvasHeight, terrainBlueprint = [[1, 1, 1, 1, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 1], [1, 0, 1]]) {
        this.id = id;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.terrainBlueprint = terrainBlueprint;
        this.entityMap = new Map();


    }

    setUp() {


        let map = new Map();

        let distance = 50;

        let startTerrainX = 125;
        let startTerrainY = this.canvasHeight - 125;

        // x axis
        for (let x = 0; x < this.terrainBlueprint.length; x++) {
            for (let y = 0; y < this.terrainBlueprint[x].length; y++) {

                if (this.terrainBlueprint[x][y] == 0) {

                } else if (this.terrainBlueprint[x][y] == 1) {

                    // TODO corner points are also disabeled

                    // determinate which sides have some entity next to it and switch on/off collisions
                    let top = (this.terrainBlueprint[x][y + 1] != 1); //false;
                    let right = (x + 1 == this.terrainBlueprint.length || this.terrainBlueprint[x + 1][y] != 1);
                    let bottom = (this.terrainBlueprint[x][y - 1] != 1);
                    let left = (x == 0 || this.terrainBlueprint[x - 1][y] != 1);

                    map.set("terrain_entity_" + x + "_" + y,
                        new EntityBuilder2(
                            EntityBuilder2.kindTerrain + "_entity_" + x + "_" + y,
                            EntityBuilder2.kindTerrain,
                            new Point2("terrain_centerpoint_" + x + "_" + y,
                                startTerrainX + (x * distance),
                                startTerrainY - (y * distance)
                            )
                        )
                            .getPointsByGenerationSquare(
                                distance - 5,
                                distance - 5,
                                8,
                                8,
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
                this.terrainBlueprint[x][y] = 0;
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



