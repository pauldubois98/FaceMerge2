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
    for (let index = 0; index < event.target.files.length; index++) {
        var file = event.target.files[index];
        addImage(file);
    }
    circle();
}
async function calculate_landmarks() {
    for (let index = 0; index < hidden_images.length; index++) {
        var img = hidden_images[index];
        landmarks = await get_landmarks(img);
        images_landmarks.push(landmarks);
    }
    console.log(images_landmarks);
    calculate_centers();
    console.log(images_centers);
}

function calculate_centers() {
    for (let index = 0; index < hidden_images.length; index++) {
        var img = hidden_images[index];
        var landmarks = images_landmarks[index]
        var total_x = 0;
        var total_y = 0;
        var count = 0;
        landmarks._positions.forEach(function(item, index) {
            total_x += item._x;
            total_y += item._y;
            count++;
        });
        f_c = [(total_x / count)/img.width, (total_y / count)/img.height];
        images_centers.push(f_c);
    }
    console.log(images_landmarks);
    console.log(images_centers);
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
    let op = 1 / circles.length;
    for (let i = 0; i < circles.length; ++i) {
        try {
            circles[i].style.transform = `scale(1) translate(${-images_centers[i][0]*circles[i].width}px, ${-images_centers[i][1]*circles[i].height}px)`;
        } catch (error) {
            circles[i].style.transform = `scale(1)`;            
        }
        circles[i].style.opacity = `${op}`;
    }
}