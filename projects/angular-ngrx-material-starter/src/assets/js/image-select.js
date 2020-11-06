function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    var id = input.id;
    var index = id.substring(10);

    reader.onload = function (e) {
      var img= document.getElementById("imagen" + index);
      img.src=e.target.result;
      img.style.display = "inline";
      var icon= document.getElementById('camera' + index);
      icon.style.display="none";
      var close = document.getElementById('close' + index);
      if (index != 0) {
        close.style.display = "inline";
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function clickInput(e) {
  var id = e.id;
  var index = id.substring(6);
  var input = document.getElementById("inputImage" + index);
  input.click();
}

function hideCamera_showClose(image) {
  image.style.display = "inline"
  var id = image.id;
  var index = id.substring(6);
  var icon = document.getElementById("camera"+index);
  icon.style.display = "none";
  var close = document.getElementById("close"+index);
  if (index != 0) {
    close.style.display = "inline";
  }
}
