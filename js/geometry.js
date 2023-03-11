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
  images_mean_landmarks_distances = [];
  for (let i = 0; i < hidden_images.length; i++) {
    var landmarks = images_landmarks[i];
    var total_distances = 0;
    for (let j = 0; j < landmarks._positions.length; j++) {
      landmarks._positions[j]._x -= c_x;
      landmarks._positions[j]._y -= c_y;
      total_distances += Math.sqrt(
        Math.pow(landmarks._positions[j]._x, 2) +
          Math.pow(landmarks._positions[j]._y, 2)
      );
    }
    var avg_distance = total_distances / landmarks._positions.length;
    images_mean_landmarks_distances.push(avg_distance);
  }
}

function calculate_rotation() {
  images_rotations = [];
  landmarks0 = images_landmarks[0];
  images_rotations.push(0);
  for (let i = 1; i < hidden_images.length; i++) {
    var landmarks = images_landmarks[i];
    // var s_a = 0;
    // var count = 0;
    // for (let j = 0; j < landmarks._positions.length; j++) {
    //   var x1 = landmarks._positions[j]._x;
    //   var y1 = landmarks._positions[j]._y;
    //   var d1 = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2));
    //   var x2 = landmarks0._positions[j]._x;
    //   var y2 = landmarks0._positions[j]._y;
    //   var d2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2));
    //   if(d1 > images_mean_landmarks_distances[i] && d2 > images_mean_landmarks_distances[0]) {
    //     var a1 = Math.atan2(y1, x1);
    //     var a2 = Math.atan2(y2, x2);
    //     var a3 = a2 - a1;
    //     s_a += a3;
    //     count++;
    //   }
    // }
    // var rotation = s_a / count;
    // console.log(rotation, s_a, count);
    // images_rotations.push(rotation);
    var s_x = 0;
    var s_y = 0;
    for (let j = 0; j < landmarks._positions.length; j++) {
      var x1 = landmarks._positions[j]._x;
      var y1 = -landmarks._positions[j]._y;
      var x2 = landmarks0._positions[j]._x;
      var y2 = landmarks0._positions[j]._y;
      var x3 = x1 * x2 - y1 * y2;
      var y3 = x1 * y2 + y1 * x2;
      s_x += x3;
      s_y += y3;
    }
    var rotation = Math.atan2(s_y, s_x);
    console.log(rotation, s_x, s_y);
    images_rotations.push(rotation);
  }
  for (let i = 0; i < hidden_images.length; i++) {
    var landmarks = images_landmarks[i];
    for (let j = 0; j < landmarks._positions.length; j++) {
      var x = landmarks._positions[j]._x;
      var y = landmarks._positions[j]._y;
      var new_x = x * Math.cos(images_rotations[i]) - y * Math.sin(images_rotations[i]);
      var new_y = x * Math.sin(images_rotations[i]) + y * Math.cos(images_rotations[i]);
      landmarks._positions[j]._x = new_x;
      landmarks._positions[j]._y = new_y;
    }
  }
}


function calculate_scale() {
  images_scales = [];
  landmarks0 = images_landmarks[0];
  var divisor = 0;
  for (let i = 0; i < landmarks0._positions.length; i++) {
    var x1 = landmarks0._positions[i]._x;
    var y1 = landmarks0._positions[i]._y;
    divisor += (x1 ** 2) + (y1 ** 2);
  }
  images_scales.push(1);
  for (let i = 1; i < hidden_images.length; i++) {
    var landmarks = images_landmarks[i];
    var s_x = 0;
    var s_y = 0;
    for (let j = 0; j < landmarks._positions.length; j++) {
      var x1 = landmarks._positions[j]._x;
      var y1 = -landmarks._positions[j]._y;
      var x2 = landmarks0._positions[j]._x;
      var y2 = landmarks0._positions[j]._y;
      var x3 = x1 * x2 - y1 * y2;
      var y3 = x1 * y2 + y1 * x2;
      s_x += x3;
      s_y += y3;
    }
    var total = Math.sqrt((s_x ** 2) + (s_y ** 2));
    var scale = total / divisor;
    images_scales.push(scale);
  }
  // var total_scale = 1;
  // for (let i = 0; i < images_scales.length; i++) {
  //   total_scale *= images_scales[i];
  // }
  // var mean_scale = total_scale ** (1/images_scales.length);
  // for (let i = 1; i < images_scales.length; i++) {
  //   images_scales[i] /= mean_scale;
  // }
}
