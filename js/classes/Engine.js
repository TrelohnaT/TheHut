import Calculations from "./common/Calculations.js";
import KeyHandler from "./util/KeyHandler.js";
import Entity from "./entities/Entity.js";
import MouseHandler from "./util/MouseHnadler.js";
import QuadTree from "./util/QuadTree.js";
import Point from "./geometry/Point.js";
import Entity2 from "./entities/Entity2.js";
import Point2 from "./geometry/Point2.js";



export default class Engine {

    constructor(id) {
        this.id = id;
        /**@type {Array<Entity2>} */
        this.enityList = new Array();

        /**@type {QuadTree} */
        this.grid = null;

        this.macroPlayer = "player";

        this.gravity = 0;
        this.speed = 5;

    }

    // set up entities
    setUp(canvasWidth, canvasHeight) {
        console.log("setUp");
        this.enityList = new Array();
        this.grid = null;

        //this.enityList.push(new Player(this.macroPlayer, canvas.width/2, canvas.height/2));

        // this.enityList.push(new Entity("test", 200, 0, this.speed));
        // this.enityList.push(new Entity("test", 200, 100, this.speed));
        // this.enityList.push(new Entity("test", 200, 200, this.speed));
        // this.enityList.push(new Entity("test", 200, 300, this.speed));


        this.enityList.push(new Entity2("test", new Point2("test", 40, 40)));

        //this.enityList.push(new Entity2("mouse", new Point2("mouse", 0, 0, 1)));


        this.grid = new QuadTree("a", new Point("a_c", canvasWidth / 2, canvasHeight / 2),
            canvasWidth, canvasWidth, 0, document.getElementById("maxDeep").value);
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

        if (this.enityList.length > 0) {
            let mouse = this.getEntity("mouse");
            if (mouse != null) {
                mouse.centerPoint.x = mouseHandler.x;
                mouse.centerPoint.y = mouseHandler.y;
            }
        }

        if (this.grid != null) {
            this.grid.update(this.enityList);

            this.grid.drawMe(ctx);
        }

        for (const enity of this.enityList) {
            enity.drawMe(ctx);
        }

    }

    getEntity(id) {
        for (const entity of this.enityList) {
            if (id == entity.id) {
                return entity;
            }
        }
    }

    logToDom() {
        document.getElementById("entityCount").innerHTML = this.enityList.length;


    }

}




