// ---------------------- Global variable ---------------------- //

var image = document.getElementById("image");
var button = document.getElementById("crop_img");
var result = document.getElementById("result");
var croppable = false;

// ------------------- Initial build cropper ------------------- //

var cropper = new Cropper(image, {
  aspectRatio: NaN, //比例
  viewMode: 1, //裁剪空間可以到外面
  preview: ".preview", //預覽圖
  ratotable: true, //可旋轉但我沒做
  crop(event) {
    croppable = true; //當正在拉圖的時候表示true(框在上面的時候)
  },
});

// ------------------------------------------------------------- //

function canvasCrop(source) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var width = source.width;
  var height = source.height;
  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  //圖像平滑度開啟
  context.drawImage(source, 0, 0, width, height);
  //drawImage(img,dx,dy,dwidth,dheight)
  context.globalCompositeOperation = "destination-in";
  // globalCompositeOperation含12種合成設定，每一種合成設定均將套用到新繪製的圖形上
  //destination-in只保留新、舊圖形重疊的舊圖形區域，其餘皆變為透明。
  // context.beginPath();
  // context.rect(0, 0, width, height);
  // context.fill();
  //填充填滿
  return canvas;
}

  button.onclick = function () {
  	var croppedCanvas;
  	var roundedCanvas;
  	var roundedImage;
    if (!croppable) {
      return;
    }
    // Crop
    croppedCanvas = cropper.getCroppedCanvas();
    //返回影象裁剪後，繪製的canvas物件，如果影象未裁剪，則將返回整個影象，繪製的canvas。
    // Round
    roundedCanvas = canvasCrop(croppedCanvas);
    //繪製canvas。
    // Show
    roundedImage = document.createElement("img");
    roundedImage.src = roundedCanvas.toDataURL();
    //roundedCanvas轉成圖片+base64模式 (toDataURL)
    result.innerHTML = "";
    //清空HTML讓他不會重複生成
    result.appendChild(roundedImage);
    //生成圖片在result 用生成appendChild子節點的方式
  };
