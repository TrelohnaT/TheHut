


export default class EntityParameters{

    constructor() {
        this.moveAble = false;
        this.seeCenterPoints = true;
        this.seeBodyPoints = true;
        this.pointLifeTimeAutonomy = false;
        this.isDoomed = false;

    }

    setMoveAble(value) {
        this.moveAble = value;
        return this;
    }
    
    setSeeCenterPoints(value) {
        this.seeCenterPoints = value;
        return this;
    }

    setSeeBodyPoints(value) {
        this.seeBodyPoints = value;
        return this;
    }

    setPointLifeTimeAutonomy(value) {
        return this;
    }

    setIsDoomed(value) {
        this.isDoomed = value;
        return this;
    }

}

