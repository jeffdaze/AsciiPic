//some canvas methods here; might not use canvas to render -- might actually use a pre tag...
/**
 *
 *
 *
function createCanvas(){
  let canvasCreate = document.createElement("canvas");
  canvasCreate.style.position = "absolute";
  canvasCreate.style.left     = "0px";
  canvasCreate.style.top      = "0px";
  canvasCreate.style.zIndex   = 1;
  document.body.appendChild(canvasCreate);
  return canvasCreate;
}

function sizeCanvas(canvas){
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function init(){

  let canvas = createCanvas();

  window.addEventListener("resize", function(){ sizeCanvas(canvas) });
  //initially make the canvas the size of the whole window space...
  sizeCanvas(canvas);


}
 *
 *
 *
 */

//globals
//for the render area...
const view = document.getElementById("view");

//form for rendering online images...
let button = document.getElementById("render");
let textfield = document.getElementById("imageSource");

//global for greyscale chars...
const asciiRamp1 = " .:-=+*#%@";
const asciiRamp2 = ` .'^",:;Il!i<>~+_-?[]{}1()|\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@S`;

//some canvas handling to convert to greyscale...
function grey(input) {
  let canvas= document.createElement("canvas");

  let width = input.width;
  let height = input.height;

  //need to reset the canvas width or we won't get the complete image data...
  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext('2d');
  ctx.drawImage(myimage, 0 , 0);

  let imgPixels = ctx.getImageData(0, 0, width, height);

  //don't want every pixel; only get every so-many one...
  let scale = 15;

  //build the string here...
  let accumulator = "";

  //loop through image pixels here...
  for(let y = 0; y < height; y+=scale){
    for(let x = 0; x < width; x+=scale){

      let i = (y * 4) * width + x * 4;

      let avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;

      //average pixel value here; this is where I could grab my glyph equivalent...
      accumulator += asciiRamp1[Math.floor(avg / 28)];

      //if we wanted to render to another canvas could use the pixel data here...
      //imgPixels.data[i] = avg;
      //imgPixels.data[i + 1] = avg;
      //imgPixels.data[i + 2] = avg;
    }

    //newline for each row...
    accumulator += "\n";
  }

  //render our text to the pre tag...
  view.textContent = accumulator;

  //probably don't need to do this since it will be converted to chars...
  //ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
}

//create an image object to use...
let myimage = new Image();

//secret to allow for cors image loading!
myimage.crossOrigin = "Anonymous";

//handle loading...
myimage.onload = function() {
  grey(myimage);
}

//error handling if loading external garbage!
myimage.onerror = function(){
  view.textContent = "ERROR \nERROR \nERROR \nERROR \nERROR \nERROR \nERROR \nERROR \nERROR ERROR ERROR ERROR...\n\n Loading new default image";
  console.warn("image loading error; fallback to new default image...");
  setTimeout(function(){
    myimage.src = "images/imgtest2.png";
  }, 500);

}

myimage.src = "images/imgtest1.jpg";


//now we can use any image file on the internet to render as ascii...
function getImage(){
  let imageUrl = textfield.value;

  if(imageUrl){
    myimage.src = imageUrl;
  }
}

//handle button click...
button.addEventListener('click', function() {
  getImage()
}, false);

//handle enter button press...
textfield.addEventListener('keyup', function(event){
  //enter is code 13...
  if(event.keyCode === 13){
    getImage()
  }
});
