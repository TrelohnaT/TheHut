

export default class MouseHandler {

    constructor(id) {
        this.id = id;

        this.x = 0;
        this.y = 0;

        this.leftBtn = false;
        this.middleBtn = false;
        this.rightBtn = false;

    }


    handleEvent(buttonNumber) {
        if(buttonNumber == 0) {
            this.leftBtn = !this.leftBtn;
        } else if(buttonNumber == 1) {
            this.middleBtn = !this.middleBtn;
        } else if(buttonNumber == 2) {
            this.rightBtn = !this.rightBtn;
        }

    }


}