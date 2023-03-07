async function calculate_landmarks() {
  full_load.style.display = "flex";
  circle_btn.disabled = true;
  circle_one_btn.disabled = true;
  center_btn.disabled = true;
  center_one_btn.disabled = true;
  load_bar.value = 0;

  images_landmarks = [];
  for (let i = 0; i < hidden_images.length; i++) {
    var img = hidden_images[i];
    landmarks = await get_landmarks(img);
    images_landmarks.push(landmarks);
    load_bar.value = (i+1)/hidden_images.length;
  }
  // console.log("landmarks:");
  // console.log(images_landmarks);
  calculate_centers();
  // console.log("centers:");
  // console.log(images_centers);
  calculate_scale();
  // console.log("scales:");
  // console.log(images_scales);
  load_bar.value = 1;
  circle_btn.disabled = false;
  circle_one_btn.disabled = false;
  center_btn.disabled = false;
  center_one_btn.disabled = false;
  full_load.style.display = "none";
}

function calculate_centers() {
  images_centers = [];
  abs_images_centers = [];
  let circles = faces_div.querySelectorAll("img");
  for (let i = 0; i < hidden_images.length; i++) {
    var img = hidden_images[i];
    var landmarks = images_landmarks[i];
    var total_x = 0;
    var total_y = 0;
    var count = 0;
    landmarks._positions.forEach(function (item, i) {
      total_x += item._x;
      total_y += item._y;
      count++;
    });
    f_c = [
      (circles[i].width * (total_x / count)) / img.width,
      (circles[i].height * (total_y / count)) / img.height,
    ];
    abs_images_centers.push([total_x / count, total_y / count]);
    images_centers.push(f_c);
  }
  var c_x = 0;
  var c_y = 0;
  for (let i = 0; i < images_centers.length; i++) {
    c_x += images_centers[i][0];
    c_y += images_centers[i][1];
  }
  c_x /= images_centers.length;
  c_y /= images_centers.length;
  for (let i = 0; i < images_centers.length; i++) {
    images_centers[i][0] -= c_x;
    images_centers[i][1] -= c_y;
  }
}

function calculate_scale() {
  images_scales = [];
  for (let i = 0; i < hidden_images.length; i++) {
    var img = hidden_images[i];
    var landmarks = images_landmarks[i];
    var total = 0;
    var count = 0;
    var c_x = abs_images_centers[i][0];
    var c_y = abs_images_centers[i][1];
    landmarks._positions.forEach(function (item, j) {
      total += Math.sqrt((item._x - c_x) ** 2 + (item._y - c_y) ** 2);
      count++;
    });
    var span = Math.sqrt(img.width ** 2 + img.height ** 2);
    f_s = total / count / span;
    images_scales.push(f_s);
  }
  var c = images_scales[0];
  for (let i = 1; i < images_scales.length; i++) {
    if (images_scales[i] > c) {
      c = images_scales[i];
    }
  }
  for (let i = 0; i < images_scales.length; i++) {
    images_scales[i] /= c;
  }
}
