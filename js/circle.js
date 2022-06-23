var images_div = document.getElementById("faces");
var images = [];
var images_landmarks = [];

function addImage(file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    images_div.appendChild(img);
    images.push(img);
}

function upload(event) {
    for (let index = 0; index < event.target.files.length; index++) {
        const file = event.target.files[index];
        addImage(file);
    }
    circle();
}
async function calculate_landmarks() {
    for (let index = 0; index < images.length; index++) {
        const img = images[index];
        landmarks = await get_landmarks(img);
        images_landmarks.push(landmarks);
    }
    console.log(images_landmarks);
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
        let circle = circles[i];
        circle.style.transform = "scale(2)";
        circle.style.opacity = `${op}`;
    }
}