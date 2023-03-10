var images = [];
var hidden_images = [];
var images_landmarks = [];
var abs_images_centers = [];
var images_centers = [];
var images_translations = [];
var images_scales = [];
var images_rotations = [];
var merge_scale_factor = 1;
var avatar_index = 0;
var align_index = 0;
var circles = [];
var avatars_images = [];

function addImage(file) {
  var img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  faces_div.appendChild(img);
  images.push(img);
  var hidden_img = document.createElement("img");
  hidden_img.src = URL.createObjectURL(file);
  hidden_images.push(hidden_img);
}
function add_avatar() {
  avatars_images = avatars_div.querySelectorAll("img");
  var img = avatars_images[avatar_index].cloneNode(true);
  faces_div.appendChild(img);
  images.push(img);
  var hidden_img = avatars_images[avatar_index].cloneNode(true);
  hidden_images.push(hidden_img);
  avatar_index = (avatar_index + 1) % avatars_images.length;
  circle();
  load_bar.value = 0;
  circle_btn.disabled = true;
  circle_one_btn.disabled = true;
  center_btn.disabled = true;
  center_one_btn.disabled = true;
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
  align_index = 0;
}
function circle_one() {
  circles = faces_div.querySelectorAll("img");
  let dangle = (2 * Math.PI) / circles.length;
  let op = 1;
  let r = Math.min(faces_div.clientWidth, faces_div.clientHeight) / 3;
  let circle = circles[align_index];
  let angle = dangle * align_index;
  circle.style.transform = `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`;
  circle.style.opacity = `${op}`;
  align_index = Math.max(align_index - 1, 0);
}

function center() {
  circles = faces_div.querySelectorAll("img");
  for (let i = 0; i < circles.length; ++i) {
    circles[i].style.transformOrigin = `\
    ${images_centers[i][0]}px\
    ${images_centers[i][1]}px\
    `;
    circles[i].style.transform = `\
    translate(${-images_translations[i][0]}px, \
    ${-images_translations[i][1]}px)\
    rotate(${images_rotations[i]}rad)\
    scale(${1 / images_scales[i]})\
    `;
    circles[i].style.opacity = `${(1-(i/circles.length))}`;
  }
  align_index = circles.length - 1;
}
function center_one() {
  circles = faces_div.querySelectorAll("img");
  circles[align_index].style.transformOrigin = `\
  ${images_centers[align_index][0]}px\
  ${images_centers[align_index][1]}px\
  `;
  circles[align_index].style.transform = `\
  translate(${-images_translations[align_index][0]}px, \
  ${-images_translations[align_index][1]}px)\
  rotate(${images_rotations[align_index]}rad)\
  scale(${1 / images_scales[align_index]})\
  `;
  circles[align_index].style.opacity = `${(1-(align_index/circles.length))}`;
  align_index = Math.min(align_index + 1, circles.length - 1);
}
