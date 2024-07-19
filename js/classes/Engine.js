import Calculations from "./common/Calculations.js";
import KeyHandler from "./util/KeyHandler.js";
import Entity from "./entities/Entity.js";
import MouseHandler from "./util/MouseHnadler.js";
import QuadTreeFromCenter from "./util/QuadTreeFromCenter.js";
import Point from "./geometry/Point.js";
import Entity2 from "./entities/Entity2.js";
import Point2 from "./geometry/Point2.js";
import QuadTreeFromCorner from "./util/QuadTreeFromCorner.js";



export default class Engine {

    constructor(id) {
        this.id = id;

        /**@type {Map<String, Entity2>} */
        this.entityMap = new Map();

        /**@type {QuadTreeFromCenter} */
        this.grid = null;

        this.macroPlayer = "player";

        this.gravity = 0;
        this.speed = 5;

    }

    // set up entities
    setUp(canvasWidth, canvasHeight) {
        console.log("setUp");
        this.entityMap.clear();
        this.grid = null;

        this.entityMap.set("test", new Entity2("test", new Point2("test", 40, 40)));
        this.entityMap.set("mouse", new Entity2("mouse", new Point2("mouse", 0, 0), [50,50,50,50,50,50,50,50,50,50,50,50,50,50,50]).setMoveAble(false));


        this.grid = new QuadTreeFromCorner(
            "root",
            new Point2("root", 0, 0),
            canvasWidth,
            canvasWidth,
            0,
            document.getElementById("maxDeep").value
        );

        //this.grid = new QuadTree("a", new Point("a_c", canvasWidth / 2, canvasHeight / 2),
        //    canvasWidth, canvasWidth, 0, document.getElementById("maxDeep").value);
        //this.grid.setUp();

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
                mouse.centerPoint.x = mouseHandler.x;
                mouse.centerPoint.y = mouseHandler.y;
            }
        }

        for(const [key, value] of this.entityMap) {
            value.update(canvasWidth, canvasHeight);
        }

        if (this.grid != null) {
            this.grid.update(this.entityMap);

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




