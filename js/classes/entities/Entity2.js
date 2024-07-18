import Point2 from "../geometry/Point2.js";



export default class Entity2 {

    /**
     * 
     * @param {String} id 
     * @param {Point2} centerPoint 
     */
    constructor(id, centerPoint) {
        this.id = id;
        this.centerPoint = centerPoint;

    }

    setUp() {

        return this;
    }

    update() {

        this.centerPoint.moveMeX();
        this.centerPoint.moveMeY();


        return this;
    }



    drawMe(ctx) {
        this.centerPoint.drawMe(ctx);
    }

}

