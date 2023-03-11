var images = [];
var hidden_images = [];
var images_landmarks = [];
var abs_images_centers = [];
var images_centers = [];
var images_translations = [];
var images_eyes_positions = [];
var images_scales = [];
var images_rotations = [];
var merge_scale_factor = 1;
var avatar_index = 0;
var align_index = 0;

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
  var avatars_images = avatars_div.querySelectorAll("img");
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
  let dangle = (2 * Math.PI) / images.length;
  let op = 1;
  let r = Math.min(faces_div.clientWidth, faces_div.clientHeight) / 3;
  for (let i = 0; i < images.length; ++i) {
    let image = images[i];
    let angle = dangle * i;
    image.style.transform = `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`;
    image.style.opacity = `${op}`;
  }
  align_index = 0;
}
function circle_one() {
  let dangle = (2 * Math.PI) / images.length;
  let op = 1;
  let r = Math.min(faces_div.clientWidth, faces_div.clientHeight) / 3;
  let image = images[align_index];
  let angle = dangle * align_index;
  image.style.transform = `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`;
  image.style.opacity = `${op}`;
  align_index = Math.max(align_index - 1, 0);
}

function center() {
  for (let i = 0; i < images.length; ++i) {
    let image = images[i];
    image.style.transformOrigin = `\
    ${images_centers[i][0]}px\
    ${images_centers[i][1]}px\
    `;
    image.style.transform = `\
    translate(${-images_translations[i][0]}px, \
    ${-images_translations[i][1]}px)\
    rotate(${-images_rotations[i]}rad)\
    scale(${35 / images_scales[i]})\
    `;
    image.style.opacity = `${(1-(i/images.length))}`;
  }
  align_index = images.length - 1;
}
function center_one() {
  var image = images[align_index];
  image.style.transformOrigin = `\
  ${images_centers[align_index][0]}px\
  ${images_centers[align_index][1]}px\
  `;
  image.style.transform = `\
  translate(${-images_translations[align_index][0]}px, \
  ${-images_translations[align_index][1]}px)\
  rotate(${-images_rotations[align_index]}rad)\
  scale(${35 / images_scales[align_index]})\
  `;
  image.style.opacity = `${(1-(align_index/images.length))}`;
  align_index = Math.min(align_index + 1, images.length - 1);
}
