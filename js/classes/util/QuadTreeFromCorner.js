import Calculations from "../common/Calculations.js";
import Point2 from "../geometry/Point2.js";


export default class QuadTreeFromCorner {

    /**
     * 
     * @param {String} id 
     * @param {Point2} leftTopPoint 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} deep 
     * @param {Number} maxDeep 
     */
    constructor(id, leftTopPoint, width, height, deep, maxDeep) {
        this.id = id;
        this.leftTopPoint = leftTopPoint;
        this.rightBottomPoint = new Point2("rightBottom", leftTopPoint.x + width, leftTopPoint.y + height);
        this.width = width;
        this.height = height;
        this.deep = deep;
        this.maxDeep = maxDeep;

        /**@type {Map<String, QuadTreeFromCorner>} */
        this.childs = new Map();

        /**@type {Set<String>} */
        this.entitySet = new Set();


    }

    setUp() {
        if (this.childs.length > 0 || this.deep == this.maxDeep) {
            return;
        }


        let newWidth = this.width / 2;
        let newHeight = this.height / 2;

        this.childs.set("left_top", new QuadTreeFromCorner(
            "left_top",
            new Point2("left_top_" + this.deep, this.leftTopPoint.x, this.leftTopPoint.y),
            newWidth,
            newHeight,
            this.deep + 1,
            this.maxDeep
        ));
        this.childs.set("right_top", new QuadTreeFromCorner(
            "right_top",
            new Point2("right_top_" + this.deep, this.leftTopPoint.x + newWidth, this.leftTopPoint.y),
            newWidth,
            newHeight,
            this.deep + 1,
            this.maxDeep
        ));
        this.childs.set("left_bottom", new QuadTreeFromCorner(
            "left_bottom",
            new Point2("left_bottom_" + this.deep, this.leftTopPoint.x, this.leftTopPoint.y + newHeight),
            newWidth,
            newHeight,
            this.deep + 1,
            this.maxDeep
        ));
        this.childs.set("right_bottom", new QuadTreeFromCorner(
            "right_bottom",
            new Point2("right_bottom_" + this.deep, this.leftTopPoint.x + newWidth, this.leftTopPoint.y + newHeight),
            newWidth,
            newHeight,
            this.deep + 1,
            this.maxDeep
        ));
    }

    /**
     * 
     * @param {Map<String, Entity>} entityMap 
     */
    update(entityMap) {
        if (this.isSomethingIn(entityMap, false)) {
            // this is not last layer
            if (this.deep < this.maxDeep) {
                this.setUp();
                for (const [key, child] of this.childs) {
                    child.update(entityMap);
                }
            } else if (this.deep == this.maxDeep) {
                if (this.entitySet.size > 1) {
                    console.log("posible colision");
                }

            }
        } else {
            this.childs.clear();
        }
    }

    /**
     * Returns true if atleast one entity is in
     * @param {Map<String, Entity2>} entityMap
     * @returns {boolean} 
     */
    isSomethingIn(entityMap, checkOnlyCenterPoint = true) {
        let isIn = false;
        for (const [key, entity] of entityMap) {
            if (checkOnlyCenterPoint) {
                if (Calculations.isPointBetweenThosePoints(entity.centerPoint, this.leftTopPoint, this.rightBottomPoint)) {
                    isIn = true;
                    this.entitySet.add(entity.id);
                }
            } else {

                for (const [key, value] of entity.bodyPointMap) {

                    if (Calculations.isPointBetweenThosePoints(value, this.leftTopPoint, this.rightBottomPoint)) {
                        isIn = true;
                        this.entitySet.add(entity.id);
                    }

                }

            }
        }
        return isIn;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawMe(ctx) {
        this.leftTopPoint.drawMe(ctx);
        this.rightBottomPoint.drawMe(ctx);

        this.drawLine(ctx, this.leftTopPoint.x, this.leftTopPoint.y,
            this.leftTopPoint.x, this.rightBottomPoint.y
        );
        this.drawLine(ctx, this.leftTopPoint.x, this.leftTopPoint.y,
            this.rightBottomPoint.x, this.leftTopPoint.y
        );


        if (this.deep == this.maxDeep) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.leftTopPoint.x, this.leftTopPoint.y, this.width, this.height);

        }


        for (const [key, child] of this.childs) {
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


