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
async function calculate_landmarks() {
    for (let i = 0; i < hidden_images.length; i++) {
        var img = hidden_images[i];
        landmarks = await get_landmarks(img);
        images_landmarks.push(landmarks);
    }
    console.log(images_landmarks);
    calculate_centers();
    console.log(images_centers);
}

function calculate_centers() {
    images_centers = [];
    let circles = images_div.querySelectorAll("img");
    for (let i = 0; i < hidden_images.length; i++) {
        var img = hidden_images[i];
        var landmarks = images_landmarks[i]
        var total_x = 0;
        var total_y = 0;
        var count = 0;
        landmarks._positions.forEach(function(item, i) {
            total_x += item._x;
            total_y += item._y;
            count++;
        });
        f_c = [circles[i].width*(total_x / count)/img.width, circles[i].height*(total_y / count)/img.height];
        images_centers.push(f_c);
    }
    var c_x = 0;
    var c_y = 0;
    for (let i = 0; i < images_centers.length; i++) {
        c_x += images_centers[i][0];
        c_y += images_centers[i][1];
    }
    c_x /= images_centers.length
    c_y /= images_centers.length
    for (let i = 0; i < images_centers.length; i++) {
        images_centers[i][0] -= c_x;
        images_centers[i][1] -= c_y;
    }
    console.log(c_x, c_y)
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
            circles[i].style.transform = `scale(1) translate(${-images_centers[i][0]}px, ${-images_centers[i][1]}px)`;
        } catch (error) {
            circles[i].style.transform = `scale(1)`;            
        }
        circles[i].style.opacity = `${op}`;
    }
}