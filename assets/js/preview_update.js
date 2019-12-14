console.log("this page is loaded")
function readURL(input) {
  if (input.file) {
    console.log(input.file);
    var reader = new FileReader();
    
    reader.onload = function(e) {
      console.log("event is",e);
      $('#blah').attr('src', e.target.result);
    }
    
    reader.readAsDataURL(input.file);
  }
}

$("#update-image").change(function() {
  console.log("he has changed")
  readURL(this);
});