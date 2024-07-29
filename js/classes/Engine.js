import KeyHandler from "./util/KeyHandler.js";
import MouseHandler from "./util/MouseHnadler.js";
import Entity2 from "./entities/Entity2.js";
import Point2 from "./geometry/Point2.js";
import QuadTreeFromCorner from "./util/QuadTreeFromCorner.js";
import EntityBuilder from "./entities/EntityBuilder.js";

export default class Engine {

    constructor(id) {
        this.id = id;

        /**@type {Map<String, Entity2>} */
        this.entityMap = new Map();

        /**@type {QuadTreeFromCorner} */
        this.grid = null;

        this.macroPlayer = "player";

        this.entityKind = "entity";
        this.terrainKind = "terrain";

        this.gravity = 0;
        this.speed = 5;

    }

    // set up entities
    setUp(canvasWidth, canvasHeight) {
        console.log("setUp");
        this.entityMap.clear();
        this.grid = null;

        let distance = 32;

        let terrainPoints = [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8];

        let startTerrainX = 16;
        let startTerrainY = canvasHeight - 16;

        // X axis
        for (let i = 0; i < terrainPoints.length; i++) {
            // y axis
            for (let j = 0; j < terrainPoints[i]; j++) {
                this.entityMap.set("terrain_entity_" + i + "_" + j,
                    new EntityBuilder(
                        "terrain_entity_" + i + "_" + j,
                        new Point2("terrain_centerpoint_" + i + "_" + j,
                            startTerrainX + (i * distance),
                            startTerrainY - (j * distance)
                        ),
                        [distance / 2, distance / 2, distance / 2, distance / 2]
                    ).setBaseRotation(45)
                        .build()
                );
            }
        }

        this.entityMap.set("mouse",
            new EntityBuilder(
                "mouse",
                new Point2("mouse_point", 0, 0),
                [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]
            ).build()
        );

        this.grid = new QuadTreeFromCorner(
            "root",
            new Point2("root", 0, 0),
            canvasWidth,
            canvasWidth,
            0,
            8
        );
    }

    /**
     * udpates all entities
     * @param {CanvasRenderingContext2D} ctx 
     * @param {KeyHandler} keyHandler 
     * @param {MouseHandler} mouseHandler 
     * @param {Number} canvasWidth 
     * @param {Number} canvasHeight 
     */
    update(ctx, keyHandler, mouseHandler, canvasWidth, canvasHeight) {

        let doomedEntites = new Set();
        this.logToDom();
        if (this.entityMap.size > 0) {
            let mouse = this.entityMap.get("mouse");
            if (mouse != null) {
                mouse.centerPoint.futureX = mouseHandler.x;
                mouse.centerPoint.futureY = mouseHandler.y;
                mouse.centerPoint.changed = true;
            }
        }

        for (const [key, value] of this.entityMap) {
            value.update(canvasWidth, canvasHeight);
        }

        if (this.grid != null) {
            // return set of collisions
            let collisionSet = this.grid.update(this.entityMap, Array.from(this.entityMap.keys()), new Set());

            if (collisionSet.size != 0) {
                console.log(collisionSet);

                for (const collision of collisionSet) {
                    for (const entityId of collision.entitiesId) {
                        if (entityId.includes("terrain")) {
                            doomedEntites.add(this.entityMap.get(entityId).destroy());
                        }
                    }
                }
            }

            if (document.getElementById("seeGrid").checked) {
                this.grid.drawMe(ctx);
            }
        }

        // delete doomed entites
        for(const doomed of doomedEntites) {
            this.entityMap.delete(doomed);
        }

        // draw alive entities
        for (const [key, entity] of this.entityMap) {
            entity.drawMe(ctx);
        }

    }

    logToDom() {
        document.getElementById("entityCount").innerHTML = this.entityMap.size;
    }

}




