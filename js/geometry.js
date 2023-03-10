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
  calculate_rotation();
  // console.log("rotations:");
  // console.log(images_rotations);
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
  images_translations = [];
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
    abs_images_centers.push([total_x / count, total_y / count]);
    images_centers.push([
      (circles[i].width * (total_x / count)) / img.width,
      (circles[i].height * (total_y / count)) / img.height,
    ]);
    images_translations.push([
      (circles[i].width * (total_x / count)) / img.width,
      (circles[i].height * (total_y / count)) / img.height,
    ]);
  }
  var c_x = 0;
  var c_y = 0;
  for (let i = 0; i < images_translations.length; i++) {
    c_x += images_translations[i][0];
    c_y += images_translations[i][1];
  }
  c_x /= images_translations.length;
  c_y /= images_translations.length;
  for (let i = 0; i < images_translations.length; i++) {
    images_translations[i][0] -= c_x;
    images_translations[i][1] -= c_y;
  }
}

function calculate_rotation() {
  images_rotations = [];
  landmarks0 = images_landmarks[0];
  var c_x0 = abs_images_centers[0][0];
  var c_y0 = abs_images_centers[0][1];
  images_rotations.push(0);
  for (let i = 1; i < hidden_images.length; i++) {
    var img = hidden_images[i];
    var landmarks = images_landmarks[i];
    var s_x = 0;
    var s_y = 0;
    var c_x = abs_images_centers[i][0];
    var c_y = abs_images_centers[i][1];
    for (let j = 0; j < landmarks._positions.length; j++) {
      var x1 = landmarks._positions[j]._x - c_x;
      var y1 = landmarks._positions[j]._y - c_y;
      var x2 = landmarks0._positions[j]._x - c_x0;
      var y2 = landmarks0._positions[j]._y - c_y0;
      var x3 = x1 * x2 + y1 * y2;
      var y3 = x1 * y2 - y1 * x2;
      s_x += x3;
      s_y += y3;
    }
    rotation = Math.atan2(s_y, s_x);
    images_rotations.push(rotation);
  }
  var total_rotation = 0;
  var count = 0;
  for (let i = 0; i < images_rotations.length; i++) {
    total_rotation += images_rotations[i];
    count++;
  }
  var mean_rotation = total_rotation /= count;
  for (let i = 0; i < images_rotations.length; i++) {
    images_rotations[i] -= mean_rotation;
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
    // var span = Math.sqrt(img.width ** 2 + img.height ** 2);
    var scale = total / count;
    images_scales.push(scale);
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
