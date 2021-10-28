// ---------------------- Global variable ---------------------- //

var image = document.getElementById("image");
var result = document.getElementById("result");
var btn_crop = document.getElementById("crop_img");
var btn_reset = document.getElementById("reset_img");
var btn_upload = document.getElementById("upload_img");
var btn_zoomIn = null;

var cropper, options;
var croppable = false;

// ------------------- Initial build cropper ------------------- //

function initialCropper() {
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

// ------------------------------------------------------------- //

function canvasCrop(source) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var width = source.width;
  var height = source.height;
  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  context.drawImage(source, 0, 0, width, height);
  context.globalCompositeOperation = "destination-in";
  return canvas;
}

// ----------------------- Button event ------------------------ //

btn_upload.onchange = function () {
  var uploadedImageURL;
  var files = this.files;
  if (files && files.length) {
    var file = files[0];
    if (/^image\/\w+/.test(file.type)) {
      uploadedImageType = file.type;
      uploadedImageName = file.name;
      if (uploadedImageURL) {
        URL.revokeObjectURL(uploadedImageURL);
      }
      image.src = uploadedImageURL = URL.createObjectURL(file);
      if (cropper) {
        cropper.destroy();
      }
      initialCropper();
      btn_upload.value = null;
    } else {
      window.alert("Please choose an image file.");
    }
  }
};

btn_crop.onclick = function () {
  console.log("foo");
  if (!croppable) return;
  var croppedCanvas = cropper.getCroppedCanvas();
  var roundedCanvas = canvasCrop(croppedCanvas);
  var roundedImage = document.createElement("img");
  roundedImage.src = roundedCanvas.toDataURL();
  result.innerHTML = null;
  result.appendChild(roundedImage);
};

btn_reset.onclick = function () {
  if (cropper) {
    cropper.destroy();
  }
  initialCropper();
};

// ---------------------- Window onload ------------------------ //

window.onload = function () {
  initialCropper();
};
