import Calculations from "../common/Calculations.js";
import Point from "./Point.js";

export default class Vector {


    /**
     * 
     * @param {String} id 
     * @param {int} startX 
     * @param {int} startY 
     * @param {int} endX 
     * @param {int} endY 
     */
    constructor(id, startX, startY, endX, endY) {
        this.id = id;

        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

        this.maxAxisLengthX = 5;
        this.maxAxisLengthY = 10;

        this.length = 0;

        this.lengthX = 0;
        this.lengthY = 0;

        this.incrementX = 0;
        this.incrementY = 0;

    }


    doCalculations() {

        this.lengthX = this.endX - this.startX;
        this.lengthY = this.endY - this.startY;

        this.length = Math.sqrt(Math.pow(this.lengthX, 2) + Math.pow(this.lengthY, 2));

        //return this;
    }

    updateBetter(incrementX, incrementY) {



    }

    update(lenght, angle) {
        let endPoint = Calculations.point_B_angle_B_length_c_get_point_A(
            new Point("A", this.startX, this.startY),
            angle,
            lenght);

        this.endX = endPoint.x;
        this.endY = endPoint.y;
        this.doCalculations();

    }

    moveMeX() {
        this.startX = this.endX;
    }

    moveMeY() {
        this.startY = this.endY;
    }

    /**
     * 
     * @param {String} axis x / y
     */
    flipAxis(axis) {
        if (axis == "x") {
            this.endX = this.startX; //this.endX + (this.lengthX * -1);
        }
        else if (axis == "y") {
            this.endY = this.startY; //this.endY + (this.lengthY * -1);
        }
        else {
            console.log("unknows axis: " + axis);
        }

        this.doCalculations();

    }

    checkMaxAxisLength(maxAxisLength, a, b) {
        return maxAxisLength >= Math.abs(a - b);
    }

    printInfo() {
        console.log("vector ID: " + this.id);
        console.log("X: " + this.lengthX);
        console.log("Y: " + this.lengthY);
        console.log("Lenght: " + this.length);
    }


    drawMe(ctx) {

        ctx.beginPath();
        ctx.arc(this.startX, this.startY, 1, 0, 2 * Math.PI);
        ctx.arc(this.endX, this.endY, 1, 0, 2 * Math.PI);

        ctx.stroke();

    }

}






