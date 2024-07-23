


export default class Point2 {

    constructor(id, x, y, radius = 1, color = "#000000") {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

        // Vector part
        this.futureX = x;
        this.futureY = y;
        this.length = 0;
        this.lengthX = 0;
        this.lengthY = 0;
        this.angle = 0;

        this.changed = true;

    }

    /**
     * Set Vector by point of next position.
     * @param {Number} futureX 
     * @param {Number} futureY 
     */
    setVectorByPoint(futureX, futureY) {
        this.futureX = futureX;
        this.futureY = futureY;
        this.lengthX = this.x - futureX;
        this.lengthY = this.y - futureY;
        this.length = Math.sqrt(Math.pow(this.lengthX, 2) + Math.pow(this.lengthY, 2));

        return this;
    }

    /**
     * Set Vector by its length and angle to base.
     * @param {Number} length 
     * @param {Number} angle 
     */
    setVectorByLengthAndAngle(length, angle) {
        this.length = length;
        this.angle = angle;
        this.lengthX = length * Math.cos(angle * (Math.PI / 180));
        this.lengthY = length * Math.sin(angle * (Math.PI / 180));
        this.futureX = this.x + this.lengthX;
        this.futureY = this.y + this.lengthY;

        return this;

    }

    moveMeX() {
        this.x = this.futureX;
        if (this.x != this.futureX) {
            this.changed = true;
        }
    }

    moveMeY() {
        this.y = this.futureY;
        if (this.y != this.futureY) {
            this.changed = true;
        }
    }

    handleOutOfBorder(maxX, maxY) {

        if (this.x < 0) {
            this.x = maxX;
            this.changed = true;
        } else if (maxX < this.x) {
            this.x = 0;
            this.changed = true;
        }

        if (this.y < 0) {
            this.y = maxY;
            this.changed = true;
        } else if (maxY < this.y) {
            this.y = 0;
            this.changed = true;
        }

    }

    resetChangedFlag() {
        this.changed = false;
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
        console.log(this);
    }

}

