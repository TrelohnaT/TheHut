

export default class Vector2 {

    constructor(id) {
        this.id = id;

        this.startX = 0;
        this.startY = 0;

        this.endX = 0;
        this.endY = 0;

        this.velocityX = 0;
        this.velocityY = 0;

        this.length = 0;

        this.angle = 0;

    }

    update(startX, startY) {
        this.startX = startX;
        this.startY = startY;
    }

    initByAngleAndLength(angle, length) {

        this.angle = angle;
        this.length = length;

        let endPoint = Calculations.point_B_angle_B_length_c_get_point_A(
            new Point("A", this.startX, this.startY),
            angle,
            length);

        this.endX = endPoint.x;
        this.endY = endPoint.y;
    }


}

