// ---------------------- Global variable ---------------------- //

var image = document.getElementById("image");
var result = document.getElementById("result");
var btn_load = document.getElementById("load_img");
var btn_crop = document.getElementById("crop_img");
var btn_reset = document.getElementById("reset_img");

var cropper, options;
var croppable = false;

// ------------------- Initial build cropper ------------------- //

function InitialCropper() {
  options = {
    aspectRatio: NaN,
    viewMode: 1,
    preview: ".preview",
    ratotable: true,
    crop(event) {
      croppable = true;
    },
  };
  cropper = new Cropper(image, options);
}

// ----------------------- Button event ----------------------- //

btn_crop.onclick = function () {
  if (!croppable) return;
  var croppedCanvas = cropper.getCroppedCanvas();
  var roundedCanvas = canvasCrop(croppedCanvas);
  var roundedImage = document.createElement("img");
  roundedImage.src = roundedCanvas.toDataURL();
  result.innerHTML = "";
  result.appendChild(roundedImage);
};

// ---------------------- Window onload ----------------------- //

window.onload = function () {
  InitialCropper();
};
