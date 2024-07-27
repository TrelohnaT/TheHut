import Calculations from "./common/Calculations.js";
import KeyHandler from "./util/KeyHandler.js";
import Entity from "./entities/Entity.js";
import MouseHandler from "./util/MouseHnadler.js";
import QuadTreeFromCenter from "./util/QuadTreeFromCenter.js";
import Point from "./geometry/Point.js";
import Entity2 from "./entities/Entity2.js";
import Point2 from "./geometry/Point2.js";
import QuadTreeFromCorner from "./util/QuadTreeFromCorner.js";
import Terrain from "./entities/Terrain.js";
import TerrainStrip from "./entities/TerrainStrip.js";



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
        this.grid = null;//new Terrain("terrain", 20).setUp([30, 40], 20);

        let distance = 10;
        //let terrainPointsX = 5;
        //let terrainPointsY = [10, 15, 15, 10, 10];

        let terrainPoints = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

        let startTerrainX = 30;
        let startTerrainY = canvasHeight - 50;

        // X axis
        for (let i = 0; i < terrainPoints.length; i++) {
            // y axis
            for (let j = 0; j < terrainPoints[i]; j++) {

                this.entityMap.set("terrain_entity_" + i + "_" + j,
                    new Entity2("terrain_entity_" + i + "_" + j,
                        new Point2("terrain_centerpoint_" + i + "_" + j,
                            startTerrainX + (i * distance),
                            startTerrainY - (j * distance)
                        ), [distance/2, distance/2, distance/2, distance/2], 45
                    )
                );
            }
        }


        //this.entityMap.set("test", new Entity2("test",  new Point2("test", 40, 40)));
        this.entityMap.set("mouse", new Entity2("mouse", new Point2("mouse", 0, 0), [30,30,30,30,30,30,30,30,30,30]));

        this.grid = new QuadTreeFromCorner(
            "root",
            new Point2("root", 0, 0),
            canvasWidth,
            canvasWidth,
            0,
            //2
            9
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

        this.logToDom();
        if (this.entityMap.size > 0) {
            let mouse = this.entityMap.get("mouse"); //this.getEntity("mouse");
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
            //console.log(this.grid.update(this.entityMap, Array.from(this.entityMap.keys()), new Set()));
            //console.log(Array.from(this.entityMap.keys()));
            let tmp = this.grid.update(this.entityMap, Array.from(this.entityMap.keys()), new Set());

            if(tmp.size != 0) {
                console.log(tmp);
            }

            if (document.getElementById("seeGrid").checked) {
                this.grid.drawMe(ctx);
            }
        }

        for (const [key, entity] of this.entityMap) {
            entity.drawMe(ctx);
        }

    }

    logToDom() {
        document.getElementById("entityCount").innerHTML = this.entityMap.size;


    }

}




