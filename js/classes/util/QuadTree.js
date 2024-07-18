import Calculations from "../common/Calculations.js";
import Entity2 from "../entities/Entity2.js";
import Point from "../geometry/Point.js";



export default class QuadTree {

    /**
     * 
     * @param {String} id 
     * @param {Point} centerPoint 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} deep 
     * @param {Number} maxDeep 
     */
    constructor(id, centerPoint, width, height, deep, maxDeep) {
        //console.log("id: " + id);
        //console.log("deep: " + deep);
        this.id = id;
        this.centerPoint = centerPoint;
        this.width = width;
        this.height = height;
        this.deep = deep;
        this.maxDeep = maxDeep;

        this.cornerPoints = this.generateCornerPoints();
        /**@type {Array<QuadTree>} */
        this.childs = new Array();

        /**@type {Set<String>} */
        this.entityIdSet = new Set();

    }

    setUp() {

        if (this.childs.length > 0 || this.deep == this.maxDeep) {
            return;
        }

        let offsetX = this.width / 4;
        let offsetY = this.height / 4;
        let newWidth = this.width / 2;
        let newHeight = this.height / 2;

        this.childs.push(new QuadTree(
            this.id + "_0",
            new Point(this.id, this.centerPoint.x + offsetX, this.centerPoint.y + offsetY),
            newWidth, newHeight, this.deep + 1, this.maxDeep));
        this.childs.push(new QuadTree(
            this.id + "_1",
            new Point(this.id, this.centerPoint.x - offsetX, this.centerPoint.y + offsetY),
            newWidth, newHeight, this.deep + 1, this.maxDeep));
        this.childs.push(new QuadTree(
            this.id + "_2",
            new Point(this.id, this.centerPoint.x - offsetX, this.centerPoint.y - offsetY),
            newWidth, newHeight, this.deep + 1, this.maxDeep));
        this.childs.push(new QuadTree(
            this.id + "_3",
            new Point(this.id, this.centerPoint.x + offsetX, this.centerPoint.y - offsetY),
            newWidth, newHeight, this.deep + 1, this.maxDeep));

    }

    /**
     * 
     * @param {Array<Entity2>} entityList 
     */
    update(entityList) {
        for (const entity of entityList) {
            if (this.isEntityIn(entity)) {
                if (this.deep < this.maxDeep) {
                    this.setUp();
                    for (const child of this.childs) {
                        child.update(entityList);

                    }
                }
            } else {
                this.childs = new Array();
            }
        }
    }

    isEntityIn(entity) {
        return Calculations
            .isPointBetweenThosePoints(entity.centerPoint, this.cornerPoints[0], this.cornerPoints[1]);
    }

    isQuereEmpty(entityList) {
        let isEmpty = true;
        for (const entity of entityList) {
            if(isEmpty) {
                isEmpty
            }

        }
    }

    /**
     * 
     * @returns {Array<Point>}
     */
    generateCornerPoints() {
        let arr = new Array();
        let halfWidth = this.width / 2;
        let halfHeight = this.height / 2;
        arr.push(new Point(this.id + "_0", this.centerPoint.x - halfWidth, this.centerPoint.y - halfHeight));
        arr.push(new Point(this.id + "_1", this.centerPoint.x + halfWidth, this.centerPoint.y + halfHeight));
        return arr;

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawMe(ctx) {
        //this.centerPoint.drawMe(ctx);
        for (const point of this.cornerPoints) {
            point.drawMe(ctx);
        }

        this.drawLine(ctx, this.cornerPoints[0].x, this.cornerPoints[0].y,
            this.cornerPoints[0].x, this.cornerPoints[1].y
        );
        this.drawLine(ctx, this.cornerPoints[0].x, this.cornerPoints[0].y,
            this.cornerPoints[1].x, this.cornerPoints[0].y
        );


        if (this.deep == this.maxDeep) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.cornerPoints[0].x, this.cornerPoints[0].y, this.width, this.height);

        }


        for (const child of this.childs) {
            child.drawMe(ctx);
        }

    }

    drawLine(ctx, fromX, fromY, toX, toY) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }

}


