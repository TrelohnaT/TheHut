import Calculations from "../common/Calculations.js";
import Entity2 from "../entities/Entity2.js";
import Point2 from "../geometry/Point2.js";
import Collision from "./Collision.js";


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

        this.shouldSetUp = true;;


    }

    setUp() {
        //console.log("setting up: " + this.id);
        if (this.childs.length > 0 || this.deep == this.maxDeep) {
            return;
        }

        let newWidth = this.width / 2;
        let newHeight = this.height / 2;

        this.childs.set(this.id + "_left_top", new QuadTreeFromCorner(
            this.id + "_left_top",
            new Point2(this.id + "_left_top_" + this.deep, this.leftTopPoint.x, this.leftTopPoint.y),
            newWidth,
            newHeight,
            this.deep + 1,
            this.maxDeep
        ));
        this.childs.set(this.id + "_right_top", new QuadTreeFromCorner(
            this.id + "_right_top",
            new Point2(this.id + "_right_top_" + this.deep, this.leftTopPoint.x + newWidth, this.leftTopPoint.y),
            newWidth,
            newHeight,
            this.deep + 1,
            this.maxDeep
        ));
        this.childs.set(this.id + "_left_bottom", new QuadTreeFromCorner(
            this.id + "_left_bottom",
            new Point2(this.id + "_left_bottom_" + this.deep, this.leftTopPoint.x, this.leftTopPoint.y + newHeight),
            newWidth,
            newHeight,
            this.deep + 1,
            this.maxDeep
        ));
        this.childs.set(this.id + "_right_bottom", new QuadTreeFromCorner(
            this.id + "_right_bottom",
            new Point2(this.id + "_right_bottom_" + this.deep, this.leftTopPoint.x + newWidth, this.leftTopPoint.y + newHeight),
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
        //console.log("update: " + this.id);
        // each squere can have only entites from parent in them 
        let entitySet = new Set();
        for (const parentChildId of parentEntitySet) {
            let entity = entityMap.get(parentChildId);
            if (entity != null) {
                for (const [key, value] of entity.bodyPointMap) {
                    if (Calculations.isPointBetweenThosePoints(value, this.leftTopPoint, this.rightBottomPoint)) {
                        // set of entites in this square
                        entitySet.add(entity.id);
                    }
                }
            }
        }

        // some enties are in here
        if (entitySet.size > 0) {
            if (this.shouldSetUp) {
                this.setUp();
                this.shouldSetUp = false;
            }

            if (this.deep < this.maxDeep) {
                for (const [key, child] of this.childs) {
                   colisionSet = Calculations.addSetToSet(colisionSet, child.update(entityMap, entitySet, colisionSet));
                }
            } else if (this.deep == this.maxDeep) {
                // this only take place in leaf child
                if (entitySet.size > 1) {
                    console.log("colision");
                    colisionSet.add(new Collision("", this.id, entitySet));
                }

            }
        } else if (entitySet.size == 0) {
            if (!this.shouldSetUp) {
                //console.log("clearing");
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

        //  this.drawLine(ctx, this.leftTopPoint.x, this.leftTopPoint.y,
        //      this.leftTopPoint.x, this.rightBottomPoint.y
        //  );
        //  this.drawLine(ctx, this.leftTopPoint.x, this.leftTopPoint.y,
        //      this.rightBottomPoint.x, this.leftTopPoint.y
        //  );


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


