var images = [];
var hidden_images = [];
var images_landmarks = [];
var abs_images_centers = [];
var images_centers = [];
var images_scales = [];
var merge_scale_factor = 1;
var align_indice = 0;
var circles = [];

function addImage(file) {
  var img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  faces_div.appendChild(img);
  images.push(img);
  var hidden_img = document.createElement("img");
  hidden_img.src = URL.createObjectURL(file);
  hidden_images.push(hidden_img);
}

function upload(event) {
  for (let i = 0; i < event.target.files.length; i++) {
    var file = event.target.files[i];
    addImage(file);
  }
  circle();
  load_bar.value = 0;
  circle_btn.disabled = true;
  circle_one_btn.disabled = true;
  center_btn.disabled = true;
  center_one_btn.disabled = true;
}

function circle() {
  circles = faces_div.querySelectorAll("img");
  let dangle = (2 * Math.PI) / circles.length;
  let op = 1;
  let r = Math.min(faces_div.clientWidth, faces_div.clientHeight) / 3;
  for (let i = 0; i < circles.length; ++i) {
    let circle = circles[i];
    let angle = dangle * i;
    circle.style.transform = `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`;
    circle.style.opacity = `${op}`;
  }
  align_indice = 0;
}
function circle_one() {
  circles = faces_div.querySelectorAll("img");
  let dangle = (2 * Math.PI) / circles.length;
  let op = 1;
  let r = Math.min(faces_div.clientWidth, faces_div.clientHeight) / 3;
  let circle = circles[align_indice];
  let angle = dangle * align_indice;
  circle.style.transform = `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`;
  circle.style.opacity = `${op}`;
  align_indice = Math.max(align_indice - 1, 0);
}

function center() {
  circles = faces_div.querySelectorAll("img");
  for (let i = 0; i < circles.length; ++i) {
    circles[i].style.transform = `\
    translate(${-images_centers[i][0] / images_scales[i]}px, \
    ${-images_centers[i][1] / images_scales[i]}px)\
    scale(${1 / images_scales[i]})`;
    circles[i].style.opacity = `${(1-(i/circles.length))}`;
  }
  align_indice = circles.length - 1;
}
function center_one() {
  circles = faces_div.querySelectorAll("img");
  circles[align_indice].style.transform = `\
  translate(${-images_centers[align_indice][0] / images_scales[align_indice]}px, \
  ${-images_centers[align_indice][1] / images_scales[align_indice]}px)\
  scale(${1 / images_scales[align_indice]})`;
  circles[align_indice].style.opacity = `${(1-(align_indice/circles.length))}`;
  align_indice = Math.min(align_indice + 1, circles.length - 1);
}
