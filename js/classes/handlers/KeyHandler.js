


export default class KeyHandler {

    constructor(id) {
        this.id = id;

        this.keyMap = new Map();
        // list of supported keys, no needed but still
        this.keyMap.set("W", false);
        this.keyMap.set("S", false);
        this.keyMap.set("A", false);
        this.keyMap.set("D", false);
        this.keyMap.set("SPACE", false);

        this.typeUp = "up";
        this.typeDown = "down";

    }

    handleEvent(key, type) {

        if(key == " ") {
            key = "SPACE";
        } 

        if(type == this.typeDown) {
            this.keyMap.set(key.toUpperCase(), true);

        }
        else if (type == this.typeUp) {
            this.keyMap.set(key.toUpperCase(), false);
        }

    }

    getValue(key) {
        return this.keyMap.get(key.toUpperCase());
    }

    printInfo() {

        for (let [key, value] of this.keyMap) {
            console.log(key + " is " + value);
        }
    }


}



