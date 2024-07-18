import Engine from "./classes/Engine.js";
import KeyHandler from "./classes/util/KeyHandler.js";
import MouseHandler from "./classes/util/MouseHnadler.js";


let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 50;
let ctx = canvas.getContext("2d");

let engine = new Engine("engine");

let keyHandler = new KeyHandler("keyHandler");

let mouseHandler = new MouseHandler("mouseHandler");

let mousePosition = {};


export function starter() {
    console.log("starter");

    engine.setUp(canvas.width, canvas.height);


}

export function keyEvent(event, type) {
    keyHandler.handleEvent(event.key, type);
}

mainLoop();
/**
 * Hlavni smycka ktera se bude opakovat do konce casu, nebo do znovunacteni
 */
function mainLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    engine.update(ctx, keyHandler, mouseHandler, canvas.width, canvas.height);

    requestAnimationFrame(mainLoop);
    frames++;
    
}

setInterval(() => {

    document.getElementById("fps_counter").innerHTML = frames + " FPS";
    frames = 0;
}, 1000)



// mouse event listeners
document.getElementById("canvas").onmousemove = function(evt) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;    
    let scaleY = canvas.height / rect.height;  
    mouseHandler.x = (evt.clientX - rect.left) * scaleX;
    mouseHandler.y = (evt.clientY - rect.top) * scaleY; 
    
}
document.getElementById("canvas").onmousedown = function(evt) {
    mouseHandler.handleEvent(evt.button);
}
document.getElementById("canvas").onmouseup = function(evt) {
    mouseHandler.handleEvent(evt.button);
}

document.getElementById("maxDeep").onchange = function(evt) {
    document.getElementById("showMaxDeep").innerHTML = document.getElementById("maxDeep").value;
    starter();
}


