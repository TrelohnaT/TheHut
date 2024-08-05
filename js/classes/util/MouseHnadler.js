

export default class MouseHandler {

    constructor(id) {
        this.id = id;

        this.x = 0;
        this.y = 0;

        this.leftBtn = false;
        this.middleBtn = false;
        this.rightBtn = false;


        this.down = "onmousedown";
        this.up = "onmouseup";
    }


    handleEvent(buttonNumber, type) {
        if (buttonNumber == 0) {
            if (type == this.down) {
                this.leftBtn = true;
            } else if (type == this.up) {
                this.leftBtn = false;
            }
        } else if (buttonNumber == 1) {
            if (type == this.down) {
                this.middleBtn = true;
            } else if (type == this.up) {
                this.middleBtn = false;
            }
        } else if (buttonNumber == 2) {
            if (type == this.down) {
                this.rightBtn = true;
            } else if (type == this.up) {
                this.rightBtn = false;
            }
        }

    }

    clear() {
        this.leftBtn = false;
        this.middleBtn = false;
        this.rightBtn = false;
    }

}