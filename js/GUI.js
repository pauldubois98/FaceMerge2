var images_div = document.getElementById("faces");
var center_btn = document.getElementById("center_btn");
var circle_btn = document.getElementById("circle_btn");
var load_bar = document.getElementById("load");
var images = [];
var hidden_images = [];
var images_landmarks = [];
var abs_images_centers = [];
var images_centers = [];
var images_scales = [];
var merge_scale_factor = 1;

function addImage(file) {
  var img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  images_div.appendChild(img);
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
}

function circle() {
  let circles = images_div.querySelectorAll("img");
  let dangle = (2 * Math.PI) / circles.length;
  let op = 1;
  let r = Math.min(images_div.clientWidth, images_div.clientHeight) / 3;
  for (let i = 0; i < circles.length; ++i) {
    let circle = circles[i];
    let angle = dangle * i;
    circle.style.transform = `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`;
    circle.style.opacity = `${op}`;
  }
}

function center() {
  let circles = images_div.querySelectorAll("img");
  for (let i = 0; i < circles.length; ++i) {
    circles[i].style.transform = `\
    translate(${-images_centers[i][0] / images_scales[i]}px, \
    ${-images_centers[i][1] / images_scales[i]}px)\
    scale(${1 / images_scales[i]})`;
    circles[i].style.opacity = `${(1-(i/circles.length))}`;
  }
}

let circles = images_div.querySelectorAll("img");
