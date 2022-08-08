var images_div = document.getElementById("faces");
var images = [];
var hidden_images = [];
var images_landmarks = [];
var images_centers = [];

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
}

function circle() {
  let circles = images_div.querySelectorAll("img");
  let dangle = (2 * Math.PI) / circles.length;
  let op = 1;
  let r = Math.min(images_div.clientWidth, images_div.clientHeight) / 3;
  for (let i = 0; i < circles.length; ++i) {
    let circle = circles[i];
    let angle = dangle * i;
    circle.style.transform = `translate(${Math.cos(angle) * r}px, ${
      Math.sin(angle) * r
    }px)`;
    circle.style.opacity = `${op}`;
  }
}

function center() {
  let circles = images_div.querySelectorAll("img");
  let op = 1 / circles.length;
  for (let i = 0; i < circles.length; ++i) {
    try {
      circles[i].style.transform = `scale(1) translate(${-images_centers[
        i
      ][0]}px, ${-images_centers[i][1]}px)`;
    } catch (error) {
      circles[i].style.transform = `scale(1)`;
    }
    circles[i].style.opacity = `${op}`;
  }
}
