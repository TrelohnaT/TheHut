import Calculations from "../common/Calculations.js";
import Entity2 from "../entities/Entity2.js";
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

        this.shouldSetUp = true;;


    }

    setUp() {
        //console.log("setting up: " + this.id);
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
     * @param {Map<String, Entity2>} entityMap 
     * @param {Set<String>} parentEntitySet 
     */
    update(entityMap, parentEntitySet, colisionSet) {
        //console.log(parentEntitySet);
        // each squere can have only entites from parent in them 
        let entitySet = new Set();
        for (const parentChildId of parentEntitySet) {
            let entity = entityMap.get(parentChildId);
            if (entity != null) {
                for (const [key, value] of entity.bodyPointMap) {
                    if (Calculations.isPointBetweenThosePoints(value, this.leftTopPoint, this.rightBottomPoint)) {
                        entitySet.add(entity.id);
                    }
                }
            }
        }

        // some enties are in here
        if (entitySet.size > 0 || entitySet.size != this.entitySet.size) {
            if (this.shouldSetUp) {
                this.setUp();
                this.shouldSetUp = false;
            }
            this.entitySet = entitySet;
            if (this.deep < this.maxDeep) {
                for (const [key, child] of this.childs) {
                    colisionSet = new Set([...colisionSet, ...child.update(entityMap, this.entitySet, colisionSet)]);
                }
            } else if (this.deep == this.maxDeep) {
                if (entitySet.size > 1) {
                    console.log("posible colision");
                    colisionSet = this.entitySet;
                }

            }
        } else if (entitySet.size == 0) {
            if (!this.shouldSetUp) {
                //console.log("clearing");
                this.entitySet.clear();
                this.childs.clear();
                this.shouldSetUp = true;
            }
        }

        return colisionSet;
    }

    destroy() {



    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawMe(ctx) {
        this.leftTopPoint.drawMe(ctx);
        this.rightBottomPoint.drawMe(ctx);

        // this.drawLine(ctx, this.leftTopPoint.x, this.leftTopPoint.y,
        //     this.leftTopPoint.x, this.rightBottomPoint.y
        // );
        // this.drawLine(ctx, this.leftTopPoint.x, this.leftTopPoint.y,
        //     this.rightBottomPoint.x, this.leftTopPoint.y
        // );


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


