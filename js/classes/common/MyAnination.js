


export default class MyAnimation {

    /**
     * 
     * @param {String} id 
     * @param {Array<String>} frameIdList 
     */
    constructor(id, frameIdList, delay = 5) {

        this.id = id;
        this.frameIdList = frameIdList;
        this.delay = delay;
        this.currentFrame = 0;
        this.currentClock = 0;

    }

    getFrame() {
        let frameEl = document.getElementById(this.frameIdList[this.currentFrame]);

        if (this.delay == this.currentClock) {
            this.currentClock = 0;
            // add the next frame, or reset the counter
            if ((this.currentFrame + 1) < this.frameIdList.length) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
        } else {
            this.currentClock++;
        }
        return frameEl;

    }

    getParticularFrame(frameNumber) {
        return document.getElementById(this.frameIdList[frameNumber]);
    }

}


