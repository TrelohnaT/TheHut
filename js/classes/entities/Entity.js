
import Calculations from "../common/Calculations.js";
import Point from "../geometry/Point.js";
import Vector from "../geometry/Vector.js";


export default class Entity {

    /**
     * 
     * @param {String} id 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(id, x, y, speed) {
        this.id = id;
        this.speed = speed;
        this.modelScale = 5;
        this.centerPoint = new Point(this.id + "_centerpoint", x, y, 5 * this.modelScale).allowUpdate();
        this.vector = new Vector(this.id + "_vector", x, y, x, y);
        /**@type {Array<Point>} */
        this.pointList = new Array();
        this.hitSphere = this.centerPoint.radius;
        this.log = false;

        this.bodyPintRadius = 2;
        this.pointsToCenterDistance = [3, 2, 3, 4];
        //this.pointsToCenterDistance = [2, 2, 5, 2, 6, 2, 6, 2, 5, 2, 2, 3];
        this.baseRotation = 0;
        this.offset_angle = 0;

        this.selected = false;

        this.generatePoints();

    }

    generatePoints() {
        this.pointList = new Array();

        let chunck_angle = 360 / this.pointsToCenterDistance.length;
        let maxAngle = 360;

        for (let i = 1; (chunck_angle * i) <= maxAngle; i++) {
            this.pointList.push(
                Calculations.point_B_angle_B_length_c_get_point_A(
                    this.centerPoint,
                    // offset of start + rotation of model + angle of point to center * point number
                    ((this.offset_angle + this.baseRotation) + (chunck_angle * i)) * 1,
                    // distace of point to center * scale
                    this.pointsToCenterDistance[i - 1] * this.modelScale,
                    // id of point
                    this.id + "_pointA_" + i
                    // radius setting
                ).setRadius(this.bodyPintRadius)
            );

        }

    }

    update(keyHandler) {
        if (this.selected) {
            if (keyHandler.getValue("a")) {
                //incrementX = incrementX - 1;
                this.baseRotation = this.baseRotation - 1;
            }
            if (keyHandler.getValue("d")) {
                //incrementX = incrementX + 1;
                this.baseRotation = this.baseRotation + 1;
            }
        }

        this.vector.update(this.speed, this.baseRotation);
        this.vector.moveMeX();
        this.vector.moveMeY();
        this.centerPoint.futureX = this.vector.startX;
        this.centerPoint.futureY = this.vector.startY;
        this.centerPoint.moveMeX();
        this.centerPoint.moveMeY();

        this.generatePoints();
    }

    moveMeX() {
        this.centerPoint.moveMeX();
    }

    moveMeY() {
        this.centerPoint.moveMeY();
    }

    futureX() {
        return this.centerPoint.futureX;
    }

    futureY() {
        return this.centerPoint.futureY;
    }

    moveToPosition(newX, newY) {
        this.centerPoint.futureX = newX;
        this.centerPoint.futureY = newY;

        this.vector.startX = newX;
        this.vector.startY = newY;
        this.vector.endX = newX;
        this.vector.endY = newY;

    }

    /**
     * 
     * @param {String} axis x / y
     */
    flipVector(axis) {
        this.centerPoint.flipVector(axis);
    }

    drawMe(ctx) {
        this.centerPoint.drawMe(ctx);
        this.vector.drawMe(ctx);

        // drawing lines in body of entity
        for (let i = 0; i < this.pointList.length; i++) {
            this.pointList[i].drawMe(ctx, true);

            if ((i + 1) < this.pointList.length) {
                // vykresleni teto usecky jako takove
                ctx.moveTo(this.pointList[i].x, this.pointList[i].y);
                ctx.lineTo(this.pointList[i + 1].x, this.pointList[i + 1].y);
                //ctx.strokeStyle = this.color;
                ctx.stroke();
            } else {
                ctx.moveTo(this.pointList[i].x, this.pointList[i].y);
                ctx.lineTo(this.pointList[0].x, this.pointList[0].y);
                ctx.stroke();
            }

        }

    }

    moveAble() {
        return true;
    }

    x() {
        return this.centerPoint.x;
    }

    y() {
        return this.centerPoint.y;
    }

    logToScreen() {
        if (!this.log) {
            return;
        }
        document.getElementById("playerPositionX").innerHTML = this.centerPoint.x;
        document.getElementById("playerPositionY").innerHTML = this.centerPoint.y;

        document.getElementById("playerVelocityX").innerHTML = (this.centerPoint.x - this.centerPoint.futureX);
        document.getElementById("playerVelocityY").innerHTML = (this.centerPoint.y - this.centerPoint.futureY);
    }

}


