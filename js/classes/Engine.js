import KeyHandler from "./handlers/KeyHandler.js";
import MouseHandler from "./handlers/MouseHnadler.js";
import Point2 from "./geometry/Point2.js";
import QuadTreeFromCorner from "./util/QuadTreeFromCorner.js";
import EntityBuilder2 from "./entities/EntityBuilder2.js";
import Collision from "./util/Collision.js";
import Terrain from "./util/Terrain.js";
import Calculations from "./common/Calculations.js";
import Entity from "./entities/Entity.js";

export default class Engine {

    constructor(id) {
        this.id = id;

        /**@type {Map<String, Entity>} */
        this.entityMap = new Map();

        /**@type {QuadTreeFromCorner} */
        this.grid = null;

        /**@type {Terrain} */
        this.terrain = null;

        this.gravity = 0;
        this.speed = 5;

        this.spawnedEntites = 0;

    }

    // set up entities
    setUp(canvasWidth, canvasHeight) {
        console.log("setUp");
        this.entityMap.clear();
        this.grid = null;

        let terrainBluePrint = [
            // testing cube
            // [1, 0, 0, 0],
            // [0, 1, 1, 0],
            // [0, 1, 1, 0],
            // [0, 0, 0, 0]
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.terrain = new Terrain(
            "terrain",
            canvasHeight,
            canvasHeight,
            terrainBluePrint,
            50          // block size
        );


        this.entityMap = this.terrain.setUp(canvasWidth, canvasHeight);
        //Calculations.addMapToMap(this.entityMap, this.terrain.setUp(canvasWidth, canvasHeight));

        this.entityMap.set(
            EntityBuilder2.kindPlayer,
            new EntityBuilder2(
                EntityBuilder2.kindPlayer,
                EntityBuilder2.kindPlayer,
                new Point2(
                    "player_centerpoint",
                    canvasWidth / 2,
                    canvasHeight / 2 + 100
                )
            )
                .getPointsByGenerationSquare(
                    40,
                    40,
                    10,
                    10,
                    Entity.getHitAbleMap(true, true, true, true)
                ).build()
        );

        this.entityMap.set("mouse",
            new EntityBuilder2(
                "mouse",
                EntityBuilder2.kindMouse,
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

        console.log("canvasWidth: " + canvasWidth)
        console.log("canvasHeight: " + canvasHeight)

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
                EntityBuilder2.kindMouse,
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
            //exploded.explode();
            //this.entityMap.set(explodeId, exploded);
        }

        // update quadtree and check collisions
        if (this.grid != null) {
            // return set of collisions
            collisionSet = this.grid.update(this.entityMap, Array.from(this.entityMap.keys()), new Set());

            if (document.getElementById("seeGrid").checked) {
                this.grid.drawMe(ctx);
            }
        }

        // handle keyboard input
        // axis Y
        if (keyHandler.getValue("w") && keyHandler.getValue("s")) {
            this.terrain.setIncrementY(0);
        } else if (keyHandler.getValue("w")) {
            this.terrain.setIncrementY(1);
        } else if (keyHandler.getValue("s")) {
            this.terrain.setIncrementY(-1);
        } else {
            this.terrain.setIncrementY(0);
        }

        // axis X
        if (keyHandler.getValue("a") && keyHandler.getValue("d")) {
            this.terrain.setIncrementX(0);
        } else if (keyHandler.getValue("a")) {
            this.terrain.setIncrementX(1);
        } else if (keyHandler.getValue("d")) {
            this.terrain.setIncrementX(-1);
        } else {
            this.terrain.setIncrementX(0);
        }


        for (let [key, value] of this.entityMap) {
            if (collisionSet.size != 0) {
                for (const colision of collisionSet) {
                    for (const entityId of colision.entitiesId) {
                        for (const collisionPointId of colision.pointId) {
                            // each point has its own lifetime
                            if (value.pointLifeTimeAutonomy) {
                                value.handlePointColision(collisionPointId);
                            } else {
                                if (entityId.includes(EntityBuilder2.kindTerrain)) {
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

            // move terrain entities 
            if (value.id.includes(EntityBuilder2.kindTerrain)) {
                value = this.terrain.move(value);
            }


            //value = this.handleUserInput(keyHandler, value);
            value.update(canvasWidth, canvasHeight);
        }

        Calculations.addMapToMap(this.entityMap, this.terrain.update(doomedEntites));

        // delete doomed entites
        for (const doomed of doomedEntites) {
            this.entityMap.delete(doomed);
        }

        // draw alive entities
        for (const [key, entity] of this.entityMap) {
            entity.drawMe(ctx);
        }

    }

    /**
     * 
     * @param {KeyHandler} keyHandler 
     * @param {Entity} entity 
     * @returns 
     */
    handleUserInput(keyHandler, entity) {
        let incrementX = 0;
        let incrementY = 0;

        if (keyHandler.getValue("w")) {
            incrementY = -1;
        }
        if (keyHandler.getValue("a")) {
            incrementX = -1;
        }
        if (keyHandler.getValue("s")) {
            incrementY = 1;
        }
        if (keyHandler.getValue("d")) {
            incrementX = 1;
        }


        if (incrementX != 0 || incrementY != 0) {
            if (entity.id.includes(EntityBuilder2.kindTerrain)) {
                entity = this.terrain.move(entity, incrementX, incrementY);
            }

        }

        return entity;
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




