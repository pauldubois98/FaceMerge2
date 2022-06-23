var faces = document.getElementById("faces");
var faces_landmarks = [];

async function addImage(file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    faces.appendChild(img);
    landmarks = await get_landmarks(img);
    faces_landmarks.push(landmarks);
}

async function upload(event) {
    for (let index = 0; index < event.target.files.length; index++) {
        const file = event.target.files[index];
        addImage(file);
    }
    circle();
    console.log(faces_landmarks[0]);
}

function circle() {
    let circles = faces.querySelectorAll("img");
    let dangle = (2 * Math.PI) / circles.length;
    let op = 1;
    let r = Math.min(faces.clientWidth, faces.clientHeight) / 3;
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
    let circles = faces.querySelectorAll("img");
    let op = 1 / circles.length;
    for (let i = 0; i < circles.length; ++i) {
        let circle = circles[i];
        circle.style.transform = "scale(2)";
        circle.style.opacity = `${op}`;
    }
}