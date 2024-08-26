import Calculations from "../common/Calculations.js";
import Entity2 from "../entities/Entity.js";
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
     * @param {Number} lowerLimit
     */
    constructor(id, leftTopPoint, width, height, deep, lowerLimit) {
        this.id = id;
        this.leftTopPoint = leftTopPoint;
        this.rightBottomPoint = new Point2("rightBottom", leftTopPoint.x + width, leftTopPoint.y + height);
        this.width = width;
        this.height = height;
        this.deep = deep;

        /**@type {Map<String, QuadTreeFromCorner>} */
        this.childs = new Map();

        this.shouldSetUp = true;

        this.lowLimit = lowerLimit;

        this.isLeaf = false;


    }

    setUp() {
        //console.log("setting up: " + this.id);
        if (this.childs.length > 0 || (this.width < this.lowLimit && this.height < this.lowLimit)) { //this.deep == this.maxDeep) {
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
            this.lowLimit
        ));
        this.childs.set(this.id + "_right_top", new QuadTreeFromCorner(
            this.id + "_right_top",
            new Point2(this.id + "_right_top_" + this.deep, this.leftTopPoint.x + newWidth, this.leftTopPoint.y),
            newWidth,
            newHeight,
            this.deep + 1,
            this.lowLimit
        ));
        this.childs.set(this.id + "_left_bottom", new QuadTreeFromCorner(
            this.id + "_left_bottom",
            new Point2(this.id + "_left_bottom_" + this.deep, this.leftTopPoint.x, this.leftTopPoint.y + newHeight),
            newWidth,
            newHeight,
            this.deep + 1,
            this.lowLimit
        ));
        this.childs.set(this.id + "_right_bottom", new QuadTreeFromCorner(
            this.id + "_right_bottom",
            new Point2(this.id + "_right_bottom_" + this.deep, this.leftTopPoint.x + newWidth, this.leftTopPoint.y + newHeight),
            newWidth,
            newHeight,
            this.deep + 1,
            this.lowLimit
        ));
    }

    /**
     * 
     * @param {Map<String, Entity2>} entityMap 
     * @param {Set<String>} parentEntitySet 
     * @returns {Set<Collision>}
     */
    update(entityMap, parentEntitySet, colisionSet) {
        //console.log("update: " + this.id);
        // each squere can have only entites from parent in them 
        /**@type {String} */
        let entityIdSet = new Set();
        let pointSet = new Set();
        for (const parentChildId of parentEntitySet) {
            let entity = entityMap.get(parentChildId);
            if (entity != null) {
                for (const [key, value] of entity.bodyPointMap) {
                    if (value.collisions) {
                        if (Calculations.isPointBetweenThosePoints(value, this.leftTopPoint, this.rightBottomPoint)) {
                            // set of entites in this square
                            entityIdSet.add(entity.id);
                            pointSet.add(value.id);
                        }
                    }
                }
            }
        }

        // some enties are in here
        if (entityIdSet.size > 0) {
            if (this.shouldSetUp) {
                this.setUp();
                this.shouldSetUp = false;
            }
            if (this.width > this.lowLimit || this.height > this.lowLimit) {
                //if (this.deep < this.maxDeep) {
                for (const [key, child] of this.childs) {
                    colisionSet = Calculations.addSetToSet(colisionSet, child.update(entityMap, entityIdSet, colisionSet));
                }
            } else if (this.width <= this.lowLimit && this.height <= this.lowLimit) {
                // this only take place in leaf child
                //console.log("width: " + this.width + " height: " + this.height + " deep: " + this.deep);
                this.isLeaf = true;
                if (entityIdSet.size > 1) {
                    let realCollision = false;
                    
                    for(let ent of entityIdSet) {
                        if(!ent.includes("terrain")) {
                            realCollision = true;
                            break;
                        }

                    }

                    if (realCollision) {
                        console.log("colision");
                        colisionSet.add(new Collision("", this.id, entityIdSet, pointSet));
                    }
                }

            }
        } else if (entityIdSet.size == 0) {
            if (!this.shouldSetUp) {
                //console.log("clearing");
                this.childs.clear();
                this.shouldSetUp = true;
                this.isLeaf = false;
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

        this.drawLine(ctx, this.leftTopPoint.x, this.leftTopPoint.y,
            this.leftTopPoint.x, this.rightBottomPoint.y
        );
        this.drawLine(ctx, this.leftTopPoint.x, this.leftTopPoint.y,
            this.rightBottomPoint.x, this.leftTopPoint.y
        );

        if (this.isLeaf) {
            //if (this.deep == this.maxDeep) {
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


