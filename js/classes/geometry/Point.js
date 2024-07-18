import KeyHandler from "../util/KeyHandler.js";
import Vector from "./Vector.js";


export default class Point {

    /**
     * 
     * @param {string} id 
     * @param {int} x 
     * @param {int} y 
     */
    constructor(id, x, y, radius = 1, color = "#000000") {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

        this.futureX = x;
        this.futureY = y;

        this.vector = null;

        this.updateAble = false;

        this.hitBorder = false;

    }

    setRadius(value) {
        this.radius = value;
        return this;
    }

    /**
     * Initialize vector and also sets updateAble to true.
     * Only points with vector can be updateded.
     * @returns this;
     */
    allowUpdate() {
        //this.vector = new Vector(this.id + "_vector", this.x, this.y, this.x, this.y);
        this.updateAble = true;
        return this;
    }

    /**
     * This calculate the possible future position of point based on the current state of keyHandler
     * and current state of vector.
     * @param {KeyHandler} keyHandler 
     */
    update(newX, newY) {

        if(!this.updateAble) {
            return
        }

        

        //let incrementX = 0;
        //let incrementY = 0;


        //this.vector.update(incrementX, incrementY);

        // future positon of this point
        //this.futureX = this.x + this.vector.lengthX;
        //this.futureY = this.y + this.vector.lengthY;

    }

    moveMeX() {
        this.x = this.futureX;
        //this.vector.moveMeX();
    }

    moveMeY() {
        this.y = this.futureY;
        //this.vector.moveMeY();
    }

    /**
     * 
     * @param {String} axis x / y
     */
    flipVector(axis) {
        //this.vector.flipAxis(axis);
    }


    drawMe(ctx, fillIn = false) {
        //this.vector.drawMe(ctx);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        if (fillIn) {
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    printInfo() {
        console.log("Point:");
        console.log("id: " + this.id);
        console.log("x: " + this.x);
        console.log("y: " + this.y);
        console.log("radius: " + this.radius);
        console.log("color: " + this.color);
    }


}


