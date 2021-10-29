// ---------------------- Global variable ---------------------- //

var image = document.getElementById("image");
var result = document.getElementById("result");
var btn_crop = document.getElementById("crop_img");
var btn_reset = document.getElementById("reset_img");
var btn_upload = document.getElementById("upload_img");
var tooltip = document.getElementById("docs-tooltip");
var toggle = document.getElementById("docs-toggles");
var dataWidth = document.getElementById("dataWidth");
var dataHeight = document.getElementById("dataHeight");
var formControl = $('input[class="form-control"]');

var cropper, options;
var croppable = false;

// ------------------- Initial build cropper ------------------- //

function initialCropper(restart = false) {
  if (cropper) {
    cropper.destroy();
  }
  if (!restart) {
    options = {
      aspectRatio: NaN,
      viewMode: 1,
      preview: ".preview",
      ratotable: true,
      crop(event) {
        dataWidth.value = Math.round(event.detail.width);
        dataHeight.value = Math.round(event.detail.height);
        croppable = true;
      },
    };
  }
  cropper = new Cropper(image, options);
}

// ----------------------- Export photo ------------------------ //

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
      initialCropper();
      btn_upload.value = null;
    } else {
      window.alert("Please choose an image file.");
    }
  }
};

btn_crop.onclick = function () {
  if (!croppable) return;
  var croppedCanvas = cropper.getCroppedCanvas();
  var roundedCanvas = canvasCrop(croppedCanvas);
  var roundedImage = document.createElement("img");
  roundedImage.src = roundedCanvas.toDataURL();
  result.innerHTML = null;
  result.appendChild(roundedImage);
};

btn_reset.onclick = function () {
  initialCropper();
};

tooltip.onclick = function (event) {
  var target = event.target;
  if (target.nodeName == "SPAN") {
    // 如果是按到 favicon 時，就找 父層的 button
    target = target.parentNode;
  }
  var method = target.getAttribute("data-method");
  var value = target.getAttribute("value");
  switch (method) {
    case "zoom":
      cropper.zoom(value);
      break;
    case "rotate":
      cropper.rotate(value);
      break;
    case "scaleX":
      cropper.scaleX(value);
      target.setAttribute("value", -value);
      break;
    case "scaleY":
      cropper.scaleY(value);
      target.setAttribute("value", -value);
      break;
  }
};

toggle.onchange = function (event) {
  options["aspectRatio"] = event.target.value;
  initialCropper(true);
};

// ---------------------- Window onload ------------------------ //

window.onload = function () {
  initialCropper();

  // ------- Fail at work, 從 input 改變 選取框大小 ------ //
  formControl.each(function (index, element) {
    element.addEventListener("input", function (event) {
      var key = event.target.name;
      var val = event.target.value;
      var data = cropper.getData();
      data[key] = val;
      cropper.setData(data);
    });
  });
  // --------------------------------------------------- //
};
