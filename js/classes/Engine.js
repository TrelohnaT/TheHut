import KeyHandler from "./util/KeyHandler.js";
import MouseHandler from "./util/MouseHnadler.js";
import Entity2 from "./entities/Entity.js";
import Point2 from "./geometry/Point2.js";
import QuadTreeFromCorner from "./util/QuadTreeFromCorner.js";
import EntityBuilder2 from "./entities/EntityBuilder2.js";
import Collision from "./util/Collision.js";

export default class Engine {

    constructor(id) {
        this.id = id;

        /**@type {Map<String, Entity2>} */
        this.entityMap = new Map();

        /**@type {QuadTreeFromCorner} */
        this.grid = null;

        this.gravity = 0;
        this.speed = 5;

        this.spawnedEntites = 0;

    }

    // set up entities
    setUp(canvasWidth, canvasHeight) {
        console.log("setUp");
        this.entityMap.clear();
        this.grid = null;

        let distance = 50;

        let terrainPoints = [8, 8, 8];

        let startTerrainX = 25;
        let startTerrainY = canvasHeight - 25;

        // X axis
        for (let i = 0; i < terrainPoints.length; i++) {
            // y axis
            for (let j = 0; j < terrainPoints[i]; j++) {
                this.entityMap.set("terrain_entity_" + i + "_" + j,
                    new EntityBuilder2(
                        "terrain_entity_" + i + "_" + j,
                        new Point2("terrain_centerpoint_" + i + "_" + j,
                            startTerrainX + (i * distance),
                            startTerrainY - (j * distance)
                        )
                    )
                        .getPointsByGenerationSquare(
                            distance - 5,
                            distance - 5,
                            4,
                            4
                        )
                        .build()
                );
            }
        }

        this.entityMap.set("mouse",
            new EntityBuilder2(
                "mouse",
                new Point2("mouse_point", 0, 0)
            )
                .getPointByRotatingVector(
                    [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
                    0,
                    0,
                    1
                )
                .setPointLifeTimeAutonomy(true)
                .setMoveAble(true).build()
        );

        this.grid = new QuadTreeFromCorner(
            "root",
            new Point2("root", 0, 0),
            canvasWidth,
            canvasWidth,
            0
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

        /**@type {String} */
        let doomedEntites = new Set();
        /**@type {Set<Collision>} */
        let collisionSet = new Set();
        this.logToDom();
        if (this.entityMap.size > 0) {
            let mouse = this.entityMap.get("mouse");
            if (mouse != null) {
                mouse.moveMeTo(mouseHandler.x, mouseHandler.y);

            }
        }

        if (mouseHandler.leftBtn) {
            let explodeId = "exploded_" + this.spawnedEntites++;
            let exploded = new EntityBuilder2(
                explodeId,
                new Point2(explodeId + "_point", mouseHandler.x, mouseHandler.y)
            )
                .getPointByRotatingVector(
                    [30],
                    0,
                    0,
                    1
                )
                .setMoveAble(true)
                .setPointLifeTimeAutonomy(true)
                .build();
            console.log("spawnedEntities: " + this.spawnedEntites);
            exploded.explode();
            this.entityMap.set(explodeId, exploded);
        }

        // update quadtree and check collisions
        if (this.grid != null) {
            // return set of collisions
            collisionSet = this.grid.update(this.entityMap, Array.from(this.entityMap.keys()), new Set());

            if (document.getElementById("seeGrid").checked) {
                this.grid.drawMe(ctx);
            }
        }

        for (const [key, value] of this.entityMap) {
            if (collisionSet.size != 0) {
                for (const colision of collisionSet) {
                    for (const entityId of colision.entitiesId) {
                        for (const collisionPointId of colision.pointId) {
                            // each point has its own lifetime
                            if (value.pointLifeTimeAutonomy) {
                                value.handlePointColision(collisionPointId);
                            } else {
                                if (entityId.includes("terrain")) {
                                    doomedEntites.add(entityId);
                                }
                            }
                        }
                    }
                }
            }

            if (value.bodyPointMap.size == 0) {
                doomedEntites.add(value.id);
            }

            value.update(canvasWidth, canvasHeight);
        }

        // delete doomed entites
        for (const doomed of doomedEntites) {
            this.entityMap.delete(doomed);
        }

        // draw alive entities
        for (const [key, entity] of this.entityMap) {
            entity.drawMe(ctx);
        }

    }

    logToDom() {
        document.getElementById("entityCount").innerHTML = this.entityMap.size;

        let pointCount = 0;

        this.entityMap.forEach(value => {
            pointCount = pointCount + value.bodyPointMap.size;
        });

        document.getElementById("pointCount").innerHTML = pointCount;
    }

}




